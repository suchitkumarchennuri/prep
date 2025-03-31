import React, { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import { isAuthenticated } from "@/lib/actions/auth.action";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  const isUserAuthenticated = await isAuthenticated();

  if (isUserAuthenticated) {
    redirect("/");
  }

  // Only redirect if user is authenticated and trying to access auth pages
  if (session?.value) {
    redirect("/");
  }

  return (
    <div className="auth-layout">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" width={38} height={32} />
          <h2 className="text-primary-100">Intervue</h2>
        </div>
        <h3>Practice job interviews with AI</h3>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
