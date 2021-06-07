import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
  historyPush,
  withModulesManager,
  withHistory,
} from "@openimis/fe-core";
import UserSearcher from "./UserSearcher";

const styles = (theme) => ({
  page: theme.page,
  fab: theme.fab,
});

class UsersPage extends Component {
  onDoubleClick = (u, newTab = false) => {
    historyPush(
      this.props.modulesManager,
      this.props.history,
      "admin.userOverview",
      [u.id],
      newTab,
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.page}>
        <UserSearcher
          cacheFiltersKey="usersPageFiltersCache"
          onDoubleClick={this.onDoubleClick}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  rights:
    !!state.core && !!state.core.user && !!state.core.user.i_user
      ? state.core.user.i_user.rights
      : [],
});

export default injectIntl(
  withModulesManager(
    withHistory(
      connect(mapStateToProps)(withTheme(withStyles(styles)(UsersPage))),
    ),
  ),
);
