import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Autocomplete } from "@openimis/fe-core";
import { fetchEnrolmentOfficers } from "../../actions";

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
  const dispatch = useDispatch();
  const [searchString, setSearchString] = useState(null);

  const isLoading = useSelector((state) => state.admin.enrolmentOfficers.isFetching);
  const options = useSelector((state) => state.admin.enrolmentOfficers.items);

  useEffect(() => {
    dispatch(
      fetchEnrolmentOfficers(modulesManager, {
        first: searchString ? undefined : 10,
        searchString,
      }),
    );
  }, [searchString]);

  return (
    <Autocomplete
      multiple={multiple}
      required={required}
      placeholder={placeholder}
      label={label}
      withLabel={withLabel}
      readOnly={readOnly}
      options={options}
      isLoading={isLoading}
      value={value}
      getOptionLabel={formatSuggestion}
      onChange={onChange}
      filterOptions={filterOptions}
      filterSelectedOptions={filterSelectedOptions}
      onInputChange={setSearchString}
    />
  );
};

export default EnrolmentOfficerPicker;
