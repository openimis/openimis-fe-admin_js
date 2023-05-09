import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";

import { TextField } from "@material-ui/core";

import { Autocomplete, useTranslations } from "@openimis/fe-core";
import { fetchSubstitutionEOs } from "../../utils";

const formatSuggestion = (p) => {
  if (!p) return "?";
  return [p.code, p.lastName, p.otherNames].filter(Boolean).join(" ");
};

const SubstitutionEnrolmentOfficerPicker = (props) => {
  const {
    onChange,
    modulesManager,
    readOnly = false,
    required = false,
    value,
    villages,
    filterOptions,
    filterSelectedOptions,
    multiple = false,
    withLabel = true,
    label,
    withPlaceholder = false,
    placeholder,
  } = props;
  const dispatch = useDispatch();
  const { formatMessage } = useTranslations("admin", modulesManager);
  const [searchString, setSearchString] = useState("");
  const { isFetching, items } = useSelector((state) => state.admin.substitutionEnrolmentOfficers);
  const officerUuid = useSelector((state) => state.admin?.user?.officer?.uuid) ?? null;

  const handleInputChange = (str) => {
    setSearchString(str);
    fetchSubstitutionEOs(dispatch, modulesManager, officerUuid, searchString, villages);
  };

  return (
    <Autocomplete
      multiple={multiple}
      required={required}
      placeholder={placeholder}
      label={label}
      withLabel={withLabel}
      readOnly={readOnly}
      options={items}
      isLoading={isFetching}
      value={value}
      getOptionLabel={formatSuggestion}
      onChange={onChange}
      filterOptions={filterOptions}
      filterSelectedOptions={filterSelectedOptions}
      onInputChange={handleInputChange}
      renderInput={(inputProps) => (
        <TextField
          {...inputProps}
          label={withLabel && (label || formatMessage("EnrolmentOfficerFormPanel.substitutionOfficer"))}
          placeholder={
            withPlaceholder &&
            (placeholder || formatMessage("EnrolmentOfficerFormPanel.substitutionOfficer.placeholder"))
          }
        />
      )}
    />
  );
};

export default SubstitutionEnrolmentOfficerPicker;
