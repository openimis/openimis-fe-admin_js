import React, { Component } from "react";
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
  formatDateFromISO,
  ConfirmDialog,
  decodeId,
} from "@openimis/fe-core";
import UserFilter from "./UserFilter";

import { fetchUsersSummaries, deleteUser } from "../actions";
import { RIGHT_USER_DELETE } from "../constants";

const USER_SEARCHER_CONTRIBUTION_KEY = "user.UserSearcher";

const getHeaders = () => [
  "admin.user.username",
  "admin.user.lastName",
  "admin.user.otherNames",
  "admin.user.email",
  "admin.user.phone",
  "admin.user.dob",
  "",
];

const getSorts = () => [
  ["username", true],
  ["iUser_LastName", true],
  ["iUser_OtherNames", true],
  ["iUser_Email", true],
  ["iUser_Phone", true],
  ["officer__dob", false],
];

const getAligns = () => {
  const aligns = getHeaders().map(() => null);
  aligns.splice(-1, 1, "right");
  return aligns;
};

class UserSearcher extends Component {
  state = {
    deleteUser: null,
    params: {},
    defaultParams: {},
  };

  fetch = (params) => {
    this.setState({ params });
    if (this.props.fetchedUserLocation) {
      this.props.fetchUsersSummaries(this.props.modulesManager, params);
    }
  };

  setRegionIds = (paramsArray) => {
    const regionIds = this.props.userL0s?.map((region) => decodeId(region.id));
    paramsArray.push(`regionIds: [${regionIds}]`);
  };

  componentDidUpdate = (prevState) => {
    if (prevState.userL0s !== this.props.userL0s) {
      if (this.props.userL0s && this.props.fetchedUserLocation) {
        const prms = [...this.state.params];
        this.setRegionIds(prms);
        this.props.fetchUsersSummaries(this.props.modulesManager, prms);
      }
    }
  };

  filtersToQueryParams = (state) => {
    const prms = Object.keys(state.filters)
      .filter((contrib) => !!state.filters[contrib].filter)
      .map((contrib) => state.filters[contrib].filter);
    if (!state.beforeCursor && !state.afterCursor) {
      prms.push(`first: ${state.pageSize}`);
    }
    if (state.afterCursor) {
      prms.push(`after: "${state.afterCursor}"`);
      prms.push(`first: ${state.pageSize}`);
    }
    if (state.beforeCursor) {
      prms.push(`before: "${state.beforeCursor}"`);
      prms.push(`last: ${state.pageSize}`);
    }
    if (state.orderBy) {
      prms.push(`orderBy: ["${state.orderBy}"]`);
    }
    if (this.props.fetchedUserLocation) {
      this.setRegionIds(prms);
    }
    return prms;
  };

  deleteUser = (isConfirmed) => {
    if (!isConfirmed) {
      this.setState({ deleteUser: null });
    } else {
      const user = this.state.deleteUser;
      this.setState({ deleteUser: null }, async () => {
        await this.props.deleteUser(
          this.props.modulesManager,
          user,
          formatMessage(this.props.intl, "admin.user", "deleteDialog.title"),
        );
        this.fetch(this.state.params);
      });
    }
  };

  getUserItem = (user, item) =>
    (user.iUser && user.iUser[item]) ||
    (user.officer && user.officer[item]) ||
    (user.claimAdmin && user.claimAdmin[item]);

  itemFormatters = () => {
    const formatters = [
      (u) => u.username,
      (u) => this.getUserItem(u, "lastName"),
      (u) => this.getUserItem(u, "otherNames"),
      (u) => this.getUserItem(u, "email") || this.getUserItem(u, "emailId"),
      (u) => this.getUserItem(u, "phone"),
      (u) =>
        (u.claimAdmin || u.officer) &&
        formatDateFromISO(this.props.modulesManager, this.props.intl, this.getUserItem(u, "dob")),

      (u) => (
        <>
          <Tooltip title={formatMessage(this.props.intl, "admin.user", "openNewTab")}>
            <IconButton onClick={() => this.props.onDoubleClick(u, true)}>
              <TabIcon />
            </IconButton>
          </Tooltip>
          {this.props.rights.includes(RIGHT_USER_DELETE) && u.validityTo ? null : (
            <Tooltip title={formatMessage(this.props.intl, "admin.user", "deleteUser.tooltip")}>
              <IconButton onClick={() => this.setState({ deleteUser: u })}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </>
      ),
    ];

    return formatters;
  };

  render() {
    const { intl, users, usersPageInfo, fetchingUsers, fetchedUsers, errorUsers, cacheFiltersKey, onDoubleClick } =
      this.props;
    return (
      <>
        {this.state.deleteUser && (
          <ConfirmDialog
            confirm={{
              title: formatMessage(intl, "admin.user", "deleteDialog.title"),
              message: formatMessage(intl, "admin.user", "deleteDialog.message"),
            }}
            onConfirm={this.deleteUser}
          />
        )}
        <Searcher
          module="user"
          cacheFiltersKey={cacheFiltersKey}
          FilterPane={UserFilter}
          items={users}
          itemsPageInfo={usersPageInfo}
          fetchingItems={fetchingUsers}
          fetchedItems={fetchedUsers}
          errorItems={errorUsers}
          contributionKey={USER_SEARCHER_CONTRIBUTION_KEY}
          tableTitle={formatMessageWithValues(intl, "admin.user", "userSummaries", {
            count: usersPageInfo.totalCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          })}
          fetch={this.fetch}
          rowIdentifier={(r) => r.uuid}
          filtersToQueryParams={this.filtersToQueryParams}
          defaultOrderBy="-username"
          headers={getHeaders}
          aligns={getAligns}
          itemFormatters={this.itemFormatters}
          sorts={getSorts}
          rowDisabled={(_, i) => i.validityTo || i.clientMutationId}
          rowLocked={(_, i) => i.clientMutationId}
          onDoubleClick={onDoubleClick}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  rights: state.core?.i_user?.rights ?? [],
  users: state.admin.usersSummaries.items,
  usersPageInfo: state.admin.usersSummaries.pageInfo,
  fetchingUsers: state.admin.usersSummaries.isFetching,
  fetchedUsers: state.admin.usersSummaries.fetched,
  errorUsers: state.admin.usersSummaries.error,
  userL0s: state.loc.userL0s ?? [],
  fetchedUserLocation: state.loc.fetchedUserLocation,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchUsersSummaries, deleteUser }, dispatch);

export default withModulesManager(connect(mapStateToProps, mapDispatchToProps)(injectIntl(UserSearcher)));
