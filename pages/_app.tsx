import { RealmOrganizationsProvider } from "@/realm-organization";
import "@/styles/globals.css";
import { RealmProvider } from "@llampukaq/realm";

import { Provider } from "cllk";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <RealmProvider appId={"backend-llk-nlhkq"}>
        <RealmOrganizationsProvider>
          <Component {...pageProps} />
        </RealmOrganizationsProvider>
      </RealmProvider>
    </Provider>
  );
}
