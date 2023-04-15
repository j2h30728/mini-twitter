import { SWRConfig } from "swr";
import "@/global.css";
import { AppProps } from "next/app";
import { User } from "@prisma/client";

interface whithProfileApp extends AppProps {
  profile: User;
}

export default function App({ Component, pageProps }: whithProfileApp) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => fetch(url).then(response => response.json()),
      }}>
      <div className="w-full h-screen max-w-xl mx-auto">
        <Component {...pageProps} />
      </div>
    </SWRConfig>
  );
}
