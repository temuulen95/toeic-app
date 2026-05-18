"use client";

import { UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="fixed top-0 right-0 z-50 p-4">
      <UserButton />
    </header>
  );
}
