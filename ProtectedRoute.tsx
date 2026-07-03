import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session } = useAdminAuth();

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
