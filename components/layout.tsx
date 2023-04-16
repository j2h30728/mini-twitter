import { cls } from "@/lib/client/utils";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import Link from "next/link";
import useLogout from "@/lib/client/useLogout";

interface LayoutProp {
  children: ReactNode;
  title?: string;
  symbol?: boolean;
  hasTabBar?: boolean;
  canGoBack?: boolean;
}

export default function Layout({
  children,
  hasTabBar,
  canGoBack,
  symbol,
  title,
}: LayoutProp) {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const handleHome = () => {
    router.push("/");
  };
  const usehandleLoguout = useLogout();
  const handleLogout = () => {
    usehandleLoguout();
  };
  return (
    <div>
      <div className="bg-base w-full h-16 max-w-xl flex items-center justify-center text-lg px-10 font-medium fixed text-gray-800 border-b">
        {canGoBack ? (
          <button onClick={handleBack} className="absolute left-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
        ) : null}
        {title ? (
          <span className={cls(canGoBack ? "mx-auto" : "", "")}>{title}</span>
        ) : null}
        {symbol ? (
          <svg
            onClick={handleHome}
            className="w-6 h-6 cursor-pointer  stroke-primary fill-primary"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512">
            <path d="M192 32c0-17.7 14.3-32 32-32H352c17.7 0 32 14.3 32 32V64h48c26.5 0 48 21.5 48 48V240l44.4 14.8c23.1 7.7 29.5 37.5 11.5 53.9l-101 92.6c-16.2 9.4-34.7 15.1-50.9 15.1c-19.6 0-40.8-7.7-59.2-20.3c-22.1-15.5-51.6-15.5-73.7 0c-17.1 11.8-38 20.3-59.2 20.3c-16.2 0-34.7-5.7-50.9-15.1l-101-92.6c-18-16.5-11.6-46.2 11.5-53.9L96 240V112c0-26.5 21.5-48 48-48h48V32zM160 218.7l107.8-35.9c13.1-4.4 27.3-4.4 40.5 0L416 218.7V128H160v90.7zM306.5 421.9C329 437.4 356.5 448 384 448c26.9 0 55.4-10.8 77.4-26.1l0 0c11.9-8.5 28.1-7.8 39.2 1.7c14.4 11.9 32.5 21 50.6 25.2c17.2 4 27.9 21.2 23.9 38.4s-21.2 27.9-38.4 23.9c-24.5-5.7-44.9-16.5-58.2-25C449.5 501.7 417 512 384 512c-31.9 0-60.6-9.9-80.4-18.9c-5.8-2.7-11.1-5.3-15.6-7.7c-4.5 2.4-9.7 5.1-15.6 7.7c-19.8 9-48.5 18.9-80.4 18.9c-33 0-65.5-10.3-94.5-25.8c-13.4 8.4-33.7 19.3-58.2 25c-17.2 4-34.4-6.7-38.4-23.9s6.7-34.4 23.9-38.4c18.1-4.2 36.2-13.3 50.6-25.2c11.1-9.4 27.3-10.1 39.2-1.7l0 0C136.7 437.2 165.1 448 192 448c27.5 0 55-10.6 77.5-26.1c11.1-7.9 25.9-7.9 37 0z" />
          </svg>
        ) : null}
      </div>
      <div
        className={cls(
          "h-screen pt-16 px-5 border-x-4 border-solid border-base bg-white overflow-scroll",
          hasTabBar ? "pb-32" : ""
        )}>
        {children}
      </div>
      {hasTabBar ? (
        <nav className="bg-base max-w-xl text-gray-700 border-t fixed bottom-0 w-full px-10 pb-3 pt-3 flex justify-between text-xs">
          <button onClick={handleLogout}>
            <a
              className={cls(
                "flex flex-col items-center space-y-2 ",
                "hover:text-gray-500 transition-colors"
              )}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
                className="w-5 h-5"
                stroke="currentColor">
                <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L353.3 251.6C407.9 237 448 187.2 448 128C448 57.3 390.7 0 320 0C250.2 0 193.5 55.8 192 125.2L38.8 5.1zM264.3 304.3C170.5 309.4 96 387.2 96 482.3c0 16.4 13.3 29.7 29.7 29.7H514.3c3.9 0 7.6-.7 11-2.1l-261-205.6z" />
              </svg>
              <span>로그아웃</span>
            </a>
          </button>
          <Link legacyBehavior href="/">
            <a
              className={cls(
                "flex flex-col items-center space-y-2 ",
                router.pathname === "/"
                  ? "text-primaryFocus"
                  : "hover:text-gray-500 transition-colors"
              )}>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <span>홈</span>
            </a>
          </Link>

          <Link legacyBehavior href="/profile">
            <a
              className={cls(
                "flex flex-col items-center space-y-2 ",
                router.pathname === "/profile"
                  ? "text-primaryFocus"
                  : "hover:text-gray-500 transition-colors"
              )}>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span>마이페이지</span>
            </a>
          </Link>
        </nav>
      ) : null}
    </div>
  );
}
