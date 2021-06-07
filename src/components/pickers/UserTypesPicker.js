import React, { Component } from "react";
import { ConstantBasedPicker } from "@openimis/fe-core";

import { USER_TYPES } from "../../constants";

class UserTypesPicker extends Component {
  render() {
    return (
      <ConstantBasedPicker
        module="admin"
        label="user.userTypes"
        constants={USER_TYPES}
        {...this.props}
      />
    );
  }
}

export default UserTypesPicker;
