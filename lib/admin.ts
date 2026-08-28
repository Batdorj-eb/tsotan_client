import { API_URL } from "./api";
import { toast } from "./toast";

const TOKEN_KEY = "tsotan-admin-token";
const USER_KEY = "tsotan-admin-user";

export type AdminRole = "ADMIN" | "EDITOR";

export type AdminUser = {
  id: number;
  username: string;
  role: AdminRole;
};

function normalizeRole(role?: string): AdminRole {
  return String(role || "").trim().toUpperCase() === "ADMIN" ? "ADMIN" : "EDITOR";
}

function userFromToken(token: string): AdminUser | null {
  try {
    const part = token.split(".")[1] || "";
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(json) as {
      id?: number;
      username?: string;
      role?: string;
    };
    if (!payload.id || !payload.username) return null;
    return {
      id: payload.id,
      username: payload.username,
      role: normalizeRole(payload.role),
    };
  } catch {
    return null;
  }
}

export function getAdminToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function getAdminUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AdminUser;
      return {
        id: parsed.id,
        username: parsed.username,
        role: normalizeRole(parsed.role),
      };
    }
  } catch {
    /* ignore */
  }
  const token = getAdminToken();
  return token ? userFromToken(token) : null;
}

export function setAdminToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function setAdminUser(user: AdminUser) {
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      id: user.id,
      username: user.username,
      role: normalizeRole(user.role),
    }),
  );
}

export function setAdminSession(token: string, user?: AdminUser | null) {
  setAdminToken(token);
  const fromToken = userFromToken(token);
  const next = {
    id: user?.id ?? fromToken?.id,
    username: user?.username ?? fromToken?.username,
    role: normalizeRole(user?.role || fromToken?.role),
  };
  if (next.id && next.username) setAdminUser(next as AdminUser);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAdminRole(user?: AdminUser | null) {
  return normalizeRole(user?.role) === "ADMIN";
}

export async function adminFetch<T>(
  path: string,
  init: RequestInit = {},
  opts: { silent?: boolean; success?: string } = {},
) {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(init.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      Authorization: `Bearer ${getAdminToken()}`,
      ...(init.headers || {}),
    },
  });
  if (res.status === 401) {
    clearAdminToken();
    if (typeof window !== "undefined") window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = (body as { message?: string }).message || "Хүсэлт амжилтгүй";
    if (!opts.silent) toast(message, "error");
    throw new Error(message);
  }
  const method = String(init.method || "GET").toUpperCase();
  const mutating = ["POST", "PUT", "PATCH", "DELETE"].includes(method);
  const isUpload = path.includes("/upload");
  if (!opts.silent) {
    if (opts.success) toast(opts.success);
    else if (mutating && !isUpload) {
      toast(method === "DELETE" ? "Устгалаа" : "Хадгаллаа");
    }
  }
  return res.json() as Promise<T>;
}

export async function adminUpload(file: File) {
  const data = new FormData();
  data.append("file", file);
  const json = await adminFetch<{
    path?: string;
    url?: string;
    items?: { path?: string; url?: string }[];
  }>("/product/upload", { method: "POST", body: data });
  const first = json.items?.[0];
  return {
    path: json.path || first?.path || "",
    url: json.url || first?.url || "",
  };
}

export function adminLogin(username: string, password: string) {
  return fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  }).then(async (res) => {
    if (!res.ok) throw new Error("Нэвтрэх нэр эсвэл нууц үг буруу");
    return res.json() as Promise<{ token: string; user: AdminUser }>;
  });
}
