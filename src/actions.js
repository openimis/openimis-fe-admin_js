import {
  graphql,
  formatPageQuery,
  formatPageQueryWithCount,
  formatMutation,
  decodeId,
  prepareMutation,
  graphqlWithVariables,
  fetchMutation,
} from "@openimis/fe-core";
import _ from "lodash";
import { mapUserValuesToInput } from "./utils";

const USER_SUMMARY_PROJECTION = [
  "id",
  "username",
  "officer{id,dob,phone,lastName,otherNames,email}",
  "iUser{id,phone,lastName,otherNames,email,roles{id,name}}",
  "claimAdmin{id,phone,lastName,otherNames,emailId,dob}",
  "clientMutationId",
];

export function fetchUsers(mm, filters = [], restrictHealthFacility = true) {
  return (dispatch, getState) => {
    if (restrictHealthFacility) {
      const state = getState();
      const hf = state.loc.userHealthFacilityFullPath;
      if (hf) {
        filters.push(`healthFacility_Uuid: "${hf.uuid}"`);
      }
    }

    const payload = formatPageQuery("users", filters, mm.getRef("admin.UserPicker.projection"));
    return dispatch(graphql(payload, "ADMIN_USERS", filters));
  };
}
export function fetchUsersSummaries(mm, filters) {
  const payload = formatPageQueryWithCount("users", filters, USER_SUMMARY_PROJECTION);
  return graphql(payload, "ADMIN_USERS_SUMMARIES");
}

export function fetchEnrolmentOfficers(mm, variables) {
  return graphqlWithVariables(
    `
      query ($searchString: String, $first: Int) {
        enrolmentOfficers(str: $searchString, first: $first) {
          edges {
            node {
              id
              code
              lastName
              otherNames
              
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `,
    variables,
    "ADMIN_ENROLMENT_OFFICERS",
  );
}

export function createUser(mm, user, clientMutationLabel) {
  const mutation = prepareMutation(
    `
    mutation ($input: CreateUserMutationInput!) {
      createUser(input: $input) {
        clientMutationId
        internalId
      }
    }
  `,
    mapUserValuesToInput(user),
    { clientMutationLabel },
  );

  // eslint-disable-next-line no-param-reassign
  user.clientMutationId = mutation.clientMutationId;

  return graphqlWithVariables(
    mutation.operation,
    mutation.variables,
    ["ADMIN_USER_MUTATION_REQ", "ADMIN_USER_CREATE_RESP", "ADMIN_USER_MUTATION_ERR"],
    { clientMutationId: mutation.clientMutationId, clientMutationLabel },
  );
}

export function updateUser(mm, user, clientMutationLabel) {
  const mutation = prepareMutation(
    `
    mutation ($input: UpdateUserMutationInput!) {
      updateUser(input: $input) {
        clientMutationId
        internalId
      }
    }
  `,
    mapUserValuesToInput(user),
    { clientMutationLabel },
  );

  // eslint-disable-next-line no-param-reassign
  user.clientMutationId = mutation.clientMutationId;

  return graphqlWithVariables(
    mutation.operation,
    mutation.variables,
    ["ADMIN_USER_MUTATION_REQ", "ADMIN_USER_UPDATE_RESP", "ADMIN_USER_MUTATION_ERR"],
    { clientMutationId: mutation.clientMutationId, clientMutationLabel, userId: user.id },
  );
}

export function deleteUser(mm, user, clientMutationLabel) {
  const mutation = formatMutation("deleteUser", `uuids: ["${decodeId(user.id)}"]`, clientMutationLabel);
  // eslint-disable-next-line no-param-reassign
  user.clientMutationId = mutation.clientMutationId;
  return (dispatch) => {
    dispatch(
      graphql(mutation.payload, ["ADMIN_USER_MUTATION_REQ", "ADMIN_USER_DELETE_RESP", "ADMIN_USER_MUTATION_ERR"], {
        clientMutationId: mutation.clientMutationId,
        clientMutationLabel,
        userId: user.id,
      }),
    );
    dispatch(fetchMutation(mutation.clientMutationId));
  };
}

export function fetchUser(mm, userId, clientMutationId) {
  const filters = [];
  if (userId) {
    filters.push(`id: "${decodeId(userId)}"`);
  } else if (clientMutationId) {
    filters.push(`clientMutationId: "${clientMutationId}"`);
  }
  return graphql(
    `
    {
      users(${filters.join(" ")}) {
        pageInfo { hasNextPage, hasPreviousPage, startCursor, endCursor}
        edges {
          node {
            clientMutationId
            id
            username
            officer {
              id
              hasLogin
              phone
              dob
              lastName
              otherNames
              address
              substitutionOfficer { id lastName otherNames code }
              worksTo
              officerVillages {
                id
                location {
                  id
                  name
                  code
                  uuid
                  parent {
                    id
                    name
                    code
                    uuid
                  }
                }
              }
              location {
                id
                name
                uuid
                code
                parent {
                  id
                  name
                  uuid
                  code
                }
              }
            }
            iUser {
              id
              phone
              languageId
              lastName
              otherNames
              roles { id name }
              healthFacility ${mm.getProjection("location.HealthFacilityPicker.projection")}
              validityFrom
              validityTo
              email
              districts: userdistrictSet { location { id name code uuid parent { id code uuid name }}}
            }
            claimAdmin{
              id
              hasLogin
              emailId
              phone
              dob
              lastName
              otherNames
              healthFacility ${mm.getProjection("location.HealthFacilityPicker.projection")}
            
            }
          }
        }
      }
    }
  `,
    "ADMIN_USER_OVERVIEW",
  );
}

export function newUser() {
  return (dispatch) => {
    dispatch({ type: "ADMIN_USER_NEW" });
  };
}

export function fetchUserMutation(mm, clientMutationId) {
  const payload = formatPageQuery(
    "mutationLogs",
    [`clientMutationId:"${clientMutationId}"`],
    ["id", "status", "users{coreUser{id}}"],
  );
  return graphql(payload, "ADMIN_USER");
}
