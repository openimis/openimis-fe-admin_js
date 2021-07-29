import AdminMainMenu from "./components/AdminMainMenu";
import { ProductsPage } from "./components/ProductsPage";
import { MedicalServicesPriceListPage } from "./pages/MedicalServicesPriceListPage";
import { MedicalItemsPriceListPage } from "./pages/MedicalItemsPriceListPage";
import UsersPage from "./pages/UsersPage";
import UserPage from "./pages/UserPage";
import UserOverviewPage from "./pages/UserOverviewPage";
import { EnrollmentOfficersPage } from "./pages/EnrollmentOfficersPage";
import { ClaimAdministratorsPage } from "./pages/ClaimAdministratorsPage";
import { PayersPage } from "./pages/PayersPage";
import messagesEn from "./translations/en.json";
import UserPicker from "./components/pickers/UserPicker";
import UserRolesPicker from "./components/pickers/UserRolesPicker";
import UserTypesPicker from "./components/pickers/UserTypesPicker";
import reducer from "./reducer";

const ROUTE_ADMIN_USERS = "admin/users";
const ROUTE_ADMIN_USER_OVERVIEW = "admin/users/overview";
const ROUTE_ADMIN_USER_NEW = "admin/users/new";

const DEFAULT_CONFIG = {
  translations: [{ key: "en", messages: messagesEn }],
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
    { path: ROUTE_ADMIN_USERS, component: UsersPage },
    { path: ROUTE_ADMIN_USER_NEW, component: UserPage },
    {
      path: `${ROUTE_ADMIN_USER_OVERVIEW}/:user_id`,
      component: UserOverviewPage,
    },
    { path: "admin/enrollmentOfficers", component: EnrollmentOfficersPage },
    { path: "admin/claimAdministrators", component: ClaimAdministratorsPage },
    { path: "admin/payers", component: PayersPage },
  ],
  "core.MainMenu": [AdminMainMenu],
  refs: [
    { key: "admin.UserPicker", ref: UserPicker },
    { key: "admin.UserRolesPicker", ref: UserRolesPicker },
    { key: "admin.UserTypesPicker", ref: UserTypesPicker },
    { key: "admin.UserPicker.projection", ref: ["id", "username", "iUser{id}"] },
    { key: "admin.UserRolesPicker.projection", ref: ["id", "name"] },
    { key: "admin.users", ref: ROUTE_ADMIN_USERS },
    { key: "admin.userOverview", ref: ROUTE_ADMIN_USER_OVERVIEW },
    { key: "admin.userNew", ref: ROUTE_ADMIN_USER_NEW },
  ],
};

export const AdminModule = (cfg) => ({ ...DEFAULT_CONFIG, ...cfg });
