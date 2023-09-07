import { useContext } from "react";
import { RealmOrganizationsContext } from "../context/RealmOrganizations";
export function useOrganization() {
    return useContext(RealmOrganizationsContext);
}
