import React, { useState, useEffect }  from "react";
import { Grid, Typography, Paper, Switch } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { useTranslations, withModulesManager, combine, PublishedComponent, useGraphqlQuery } from "@openimis/fe-core";
import { CLAIM_ADMIN_USER_TYPE } from "../constants";
import { toggleUserType } from "../utils";

const styles = (theme) => ({
  item: theme.paper.item,
  paper: theme.paper.paper,
  title: theme.paper.title,
});

const ClaimAdministratorFormPanel = (props) => {
  const { edited, classes, modulesManager, onEditedChanged, readOnly } = props;
  const { formatMessage } = useTranslations("admin.ClaimAdministratorFormPanel", modulesManager);
  const isEnabled = edited.userTypes?.includes(CLAIM_ADMIN_USER_TYPE);

  const has_role = !!edited.roles ? (edited.roles.filter((x) => x.isSystem == 256).length != 0) : false
  if (isEnabled) {
    const {isLoading, data, error: graphqlError} = useGraphqlQuery(
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
      { system_id: 256 }, // Claim Admin System Role is 256
    );
    const isValid = !isLoading
    useEffect(() => {
      if (isValid & isEnabled & !has_role) {
        const role = data.role.edges[0].node
        const roles  = !!edited.roles ? edited.roles : [];
        roles.push(role)
        edited.roles = roles
        onEditedChanged(edited)
      }
    }, [isValid]);
  }

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
              onChange={() => onEditedChanged(toggleUserType(edited, CLAIM_ADMIN_USER_TYPE))}
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
                pubRef="location.HealthFacilityPicker"
                value={edited?.healthFacility}
                required
                module="admin"
                readOnly={readOnly}
                onChange={(healthFacility) => onEditedChanged({ ...edited, healthFacility })}
              />
            </Grid>
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};

const enhance = combine(withModulesManager, withTheme, withStyles(styles));

export default enhance(ClaimAdministratorFormPanel);
