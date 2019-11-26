import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
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
import {
  RIGHT_PRODUCTS,
  RIGHT_HEALTHFACILITIES,
  RIGHT_PRICELISTMS,
  RIGHT_PRICELISTMI,
  RIGHT_MEDICALSERVICES,
  RIGHT_MEDICALITEMS,
  RIGHT_ENROLMENTOFFICER,
  RIGHT_CLAIMADMINISTRATOR,
  RIGHT_USERS,
  RIGHT_PAYERS,
  RIGHT_LOCATIONS,
  RIGHT_USERPROFILES,
} from "../constants";

class AdminMainMenu extends Component {
  render() {
    const { rights } = this.props;
    let entries = [];

    if (rights.includes(RIGHT_PRODUCTS)) {
      entries.push({
        text: formatMessage(this.props.intl, "admin", "menu.products"),
        icon: <Tune />,
        route: "/admin/products"
      });
    }
    if (rights.includes(RIGHT_HEALTHFACILITIES)) {
      entries.push({
        text: formatMessage(this.props.intl, "admin", "menu.healthFacilities"),
        icon: <LocalHospital />,
        route: "/admin/healthFacilities",
        withDivider: true
      });
    }
    if (rights.includes(RIGHT_PRICELISTMS)) {
      entries.push({
        text: formatMessage(this.props.intl, "admin", "menu.medicalServicesPrices"),
        icon: <HealingOutlined />,
        route: "/admin/medicalServicesPriceList"
      });
    }
    if (rights.includes(RIGHT_PRICELISTMI)) {
      entries.push({
        text: formatMessage(this.props.intl, "admin", "menu.medicalItemsPrices"),
        icon: <LocalPharmacyOutlined />,
        route: "/admin/medicalItemsPriceList",
        withDivider: true
      });
    }
    if (rights.includes(RIGHT_MEDICALSERVICES)) {
      entries.push({
        text: formatMessage(this.props.intl, "admin", "menu.medicalServices"),
        icon: <Healing />,
        route: "/admin/medilcalServices"
      });
    }
    if (rights.includes(RIGHT_MEDICALITEMS)) {
      entries.push({
        text: formatMessage(this.props.intl, "admin", "menu.medicalItems"),
        icon: <LocalPharmacy />,
        route: "/admin/medilcalItems",
        withDivider: true
      });
    }
    if (rights.includes(RIGHT_USERS)) {
      entries.push({
        text: formatMessage(this.props.intl, "admin", "menu.users"),
        icon: <Person />,
        route: "/admin/users"
      });
    }
    if (rights.includes(RIGHT_USERPROFILES)) {
      entries.push({
        text: formatMessage(this.props.intl, "admin", "menu.usersProfiles"),
        icon: <AccountBox />,
        route: "/admin/userProfiles"
      });
    }
    if (rights.includes(RIGHT_ENROLMENTOFFICER)) {
      entries.push({
        text: formatMessage(this.props.intl, "admin", "menu.enrollmentOfficers"),
        icon: <SupervisorAccount />,
        route: "/admin/enrollmentOfficers"
      });
    }
    if (rights.includes(RIGHT_CLAIMADMINISTRATOR)) {
      entries.push({
        text: formatMessage(this.props.intl, "admin", "menu.claimAdministrators"),
        icon: <PersonOutlined />,
        route: "/admin/claimAdministrators"
      });
    }
    if (rights.includes(RIGHT_PAYERS)) {
      entries.push({
        text: formatMessage(this.props.intl, "admin", "menu.payers"),
        icon: <AccountBalance />,
        route: "/admin/payers"
      });
    }
    if (rights.includes(RIGHT_LOCATIONS)) {
      entries.push({
        text: formatMessage(this.props.intl, "admin", "menu.locations"),
        icon: <PinDrop />,
        route: "/location/locations"
      });
    }

    if (!entries.length) return null;
    return (
      <MainMenuContribution
        {...this.props}
        header={formatMessage(this.props.intl, "admin", "mainMenu")}
        icon={<LocationCity />}
        entries={entries}
      />
    );
  }
}

const mapStateToProps = state => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
})

export default injectIntl(connect(mapStateToProps)(AdminMainMenu));
