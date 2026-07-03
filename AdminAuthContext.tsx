import { createContext, useContext, useState, type ReactNode } from "react";
import { getStoredSession, adminLogout as logoutService, type AdminSession } from "@/services/adminAuthService";

interface AdminAuthContextValue {
  session: AdminSession | null;
  setSession: (session: AdminSession | null) => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(() => getStoredSession());

  function logout() {
    logoutService();
    setSession(null);
  }

  return (
    <AdminAuthContext.Provider value={{ session, setSession, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth deve ser usado dentro de AdminAuthProvider");
  return ctx;
}
