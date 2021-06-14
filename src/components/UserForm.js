import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import ReplayIcon from "@material-ui/icons/Replay";
import {
  formatMessageWithValues,
  withModulesManager,
  withHistory,
  historyPush,
  Form,
  ProgressOrError,
  journalize,
  coreConfirm,
  parseData,
} from "@openimis/fe-core";
import { RIGHT_USERS } from "../constants";

import { fetchUser, newUser, createUser, fetchUserMutation } from "../actions";
import UserMasterPanel from "./UserMasterPanel";

const styles = (theme) => ({
  lockedPage: theme.page.locked,
});

const USER_OVERVIEW_MUTATIONS_KEY = "user.UserOverview.mutations";

class UserForm extends Component {
  state = {
    lockNew: false,
    reset: 0,
    user: this.newUser(),
    newUser: true,
    consirmedAction: null,
  };

  newUser() {
    return {};
  }

  componentDidMount() {
    document.title = formatMessageWithValues(
      this.props.intl,
      "admin.user",
      "UserOverview.title",
      { label: "" },
    );
    if (this.props.userId) {
      this.setState(
        (state, props) => ({ userId: props.userId }),
        (e) =>
          this.props.fetchUser(this.props.modulesManager, this.props.userId),
      );
    }
    if (this.props.premium_uuid) {
      this.setState({
        user: {
          ...this.newUser(),
          premium_uuid: this.props.premium_uuid,
        },
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.fetchedUser && !!this.props.fetchedUser) {
      const { user } = this.props;
      this.setState({
        user,
        userId: user.id,
        lockNew: false,
        newUser: false,
      });
    } else if (prevProps.userId && !this.props.userId) {
      this.setState({
        user: this.newUser(),
        newUser: true,
        lockNew: false,
        userId: null,
      });
    } else if (prevProps.submittingMutation && !this.props.submittingMutation) {
      this.props.journalize(this.props.mutation);
      this.setState((state, props) => ({
        user: {
          ...state.user,
          clientMutationId: props.mutation.clientMutationId,
        },
      }));
    } else if (
      prevProps.confirmed !== this.props.confirmed &&
      !!this.props.confirmed &&
      !!this.state.confirmedAction
    ) {
      this.state.confirmedAction();
    }
  }

  add = () => {
    this.setState(
      (state) => ({
        user: this.newUser(),
        newUser: true,
        lockNew: false,
        reset: state.reset + 1,
      }),
      (e) => {
        this.props.add();
        this.forceUpdate();
      },
    );
  };

  reload = () => {
    const { family } = this.state;
    const { clientMutationId, userId } = this.props.mutation;
    if (clientMutationId && !userId) {
      this.props
        .fetchUserMutation(this.props.modulesManager, clientMutationId)
        .then((res) => {
          const mutationLogs = parseData(res.payload.data.mutationLogs);
          if (
            mutationLogs &&
            mutationLogs[0] &&
            mutationLogs[0].users &&
            mutationLogs[0].users[0] &&
            mutationLogs[0].users[0].user
          ) {
            const { id } = parseData(res.payload.data.mutationLogs)[0].users[0]
              .user;
            if (id) {
              historyPush(
                this.props.modulesManager,
                this.props.history,
                "admin.userOverview",
                [id],
              );
            }
          }
        });
    } else {
      this.props.fetchUser(
        this.props.modulesManager,
        userId,
        family.clientMutationId,
      );
    }
  };

  canSave = () => {
    if (
      this.state.user.iUser &&
      this.state.user.iUser.lastName &&
      this.state.user.iUser.otherNames &&
      this.state.user.iUser.roles &&
      this.state.user.username &&
      this.state.user.userTypes
    )
      return true;
    return false;
  };

  save = (user) => {
    this.setState(
      { lockNew: !user.id }, // avoid duplicates
      (e) => this.props.save(user),
    );
  };

  onEditedChanged = (user) => {
    this.setState({ user, newUser: false });
  };

  onActionToConfirm = (title, message, confirmedAction) => {
    this.setState({ confirmedAction }, this.props.coreConfirm(title, message));
  };

  render() {
    const {
      modulesManager,
      classes,
      state,
      rights,
      userId,
      fetchingUser,
      fetchedUser,
      errorUser,
      overview = false,
      readOnly = false,
      add,
      save,
      back,
    } = this.props;
    const { user, reset } = this.state;
    if (!rights.includes(RIGHT_USERS)) return null;
    let runningMutation = !!user && !!user.clientMutationId;
    const contributedMutations = modulesManager.getContribs(
      USER_OVERVIEW_MUTATIONS_KEY,
    );
    for (
      let i = 0;
      i < contributedMutations.length && !runningMutation;
      i += 1
    ) {
      runningMutation = contributedMutations[i](state);
    }
    const actions = [
      {
        doIt: this.reload,
        icon: <ReplayIcon />,
        onlyIfDirty: !readOnly && !runningMutation,
      },
    ];
    return (
      <div className={runningMutation ? classes.lockedPage : null}>
        <ProgressOrError progress={fetchingUser} error={errorUser} />
        {((!!fetchedUser && !!user && user.id === userId) || !userId) && (
          <Form
            module="user"
            title={
              this.state.newUser
                ? "admin.user.UserOverview.newTitle"
                : "admin.user.UserOverview.title"
            }
            edited_id={userId}
            edited={user}
            reset={reset}
            back={back}
            add={!!add && !this.state.newUser ? this.add : null}
            readOnly={
              readOnly || runningMutation || (!!user && !!user.validityTo)
            }
            actions={actions}
            overview={overview}
            HeadPanel={UserMasterPanel}
            user={user}
            onEditedChanged={this.onEditedChanged}
            canSave={this.canSave}
            save={save ? this.save : null}
            onActionToConfirm={this.onActionToConfirm}
          />
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
  fetchingUser: state.admin.fetchingUser,
  errorUser: state.admin.errorUser,
  fetchedUser: state.admin.fetchedUser,
  submittingMutation: state.admin.submittingMutation,
  mutation: state.admin.mutation,
  user: state.admin.user,
  confirmed: state.core.confirmed,
  state,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchUser,
      newUser,
      createUser,
      fetchUserMutation,
      journalize,
      coreConfirm,
    },
    dispatch,
  );

export default withHistory(
  withModulesManager(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    )(injectIntl(withTheme(withStyles(styles)(UserForm)))),
  ),
);
