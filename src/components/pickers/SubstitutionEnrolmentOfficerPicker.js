import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Autocomplete } from "@openimis/fe-core";
import { fetchSubstitutionEnrolmentOfficers } from "../../actions";

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
    withLabel = true,
    value,
    villages,
    label,
    filterOptions,
    filterSelectedOptions,
    placeholder,
    multiple = false,
  } = props;
  const dispatch = useDispatch();
  const [searchString, setSearchString] = useState(null);

  const isLoading = useSelector((state) => state.admin.substitutionEnrolmentOfficers.isFetching);
  const options = useSelector((state) => state.admin.substitutionEnrolmentOfficers.items);
  const officerUuid = useSelector((state) => state.admin?.user?.officer?.uuid) ?? null;

  useEffect(() => {
    dispatch(
      fetchSubstitutionEnrolmentOfficers(modulesManager, {
        officerUuid: officerUuid,
        villagesUuids: villages?.map((village) => village.uuid),
        str: null,
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

export default SubstitutionEnrolmentOfficerPicker;
