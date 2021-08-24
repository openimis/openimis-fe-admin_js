import {
  parseData,
  pageInfo,
  formatServerError,
  formatGraphQLError,
  dispatchMutationResp,
  dispatchMutationErr,
  dispatchMutationReq,
} from "@openimis/fe-core";

import { getUserTypes, mapQueriesUserToMutation } from "./utils";

function reducer(
  state = {
    usersSummaries: {
      items: [],
      isFetching: false,
      isFetched: false,
      fetched: null,
      pageInfo: {
        totalCount: 0,
      },
      error: null,
    },

    userRoles: {
      isFetching: false,
      isFetched: false,
      items: [],
      error: null,
    },

    users: {
      items: [],
      isFetching: false,
      isFetched: false,
      error: null,
    },

    fetchingUser: false,
    fetchedUser: false,
    errorUser: null,
    user: null,
    submittingMutation: false,
    mutation: {},
  },
  action,
) {
  switch (action.type) {
    case "ADMIN_USERS_REQ":
      return {
        ...state,
        users: {
          ...state.users,
          isFetching: true,
          fetched: null,
          error: null,
        },
      };
    case "ADMIN_USERS_RESP":
      return {
        ...state,
        users: {
          ...state.users,
          isFetching: false,
          fetched: action.meta,
          items: parseData(action.payload.data.users).map((user) => ({
            ...user,
            userTypes: getUserTypes(user),
          })),
          error: formatGraphQLError(action.payload),
        },
      };
    case "ADMIN_USERS_ERR":
      return {
        ...state,
        users: {
          ...state.users,
          error: formatServerError(action.payload),
          isFetching: false,
          items: [],
        },
      };
    case "ADMIN_USER_ROLES_REQ":
      return {
        ...state,
        userRoles: {
          ...state.userRoles,
          isFetching: true,
          fetched: null,
          items: [],
          error: null,
        },
      };
    case "ADMIN_USER_ROLES_RESP":
      return {
        ...state,
        userRoles: {
          ...state.userRoles,
          isFetching: false,
          fetched: action.meta,
          items: parseData(action.payload.data.role),
          error: formatGraphQLError(action.payload),
        },
      };
    case "ADMIN_USER_ROLES_ERR":
      return {
        ...state,
        userRoles: {
          ...state.userRoles,
          isFetching: false,
          fetched: null,
          error: formatServerError(action.payload),
        },
      };
    case "ADMIN_USERS_SUMMARIES_REQ":
      return {
        ...state,
        usersSummaries: {
          ...state.usersSummaries,
          isFetching: true,
          isFetched: false,
          error: null,
        },
      };
    case "ADMIN_USERS_SUMMARIES_RESP":
      return {
        ...state,
        usersSummaries: {
          ...state.usersSummaries,
          isFetching: false,
          isFetched: true,
          fetched: action.meta,
          pageInfo: pageInfo(action.payload.data.users),
          items: parseData(action.payload.data.users),
          error: formatGraphQLError(action.payload),
        },
      };
    case "ADMIN_USERS_SUMMARIES_ERR":
      return {
        ...state,
        usersSummaries: {
          ...state.usersSummaries,
          isFetching: false,
          isFetched: true,
          fetched: null,
          items: [],
          error: formatGraphQLError(action.payload),
        },
      };
    case "ADMIN_USER_OVERVIEW_REQ":
      return {
        ...state,
        fetchingUser: true,
        fetchedUser: false,
        errorUser: null,
      };
    case "ADMIN_USER_OVERVIEW_RESP":
      const users = parseData(action.payload.data.users);
      let user = null;
      if (!!users && users.length > 0) {
        [user] = users;
        user = {
          ...mapQueriesUserToMutation(user),
          userTypes: getUserTypes(user),
        };
      }
      return {
        ...state,
        fetchingUser: false,
        fetchedUser: true,
        user,
        errorUser: formatGraphQLError(action.payload),
      };
    case "ADMIN_USER_OVERVIEW_ERR":
      return {
        ...state,
        fetchedUser: false,
        errorUser: formatServerError(action.payload),
      };
    case "ADMIN_USER_NEW":
      return {
        ...state,
        usersPageInfo: { totalCount: 0 },
        user: null,
      };
    case "ADMIN_USER_MUTATION_REQ":
      return dispatchMutationReq(state, action);
    case "ADMIN_USER_MUTATION_ERR":
      return dispatchMutationErr(state, action);
    case "ADMIN_USER_UPDATE_RESP":
      return dispatchMutationResp(state, "updateUser", action);
    case "ADMIN_USER_DELETE_RESP":
      return dispatchMutationResp(state, "deleteUser", action);
    case "ADMIN_USER_CREATE_RESP":
      return dispatchMutationResp(state, "createUser", action);
    default:
      return state;
  }
}

export default reducer;
