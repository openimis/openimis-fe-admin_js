export const RIGHT_PRODUCTS = 121001;
export const RIGHT_HEALTHFACILITIES = 121101;
export const RIGHT_PRICELISTMS = 121201;
export const RIGHT_PRICELISTMI = 121301;
export const RIGHT_MEDICALSERVICES = 121401;
export const RIGHT_MEDICALITEMS = 122101;
export const RIGHT_ENROLMENTOFFICER = 121501;
export const RIGHT_CLAIMADMINISTRATOR = 121601;
export const RIGHT_PAYERS = 121801;
export const RIGHT_LOCATIONS = 121901;

export const RIGHT_USERS = 121701;
export const RIGHT_USER_SEARCH = 121701;
export const RIGHT_USER_ADD = 121702;
export const RIGHT_USER_EDIT = 121703;
export const RIGHT_USER_DELETE = 121704;

export const USER_TYPES = (rights) => {
  const baseTypes = ["INTERACTIVE"];
  if (rights.includes(RIGHT_ENROLMENTOFFICER)) {
    baseTypes.push("OFFICER");
    if (rights.includes(RIGHT_CLAIMADMINISTRATOR)) {
      baseTypes.push("CLAIM_ADMIN");
    }
  }
  return baseTypes;
};

export const userTypesMapping = {
  iUser: "INTERACTIVE",
  officer: "OFFICER",
  claimAdmin: "CLAIM_ADMIN",
};
