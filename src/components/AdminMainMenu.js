import React, { Component } from "react";
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
import { MainMenuContribution } from "@openimis/fe-core";

class AdminMainMenu extends Component {
  render() {
    return (
      <MainMenuContribution
        {...this.props}
        header="Administration"
        icon={<LocationCity />}
        entries={[
          { text: "Products", icon: <Tune />, route: "/admin/products" },
          {
            text: "Health Facilities",
            icon: <LocalHospital />,
            route: "/admin/healthFacilities",
            withDivider: true
          },
          {
            text: "Medical Services Price List",
            icon: <HealingOutlined />,
            route: "/admin/medicalServicesPriceList"
          },
          {
            text: "Medical Items Price List",
            icon: <LocalPharmacyOutlined />,
            route: "/admin/medicalItemsPriceList",
            withDivider: true
          },
          {
            text: "Medical Services",
            icon: <Healing />,
            route: "/admin/medilcalServices"
          },
          {
            text: "Medical Items",
            icon: <LocalPharmacy />,
            route: "/admin/medilcalItems",
            withDivider: true
          },
          { text: "Users", icon: <Person />, route: "/admin/users" },
          {
            text: "User Profiles",
            icon: <AccountBox />,
            route: "/admin/userProfiles"
          },
          {
            text: "Enrolment Officers",
            icon: <SupervisorAccount />,
            route: "/admin/enrolmentOfficers"
          },
          {
            text: "Claim Administrators",
            icon: <PersonOutlined />,
            route: "/admin/claimAdministrators"
          },
          { text: "Payers", icon: <AccountBalance />, route: "/admin/payers" },
          { text: "Locations", icon: <PinDrop />, route: "/admin/locations" }
        ]}
      />
    );
  }
}
export { AdminMainMenu };
