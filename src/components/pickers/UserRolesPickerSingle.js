import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import _debounce from "lodash/debounce";
import _ from "lodash";
import {
  formatMessage,
  AutoSuggestion,
  ProgressOrError,
  withModulesManager,
} from "@openimis/fe-core";
import { fetchUserRoles } from "../../actions";

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
  }

  formatSuggestion = (p) => (!p ? "" : `${p.name || ""}`);

  onSuggestionSelected = (v) => {
    this.props.onChange(v, this.formatSuggestion(v));
  };

  getSuggestions = (str) =>
    !!str &&
    str.length >=
      this.props.modulesManager.getConf("fe-admin", "rolesMinCharLookup", 2) &&
    this.props.fetchUserRoles(
      this.props.modulesManager,
      this.props.userHealthFacilityFullPath,
      str,
      this.props.fetchedUserRoles,
    );

  debouncedGetSuggestion = _.debounce(
    this.getSuggestions,
    this.props.modulesManager.getConf("fe-admin", "debounceTime", 800),
  );

  render() {
    const {
      intl,
      value,
      reset,
      readOnly = false,
      required = false,
      roles,
      fetchingUserRoles,
      errorUserRoles,
      withNull = false,
      nullLabel = null,
      withLabel = true,
      label,
    } = this.props;
    return (
      <Fragment>
        <ProgressOrError progress={fetchingUserRoles} error={errorUserRoles} />
        {!fetchingUserRoles && !errorUserRoles && (
          <AutoSuggestion
            module="admin"
            items={roles}
            label={
              !!withLabel &&
              (label || formatMessage(intl, "admin", "UserRolesPicker.label"))
            }
            getSuggestions={this.debouncedGetSuggestion}
            renderSuggestion={(a) => <span>{this.formatSuggestion(a)}</span>}
            getSuggestionValue={this.formatSuggestion}
            onSuggestionSelected={this.onSuggestionSelected}
            value={value}
            reset={reset}
            readOnly={readOnly}
            required={required}
            selectThreshold={this.selectThreshold}
            withNull={withNull}
            nullLabel={
              nullLabel || formatMessage(intl, "admin", "UserRolesPicker.null")
            }
          />
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  userHealthFacilityFullPath: state.loc
    ? state.loc.userHealthFacilityFullPath
    : null,
  roles: state.admin.roles,
  fetchedUserRoles: state.admin.fetchedUserRoles,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ fetchUserRoles }, dispatch);

export default withModulesManager(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(injectIntl(withTheme(withStyles(styles)(UserRolesPicker)))),
);
