import React, {useEffect, useRef } from "react";
import clsx from "clsx";
import { TextInput, useDebounceCb, useModulesManager, useTranslations} from "@openimis/fe-core";
import { InputAdornment, CircularProgress, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import CheckOutlinedIcon from "@material-ui/icons/CheckOutlined";
import { useDispatch, useSelector } from "react-redux";
import ErrorOutlineOutlinedIcon from "@material-ui/icons/ErrorOutlineOutlined";
import { debounce } from "lodash";

const useStyles = makeStyles((theme) => ({
  validIcon: {
    color: "green",
  },
  invalidIcon: {
    color: theme.palette.error.main,
  },
}));

const UniqueUsernameInput = (props) => {
  const { value, onChange, className, label = "Username", placeholder, readOnly, required, inputProps, action, clearAction } = props;
  const modulesManager = useModulesManager();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { formatMessage } = useTranslations("admin", modulesManager);

  const isValid = useSelector((state) => state.admin.validationFields?.username?.isValid);
  const isValidating = useSelector((state) => state.admin.validationFields?.username.isValidating);
  const validationError = useSelector((state) => state.admin.validationFields?.username.validationError);


  console.log("isValid", isValid);
  console.log("isValidating", isValidating);
  console.log("validationError", validationError);

  const debounceResponse = useRef(
    debounce((value) => dispatch(action(modulesManager, { username: value })), 800),
  ).current;

  useEffect(() => {
    if (value) debounceResponse(value);
    return () => dispatch(clearAction());
  }, [value]);

  return (
    <TextInput
      module="admin"
      className={className}
      disabled={readOnly}
      required={required}
      label={label}
      placeholder={placeholder}
      error={validationError || (!isValidating && !isValid && value)? formatMessage("user.usernameAlreadyTaken") : null}
      value={value}
      inputProps={{ maxLength: modulesManager.getConf("fe-admin", "userFrom.usernameMaxLength", inputProps.maxLength) }}
      endAdornment={
        <InputAdornment 
        position="end" 
        className={clsx((isValid && value) && classes.validIcon, (!isValid && value)&& classes.invalidIcon)}>
          <>
            {isValidating && value && (
              <Box mr={1}>
                <CircularProgress size={20} />
              </Box>
            )}
            {(!isValidating && isValid && value) && <CheckOutlinedIcon size={20} />}
            {(!isValidating && !isValid && value) && <ErrorOutlineOutlinedIcon size={20} />}
          </>
        </InputAdornment>
      }
      onChange={onChange}
    />
  );
};

export default UniqueUsernameInput;
