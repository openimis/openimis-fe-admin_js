import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { TextInput, useDebounceCb, useModulesManager, useTranslations, useGraphqlQuery } from "@openimis/fe-core";
import { InputAdornment, CircularProgress, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import CheckOutlinedIcon from "@material-ui/icons/CheckOutlined";
import ErrorOutlineOutlinedIcon from "@material-ui/icons/ErrorOutlineOutlined";

const useStyles = makeStyles((theme) => ({
  validIcon: {
    color: "green",
  },
  invalidIcon: {
    color: theme.palette.error.main,
  },
}));

const operation = `
  query ($username: String!) {
    isValid: validateUsername(username: $username)
  }
`;

const UniqueUsernameInput = (props) => {
  const { value, new_user, onChange, className, label = "Username", placeholder, edited, readOnly, required, inputProps } = props;
  const [internalValue, setInternalValue] = useState(value);
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations("admin", modulesManager);
  const classes = useStyles();
  const {
    isLoading,
    data,
    error: graphqlError,
  } = useGraphqlQuery(operation, { username: internalValue}, { skip: !internalValue });

  const handleValueChange = useDebounceCb((val) => {
    if (val) {
      setInternalValue(val);
    } else {
      onChange({"username": val, "isValid": isValid});
    }
  }, modulesManager.getConf("fe-admin", "debounceTime", 400));

  const isValid = !isLoading && data?.isValid;

  useEffect(() => {
    onChange({"username": internalValue, "isValid": isValid});
  }, [isValid]);

  return (
    <TextInput
      module="admin"
      className={className}
      disabled={readOnly}
      required={required}
      label={label}
      placeholder={placeholder}
      error={graphqlError || (!isValid && value)? formatMessage("user.usernameAlreadyTaken") : null}
      value={value}
      new_user={new_user}
      inputProps={{ maxLength: modulesManager.getConf("fe-admin", "userFrom.usernameMaxLength", inputProps.maxLength) }}
      endAdornment={
        <InputAdornment position="end" className={clsx((isValid && value) && classes.validIcon, (!isValid && value)&& classes.invalidIcon)}>
          <>
            {isLoading && (
              <Box mr={1}>
                <CircularProgress size={20} />
              </Box>
            )}
            {(isValid && value) && <CheckOutlinedIcon size={20} />}
            {(!isValid && value) && <ErrorOutlineOutlinedIcon size={20} />}
          </>
        </InputAdornment>
      }
      onChange={handleValueChange}
    />
  );
};

export default UniqueUsernameInput;
