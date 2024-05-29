"use client"
import UserPage from "../../components/userpage";
import ProtectedRoute from "../../components/protected/page";

export default function User() {
  return (
    <ProtectedRoute auth={true}>
      <UserPage />
    </ProtectedRoute>
  );
}