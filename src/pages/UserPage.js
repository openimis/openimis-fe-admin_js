import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
  formatMessageWithValues,
  withModulesManager,
  withHistory,
  historyPush,
} from "@openimis/fe-core";
import UserForm from "../components/UserForm";
import { createUser, updateUser } from "../actions";
import { RIGHT_USER_ADD, RIGHT_USER_EDIT } from "../constants";

const styles = (theme) => ({
  page: theme.page,
});

class UserPage extends Component {
  add = () => {
    historyPush(this.props.modulesManager, this.props.history, "admin.userNew");
  };

  save = (user) => {
    if (!user.id) {
      this.props.createUser(
        this.props.modulesManager,
        user,
        formatMessageWithValues(
          this.props.intl,
          "admin.user",
          "createUser.mutationLabel",
        ),
      );
    } else {
      this.props.updateUser(
        this.props.modulesManager,
        user,
        formatMessageWithValues(
          this.props.intl,
          "admin.user",
          "updateUser.mutationLabel",
        ),
      );
    }
  };

  render() {
    const { classes, rights, userId, overview, modulesManager, history } =
      this.props;
    if (!rights.includes(RIGHT_USER_EDIT)) return null;

    return (
      <div className={classes.page}>
        <UserForm
          overview={overview}
          userId={userId}
          back={(e) => historyPush(modulesManager, history, "admin.users")}
          add={rights.includes(RIGHT_USER_ADD) ? this.add : null}
          save={rights.includes(RIGHT_USER_EDIT) ? this.save : null}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  rights:
    !!state.core && !!state.core.user && !!state.core.user.i_user
      ? state.core.user.i_user.rights
      : [],
  userId: props.match.params.user_id,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ createUser, updateUser }, dispatch);

export default withHistory(
  withModulesManager(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    )(injectIntl(withTheme(withStyles(styles)(UserPage)))),
  ),
);
