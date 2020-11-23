import AdminMainMenu from "./components/AdminMainMenu";
import { ProductsPage } from "./components/ProductsPage";
import { MedicalServicesPriceListPage } from "./components/MedicalServicesPriceListPage";
import { MedicalItemsPriceListPage } from "./components/MedicalItemsPriceListPage";
import { MedicalServicesPage } from "./components/MedicalServicesPage";
import { MedicalItemsPage } from "./components/MedicalItemsPage";
import { UsersPage } from "./components/UsersPage";
import { UserProfilesPage } from "./components/UserProfilesPage";
import { EnrollmentOfficersPage } from "./components/EnrollmentOfficersPage";
import { ClaimAdministratorsPage } from "./components/ClaimAdministratorsPage";
import { PayersPage } from "./components/PayersPage";
import messages_en from "./translations/en.json";

const DEFAULT_CONFIG = {
  "translations": [{key: 'en', messages: messages_en}],
  "core.Router": [
    { path: "admin/products", component: ProductsPage },
    { path: "admin/medicalServicesPriceList", component: MedicalServicesPriceListPage },
    { path: "admin/medicalItemsPriceList", component: MedicalItemsPriceListPage },
    { path: "admin/medicalServices", component: MedicalServicesPage },
    { path: "admin/medilcalItems", component: MedicalItemsPage },
    { path: "admin/users", component: UsersPage },
    { path: "admin/userProfiles", component: UserProfilesPage },
    { path: "admin/enrollmentOfficers", component: EnrollmentOfficersPage },
    { path: "admin/claimAdministrators", component: ClaimAdministratorsPage },
    { path: "admin/payers", component: PayersPage },
  ],
  "core.MainMenu": [AdminMainMenu],
}

export const AdminModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg};
}