import React from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";
import {
  withHistory,
  withModulesManager,
  TextInput,
  PublishedComponent,
  FormPanel,
} from "@openimis/fe-core";
import { userTypesMapping, RIGHT_ENROLMENTOFFICER } from "../constants";

export const getUserTypes = (user) => {
  const userTypes = [];
  if (user.iUser && user.iUser.id) {
    userTypes.push(userTypesMapping.iUser);
  }
  if (user.officer && user.officer.id) {
    userTypes.push(userTypesMapping.officer);
  }
  if (user.claimAdmin && user.claimAdmin.id) {
    userTypes.push(userTypesMapping.claimAdmin);
  }
  return userTypes;
};

const styles = (theme) => ({
  tableTitle: theme.table.title,
  item: theme.paper.item,
  fullHeight: {
    height: "100%",
  },
});

class UserMasterPanel extends FormPanel {
  render() {
    const { classes, edited, readOnly, rights } = this.props;
    const userRoles = edited && edited.iUser ? edited.iUser.roles : [];
    return (
      <>
        <Grid container className={classes.item}>
          <Grid item xs={4} className={classes.item}>
            <TextInput
              module="admin"
              required
              label="user.username"
              readOnly={Boolean(edited.id) || readOnly}
              value={edited ? edited.username : ""}
              onChange={(p) => this.updateAttribute("username", p)}
            />
          </Grid>
          <Grid item xs={4} className={classes.item}>
            <PublishedComponent
              required
              pubRef="admin.UserTypesPicker"
              value={(edited && edited.userTypes) || getUserTypes(edited)}
              module="admin"
              readOnly={readOnly}
              onChange={(p) => this.updateAttribute("userTypes", p)}
            />
          </Grid>
          <Grid item xs={4} className={classes.item}>
            <PublishedComponent
              pubRef="admin.UserRolesPicker"
              required
              value={userRoles || []}
              module="admin"
              readOnly={readOnly}
              onChange={(roles) => {
                const iUser = {
                  ...edited.iUser,
                  roles,
                };
                this.updateAttributes({ iUser });
              }}
            />
          </Grid>
        </Grid>
        <Grid container className={classes.item}>
          <Grid item xs={4} className={classes.item}>
            <TextInput
              module="admin"
              label="user.lastName"
              required
              readOnly={readOnly}
              value={edited && edited.iUser ? edited.iUser.lastName : ""}
              onChange={(lastName) => {
                const iUser = {
                  ...edited.iUser,
                  lastName,
                };
                this.updateAttributes({ iUser });
              }}
            />
          </Grid>
          <Grid item xs={4} className={classes.item}>
            <TextInput
              module="admin"
              label="user.otherNames"
              required
              readOnly={readOnly}
              value={edited && edited.iUser ? edited.iUser.otherNames : ""}
              onChange={(otherNames) => {
                const iUser = {
                  ...edited.iUser,
                  otherNames,
                };
                this.updateAttributes({ iUser });
              }}
            />
          </Grid>

          <Grid item xs={4} className={classes.item}>
            <PublishedComponent
              pubRef="location.HealthFacilityPicker"
              value={edited && edited.iUser && edited.iUser.healthFacility}
              module="admin"
              readOnly={readOnly}
              onChange={(healthFacility) => {
                const iUser = {
                  ...edited.iUser,
                  healthFacility,
                };
                this.updateAttributes({ iUser });
              }}
            />
          </Grid>
          <Grid container className={classes.item}>
            <Grid item xs={4} className={classes.item}>
              <TextInput
                module="admin"
                type="email"
                label="user.email"
                readOnly={readOnly}
                value={edited && edited.iUser ? edited.iUser.email : ""}
                onChange={(email) => {
                  const iUser = {
                    ...edited.iUser,
                    email,
                  };
                  this.updateAttributes({ iUser });
                }}
              />
            </Grid>
            <Grid item xs={4} className={classes.item}>
              <TextInput
                module="admin"
                type="phone"
                label="user.phone"
                readOnly={readOnly}
                value={edited && edited.iUser ? edited.iUser.phone : ""}
                onChange={(phone) => {
                  const iUser = {
                    ...edited.iUser,
                    phone,
                  };
                  this.updateAttributes({ iUser });
                }}
              />
            </Grid>
            {(edited.officer ||
              (edited.userTypes &&
                edited.userTypes.includes("OFFICER") &&
                rights.includes(RIGHT_ENROLMENTOFFICER))) && (
              <Grid item xs={4} className={classes.item}>
                <PublishedComponent
                  pubRef="core.DatePicker"
                  value={edited && edited.officer ? edited.officer.dob : ""}
                  module="admin"
                  label="user.dob"
                  readOnly={readOnly}
                  onChange={(dob) => {
                    const officer = {
                      ...edited.officer,
                      dob,
                    };
                    this.updateAttributes({ officer });
                  }}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
      </>
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
      connect(mapStateToProps)(withTheme(withStyles(styles)(UserMasterPanel))),
    ),
  ),
);
