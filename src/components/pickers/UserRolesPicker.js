import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { useSelector, useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  formatMessage,
  withModulesManager,
  ProgressOrError,
} from "@openimis/fe-core";

import { fetchUserRoles } from "../../actions";

const UserRolesPicker = ({ readOnly, modulesManager, value, onChange }) => {
  const intl = useIntl();
  const roles = useSelector((state) => state.admin.userRoles);
  const userHealthFacilityFullPath = useSelector((state) =>
    state.loc ? state.loc.userHealthFacilityFullPath : null,
  );
  const fetchingUserRoles = useSelector(
    (state) => state.admin.fetchingUserRoles,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserRoles(modulesManager, userHealthFacilityFullPath));
  }, []);
  return (
    <>
      <ProgressOrError progress={fetchingUserRoles} />
      {!fetchingUserRoles && (
        <Autocomplete
          loading={fetchingUserRoles}
          multiple
          disabled={readOnly}
          noOptionsText={formatMessage(
            intl,
            "admin.user",
            "userRoles.noOptions",
          )}
          id="user-role-select"
          options={roles}
          getOptionLabel={(option) => option.name}
          getOptionSelected={(option, val) => option.id === val.id}
          onChange={(e, userRoles) => onChange(userRoles)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label={formatMessage(intl, "admin.user", "userRoles")}
              placeholder=""
            />
          )}
          value={value}
        />
      )}
    </>
  );
};

export default withModulesManager(UserRolesPicker);
