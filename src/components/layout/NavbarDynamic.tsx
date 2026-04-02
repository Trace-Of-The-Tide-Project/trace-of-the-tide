"use client";

import dynamic from "next/dynamic";

function NavbarFallback() {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-gray-800 py-2"
      style={{ backgroundColor: "#191919" }}
      aria-hidden
    >
      <div className="h-14 w-full" />
    </header>
  );
}

const Navbar = dynamic(
  () => import("@/components/layout/Navbar").then((mod) => ({ default: mod.Navbar })),
  { ssr: false, loading: () => <NavbarFallback /> },
);

export function NavbarDynamic() {
  return <Navbar />;
}
