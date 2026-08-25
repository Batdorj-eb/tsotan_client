import { API_URL } from "./api";
import { toast } from "./toast";

const TOKEN_KEY = "tsotan-admin-token";

export function getAdminToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setAdminToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
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
    return res.json() as Promise<{ token: string }>;
  });
}
