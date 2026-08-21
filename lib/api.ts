import type { Banner, Category, Product } from "./types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function getJson<T>(
  path: string,
  fallback: T,
  cache: RequestCache | { revalidate: number } = { revalidate: 10 },
): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...(typeof cache === "string" ? { cache } : { next: cache }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export function getProducts() {
  return getJson<Product[]>("/product/list", []);
}

export function getProduct(id: string) {
  return getJson<Product | null>(`/product/detail/${id}`, null);
}

export function getCategories() {
  return getJson<Category[]>("/category/list/0", []);
}

export function getCategoriesByParent(id: number | string) {
  return getJson<Category[]>(`/category/list/${id}`, []);
}

export function getBanners(type: "slider" | "monthly" | "video") {
  return getJson<Banner[]>(`/banner/list?type=${type}`, [], "no-store");
}

export async function sendMail(data: { suggest: string; phoneNumber: string }) {
  const res = await fetch(`${API_URL}/mail/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Mail failed");
  return res.json();
}

export async function createOrder(data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/order/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Order failed");
  return res.json();
}

export async function createQpayInvoice(data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/order/qpay-invoice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { message?: string }).message || "QPay нэхэмжлэх үүсгэж чадсангүй",
    );
  }
  return res.json() as Promise<{
    qpayUrl?: string;
    qpayText?: string;
    invoiceId?: string;
    qpayShortUrl?: string;
    orderId?: number;
  }>;
}

export async function checkOrderPayment(orderId: number) {
  const res = await fetch(`${API_URL}/order/check-payment/${orderId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Payment check failed");
  return res.json() as Promise<{ orderState?: string; id?: number }>;
}
