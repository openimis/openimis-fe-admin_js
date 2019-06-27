import AdminMainMenu from "./components/AdminMainMenu";
import { ProductsPage } from "./components/ProductsPage";
import { HealthFacilitiesPage } from "./components/HealthFacilitiesPage";
import { MedicalServicesPriceListPage } from "./components/MedicalServicesPriceListPage";
import { MedicalItemsPriceListPage } from "./components/MedicalItemsPriceListPage";
import { MedicalServicesPage } from "./components/MedicalServicesPage";
import { MedicalItemsPage } from "./components/MedicalItemsPage";
import { UsersPage } from "./components/UsersPage";
import { UserProfilesPage } from "./components/UserProfilesPage";
import { EnrolmentOfficersPage } from "./components/EnrolmentOfficersPage";
import { ClaimAdministratorsPage } from "./components/ClaimAdministratorsPage";
import { PayersPage } from "./components/PayersPage";
import { LocationsPage } from "./components/LocationsPage";
import messages_en from "./translations/en.json";

const AdminModule = {
  "translations": [{key: 'en', messages: messages_en}],
  "core.Router": [
    { path: "admin/products", component: ProductsPage },
    { path: "admin/healthFacilities", component: HealthFacilitiesPage },
    { path: "admin/medicalServicesPriceList", component: MedicalServicesPriceListPage },
    { path: "admin/medicalItemsPriceList", component: MedicalItemsPriceListPage },
    { path: "admin/medilcalServices", component: MedicalServicesPage },
    { path: "admin/medilcalItems", component: MedicalItemsPage },
    { path: "admin/users", component: UsersPage },
    { path: "admin/userProfiles", component: UserProfilesPage },
    { path: "admin/enrolmentOfficers", component: EnrolmentOfficersPage },
    { path: "admin/claimAdministrators", component: ClaimAdministratorsPage },
    { path: "admin/payers", component: PayersPage },
    { path: "admin/locations", component: LocationsPage },
  ],
  "core.MainMenu": [AdminMainMenu],
}

export { AdminModule };
