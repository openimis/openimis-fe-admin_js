import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { injectIntl } from "react-intl";
import _debounce from "lodash/debounce";
import _ from "lodash";
import {
  formatMessage,
  ProgressOrError,
  withModulesManager,
} from "@openimis/fe-core";
import { fetchUserRoles, resetUserRoles } from "../../actions";

const styles = (theme) => ({
  label: {
    color: theme.palette.primary.main,
  },
});

class UserRolesPicker extends Component {
  constructor(props) {
    super(props);
    this.selectThreshold = props.modulesManager.getConf(
      "fe-admin",
      "UserRolesPicker.selectThreshold",
      10,
    );
    this.state = {
      str: "",
      rolesMinCharLookup: props.modulesManager.getConf(
        "fe-admin",
        "rolesMinCharLookup",
        2,
      ),
    };
  }

  formatSuggestion = (p) => (!p ? "" : `${p.name || ""}`);

  onSuggestionSelected = (v) => {
    this.props.onChange(v, this.formatSuggestion(v));
  };

  getSuggestions = (str) => {
    const { rolesMinCharLookup } = this.state;
    this.setState({ str });
    if (str.length >= rolesMinCharLookup) {
      this.props.fetchUserRoles(
        this.props.modulesManager,
        this.props.userHealthFacilityFullPath,
        str,
        this.props.fetchedUserRoles,
      );
    } else {
      this.props.resetUserRoles();
    }
  };

  handleBlur = () => {
    this.props.resetUserRoles();
    this.setState({ str: "" });
  };

  debouncedGetSuggestion = _.debounce(
    this.getSuggestions,
    this.props.modulesManager.getConf("fe-admin", "debounceTime", 800),
  );

  handleChange = (userRoles) => {
    this.props.onChange(userRoles);
    this.props.resetUserRoles();
    this.setState({ str: "" });
  };

  render() {
    const {
      intl,
      value,
      readOnly = false,
      roles,
      fetchingUserRoles,
    } = this.props;
    const { str, rolesMinCharLookup } = this.state;
    let filteredRoles = roles || [];
    if (roles && roles.length > 0) {
      filteredRoles = filteredRoles.filter(
        (r) => !value.find((v) => v.id === r.id),
      );
    }
    let noOptionsText = fetchingUserRoles
      ? formatMessage(intl, "admin.user", "userRoles.search")
      : formatMessage(intl, "admin.user", "userRoles.search");
    if (
      !fetchingUserRoles &&
      str.length > rolesMinCharLookup &&
      filteredRoles &&
      filteredRoles.length === 0
    ) {
      noOptionsText = formatMessage(intl, "admin.user", "userRoles.noOptions");
    }
    return (
      <Autocomplete
        loading={fetchingUserRoles}
        multiple
        disabled={readOnly}
        noOptionsText={noOptionsText}
        id="user-role-select"
        options={filteredRoles}
        getOptionLabel={(option) => option.name}
        onChange={(e, userRoles) => this.handleChange(userRoles)}
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={(e) => this.debouncedGetSuggestion(e.target.value)}
            variant="standard"
            label={formatMessage(intl, "admin.user", "userRoles")}
            placeholder=""
            onBlur={() => this.handleBlur()}
          />
        )}
        value={value}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  userHealthFacilityFullPath: state.loc
    ? state.loc.userHealthFacilityFullPath
    : null,
  roles: state.admin.userRoles,
  fetchedUserRoles: state.admin.fetchedUserRoles,
  fetchingUserRoles: state.admin.fetchingUserRoles,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ fetchUserRoles, resetUserRoles }, dispatch);

export default withModulesManager(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(injectIntl(withTheme(withStyles(styles)(UserRolesPicker)))),
);
