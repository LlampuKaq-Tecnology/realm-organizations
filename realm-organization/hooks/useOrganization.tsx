import { useContext } from "react";
import { RealmOrganizationsContext } from "../context/RealmOrganizations";

export function useOrganization<T>() {
  return useContext(RealmOrganizationsContext) as {
    organization: T | undefined;
    getOrganization: (
      userRealm: any,
      user:
        | unknown
        | {
            userId: string;
            organizations: {
              name: string;
              organizationId: string;
            }[];
          }
    ) => Promise<void>;
    createOrganization: (name: string, moreData?: object) => Promise<void>;
    updateOrganization: (data: object) => Promise<void>;
    addMemberOrganization: (id: string) => Promise<void>;
    deleteMemberOrganization: (id: string) => Promise<void>;
    addPanelOrganization: (data: any) => Promise<void>;
    deletePanelOrganization: (panel: string) => Promise<void>;
  };
}
