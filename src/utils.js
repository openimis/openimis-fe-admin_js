import { CLAIM_ADMIN_USER_TYPE, INTERACTIVE_USER_TYPE, OFFICER_USER_TYPE } from "./constants";

export const getUserTypes = (user) => {
  const userTypes = [];
  if (user.iUser?.id) {
    userTypes.push(INTERACTIVE_USER_TYPE);
  }
  if (user.officer?.id) {
    userTypes.push(OFFICER_USER_TYPE);
  }
  if (user.claimAdmin?.id) {
    userTypes.push(CLAIM_ADMIN_USER_TYPE);
  }
  return userTypes;
};

export const mapQueriesUserToMutation = (u) => {
  // TODO: make this more generic
  if (u.iUser) {
    u.lastName = u.iUser.lastName;
    u.otherNames = u.iUser.otherNames;
    u.email = u.iUser.email;
    u.phoneNumber = u.iUser.phone;
    u.healthFacility = u.iUser.healthFacility;
    u.language = u.iUser.languageId;
    u.roles = u.iUser.roles;
  }
  if (u.claimAdmin) {
    u.lastName = u.claimAdmin.lastName;
    u.otherNames = u.claimAdmin.otherNames;
    u.email = u.claimAdmin.emailId;
    u.phoneNumber = u.claimAdmin.phone;
    u.birthDate = u.claimAdmin.dob;
    u.healthFacility = u.claimAdmin.healthFacility;
  }
  if (u.officer) {
    u.lastName = u.officer.lastName;
    u.otherNames = u.officer.otherNames;
    u.email = u.officer.email;
    u.phoneNumber = u.officer.phone;
    u.birthDate = u.officer.dob;
    u.address = u.officer.address;
    u.substitutionOfficerId = u.officer.substitutionOfficer ? u.officer.substitutionOfficer.id : null;
    u.worksTo = u.officer.worksTo;
  }
  return u;
};
