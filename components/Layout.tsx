import { ReactNode } from "react";
import NavBar from "./NaveBar";

interface LayoutProp {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProp) {
  return (
    <>
      <NavBar />
      <div className="content">{children}</div>
    </>
  );
}
