"use client";

import React from "react";
import Form from "@/components/form/page";
import ProtectedRoute from "../../../components/protected/page";

const SignIn = () => {
  return (
    <ProtectedRoute>
      <Form isSignInPage={true} />
    </ProtectedRoute>
  );
};

export default SignIn;
