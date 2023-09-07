import { PropsWithChildren, useMemo } from "react";
import { RealmOrganizationsContext } from "./RealmOrganizations";
import { useSetUserRealm, useUser, useUserRealm } from "@llampukaq/realm";
import { customAlphabet, nanoid } from "nanoid";
import { useCache } from "react-cache-state";
import { Organization } from "../types";
import { formatOrganization } from "../services";

function RealmOrganizationsProvider({ children }: PropsWithChildren<{}>) {
  const { userRealm } = useUserRealm();
  const { setUser } = useSetUserRealm();
  const { user } = useUser();
  const [organization, setOrganization] =
    useCache<Organization>("organization");
  const customId = customAlphabet("1234567890abcdefghijklmnopqrstuvbzx", 15);
  const acc = (id?: string) => ({
    bId: organization?.organizationId,
    uId: user?.userId,
    id,
  });
  const createOrganization = async (name: string, moreData?: object) => {
    const data = {
      created: new Date(),
      organizationId: nanoid(10),
      name: name,
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
    setOrganization(res.organization);
    setUser(res.user);
  };

  const getOrganization = async () => {
    if (user.organizations) {
      const res = await userRealm?.functions.organizationOrganizations(
        "get",
        {
          bId: user.organizations[0].organizationId,
          uId: user.userId,
        },
        false
      );
      setOrganization(res);
    }
  };

  const updateOrganization = async (data: any) => {
    setOrganization(
      await userRealm?.functions.organizationOrganizations(
        "update",
        acc(organization?.organizationId),
        data
      )
    );
  };

  const addMemberOrganization = async (id: string) => {
    const res = await userRealm?.functions.organizationOrganizations(
      "addMember",
      acc(id),
      { user: id }
    );
    if (res.organization) setOrganization(res.organization);
  };

  const deleteMemberOrganization = async (id: string) => {
    const res = await userRealm?.functions.organizationOrganizations(
      "deleteMember",
      acc(id),
      { user: id }
    );
    if (res.organization) setOrganization(res.organization);
  };

  const addPanelOrganization = async (data: any) => {
    setOrganization(
      await userRealm?.functions.organizationOrganizations(
        "addPanel",
        acc(organization?.organizationId),
        data
      )
    );
  };

  const deletePanelOrganization = async (panel: string) => {
    const { res } = await userRealm?.functions.organizationOrganizations(
      "deleteMember",
      acc(panel),
      false
    );
    setOrganization(res);
  };

  const contextValue = useMemo(
    () => ({
      organization,
      createOrganization,
      getOrganization,
      updateOrganization,
      addMemberOrganization,
      addPanelOrganization,
      deleteMemberOrganization,
      deletePanelOrganization,
    }),
    [organization]
  );

  return (
    <RealmOrganizationsContext.Provider value={contextValue}>
      {children}
    </RealmOrganizationsContext.Provider>
  );
}

export default RealmOrganizationsProvider;
