import React, { Component, Fragment } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { IconButton, Tooltip } from "@material-ui/core";
import { Tab as TabIcon, Delete as DeleteIcon } from "@material-ui/icons";
import {
  withModulesManager,
  formatMessageWithValues,
  formatMessage,
  Searcher,
  journalize,
  formatDateFromISO,
} from "@openimis/fe-core";
import UserFilter from "./UserFilter";

import { fetchUsersSummaries, deleteUser } from "../actions";
import { RIGHT_USER_DELETE } from "../constants";
import DeleteUserDialog from "./DeleteUserDialog";

const USER_SEARCHER_CONTRIBUTION_KEY = "user.UserSearcher";

class UserSearcher extends Component {
  state = {
    deleteUser: null,
    reset: 0,
  };

  constructor(props) {
    super(props);
    this.rowsPerPageOptions = [10, 20, 50, 100];
    this.defaultPageSize = 10;
    this.locationLevels = 4;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.submittingMutation && !this.props.submittingMutation) {
      this.props.journalize(this.props.mutation);
      this.setState({ reset: this.state.reset + 1 });
    }
  }

  fetch = (prms) => {
    this.props.fetchUsersSummaries(this.props.modulesManager, prms);
  };

  rowIdentifier = (r) => r.uuid;

  filtersToQueryParams = (state) => {
    const prms = Object.keys(state.filters)
      .filter((contrib) => !!state.filters[contrib].filter)
      .map((contrib) => state.filters[contrib].filter);
    prms.push(`first: ${state.pageSize}`);
    if (state.afterCursor) {
      prms.push(`after: "${state.afterCursor}"`);
    }
    if (state.beforeCursor) {
      prms.push(`before: "${state.beforeCursor}"`);
    }
    if (state.orderBy) {
      prms.push(`orderBy: ["${state.orderBy}"]`);
    }
    return prms;
  };

  headers = () => {
    const h = [
      "admin.user.username",
      "admin.user.lastName",
      "admin.user.otherNames",
      "admin.user.email",
      "admin.user.phone",
      "admin.user.dob",
    ];
    return h;
  };

  sorts = () => {
    const results = [
      ["username", true],
      ["iUser_LastName", true],
      ["iUser_OtherNames", true],
      ["iUser_email", true],
      ["iUser_Phone", true],
      ["officer__dob", false],
    ];
    return results;
  };

  deleteUser = () => {
    const user = this.state.deleteUser;
    this.setState({ deleteUser: null }, (e) => {
      this.props.deleteUser(
        this.props.modulesManager,
        user,
        formatMessage(this.props.intl, "admin.user", "deleteUserDialog.title"),
      );
    });
  };

  confirmDelete = (deleteUser) => {
    this.setState({ deleteUser });
  };

  deleteAction = (i) =>
    !!i.validityTo || !!i.clientMutationId ? null : (
      <Tooltip
        title={formatMessage(
          this.props.intl,
          "admin.user",
          "deleteUser.tooltip",
        )}
      >
        <IconButton onClick={() => this.confirmDelete(i)}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    );

  itemFormatters = () => {
    const formatters = [
      (u) => u.username,
      (u) => u.iUser.lastName,
      (u) => u.iUser.otherNames,
      (u) => u.iUser.email,
      (u) => u.iUser.phone,
      (u) =>
        u.officer &&
        formatDateFromISO(
          this.props.modulesManager,
          this.props.intl,
          u.officer.dob,
        ),

      (u) => (
        <Tooltip
          title={formatMessage(this.props.intl, "admin.user", "openNewTab")}
        >
          <IconButton onClick={(e) => this.props.onDoubleClick(u, true)}>
            {" "}
            <TabIcon />
          </IconButton>
        </Tooltip>
      ),
    ];

    if (this.props.rights.includes(RIGHT_USER_DELETE)) {
      formatters.push(this.deleteAction);
    }
    return formatters;
  };

  rowDisabled = (selection, i) => !!i.validityTo;

  rowLocked = (selection, i) => !!i.clientMutationId;

  render() {
    const {
      intl,
      users,
      usersPageInfo,
      fetchingUsers,
      fetchedUsers,
      errorUsers,
      filterPaneUsersKey,
      cacheFiltersKey,
      onDoubleClick,
    } = this.props;
    const count = usersPageInfo.totalCount;
    return (
      <Fragment>
        <DeleteUserDialog
          user={this.state.deleteUser}
          onConfirm={this.deleteUser}
          onCancel={(e) => this.setState({ deleteUser: null })}
        />
        <Searcher
          module="user"
          cacheFiltersKey={cacheFiltersKey}
          FilterPane={UserFilter}
          filterPaneUsersKey={filterPaneUsersKey}
          items={users}
          itemsPageInfo={usersPageInfo}
          fetchingItems={fetchingUsers}
          fetchedItems={fetchedUsers}
          errorItems={errorUsers}
          userKey={USER_SEARCHER_CONTRIBUTION_KEY}
          tableTitle={formatMessageWithValues(
            intl,
            "admin.user",
            "userSummaries",
            {
              count,
            },
          )}
          rowsPerPageOptions={this.rowsPerPageOptions}
          defaultPageSize={this.defaultPageSize}
          fetch={this.fetch}
          rowIdentifier={this.rowIdentifier}
          filtersToQueryParams={this.filtersToQueryParams}
          defaultOrderBy="-username"
          headers={this.headers}
          itemFormatters={this.itemFormatters}
          sorts={this.sorts}
          rowDisabled={this.rowDisabled}
          rowLocked={this.rowLocked}
          onDoubleClick={(c) => !c.clientMutationId && onDoubleClick(c)}
          reset={this.state.reset}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  rights:
    !!state.core && !!state.core.user && !!state.core.user.i_user
      ? state.core.user.i_user.rights
      : [],
  users: state.admin.usersSummaries,
  usersPageInfo: state.admin.usersPageInfo,
  fetchingUsers: state.admin.fetchingUsersSummaries,
  fetchedUsers: state.admin.fetchedUsersSummaries,
  errorUsers: state.admin.errorUsersSummaries,
  submittingMutation: state.admin.submittingMutation,
  mutation: state.admin.mutation,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ fetchUsersSummaries, deleteUser, journalize }, dispatch);

export default withModulesManager(
  connect(mapStateToProps, mapDispatchToProps)(injectIntl(UserSearcher)),
);
