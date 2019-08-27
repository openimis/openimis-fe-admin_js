import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import {
  AccountBalance,
  AccountBox,
  LocationCity,
  Healing,
  HealingOutlined,
  LocalHospital,
  LocalPharmacy,
  LocalPharmacyOutlined,
  Person,
  PersonOutlined,
  PinDrop,
  SupervisorAccount,
  Tune
} from "@material-ui/icons";
import { formatMessage, MainMenuContribution } from "@openimis/fe-core";

class AdminMainMenu extends Component {
  render() {
    return (
      <MainMenuContribution
        {...this.props}
        header={formatMessage(this.props.intl, "admin", "mainMenu")}
        icon={<LocationCity />}
        entries={[
          {
            text: formatMessage(this.props.intl, "admin", "menu.products"),
            icon: <Tune />,
            route: "/admin/products"
          },
          {
            text: formatMessage(this.props.intl, "admin", "menu.healthFacilities"),
            icon: <LocalHospital />,
            route: "/admin/healthFacilities",
            withDivider: true
          },
          {
            text: formatMessage(this.props.intl, "admin", "menu.medicalServicesPrices"),
            icon: <HealingOutlined />,
            route: "/admin/medicalServicesPriceList"
          },
          {
            text: formatMessage(this.props.intl, "admin", "menu.medicalItemsPrices"),
            icon: <LocalPharmacyOutlined />,
            route: "/admin/medicalItemsPriceList",
            withDivider: true
          },
          {
            text: formatMessage(this.props.intl, "admin", "menu.medicalServices"),
            icon: <Healing />,
            route: "/admin/medilcalServices"
          },
          {
            text: formatMessage(this.props.intl, "admin", "menu.medicalItems"),
            icon: <LocalPharmacy />,
            route: "/admin/medilcalItems",
            withDivider: true
          },
          {
            text: formatMessage(this.props.intl, "admin", "menu.users"),
            icon: <Person />,
            route: "/admin/users"
          },
          {
            text: formatMessage(this.props.intl, "admin", "menu.usersProfiles"),
            icon: <AccountBox />,
            route: "/admin/userProfiles"
          },
          {
            text: formatMessage(this.props.intl, "admin", "menu.enrollmentOfficers"),
            icon: <SupervisorAccount />,
            route: "/admin/enrollmentOfficers"
          },
          {
            text: formatMessage(this.props.intl, "admin", "menu.claimAdministrators"),
            icon: <PersonOutlined />,
            route: "/admin/claimAdministrators"
          },
          {
            text: formatMessage(this.props.intl, "admin", "menu.payers"),
            icon: <AccountBalance />,
            route: "/admin/payers"
          },
          {
            text: formatMessage(this.props.intl, "admin", "menu.locations"),
            icon: <PinDrop />,
            route: "/admin/locations"
          }
        ]}
      />
    );
  }
}
export default injectIntl(AdminMainMenu);
