import RealmOrganizationsProvider from "./context/RealmOrganizationProvider";
import { useOrganization } from "./hooks/useOrganization";

export { useOrganization, RealmOrganizationsProvider };

interface OrganizationData {
  created: Date;
  organizationId: string;
  name: string;
  members: [{ role: "admin" | "user"; userId: string }];
  project_name: string;
}
export type OrganizationGeneric<T = {}> = OrganizationData & T;
