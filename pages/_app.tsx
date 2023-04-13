import { SWRConfig } from "swr";
import "@/global.css";
import Layout from "@/components/Layout";
import { withSsrSession } from "@/lib/server/withSession";
import { NextPageContext } from "next";
import db from "@/lib/server/db";
import { AppProps } from "next/app";
import { User } from "@prisma/client";

interface whithProfileApp extends AppProps {
  profile: User;
}

export default function App({
  Component,
  pageProps,
  profile,
}: whithProfileApp) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => fetch(url).then(response => response.json()),
        fallback: {
          "/api/users/me": { success: true, profile },
        },
      }}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SWRConfig>
  );
}

export const getServerSideProps = withSsrSession(async function ({
  req,
}: NextPageContext) {
  const profile = await db.user.findUnique({
    where: { id: req?.session.user?.id },
  });
  return {
    props: {
      profile: JSON.parse(JSON.stringify(profile)),
    },
  };
});
