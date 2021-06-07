import {
  graphql,
  formatPageQuery,
  formatPageQueryWithCount,
  formatMutation,
  formatJsonField,
  formatGQLString,
} from "@openimis/fe-core";
import _ from "lodash";
import _uuid from "lodash-uuid";

const USER_SUMMARY_PROJECTION = (mm) => [
  "id",
  "username",
  // "officer{id,lastName,loginName,userRoles{role{name}}}",
  "officer{id,phone,dob,lastName,otherNames,dob,location{id,name}}",
  // "iUser{id,lastName,otherNames,loginName,email,healthFacilityId,roleId,userRoles{role{name}},userdistrictSet{location{id,name,parent{id,name}}}}",
  "iUser{id,lastName,otherNames,validityFrom,validityTo,email,healthFacilityId,roleId,userRoles{role{name}}}",
  "claimAdmin{id,emailId,dob,lastName,otherNames}",
  "clientMutationId",
];

const USER_FULL_PROJECTION = (mm) => [
  "id",
  "username",
  // "officer{id,lastName,loginName,userRoles{role{name}}}",
  "officer{id,phone,dob,lastName,location{id,name}}",
  // "iUser{id,lastName,otherNames,loginName,email,healthFacilityId,roleId,userRoles{role{name}},userdistrictSet{location{id,name,parent{id,name}}}}",
  "iUser{id,lastName,otherNames,otherNames,loginName,validityFrom,validityTo,email,healthFacilityId,roleId,userRoles{role{name}}}",
  "claimAdmin{id,emailId,dob,lastName,otherNames}",
  "clientMutationId",
];

export function formatUserGQL(mm, user) {
  const req = `
    ${user.username ? `username: "${user.username}"` : ""}
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
    USER_SUMMARY_PROJECTION(mm),
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
      userUuid: user.uuid,
    },
  );
}

export function deleteUser(mm, user, clientMutationLabel) {
  const mutation = formatMutation(
    "deleteUser",
    `uuids: ["${user.uuid}"]`,
    clientMutationLabel,
  );
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
      userUuid: user.uuid,
    },
  );
}
export function fetchUser(mm, userUuid, clientMutationId) {
  const filters = [];
  if (userUuid) {
    filters.push(`uuid: "${userUuid}"`);
  } else if (clientMutationId) {
    filters.push(`clientMutationId: "${clientMutationId}"`);
  }
  const payload = formatPageQuery("users", filters, USER_FULL_PROJECTION(mm));
  return graphql(payload, "ADMIN_USER_OVERVIEW");
}
