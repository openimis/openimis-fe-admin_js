import React from "react";
import AdminMainMenu from "./components/AdminMainMenu";
import { ProductsPage } from "./components/ProductsPage";
import { MedicalServicesPriceListPage } from "./components/MedicalServicesPriceListPage";
import { MedicalItemsPriceListPage } from "./components/MedicalItemsPriceListPage";
import { MedicalServicesPage } from "./components/MedicalServicesPage";
import { MedicalItemsPage } from "./components/MedicalItemsPage";
import UsersPage from "./components/UsersPage";
import { EnrollmentOfficersPage } from "./components/EnrollmentOfficersPage";
import { ClaimAdministratorsPage } from "./components/ClaimAdministratorsPage";
import { PayersPage } from "./components/PayersPage";
import messages_en from "./translations/en.json";
import UserPicker from "./components/pickers/UserPicker";
import UserTypesPicker from "./components/pickers/UserTypesPicker";
import reducer from "./reducer";

const ROUTE_ADMIN_USER_OVERVIEW = "admin/users/overiew";

const DEFAULT_CONFIG = {
  translations: [{ key: "en", messages: messages_en }],
  reducers: [{ key: "admin", reducer }],
  "core.Router": [
    { path: "admin/products", component: ProductsPage },
    {
      path: "admin/medicalServicesPriceList",
      component: MedicalServicesPriceListPage,
    },
    {
      path: "admin/medicalItemsPriceList",
      component: MedicalItemsPriceListPage,
    },
    { path: "admin/medicalServices", component: MedicalServicesPage },
    { path: "admin/medilcalItems", component: MedicalItemsPage },
    { path: "admin/users", component: UsersPage },
    {
      path: `${ROUTE_ADMIN_USER_OVERVIEW}/:user_id`,
      component: <div>OVERIEW</div>,
    },
    { path: "admin/enrollmentOfficers", component: EnrollmentOfficersPage },
    { path: "admin/claimAdministrators", component: ClaimAdministratorsPage },
    { path: "admin/payers", component: PayersPage },
  ],
  "core.MainMenu": [AdminMainMenu],
  refs: [
    { key: "admin.UserPicker", ref: UserPicker },
    { key: "admin.UserTypesPicker", ref: UserTypesPicker },
    { key: "admin.UserPicker.projection", ref: ["id", "username"] },
    { key: "admin.userOverview", ref: ROUTE_ADMIN_USER_OVERVIEW },
  ],
};

export const AdminModule = (cfg) => ({ ...DEFAULT_CONFIG, ...cfg });
