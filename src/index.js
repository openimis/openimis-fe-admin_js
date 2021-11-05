import AdminMainMenu from "./components/AdminMainMenu";
import { ProductsPage } from "./components/ProductsPage";
import UsersPage from "./pages/UsersPage";
import UserPage from "./pages/UserPage";
import { PayersPage } from "./pages/PayersPage";
import messagesEn from "./translations/en.json";
import UserPicker from "./components/pickers/UserPicker";
import EnrolmentOfficerPicker from "./components/pickers/EnrolmentOfficerPicker";
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
    { path: ROUTE_ADMIN_USERS, component: UsersPage },
    { path: ROUTE_ADMIN_USER_NEW, component: UserPage },
    {
      path: `${ROUTE_ADMIN_USER_OVERVIEW}/:user_id`,
      component: UserPage,
    },
    { path: "admin/payers", component: PayersPage },
  ],
  "core.MainMenu": [AdminMainMenu],
  refs: [
    { key: "admin.UserPicker", ref: UserPicker },
    { key: "admin.EnrolmentOfficerPicker", ref: EnrolmentOfficerPicker },
    { key: "admin.UserRolesPicker", ref: UserRolesPicker },
    { key: "admin.UserTypesPicker", ref: UserTypesPicker },
    {
      key: "admin.UserPicker.projection",
      ref: ["id", "username", "iUser{id otherNames lastName}"],
    },
    { key: "admin.users", ref: ROUTE_ADMIN_USERS },
    { key: "admin.userOverview", ref: ROUTE_ADMIN_USER_OVERVIEW },
    { key: "admin.userNew", ref: ROUTE_ADMIN_USER_NEW },
  ],
};

export const AdminModule = (cfg) => ({ ...DEFAULT_CONFIG, ...cfg });
