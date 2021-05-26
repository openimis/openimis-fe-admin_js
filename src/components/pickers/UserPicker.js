import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import _debounce from "lodash/debounce";
import _ from "lodash";
import { fetchUsers } from "../../actions";
import { formatMessage, AutoSuggestion, ProgressOrError, withModulesManager } from "@openimis/fe-core";

const styles = theme => ({
    label: {
        color: theme.palette.primary.main
    }
});

class UserPicker extends Component {
    constructor(props) {
        super(props);
        this.selectThreshold = props.modulesManager.getConf("fe-admin", "UserPicker.selectThreshold", 10);
    }

    formatSuggestion = p => !p ? "" : `${p.username || ""}`;

    onSuggestionSelected = v => this.props.onChange(v, this.formatSuggestion(v));

    getSuggestions = (str) => !!str &&
        str.length >= this.props.modulesManager.getConf("fe-admin", "usersMinCharLookup", 2) &&
        this.props.fetchUsers(
            this.props.modulesManager,
            this.props.userHealthFacilityFullPath,
            str,
            this.props.fetchedUsers
        )

    debouncedGetSuggestion = _.debounce(
        this.getSuggestions,
        this.props.modulesManager.getConf("fe-admin", "debounceTime", 800)
    )

    render() {
        const {
            intl, value,
            reset, readOnly = false, required = false,
            users, fetchingUsers, errorUsers,
            withNull = false, nullLabel = null,
            withLabel = true, label,
        } = this.props;
        return (
            <Fragment>
                <ProgressOrError progress={fetchingUsers} error={errorUsers} />
                {!fetchingUsers && !errorUsers && (
                    <AutoSuggestion
                        module="admin"
                        items={users}
                        label={!!withLabel && (label || formatMessage(intl, "admin", "UserPicker.label"))}
                        getSuggestions={this.debouncedGetSuggestion}
                        renderSuggestion={a => <span>{this.formatSuggestion(a)}</span>}
                        getSuggestionValue={this.formatSuggestion}
                        onSuggestionSelected={this.onSuggestionSelected}
                        value={value}
                        reset={reset}
                        readOnly={readOnly}
                        required={required}
                        selectThreshold={this.selectThreshold}
                        withNull={withNull}
                        nullLabel={nullLabel || formatMessage(intl, "admin", "UserPicker.null")}
                    />
                )}
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    userHealthFacilityFullPath: !!state.loc ? state.loc.userHealthFacilityFullPath : null,
    users: state.admin.users,
    fetchedUsers: state.admin.fetchedUsers,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchUsers }, dispatch);
};

export default withModulesManager(
    connect(mapStateToProps, mapDispatchToProps)(injectIntl(withTheme(withStyles(styles)(UserPicker))))
);
