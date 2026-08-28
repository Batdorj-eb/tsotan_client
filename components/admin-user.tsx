"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  adminFetch,
  getAdminToken,
  getAdminUser,
  isAdminRole,
  setAdminUser,
  type AdminUser,
} from "@/lib/admin";

type AdminUserContextValue = {
  user: AdminUser | null;
  isAdmin: boolean;
  canDelete: boolean;
};

const AdminUserContext = createContext<AdminUserContextValue>({
  user: null,
  isAdmin: false,
  canDelete: false,
});

export function AdminUserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => getAdminUser());

  useEffect(() => {
    setUser(getAdminUser());
    if (!getAdminToken()) return;
    adminFetch<AdminUser>("/auth/me", {}, { silent: true })
      .then((next) => {
        const normalized: AdminUser = {
          id: next.id,
          username: next.username,
          role: next.role === "ADMIN" ? "ADMIN" : "EDITOR",
        };
        setAdminUser(normalized);
        setUser(normalized);
      })
      .catch(() => {
        setUser(getAdminUser());
      });
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAdmin: isAdminRole(user),
      canDelete: isAdminRole(user),
    }),
    [user],
  );

  return <AdminUserContext.Provider value={value}>{children}</AdminUserContext.Provider>;
}

export function useAdminUser() {
  return useContext(AdminUserContext);
}
