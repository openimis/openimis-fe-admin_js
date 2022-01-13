import React from "react";
import { Grid, Typography, Paper, Switch } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { useTranslations, withModulesManager, combine, PublishedComponent, TextInput } from "@openimis/fe-core";
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

  const isEnabled = edited.userTypes?.includes(ENROLMENT_OFFICER_USER_TYPE);

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
              onChange={() => onEditedChanged(toggleUserType(edited, ENROLMENT_OFFICER_USER_TYPE))}
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
            <Grid item xs={4} className={classes.item}>
              <PublishedComponent
                pubRef="location.RegionPicker"
                value={edited.location?.parent ?? edited.location}
                required
                readOnly={readOnly}
                withNull={true}
                onChange={(location) => onEditedChanged({ ...edited, location })}
              />
            </Grid>
            <Grid item xs={4} className={classes.item}>
              <PublishedComponent
                region={edited.location?.parent || edited.location}
                value={edited.location?.parent ? edited.location : null}
                pubRef="location.DistrictPicker"
                required
                withNull={true}
                readOnly={readOnly}
                onChange={(location) => onEditedChanged({ ...edited, location: location || edited.location?.parent })}
              />
            </Grid>
            <Grid item xs={12} className={classes.item}>
              <EnrolmentVillagesPicker
                readOnly={readOnly}
                location={edited.location}
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
