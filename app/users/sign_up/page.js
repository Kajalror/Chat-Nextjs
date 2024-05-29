"use client";

import React from "react";
import Form from "@/components/form/page";
import ProtectedRoute from "../../../components/protected/page";

const SignUp = () => {
  return (
    <ProtectedRoute>
      <Form isSignInPage={false} />
    </ProtectedRoute>
  );
};

export default SignUp;
