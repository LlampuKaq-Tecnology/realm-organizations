import { useContext } from "react";
import { RealmOrganizationsContext } from "../context/RealmOrganizations";
export const useOrganization = () => {
    return useContext(RealmOrganizationsContext);
};
