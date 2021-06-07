import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

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
          <FormattedMessage module="user" id="deleteContributionDialog.title" />
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <FormattedMessage
              module="user"
              id="deleteContributionDialog.message"
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => onConfirm()}
            className={classes.primaryButton}
            autoFocus
          >
            <FormattedMessage
              module="user"
              id="deleteContributionDialog.yes.button"
            />
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
