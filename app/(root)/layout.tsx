import Link from "next/link";
import React, { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";
import { isAuthenticated } from "@/lib/actions/auth.action";
const RootLayout = async ({ children }: { children: ReactNode }) => {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  const isUserAuthenticated = await isAuthenticated();

  if (!isUserAuthenticated) {
    redirect("/sign-in");
  }

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="root-layout">
      <nav className="flex justify-between items-center p-4">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="logo" width={38} height={32} />
          <h2 className="text-primary-100">Intervue</h2>
        </Link>
        <SignOutButton />
      </nav>

      {children}
    </div>
  );
};

export default RootLayout;
