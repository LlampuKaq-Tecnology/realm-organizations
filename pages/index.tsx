import { OrganizationGeneric, useOrganization } from "@/realm-organization";
import { UserGeneric, useAuth, useIsLogin, useUser } from "@llampukaq/realm";
import {
  RealmGoogleButton,
  useLogoutGoogle,
} from "@llampukaq/realm-google-provider";
import { Button } from "cllk";
import { useEffect } from "react";

export default function Home() {
  const { isLogin } = useIsLogin();
  return <>{isLogin ? <IsLogin /> : <Login />}</>;
}
const Login = () => {
  return (
    <>
      <RealmGoogleButton appId="703510913713-t7v4eq8q7jil319buekgsasqkib2ma17.apps.googleusercontent.com" />
    </>
  );
};
const IsLogin = () => {
  const { logout } = useAuth();
  const { logout: l } = useLogoutGoogle();
  const { user } = useUser<UserGeneric>();

  const { organization, getOrganization, updateOrganization } =
    useOrganization<OrganizationGeneric>();
  const r = async () => {
    if (organization != undefined) {
      console.log("falla1");
      //@ts-ignore
      await getOrganization(organization?.organizationId);
    }
    if (organization == undefined) {
      console.log("falla2");
      if (user?.organizations != undefined) {
        await getOrganization(user?.organizations[0]?.organizationId);
      }
    }
  };
  useEffect(() => {
    r();
  }, []);
  return (
    <>
      <Button
        onClick={() => {
          updateOrganization({ holi: "holi" });
        }}
      >
        act
      </Button>
      <Button
        onClick={() => {
          logout?.();
          l?.();
        }}
      >
        lo
      </Button>
    </>
  );
};
