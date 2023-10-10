import React, { Component } from "react";
import { injectIntl } from "react-intl";
import _debounce from "lodash/debounce";

import { withTheme, withStyles } from "@material-ui/core/styles";
import { Grid, Checkbox, FormControlLabel } from "@material-ui/core";

import {
  withModulesManager,
  decodeId,
  PublishedComponent,
  ControlledField,
  TextInput,
  formatMessage,
} from "@openimis/fe-core";

const styles = (theme) => ({
  dialogTitle: theme.dialog.title,
  dialogContent: theme.dialog.content,
  form: {
    padding: "0 0 10px 0",
    width: "100%",
  },
  item: {
    padding: theme.spacing(1),
  },
  paperDivider: theme.paper.divider,
});

const extractLocations = (locations) => {
  const locationsArray = Object.values(locations).map((l) => l.value);
  const region = locationsArray.find((l) => !l.parent);
  const district = region && locationsArray.find((l) => l.parent && l.parent.id === region.id);
  const municipality = district && locationsArray.find((l) => l.parent && l.parent.id === district.id);
  const village = municipality && locationsArray.find((l) => l.parent && l.parent.id === municipality.id);

  return { region, district, municipality, village };
};

class UserFilter extends Component {
  state = {
    locationFilters: {},
    selectedDistrict: {},
  };

  debouncedOnChangeFilter = _debounce(
    this.props.onChangeFilters,
    this.props.modulesManager.getConf("fe-admin", "debounceTime", 200),
  );

  filterValue = (k) => {
    const { filters } = this.props;
    return !!filters && !!filters[k] ? filters[k].value : null;
  };

  filterTextFieldValue = (k) => {
    const { filters } = this.props;
    return !!filters && !!filters[k] ? filters[k].value : "";
  };

  filterDistrict = (locations) => {
    const extractedLocations = extractLocations(locations);
    const { district } = extractedLocations;

    return district;
  };

  onChangeCheckbox = (key, value) => {
    const filters = [
      {
        id: key,
        value,
        filter: `${key}: ${value}`,
      },
    ];
    this.props.onChangeFilters(filters);
  };

  onChangeUserTypes = (currentUserType) => {
    const { onChangeFilters } = this.props;
    onChangeFilters([
      {
        id: "userTypes",
        value: currentUserType,
        filter: currentUserType ? `userTypes: [${currentUserType}]` : [],
      },
    ]);
  };

  onChangeUserRoles = (currentUserRoles) => {
    const { onChangeFilters } = this.props;
    this.setState({ currentUserRoles });
    onChangeFilters([
      {
        id: "roles",
        value: currentUserRoles,
        filter: currentUserRoles ? `roles: [${currentUserRoles.map((ur) => decodeId(ur.id)).join(",")}]` : [],
      },
    ]);
  };

  onChangeLocation = (newLocationFilters) => {
    const { onChangeFilters } = this.props;
    const locationFilters = { ...this.state.locationFilters };
    newLocationFilters.forEach((filter) => {
      if (filter.value === null) {
        delete locationFilters[filter.id];
      } else {
        locationFilters[filter.id] = {
          value: filter.value,
          filter: filter.filter,
        };
      }
    });
    const selectedDistrict = this.filterDistrict(locationFilters);
    this.setState({ locationFilters, selectedDistrict });

    onChangeFilters(newLocationFilters);
  };

