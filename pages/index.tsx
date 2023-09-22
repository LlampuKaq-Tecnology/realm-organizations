import { useOrganization } from "@/realm-organization";
import { useAuth, useIsLogin } from "@llampukaq/realm";
import {
  RealmGoogleButton,
  useLogoutGoogle,
} from "@llampukaq/realm-google-provider";
import { Button } from "cllk";

export default function Home() {
  const { isLogin } = useIsLogin();

  return <>{isLogin ? <IsLogin /> : <Login />}</>;
}
const Login = () => {
  const { getOrganization } = useOrganization();
  return (
    <>
      <RealmGoogleButton
        onSuccess={(user, userRealm) => {
          getOrganization(userRealm, user);
        }}
      />
    </>
  );
};
const IsLogin = () => {
  const { logout } = useAuth();
  const { logout: l } = useLogoutGoogle();
  const { organization } = useOrganization();
  return (
    <>
      <Button onClick={() => {}}>actualizar</Button>
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
