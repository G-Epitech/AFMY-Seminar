import { MainMenu } from "@/components/menus/main";
import React from "react";

const containerClassName = "container m-auto py-6 px-2";

export default function EventsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MainMenu />
      <div className={containerClassName}>{children}</div>
    </>
  );
}
