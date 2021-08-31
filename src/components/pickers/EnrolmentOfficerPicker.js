import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import { withModulesManager, useDebounceCb, useTranslations } from "@openimis/fe-core";
import { fetchEnrolmentOfficers } from "../../actions";

const styles = (theme) => ({
  label: {
    color: theme.palette.primary.main,
  },
});

const formatSuggestion = (p) => {
  if (!p) return "?";
  return [p.code, p.lastName, p.otherNames].filter(Boolean).join(" ");
};

const EnrolmentOfficerPicker = (props) => {
  const {
    onChange,
    modulesManager,
    readOnly = false,
    required = false,
    withLabel = true,
    value,
    label,
    filterOptions,
    filterSelectedOptions,
    placeholder,
    multiple = false,
  } = props;
  const minCharLookup = modulesManager.getConf("fe-admin", "usersMinCharLookup", 2);
  const dispatch = useDispatch();
  const [searchString, setSearchString] = useState(null);
  const { formatMessage } = useTranslations("admin.EnrolmentOfficerPicker", modulesManager);
  const [open, setOpen] = useState(false);
  const isLoading = useSelector((state) => state.admin.enrolmentOfficers.isFetching);
  const items = useSelector((state) => state.admin.enrolmentOfficers.items);

  const onInputChange = useDebounceCb(setSearchString, modulesManager.getConf("fe-admin", "debounceTime", 400));
  // eslint-disable-next-line no-shadow
  const handleChange = (__, value) => {
    onChange(value);
    if (!multiple) setOpen(false);
  };

  useEffect(() => {
    if (searchString?.length > minCharLookup) {
      dispatch(
        fetchEnrolmentOfficers(modulesManager, {
          searchString,
        }),
      );
    }
  }, [searchString]);

  useEffect(() => {
    if (open) {
      dispatch(
        fetchEnrolmentOfficers(modulesManager, {
          first: 10,
        }),
      );
    }
  }, [open]);

  return (
    <Autocomplete
      loadingText={formatMessage("loadingText")}
      openText={formatMessage("openText")}
      closeText={formatMessage("closeText")}
      clearText={formatMessage("clearText")}
      openOnFocus
      multiple={multiple}
      disabled={readOnly}
      options={items}
      loading={isLoading}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      autoComplete
      value={value}
      getOptionLabel={(option) => formatSuggestion(option)}
      getOptionSelected={(option, v) => option.id === v.id}
      onChange={handleChange}
      filterOptions={filterOptions}
      filterSelectedOptions={filterSelectedOptions}
      onInputChange={(__, query) => onInputChange(query)}
      renderInput={(inputProps) => (
        <TextField
          {...inputProps}
          variant="standard"
          required={required}
          label={withLabel && (label || formatMessage("label"))}
          placeholder={placeholder}
        />
      )}
    />
  );
};

export default withModulesManager(withTheme(withStyles(styles)(EnrolmentOfficerPicker)));
