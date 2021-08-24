import React, { Component } from "react";
import { connect } from "react-redux";
import { Edit as EditIcon } from "@material-ui/icons";
import { historyPush, withModulesManager, withHistory } from "@openimis/fe-core";
import UserPage from "./UserPage";

class UserOverviewPage extends Component {
  render() {
    const { history, modulesManager, userId } = this.props;
    const actions = [
      {
        doIt: (e) => historyPush(modulesManager, history, "admin.userOverview", [userId]),
        icon: <EditIcon />,
        onlyIfDirty: false,
      },
    ];
    return <UserPage {...this.props} readOnly={true} overview={true} actions={actions} />;
  }
}

const mapStateToProps = (state, props) => ({
  userId: props.match.params.user_id,
});

export default withHistory(withModulesManager(connect(mapStateToProps)(UserOverviewPage)));
