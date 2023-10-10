import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";

import { withTheme, withStyles } from "@material-ui/core/styles";
import { Grid, Divider, Typography, Button, InputAdornment, IconButton, Box } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

import {
  withModulesManager,
  useTranslations,
  TextInput,
  PublishedComponent,
  ValidatedTextInput,
} from "@openimis/fe-core";
import { CLAIM_ADMIN_USER_TYPE, ENROLMENT_OFFICER_USER_TYPE, EMAIL_REGEX_PATTERN } from "../constants";
import {
  usernameValidationCheck,
  usernameValidationClear,
  setUsernameValid,
  userEmailValidationCheck,
  userEmailValidationClear,
  setUserEmailValid,
  saveEmailFormatValidity,
} from "../actions";
import { passwordGenerator } from "../helpers/passwordGenerator";

const styles = (theme) => ({
  tableTitle: theme.table.title,
  item: theme.paper.item,
  fullHeight: {
    height: "100%",
  },
  sectionHeader: {
    ...theme.paper.item,
    paddingBottom: 0,
  },
  sectionTitle: theme.typography.title,
});

const UserMasterPanel = (props) => {
  const {
    classes,
    edited,
    readOnly,
    onEditedChanged,
    modulesManager,
    obligatoryUserFields,
    obligatoryEOFields,
    isUsernameValid,
    isUsernameValidating,
    usernameValidationError,
    isUserEmailValid,
    isUserEmailValidating,
    isUserEmailFormatInvalid,
    emailValidationError,
    savedUsername,
    savedUserEmail,
    usernameLength,
  } = props;
  const { formatMessage } = useTranslations("admin", modulesManager);
  const dispatch = useDispatch();

  const shouldValidateUsername = (inputValue) => {
    const shouldBeValidated = inputValue !== savedUsername;
    return shouldBeValidated;
  };

  const shouldValidateEmail = (inputValue) => {
    const shouldBeValidated = inputValue !== savedUserEmail;
    return shouldBeValidated;
  };

  const checkEmailFormatValidity = (emailInput) => {
    if (!emailInput) return false;

    const isEmailInvalid = !EMAIL_REGEX_PATTERN.test(emailInput);

    return isEmailInvalid;
  };

  const handleEmailChange = (email) => {
    const isFormatValid = checkEmailFormatValidity(email);
    dispatch(saveEmailFormatValidity(isFormatValid));

    onEditedChanged({ ...edited, email });
  };

  useEffect(() => {
    handleEmailChange(edited?.email);
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const generatePassword = () => {
    const passwordGeneratorOptions = modulesManager.getConf("fe-admin", "passwordGeneratorOptions", {
      length: 10,
      isNumberRequired: true,
      isLowerCaseRequired: true,
      isUpperCaseRequired: true,
      isSpecialSymbolRequired: true,
    });
    const generatedPassword = passwordGenerator(passwordGeneratorOptions);
    onEditedChanged({ ...edited, password: generatedPassword, confirmPassword: generatedPassword });
  };

  return (
    <Grid container direction="row">
      <Grid item xs={4} className={classes.item}>
        <ValidatedTextInput
          itemQueryIdentifier="username"
          shouldValidate={shouldValidateUsername}
          isValid={isUsernameValid}
          isValidating={isUsernameValidating}
          validationError={usernameValidationError}
          action={usernameValidationCheck}
          clearAction={usernameValidationClear}
          setValidAction={setUsernameValid}
          module="admin"
          label="user.username"
          codeTakenLabel="user.usernameAlreadyTaken"
          required={true}
          value={edited?.username ?? ""}
          readOnly={readOnly}
          onChange={(username) => onEditedChanged({ ...edited, username })}
          inputProps={{
            "maxLength": usernameLength,
          }}
        />
      </Grid>
      <Grid item xs={4} className={classes.item}>
        <TextInput
          module="admin"
          label="user.givenNames"
          required
          readOnly={readOnly}
          value={edited?.otherNames ?? ""}
          onChange={(otherNames) => onEditedChanged({ ...edited, otherNames })}
        />
      </Grid>
      <Grid item xs={4} className={classes.item}>
        <TextInput
          module="admin"
          label="user.lastName"
          required
          readOnly={readOnly}
          value={edited?.lastName ?? ""}
          onChange={(lastName) => onEditedChanged({ ...edited, lastName })}
        />
      </Grid>
      {!(
        obligatoryUserFields?.email == "H" ||
        (edited.userTypes?.includes(ENROLMENT_OFFICER_USER_TYPE) && obligatoryEOFields?.email == "H")
      ) && (
        <Grid item xs={4} className={classes.item}>
          <ValidatedTextInput
            itemQueryIdentifier="userEmail"
            shouldValidate={shouldValidateEmail}
            isValid={isUserEmailValid}
            isValidating={isUserEmailValidating}
            validationError={emailValidationError}
            invalidValueFormat={isUserEmailFormatInvalid}
            action={userEmailValidationCheck}
            clearAction={userEmailValidationClear}
            setValidAction={setUserEmailValid}
            readOnly={readOnly}
            module="admin"
            label="user.email"
            type="email"
            codeTakenLabel="user.emailAlreadyTaken"
            required={true}
            value={edited?.email ?? ""}
            onChange={(email) => handleEmailChange(email)}
          />
        </Grid>
      )}
      {!(
        obligatoryUserFields?.phone == "H" ||
        (edited.userTypes?.includes(ENROLMENT_OFFICER_USER_TYPE) && obligatoryEOFields?.phone == "H")
      ) && (
        <Grid item xs={4} className={classes.item}>
          <TextInput
            module="admin"
            type="phone"
            label="user.phone"
            required={
              obligatoryUserFields?.phone == "M" ||
              (edited.userTypes?.includes(ENROLMENT_OFFICER_USER_TYPE) && obligatoryEOFields?.phone == "M")
            }
            readOnly={readOnly}
            value={edited?.phoneNumber ?? ""}
            onChange={(phoneNumber) => onEditedChanged({ ...edited, phoneNumber })}
          />
        </Grid>
      )}
      <Grid item xs={4} className={classes.item}>
        <PublishedComponent
          pubRef="location.HealthFacilityPicker"
          value={edited?.healthFacility}
          district={edited.districts}
          module="admin"
          readOnly={readOnly}
          required={
            edited.userTypes.includes(
              CLAIM_ADMIN_USER_TYPE,
            ) /* This field is also present in the claim administrator panel */
          }
          onChange={(healthFacility) => onEditedChanged({ ...edited, healthFacility })}
        />
      </Grid>
      <Grid item xs={6} className={classes.item}>
        <PublishedComponent
          pubRef="admin.UserRolesPicker"
          required
          value={edited?.roles ?? []}
          module="admin"
          readOnly={readOnly}
          onChange={(roles) => onEditedChanged({ ...edited, roles })}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <PublishedComponent
          pubRef="location.LocationPicker"
          locationLevel={0}
          value={edited.region}
          onChange={(region) => onEditedChanged({ ...edited, region })}
          readOnly={readOnly}
          multiple
          withLabel
          label={formatMessage("user.regions")}
          restrictedOptions
        />
      </Grid>
      <Grid item xs={4} className={classes.item}>
        <PublishedComponent
          pubRef="location.LocationPicker"
          locationLevel={1}
          value={edited.districts}
          onChange={(districts) => onEditedChanged({ ...edited, districts })}
          readOnly={readOnly}
          required
          multiple
          withLabel
          label={formatMessage("user.districts")}
          restrictedOptions
        />
      </Grid>

      <Grid item xs={12} className={classes.sectionHeader}>
        <Typography className={classes.sectionTitle}>{formatMessage("UserMasterPanel.loginDetailsTitle")}</Typography>
        <Divider variant="fullWidth" />
      </Grid>
      <Grid item xs={4} className={classes.item}>
        <PublishedComponent
          pubRef="core.LanguagePicker"
          module="admin"
          label="user.language"
          readOnly={readOnly}
          required
          withNull
          nullLabel={formatMessage("UserMasterPanel.language.null")}
          value={edited.language ?? ""}
          onChange={(language) => onEditedChanged({ ...edited, language })}
        />
      </Grid>
      <Grid item xs={4} className={classes.item}>
        <TextInput
          module="admin"
          type={showPassword ? "text" : "password"}
          label="user.newPassword"
          readOnly={readOnly}
          value={edited.password}
          onChange={(password) => onEditedChanged({ ...edited, password })}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          }
        />
      </Grid>
      <Grid item xs={4} className={classes.item}>
        <TextInput
          module="admin"
          type={showPassword ? "text" : "password"}
          label="user.confirmNewPassword"
          required={edited.password}
          readOnly={readOnly}
          value={edited.confirmPassword}
          onChange={(confirmPassword) => onEditedChanged({ ...edited, confirmPassword })}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          }
        />
      </Grid>
      <Grid item xs={4} className={classes.item}>
        <Button disabled={readOnly} variant="contained" onClick={generatePassword}>
          {formatMessage("user.generatePassword")}
        </Button>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  isUsernameValid: state.admin.validationFields?.username?.isValid,
  isUsernameValidating: state.admin.validationFields?.username?.isValidating,
  usernameValidationError: state.admin.validationFields?.username?.validationError,
  savedUsername: state.admin?.user?.username,
  isUserEmailValid: state.admin.validationFields?.userEmail?.isValid,
  isUserEmailValidating: state.admin.validationFields?.userEmail?.isValidating,
  emailValidationError: state.admin.validationFields?.userEmail?.validationError,
  savedUserEmail: state.admin?.user?.email,
  isUserEmailFormatInvalid: state.admin.validationFields?.userEmailFormat?.isInvalid,
});

export default withModulesManager(connect(mapStateToProps)(withTheme(withStyles(styles)(UserMasterPanel))));