  render() {
    const { classes, filters, onChangeFilters, intl } = this.props;
    const { selectedDistrict } = this.state;
    return (
      <section className={classes.form}>
        <Grid container>
          <ControlledField
            module="admin"
            id="userFilter.userTypes"
            field={
              <Grid item xs={3} className={classes.item}>
                <PublishedComponent
                  pubRef="admin.UserTypesPicker"
                  value={this.filterValue("userTypes")}
                  onChange={(v) => this.onChangeUserTypes(v)}
                />
              </Grid>
            }
          />
          <ControlledField
            module="admin"
            id="userFilter.userRoles"
            field={
              <Grid item xs={3} className={classes.item}>
                <PublishedComponent
                  pubRef="admin.UserRolesPicker"
                  value={this.filterValue("roles")}
                  onChange={(v) => this.onChangeUserRoles(v)}
                />
              </Grid>
            }
          />
          <ControlledField
            module="admin"
            id="userFilter.healthFacility"
            field={
              <Grid item xs={3} className={classes.item}>
                <PublishedComponent
                  pubRef="location.HealthFacilityPicker"
                  withNull={true}
                  value={this.filterValue("healthFacility")}
                  district={selectedDistrict}
                  onChange={(v) => {
                    onChangeFilters([
                      {
                        id: "healthFacility",
                        value: v,
                        filter: v ? `healthFacilityId: ${decodeId(v.id)}` : null,
                      },
                    ]);
                  }}
                />
              </Grid>
            }
          />
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            <PublishedComponent
              pubRef="location.DetailedLocationFilter"
              withNull={true}
              filters={filters}
              onChangeFilters={this.onChangeLocation}
              anchor="parentLocation"
            />
          </Grid>
        </Grid>
        <Grid container>
          <ControlledField
            module="admin"
            id="userFilter.username"
            field={
              <Grid item xs={3} className={classes.item}>
                <TextInput
                  module="user"
                  label="admin.user.username"
                  name="username"
                  value={this.filterTextFieldValue("username")}
                  onChange={(v) =>
                    this.debouncedOnChangeFilter([
                      {
                        id: "username",
                        value: v,
                        filter: `username_Icontains: "${v}"`,
                      },
                    ])
                  }
                />
              </Grid>
            }
          />
          <ControlledField
            module="admin"
            id="userFilter.LastName"
            field={
              <Grid item xs={3} className={classes.item}>
                <TextInput
                  module="user"
                  label="admin.user.lastName"
                  name="lastName"
                  value={this.filterTextFieldValue("lastName")}
                  onChange={(v) =>
                    this.debouncedOnChangeFilter([
                      {
                        id: "lastName",
                        value: v,
                        filter: `lastName: "${v}"`,
                      },
                    ])
                  }
                />
              </Grid>
            }
          />
          <ControlledField
            module="admin"
            id="userFilter.OtherNames"
            field={
              <Grid item xs={3} className={classes.item}>
                <TextInput
                  module="user"
                  label="admin.user.otherNames"
                  name="otherNames"
                  value={this.filterTextFieldValue("otherNames")}
                  onChange={(v) =>
                    this.debouncedOnChangeFilter([
                      {
                        id: "otherNames",
                        value: v,
                        filter: `otherNames: "${v}"`,
                      },
                    ])
                  }
                />
              </Grid>
            }
          />
          <ControlledField
            module="admin"
            id="userFilter.Email"
            field={
              <Grid item xs={3} className={classes.item}>
                <TextInput
                  module="user"
                  label="admin.user.email"
                  name="email"
                  value={this.filterTextFieldValue("email")}
                  onChange={(v) =>
                    this.debouncedOnChangeFilter([
                      {
                        id: "email",
                        value: v,
                        filter: `email: "${v}"`,
                      },
                    ])
                  }
                />
              </Grid>
            }
          />
        </Grid>
        <Grid container>
          <ControlledField
            module="admin"
            id="userFilter.Phone"
            field={
              <Grid item xs={3} className={classes.item}>
                <TextInput
                  module="user"
                  label="admin.user.phone"
                  name="phone"
                  value={this.filterTextFieldValue("phone")}
                  onChange={(v) =>
                    this.debouncedOnChangeFilter([
                      {
                        id: "phone",
                        value: v,
                        filter: `phone: "${v}"`,
                      },
                    ])
                  }
                />
              </Grid>
            }
          />
          <ControlledField
            module="admin"
            id="UserFilter.dob"
            field={
              <Grid item xs={6}>
                <Grid container>
                  <Grid item xs={6} className={classes.item}>
                    <PublishedComponent
                      pubRef="core.DatePicker"
                      value={this.filterValue("dobFrom")}
                      module="user"
                      label="admin.user.dobFrom"
                      onChange={(d) =>
                        onChangeFilters([
                          {
                            id: "dobFrom",
                            value: d,
                            filter: `birthDateFrom: "${d}"`,
                          },
                        ])
                      }
                    />
                  </Grid>
                  <Grid item xs={6} className={classes.item}>
                    <PublishedComponent
                      pubRef="core.DatePicker"
                      value={this.filterValue("dobTo")}
                      module="user"
                      label="admin.user.dobTo"
                      onChange={(d) =>
                        onChangeFilters([
                          {
                            id: "dobTo",
                            value: d,
                            filter: `birthDateTo: "${d}"`,
                          },
                        ])
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
            }
          />
          <ControlledField
            module="policy"
            id="PolicyFilter.showDeleted"
            field={
              <Grid item xs={2} className={classes.item}>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={!!this.filterValue("showDeleted")}
                      onChange={(event) => this.onChangeCheckbox("showDeleted", event.target.checked)}
                    />
                  }
                  label={formatMessage(intl, "admin", "UserFilter.showDeleted")}
                />
              </Grid>
            }
          />
        </Grid>
      </section>
    );
  }
}

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(UserFilter))));
