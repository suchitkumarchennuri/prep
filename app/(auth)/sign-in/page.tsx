import AuthForm from "@/components/AuthForm";
import React from "react";

const page = () => {
  return (
    <div className="auth-layout">
      <AuthForm type="sign-in" />
    </div>
  );
};

export default page;
