import {
  parseData,
  pageInfo,
  formatServerError,
  formatGraphQLError,
  dispatchMutationResp,
  dispatchMutationErr,
  dispatchMutationReq,
} from "@openimis/fe-core";

function reducer(
  state = {
    fetchingUsers: false,
    fetchingUsersSummaries: false,
    fetchingUser: false,
    fetchedUsers: null,
    fetchedUsersSummaries: null,
    fetchedUser: false,
    errorUsers: null,
    errorUsersSummaries: null,
    errorUser: null,
    users: null,
    usersSummaries: null,
    user: null,
    usersPageInfo: { totalCount: 0 },
    submittingMutation: false,
    mutation: {},
  },
  action,
) {
  switch (action.type) {
    case "ADMIN_USERS_REQ":
      return {
        ...state,
        fetchingUsers: true,
        fetchedUsers: null,
        users: null,
        errorUsers: null,
      };
    case "ADMIN_USERS_RESP":
      return {
        ...state,
        fetchingUsers: false,
        fetchedUsers: action.meta,
        users: parseData(action.payload.data.users),
        errorUsers: formatGraphQLError(action.payload),
      };
    case "ADMIN_USERS_ERR":
      return {
        ...state,
        fetchingUsers: null,
        errorUsers: formatServerError(action.payload),
      };
    case "ADMIN_USERS_SUMMARIES_REQ":
      return {
        ...state,
        fetchingUsersSummaries: true,
        fetchedUsersSummaries: null,
        usersSummaries: null,
        errorUsersSummaries: null,
      };
    case "ADMIN_USERS_SUMMARIES_RESP":
      return {
        ...state,
        fetchingUsersSummaries: false,
        fetchedUsersSummaries: action.meta,
        usersSummaries: parseData(action.payload.data.users),
        usersPageInfo: pageInfo(action.payload.data.users),
        errorUsersSummaries: formatGraphQLError(action.payload),
      };
    case "ADMIN_USERS_SUMMARIES_ERR":
      return {
        ...state,
        fetchingUsersSummaries: null,
        errorUsersSummaries: formatServerError(action.payload),
      };
    case "ADMIN_USER_OVERVIEW_REQ":
      return {
        ...state,
        fetchingUser: true,
        fetchedUser: false,
        contribution: null,
        errorUser: null,
      };
    case "ADMIN_USER_OVERVIEW_RESP":
      const users = parseData(action.payload.data.users);
      let user = null;
      if (!!users && users.length > 0) {
        [user] = users;
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
