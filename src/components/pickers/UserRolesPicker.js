import React, { useState } from "react";
import { useGraphqlQuery, useTranslations, Autocomplete } from "@openimis/fe-core";

const UserRolesPicker = ({
  readOnly,
  value,
  onChange,
  required,
  multiple = true,
  placeholder,
  withLabel,
  withPlaceholder,
  label,
  filterOptions,
  filterSelectedOptions,
}) => {
  const [searchString, setSearchString] = useState();
  const { formatMessage } = useTranslations("admin");

  const { isLoading, data, error } = useGraphqlQuery(
    `
    query UserRolesPicker ($str: String) {
      role(str: $str) {
        edges {
          node {
            id name isSystem
          }
        }
      }
    }
  `,
    { str: searchString },
  );

  return (
    <Autocomplete
      multiple={multiple}
      required={required}
      placeholder={placeholder ?? formatMessage("user.userRoles.placeholder")}
      label={label ?? formatMessage("user.userRoles")}
      error={error}
      withLabel={withLabel}
      withPlaceholder={withPlaceholder}
      readOnly={readOnly}
      options={data?.role?.edges.map((edge) => edge.node) ?? []}
      isLoading={isLoading}
      value={value}
      getOptionLabel={(o) => o?.name}
      onChange={(option) => onChange(option, option?.name)}
      filterOptions={filterOptions}
      filterSelectedOptions={filterSelectedOptions}
      onInputChange={setSearchString}
    />
  );
};

export default UserRolesPicker;
