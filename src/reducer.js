import {
    parseData, formatServerError, formatGraphQLError
} from '@openimis/fe-core';

function reducer(
    state = {
        fetchingUsers: false,
        fetchedUsers: null,
        errorUsers: null,
        users: null,
    },
    action,
) {
    switch (action.type) {
        case 'ADMIN_USERS_REQ':
            return {
                ...state,
                fetchingUsers: true,
                fetchedUsers: null,
                users: null,
                errorUsers: null,
            };
        case 'ADMIN_USERS_RESP':
            return {
                ...state,
                fetchingUsers: false,
                fetchedUsers: action.meta,
                users: parseData(action.payload.data.users),
                errorUsers: formatGraphQLError(action.payload)
            };
        case 'ADMIN_USERS_ERR':
            return {
                ...state,
                fetchingUsers: null,
                errorUsers: formatServerError(action.payload)
            };
        default:
            return state;
    }
}

export default reducer;
