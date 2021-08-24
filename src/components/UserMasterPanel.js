import React from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";
import { withHistory, withModulesManager, TextInput, PublishedComponent, FormPanel, combine } from "@openimis/fe-core";
import { getUserTypes } from "../utils";

const styles = (theme) => ({
  tableTitle: theme.table.title,
  item: theme.paper.item,
  fullHeight: {
    height: "100%",
  },
});

class UserMasterPanel extends FormPanel {
  render() {
    const { classes, edited, readOnly } = this.props;
    return (
      <>
        <Grid container className={classes.item}>
          <Grid item xs={4} className={classes.item}>
            <TextInput
              module="admin"
              required
              label="user.username"
              readOnly={Boolean(edited.id) || readOnly}
              value={edited?.username ?? ""}
              onChange={(p) => this.updateAttribute("username", p)}
            />
          </Grid>
          <Grid item xs={4} className={classes.item}>
            <PublishedComponent
              required
              pubRef="admin.UserTypesPicker"
              value={edited?.userTypes || getUserTypes(edited)}
              module="admin"
              readOnly={readOnly}
              onChange={(p) => this.updateAttribute("userTypes", p)}
            />
          </Grid>
          <Grid item xs={4} className={classes.item}>
            <PublishedComponent
              pubRef="admin.UserRolesPicker"
              required={!!(edited.iUser || (edited.userTypes && edited.userTypes.includes("INTERACTIVE")))}
              value={edited?.roles ?? []}
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
              value={edited?.lastName ?? ""}
              onChange={(lastName) => this.updateAttributes({ lastName })}
            />
          </Grid>
          <Grid item xs={4} className={classes.item}>
            <TextInput
              module="admin"
              label="user.otherNames"
              required
              readOnly={readOnly}
              value={edited?.otherNames ?? ""}
              onChange={(otherNames) => this.updateAttributes({ otherNames })}
            />
          </Grid>

          <Grid item xs={4} className={classes.item}>
            <PublishedComponent
              pubRef="location.HealthFacilityPicker"
              value={edited?.healthFacility}
              module="admin"
              readOnly={readOnly}
              onChange={(healthFacilityId) => this.updateAttributes({ healthFacilityId })}
            />
          </Grid>
          <Grid container>
            <Grid item xs={4} className={classes.item}>
              <TextInput
                module="admin"
                type="email"
                label="user.email"
                readOnly={readOnly}
                value={edited?.email ?? ""}
                onChange={(email) => this.updateAttributes({ email })}
              />
            </Grid>
            <Grid item xs={4} className={classes.item}>
              <TextInput
                module="admin"
                type="phone"
                label="user.phone"
                readOnly={readOnly}
                value={edited?.phoneNumber ?? ""}
                onChange={(phoneNumber) => this.updateAttributes({ phoneNumber })}
              />
            </Grid>
            {(edited.officer || edited.userTypes?.includes("OFFICER") || edited.userTypes?.includes("CLAIM_ADMIN")) && (
              <Grid item xs={4} className={classes.item}>
                <PublishedComponent
                  pubRef="core.DatePicker"
                  value={edited?.birthDate}
                  module="admin"
                  label="user.dob"
                  readOnly={readOnly}
                  onChange={(birthDate) => this.updateAttributes({ birthDate })}
                />
              </Grid>
            )}
          </Grid>
          {(edited.iUser || edited.userTypes?.includes("INTERACTIVE")) && (
            <Grid container>
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
                <PublishedComponent
                  pubRef="core.LanguagePicker"
                  module="admin"
                  label="user.language"
                  readOnly={readOnly}
                  value={edited?.language ?? "en"}
                  onChange={(language) => this.updateAttributes({ language })}
                />
              </Grid>
            </Grid>
          )}
          {(edited.iUser || edited.userTypes?.includes("OFFICER")) && (
            <Grid container>
              <Grid item xs={4} className={classes.item}>
                <TextInput
                  module="admin"
                  label="user.address"
                  multiline
                  rows={2}
                  readOnly={readOnly}
                  value={edited?.address ?? ""}
                  onChange={(address) => this.updateAttributes({ address })}
                />
              </Grid>
              <Grid item xs={4} className={classes.item}>
                <PublishedComponent
                  pubRef="core.DatePicker"
                  value={edited?.worksTo ?? ""}
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
  rights: state.core?.user?.i_user?.rights ?? [],
});

const enhance = combine(
  injectIntl,
  withModulesManager,
  withHistory,
  withTheme,
  withStyles(styles),
  connect(mapStateToProps),
);

export default enhance(UserMasterPanel);
