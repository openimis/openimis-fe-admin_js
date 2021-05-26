import {
    graphql, formatPageQuery
} from "@openimis/fe-core";
import _ from "lodash";
import _uuid from "lodash-uuid";

export function fetchUsers(mm, filters = []) {
const payload = formatPageQuery(
    "users",
    null,
    mm.getRef("admin.UserPicker.projection")
);
return graphql(payload, 'ADMIN_USERS', filters);
}