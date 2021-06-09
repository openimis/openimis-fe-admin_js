import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
  historyPush,
  withModulesManager,
  withHistory,
  withTooltip,
  formatMessage,
} from "@openimis/fe-core";
import UserSearcher from "../components/UserSearcher";
import { RIGHT_USER_ADD } from "../constants";

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

  onAdd = () => {
    historyPush(this.props.modulesManager, this.props.history, "admin.userNew");
  };

  render() {
    const { classes, rights, intl } = this.props;
    return (
      <div className={classes.page}>
        <UserSearcher
          cacheFiltersKey="usersPageFiltersCache"
          onDoubleClick={this.onDoubleClick}
        />
        {rights.includes(RIGHT_USER_ADD) &&
          withTooltip(
            <div className={classes.fab}>
              <Fab color="primary" onClick={this.onAdd}>
                <AddIcon />
              </Fab>
            </div>,
            formatMessage(intl, "admin.user", "addNewUser.tooltip"),
          )}
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
