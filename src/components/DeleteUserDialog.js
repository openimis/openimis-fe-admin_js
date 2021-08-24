import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";

import { FormattedMessage } from "@openimis/fe-core";

const styles = (theme) => ({
  primaryButton: theme.dialog.primaryButton,
  secondaryButton: theme.dialog.secondaryButton,
});

class DeleteUserDialog extends Component {
  render() {
    const { classes, user, onCancel, onConfirm } = this.props;
    return (
      <Dialog open={!!user} onClose={onCancel}>
        <DialogTitle>
          <FormattedMessage module="admin" id="user.deleteDialog.title" />
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <FormattedMessage module="admin" id="user.deleteDialog.message" />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={(e) => onConfirm()} className={classes.primaryButton} autoFocus>
            <FormattedMessage module="admin" id="user.deleteDialog.yes.button" />
          </Button>
          <Button onClick={onCancel} className={classes.secondaryButton}>
            <FormattedMessage module="core" id="cancel" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default injectIntl(withTheme(withStyles(styles)(DeleteUserDialog)));
