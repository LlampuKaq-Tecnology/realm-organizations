import { HEAD } from "cllk";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <HEAD title="example" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
