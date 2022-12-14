import React, { useEffect, useState } from "react";
import { Grid, Typography, Paper, Switch } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
  useTranslations,
  withModulesManager,
  combine,
  PublishedComponent,
  TextInput,
  useGraphqlQuery,
} from "@openimis/fe-core";
import { ENROLMENT_OFFICER_USER_TYPE } from "../constants";
import { toggleUserType } from "../utils";
import EnrolmentVillagesPicker from "./EnrolmentVillagesPicker";

const styles = (theme) => ({
  item: theme.paper.item,
  paper: theme.paper.paper,
  title: theme.paper.title,
});

const EnrolmentOfficerFormPanel = (props) => {
  const { edited, classes, modulesManager, onEditedChanged, readOnly } = props;
  const { formatMessage } = useTranslations("admin.EnrolmentOfficerFormPanel", modulesManager);
  const [isEnabled, setIsEnabled] = useState(false);
  const hasOfficerUserType = edited.userTypes?.includes(ENROLMENT_OFFICER_USER_TYPE);
  const hasOfficerRole = edited.roles ? edited.roles.filter((x) => x.isSystem === 1).length !== 0 : false;
  const {
    isLoading,
    data,
    error: graphqlError,
  } = useGraphqlQuery(
    `
      query UserRolesPicker ($system_id: Int) {
        role(systemRoleId: $system_id) {
          edges {
            node {
              id name isSystem
            }
          }
        }
      }
    `,
    { system_id: 1 }, // EO System Role is 1
  );
  const isValid = !isLoading;

  useEffect(() => {
    const roles = edited?.roles ?? [];
    const officerRole = data?.role.edges[0].node;

    if (isValid && isEnabled && !hasOfficerRole) {
      roles.push(officerRole);
      edited.roles = roles;
      onEditedChanged(edited);
    } else if (isValid && !isEnabled) {
      const filteredRoles = roles.filter((role) => role.isSystem !== 1);
      edited.roles = filteredRoles;
      onEditedChanged(edited);
    }
  }, [isEnabled]);

  useEffect(() => {
    if (hasOfficerRole) {
      setIsEnabled(() => true);
      onEditedChanged(toggleUserType(edited, ENROLMENT_OFFICER_USER_TYPE));
    } else {
      setIsEnabled(() => false);
      if (hasOfficerUserType) {
        onEditedChanged(toggleUserType(edited, ENROLMENT_OFFICER_USER_TYPE));
      }
    }
  }, [hasOfficerRole]);

  return (
    <Paper className={classes.paper}>
      <Grid item xs={12} className={classes.title}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{formatMessage("title")}</Typography>
          {(!edited.id || !isEnabled) && (
            <Switch
              color="secondary"
              disabled={readOnly}
              checked={isEnabled}
              onChange={() => setIsEnabled(() => !isEnabled)}
            />
          )}
        </Grid>
      </Grid>
      {isEnabled && (
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={4} className={classes.item}>
              <PublishedComponent
                pubRef="core.DatePicker"
                value={edited?.birthDate}
                module="admin"
                label="user.dob"
                readOnly={readOnly}
                onChange={(birthDate) => onEditedChanged({ ...edited, birthDate })}
              />
            </Grid>
            <Grid item xs={4} className={classes.item}>
              <PublishedComponent
                pubRef="admin.EnrolmentOfficerPicker"
                module="admin"
                readOnly={readOnly}
                label={formatMessage("substitutionOfficer")}
                value={edited.substitutionOfficer}
                onChange={(substitutionOfficer) => onEditedChanged({ ...edited, substitutionOfficer })}
              />
            </Grid>
            <Grid item xs={4} className={classes.item}>
              <PublishedComponent
                pubRef="core.DatePicker"
                value={edited?.worksTo ?? ""}
                module="admin"
                label="user.worksTo"
                readOnly={readOnly}
                onChange={(worksTo) => onEditedChanged({ ...edited, worksTo })}
              />
            </Grid>
            <Grid item xs={12} className={classes.item}>
              <TextInput
                module="admin"
                label="user.address"
                multiline
                rows={2}
                variant="outlined"
                readOnly={readOnly}
                value={edited?.address ?? ""}
                onChange={(address) => onEditedChanged({ ...edited, address })}
              />
            </Grid>
            <Grid item xs={12} className={classes.item}>
              <EnrolmentVillagesPicker
                isOfficerPanelEnabled={isEnabled}
                readOnly={readOnly}
                districts={edited.districts}
                villages={edited.officerVillages}
                onChange={(officerVillages) => onEditedChanged({ ...edited, officerVillages })}
              />
            </Grid>
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};

const enhance = combine(withModulesManager, withTheme, withStyles(styles));

export default enhance(EnrolmentOfficerFormPanel);
