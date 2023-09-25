import { PropsWithChildren } from "react";
import { RealmOrganizationsContext } from "./RealmOrganizations";
import {
  UserDataRealm,
  useSetUserRealm,
  useUser,
  useUserRealm,
} from "@llampukaq/realm";
import { customAlphabet } from "nanoid";
import { useCache } from "react-cache-state";

import { formatOrganization } from "../services";
import { OrganizationGeneric } from "..";

function RealmOrganizationsProvider({ children }: PropsWithChildren<{}>) {
  const { userRealm } = useUserRealm();
  const { setUser } = useSetUserRealm();
  const { user } = useUser<UserDataRealm>();
  const [organization, setOrganization] =
    useCache<OrganizationGeneric>("organization");
  const customId = customAlphabet("1234567890abcdefghijklmnopqrstuvbzx", 15);
  const acc = (id?: string) => ({
    bId: organization?.organizationId,
    uId: user?.userId,
    id,
  });
  const createOrganization = async (name: string, moreData?: object) => {
    const data = {
      created: new Date(),
      organizationId: customId(),
      name,
      members: [{ role: "admin", userId: user.userId }],
      project_name: `${formatOrganization(name)}${customId()}`,
      ...moreData,
    };
    const res = await userRealm?.functions.organizationOrganizations(
      "create",
      {
        uId: user.userId,
      },
      data
    );
    if (res != undefined) {
      setOrganization(res.organization);
      //@ts-ignore
      setUser(res.user);
    }
  };

  const getOrganization = async (id: string) => {
    if (id != undefined) {
      const res = await userRealm?.functions.organizationOrganizations(
        "get",
        {
          bId: id,
          uId: user.userId,
        },
        false
      );
      if (res != undefined) setOrganization(res);
    }
  };

  const updateOrganization = async (data: any) => {
    const res = await userRealm?.functions.organizationOrganizations(
      "update",
      acc(organization?.organizationId),
      data
    );
    if (res != undefined) setOrganization(res);
  };
  const addMemberOrganization = async (id: string) => {
    const res = await userRealm?.functions.organizationOrganizations(
      "addMember",
      acc(id),
      { user: id }
    );
    if (res != undefined) setOrganization(res.organization);
  };

  const deleteMemberOrganization = async (id: string) => {
    const res = await userRealm?.functions.organizationOrganizations(
      "deleteMember",
      acc(id),
      { user: id }
    );
    if (res != undefined) setOrganization(res.organization);
  };

  const addPanelOrganization = async (data: any) => {
    const res = await userRealm?.functions.organizationOrganizations(
      "addPanel",
      acc(organization?.organizationId),
      data
    );
    if (res != undefined) setOrganization(res);
  };

  const deletePanelOrganization = async (panel: string) => {
    const res = await userRealm?.functions.organizationOrganizations(
      "deleteMember",
      acc(panel),
      false
    );
    if (res != undefined) setOrganization(res);
  };

  const contextValue = {
    organization,
    createOrganization,
    getOrganization,
    updateOrganization,
    addMemberOrganization,
    addPanelOrganization,
    deleteMemberOrganization,
    deletePanelOrganization,
  };

  return (
    <RealmOrganizationsContext.Provider value={contextValue}>
      {children}
    </RealmOrganizationsContext.Provider>
  );
}

export default RealmOrganizationsProvider;
