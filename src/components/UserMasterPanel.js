import React from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Grid } from "@material-ui/core";
import {
  withHistory,
  withModulesManager,
  AmountInput,
  TextInput,
  PublishedComponent,
  FormPanel,
  formatMessage,
} from "@openimis/fe-core";

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
          <Grid item xs={3} className={classes.item}>
            <TextInput
              module="admin"
              label="user.username"
              readOnly
              value={edited ? edited.username : ""}
              onChange={(p) => this.updateAttribute("username", p)}
            />
          </Grid>
          <Grid item xs={3} className={classes.item}>
            <TextInput
              module="admin"
              label="user.lastName"
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
          <Grid item xs={3} className={classes.item}>
            <TextInput
              module="admin"
              label="user.otherNames"
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
          <Grid item xs={3} className={classes.item}>
            <TextInput
              module="admin"
              type="phone"
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
        </Grid>
        <Grid container className={classes.item}>
          <Grid item xs={3} className={classes.item}>
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
        </Grid>
        {edited.officer && (
          <Grid container className={classes.item}>
            <Grid item xs={3} className={classes.item}>
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
          </Grid>
        )}
      </>
    );
  }
}

export default withModulesManager(
  withHistory(injectIntl(withTheme(withStyles(styles)(UserMasterPanel)))),
);
