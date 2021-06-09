import {
  graphql,
  formatPageQuery,
  formatPageQueryWithCount,
  formatMutation,
  decodeId,
  formatJsonField,
  formatGQLString,
} from "@openimis/fe-core";
import _ from "lodash";
import _uuid from "lodash-uuid";

const USER_SUMMARY_PROJECTION = [
  "id",
  "username",
  "officer{id,phone,dob}",
  "iUser{id,lastName,otherNames,email,roleId,userRoles{role{name}}}",
  "claimAdmin{id}",
  "clientMutationId",
];

const USER_FULL_PROJECTION = [
  "id",
  "username",
  "officer{id,phone,dob,lastName,location{id,name}}",
  // "iUser{id,lastName,otherNames,loginName,email,healthFacilityId,roleId,userRoles{role{name}},userdistrictSet{location{id,name,parent{id,name}}}}",
  "iUser{id,phone,languageId,lastName,otherNames,userRoles{role{name}},validityFrom,validityTo,email,healthFacilityId,roleId,userRoles{role{name}}}",
  "claimAdmin{id,emailId,dob,lastName,otherNames}",
  "clientMutationId",
];

export function formatUserGQL(mm, user) {
  console.log("decodeId(user.id)", decodeId(user.id));
  const req = `
    ${user.id ? `id: "${decodeId(user.id)}"` : ""}
    ${user.username ? `username: "${user.username}"` : ""}
    ${
      user.iUser.lastName
        ? `lastName: "${formatGQLString(user.iUser.lastName)}"`
        : ""
    }
    ${
      user.iUser.language
        ? `language: "${formatGQLString(user.iUser.languageId)}"`
        : 'language: "en"'
    }
    ${
      user.iUser.otherNames
        ? `otherNames: "${formatGQLString(user.iUser.otherNames)}"`
        : ""
    }
    ${
      user.iUser && user.iUser.phone
        ? `phoneNumber: "${formatGQLString(user.iUser.phone)}"`
        : ""
    }
    ${
      user.officer && user.officer.dob
        ? `birthDate: "${formatGQLString(user.officer.dob)}"`
        : ""
    }
    ${user.iUser.email ? `email: "${formatGQLString(user.iUser.email)}"` : ""}
    ${
      user.userTypes
        ? `userTypes: ${formatGQLString(user.userTypes)}`
        : "userTypes: INTERACTIVE"
    }
    ${user.iUser.roleId ? `roles: [${user.iUser.roleId}]` : ""}
  `;
  return req;
}
export function fetchUsers(mm, filters = []) {
  const payload = formatPageQuery(
    "users",
    null,
    mm.getRef("admin.UserPicker.projection"),
  );
  return graphql(payload, "ADMIN_USERS", filters);
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
    `ids: ["${user.id}"]`,
    clientMutationLabel,
  );
  // user.clientMutationId = mutation.clientMutationId;
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
  const payload = formatPageQuery("users", filters, USER_FULL_PROJECTION);
  return graphql(payload, "ADMIN_USER_OVERVIEW");
}

export function newUser() {
  return (dispatch) => {
    dispatch({ type: "ADMIN_USER_NEW" });
  };
}
