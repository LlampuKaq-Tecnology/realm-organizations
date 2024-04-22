import { PropsWithChildren } from "react";
import { RealmOrganizationsContext } from "./RealmOrganizations";
import {
  UserGeneric,
  useCollection,
  useSetUserRealm,
  useSync,
  useUser,
  useUserRealm,
} from "@llampukaq/realm";
import { customAlphabet } from "nanoid";
import { formatOrganization } from "../services";
import { OrganizationGeneric } from "..";
import { useLocalStorage } from "@uidotdev/usehooks";
function RealmOrganizationsProvider({
  children,
  onUpdate,
}: PropsWithChildren<{ onUpdate?: (data: any) => any }>) {
  const { userRealm } = useUserRealm();
  const { setUser } = useSetUserRealm();
  const { user } = useUser<UserGeneric>();

  const [organization, setOrganization] =
    useLocalStorage<OrganizationGeneric>("organization");
  const customId = customAlphabet("1234567890abcdefghijklmnopqrstuvbzx", 15);
  const collection = useCollection("organization", "organizations");
  useSync<OrganizationGeneric>(collection, ["update"], (set, documentOrg) => {
    if (documentOrg.organizationId == organization?.organizationId) {
      setOrganization(documentOrg);
    }
  });
  const userCollection = useCollection("user", "users");
  const isAdmin = async () => {
    const find = (await collection?.findOne(
      {
        organizationId: organization?.organizationId,
      },
      { projection: { _id: false, members: true } }
    )) as { members: { role: "admin" | "user"; userId: string }[] };
    const findUser = (await userCollection?.findOne(
      { userId: user?.userId },
      { projection: { _id: false, userId: true } }
    )) as { userId: string };
    const res = find?.members?.find((x) => x.userId == findUser?.userId);
    if (res != undefined) {
      if (res.role == "admin") {
        return true;
      }
      if (res.role == "user") {
        return false;
      }
    } else {
      return false;
    }
  };
  const isMember = async (id?: any) => {
    const find = (await collection?.findOne(
      {
        organizationId: id ?? organization?.organizationId,
      },
      { projection: { _id: false, members: true } }
    )) as { members: { role: "admin" | "user"; userId: string }[] };
    const findUser = (await userCollection?.findOne(
      { userId: user?.userId },
      { projection: { _id: false, userId: true } }
    )) as { userId: string };
    const res = find?.members.find((x) => x.userId == findUser?.userId);
    if (res != undefined) {
      if (res.role == "admin" || res.role == "user") {
        return true;
      }
    } else {
      return false;
    }
  };
  const access = async (callback: any) => {
    const member = await isMember();
    if (member) {
      return await callback();
    } else {
      throw new Error("no tines acceso");
    }
  };
  const accessAdmin = async (callback: any) => {
    const member = await isAdmin();
    if (member) {
      return await callback();
    } else {
      throw new Error("no tines acceso");
    }
  };

  const createOrganization = async (name: string, moreData?: object) => {
    const data = {
      created: new Date(),
      organizationId: customId(),
      name,
      members: [{ role: "admin", userId: user?.userId }],
      project_name: `${formatOrganization(name)}${customId()}`,
      ...moreData,
    };
    const res = await userRealm?.functions.organizationOrganizations(
      "create",
      {
        uId: user?.userId,
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
    const isMemberr = await isMember(id);

    if (isMemberr) {
      const res = await collection?.findOne({ organizationId: id });
      if (res != undefined) setOrganization(res);
    } else {
      throw new Error("No tienes acceso");
    }
  };

  const updateOrganization = async (data: any) => {
    await access(async () => {
      const res = await collection?.findOneAndUpdate(
        {
          organizationId: organization?.organizationId,
        },
        { $set: data }
      );
      if (res != undefined) {
        onUpdate?.(res);
        setOrganization(res);
      }
    });
  };
  const addMemberOrganization = async (user: Partial<UserGeneric>) => {
    await accessAdmin(async () => {
      await collection?.findOneAndUpdate(
        { organizationId: organization?.organizationId },
        {
          $push: {
            members: { userId: user?.userId, role: "user", invitation: true },
          },
        }
      );
      await userCollection?.findOneAndUpdate(
        { userId: user?.userId },
        {
          $push: {
            organizations: {
              name: organization?.name,
              organizationId: organization?.organizationId,
              invitation: true,
            },
          },
        }
      );
    });
  };

  const deleteMemberOrganization = async (user: Partial<UserGeneric>) => {
    await accessAdmin(async () => {
      await collection?.findOneAndUpdate(
        { organizationId: organization?.organizationId },
        {
          $pull: {
            members: { userId: user?.userId },
          },
        }
      );
      await userCollection?.findOneAndUpdate(
        { userId: user?.userId },
        {
          $pull: {
            organizations: {
              organizationId: organization?.organizationId,
            },
          },
        }
      );
    });
  };

  const addPanelOrganization = async (data: any) => {
    await accessAdmin(async () => {
      await collection?.findOneAndUpdate(
        { organizationId: organization?.organizationId },
        { $push: { panels: data } }
      );
    });
  };

  const deletePanelOrganization = async (panel: string) => {
    await accessAdmin(async () => {
      await collection?.findOneAndUpdate(
        { organizationId: organization?.organizationId },
        { $pull: { panels: { appId: panel } } }
      );
    });
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
    onUpdate,
  };

  return (
    <RealmOrganizationsContext.Provider value={contextValue}>
      {children}
    </RealmOrganizationsContext.Provider>
  );
}

export default RealmOrganizationsProvider;
