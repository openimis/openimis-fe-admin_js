import {
  graphql,
  formatPageQuery,
  formatPageQueryWithCount,
  formatMutation,
  decodeId,
  formatGQLString,
} from "@openimis/fe-core";
import _ from "lodash";

const USER_SUMMARY_PROJECTION = [
  "id",
  "username",
  "officer{id,dob,phone,lastName,otherNames,email}",
  "iUser{id,phone,lastName,otherNames,email,roles{id,name}}",
  "claimAdmin{id,phone,lastName,otherNames,emailId,dob}",
  "clientMutationId",
];

const USER_FULL_PROJECTION = (mm) => [
  "id",
  "username",
  "officer{id,phone,dob,lastName,otherNames,address,substitutionOfficer{id},worksTo,location{id,name}}",
  "iUser{id,phone,languageId,lastName,otherNames,roles{id,name}",
  `healthFacility${mm.getProjection(
    "location.HealthFacilityPicker.projection",
  )}`,
  ",validityFrom,validityTo,email,healthFacilityId,userdistrictSet{location{id,name,parent{id,name}}}}",
  "claimAdmin{id,emailId,phone,dob,lastName,otherNames}",
  "clientMutationId",
];

export function formatUserGQL(mm, user) {
  const req = `
    ${user.id ? `id: "${decodeId(user.id)}"` : ""}
    ${user.username ? `username: "${user.username}"` : ""}
    ${
      user.lastName
        ? `lastName: "${formatGQLString(user.lastName)}"`
        : ""
    }
    ${
      user.language
        ? `language: "${formatGQLString(user.language)}"`
        : 'language: "en"'
    }
    ${
      user.otherNames
        ? `otherNames: "${formatGQLString(user.otherNames)}"`
        : ""
    }
    ${
      user.phoneNumber
        ? `phoneNumber: "${formatGQLString(user.phoneNumber)}"`
        : ""
    }
    ${
      user.birthDate
        ? `birthDate: "${formatGQLString(user.birthDate)}"`
        : ""
    }
    ${user.email ? `email: "${formatGQLString(user.email)}"` : ""}
    ${user.userTypes ? `userTypes: [${user.userTypes}]` : ""}
    ${user.password ? `password: "${formatGQLString(user.password)}"` : ""}
    ${
      user.healthFacility
        ? `healthFacilityId: ${decodeId(user.healthFacility.id)}`
        : ""
    }
    ${
      user.roles
        ? `roles: [${user.roles.map((u) => decodeId(u.id))}]`
        : ""
    }
    ${user.address ? `address: "${formatGQLString(user.address)}"` : ""}
    ${user.substitutionOfficerId ? `substitutionOfficerId: "${formatGQLString(user.substitutionOfficerId)}"` : ""}
    ${user.worksTo ? `worksTo: "${formatGQLString(user.worksTo)}"` : ""}

  `;
  return req;
}
export function fetchUsers(mm, hf, str, prev) {
  const filters = [];
  if (hf) {
    filters.push(`healthFacility_Uuid: "${hf.uuid}"`);
  }
  if (str) {
    filters.push(`str: "${str}"`);
  }
  if (_.isEqual(filters, prev)) {
    return (dispatch) => {};
  }
  const payload = formatPageQuery(
    "users",
    filters,
    mm.getRef("admin.UserPicker.projection"),
  );
  return graphql(payload, "ADMIN_USERS", filters);
}

export function fetchUserRoles(mm, hf, str, prev) {
  const filters = [];
  if (hf) {
    filters.push(`healthFacility_Uuid: "${hf.uuid}"`);
  }
  if (str) {
    filters.push(`str: "${str}"`);
  }
  if (_.isEqual(filters, prev)) {
    return (dispatch) => {};
  }
  const payload = formatPageQuery(
    "role",
    filters,
    mm.getRef("admin.UserRolesPicker.projection"),
  );
  return graphql(payload, "ADMIN_USER_ROLES", filters);
}

export function fetchUsersSummaries(mm, filters) {
  const payload = formatPageQueryWithCount(
    "users",
    filters,
    USER_SUMMARY_PROJECTION,
  );
  return graphql(payload, "ADMIN_USERS_SUMMARIES");
}

export function createUser(mm, user, clientMutationLabel) {
  const mutation = formatMutation(
    "createUser",
    formatUserGQL(mm, user),
    clientMutationLabel,
  );
  const requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    [
      "ADMIN_USER_MUTATION_REQ",
      "ADMIN_USER_CREATE_RESP",
      "ADMIN_USER_MUTATION_ERR",
    ],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}

export function updateUser(mm, user, clientMutationLabel) {
  const mutation = formatMutation(
    "updateUser",
    formatUserGQL(mm, user),
    clientMutationLabel,
  );
  const requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    [
      "ADMIN_USER_MUTATION_REQ",
      "ADMIN_USER_UPDATE_RESP",
      "ADMIN_USER_MUTATION_ERR",
    ],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
      userId: user.id,
    },
  );
}

export function deleteUser(mm, user, clientMutationLabel) {
  const mutation = formatMutation(
    "deleteUser",
    `uuids: ["${decodeId(user.id)}"]`,
    clientMutationLabel,
  );
  // eslint-disable-next-line no-param-reassign
  user.clientMutationId = mutation.clientMutationId;
  const requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    [
      "ADMIN_USER_MUTATION_REQ",
      "ADMIN_USER_DELETE_RESP",
      "ADMIN_USER_MUTATION_ERR",
    ],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
      userId: user.id,
    },
  );
}

export function fetchUser(mm, userId, clientMutationId) {
  const filters = [];
  if (userId) {
    filters.push(`id: "${decodeId(userId)}"`);
  } else if (clientMutationId) {
    filters.push(`clientMutationId: "${clientMutationId}"`);
  }
  const payload = formatPageQuery("users", filters, USER_FULL_PROJECTION(mm));
  return graphql(payload, "ADMIN_USER_OVERVIEW");
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
    ["id", "users{coreUser{id}}"],
  );
  return graphql(payload, "ADMIN_USER");
}
