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
import { userTypesMapping } from "../constants";

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

export const mapQueriesUserToMutation = (u) => {
  // TODO: make this more generic
  if (u.iUser) {
    u.lastName = u.iUser.lastName;
    u.otherNames = u.iUser.otherNames;
    u.email = u.iUser.email;
    u.phoneNumber = u.iUser.phone;
    u.healthFacility = u.iUser.healthFacility;
    u.language = u.iUser.languageId;
    u.roles = u.iUser.roles;
  }
  if (u.claimAdmin) {
    u.lastName = u.claimAdmin.lastName;
    u.otherNames = u.claimAdmin.otherNames;
    u.email = u.claimAdmin.emailId;
    u.phoneNumber = u.claimAdmin.phone;
    u.birthDate = u.claimAdmin.dob;
    u.healthFacility = u.claimAdmin.healthFacility;
  }
  if (u.officer) {
    u.lastName = u.officer.lastName;
    u.otherNames = u.officer.otherNames;
    u.email = u.officer.email;
    u.phoneNumber = u.officer.phone;
    u.birthDate = u.officer.dob;
    u.address = u.officer.address;
    u.substitutionOfficerId = u.officer.substitutionOfficer ? u.officer.substitutionOfficer.id : null;
    u.worksTo = u.officer.worksTo;
  }
  return u;
}

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
    const userRoles = edited && edited.roles ? edited.roles : [];
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
              required={!!(edited.iUser ||
                        (edited.userTypes &&
                          edited.userTypes.includes("INTERACTIVE")
                          ))}
              value={userRoles || []}
              module="admin"
              readOnly={readOnly}
              onChange={(roles) => this.updateAttributes({ roles })}
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
              value={edited && edited.lastName ? edited.lastName : ""}
              onChange={(lastName) => this.updateAttributes({ lastName })}
            />
          </Grid>
          <Grid item xs={4} className={classes.item}>
            <TextInput
              module="admin"
              label="user.otherNames"
              required
              readOnly={readOnly}
              value={edited && edited.otherNames ? edited.otherNames : ""}
              onChange={(otherNames) => this.updateAttributes({ otherNames })}
            />
          </Grid>

          <Grid item xs={4} className={classes.item}>
            <PublishedComponent
              pubRef="location.HealthFacilityPicker"
              value={edited && edited.healthFacility}
              module="admin"
              readOnly={readOnly}
              onChange={(healthFacilityId) => this.updateAttributes({ healthFacilityId })}
            />
          </Grid>
          <Grid container className={classes.item}>
            <Grid item xs={4} className={classes.item}>
              <TextInput
                module="admin"
                type="email"
                label="user.email"
                readOnly={readOnly}
                value={edited && edited.email ? edited.email : ""}
                onChange={(email) => this.updateAttributes({ email })}
              />
            </Grid>
            <Grid item xs={4} className={classes.item}>
              <TextInput
                module="admin"
                type="phone"
                label="user.phone"
                readOnly={readOnly}
                value={edited && edited.phoneNumber ? edited.phoneNumber : ""}
                onChange={(phoneNumber) => this.updateAttributes({ phoneNumber })}
              />
            </Grid>
            {(edited.officer ||
              (edited.userTypes &&
                (edited.userTypes.includes("OFFICER") || edited.userTypes.includes("CLAIM_ADMIN"))
                )) && (
              <Grid item xs={4} className={classes.item}>
                <PublishedComponent
                  pubRef="core.DatePicker"
                  value={edited && edited.birthDate ? edited.birthDate : ""}
                  module="admin"
                  label="user.dob"
                  readOnly={readOnly}
                  onChange={(birthDate) => this.updateAttributes({ birthDate })}
                />
              </Grid>
            )}
          </Grid>
          {(edited.iUser ||
          (edited.userTypes &&
            edited.userTypes.includes("INTERACTIVE")
            )) && (
            <Grid container className={classes.item}>
              <Grid item xs={4} className={classes.item}>
                <TextInput
                  module="admin"
                  type="password"
                  label="user.password"
                  readOnly={readOnly}
                  value=""
                  onChange={(password) => this.updateAttributes({ password })}
                />
              </Grid>
              <Grid item xs={4} className={classes.item}>
                <TextInput
                  module="admin"
                  type="text"
                  label="user.language"
                  readOnly={readOnly}
                  value={edited && edited.language ? edited.language : "en"}
                  onChange={(language) => this.updateAttributes({ language })}
                />
              </Grid>
            </Grid>
          )}
          {(edited.iUser ||
          (edited.userTypes &&
            edited.userTypes.includes("OFFICER")
            )) && (
            <Grid container className={classes.item}>
              <Grid item xs={4} className={classes.item}>
                <TextInput
                  module="admin"
                  label="user.address"
                  multiline
                  rows={2}
                  readOnly={readOnly}
                  value={edited && edited.address ? edited.address : ""}
                  onChange={(address) => this.updateAttributes({ address })}
                />
              </Grid>
              <Grid item xs={4} className={classes.item}>
                <PublishedComponent
                  pubRef="core.DatePicker"
                  value={edited && edited.worksTo ? edited.worksTo : ""}
                  module="admin"
                  label="user.worksTo"
                  readOnly={readOnly}
                  onChange={(worksTo) => this.updateAttributes({ worksTo })}
                />
              </Grid>
            </Grid>
          )}
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
