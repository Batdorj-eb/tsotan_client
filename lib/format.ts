export function slugify(text: unknown) {
  return String(text ?? "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .replace(/,/g, "")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export const USD_RATE = Number(process.env.NEXT_PUBLIC_USD_RATE || 3400);

export function formatMnt(value: number | string | undefined) {
  const amount = Number(value ?? 0);
  if (Number.isNaN(amount)) return "0 ₮";
  return `${new Intl.NumberFormat("mn-MN").format(amount)} ₮`;
}

export function toUsd(mnt: number | string | undefined, usdPrice?: number | null) {
  if (usdPrice != null && Number.isFinite(Number(usdPrice))) return Number(usdPrice);
  const amount = Number(mnt ?? 0);
  if (!Number.isFinite(amount) || !USD_RATE) return 0;
  return Number((amount / USD_RATE).toFixed(2));
}

export function lineUsd(
  unitMnt: number | string | undefined,
  quantity = 1,
  unitUsd?: number | null,
) {
  return Number((toUsd(unitMnt, unitUsd) * quantity).toFixed(2));
}

export function formatUsd(value: number | string | undefined) {
  const amount = Number(value ?? 0);
  if (Number.isNaN(amount)) return "$0";
  return `$${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)}`;
}

export function formatDateTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("mn-MN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function orderStateLabel(state?: string) {
  if (state === "PAID") return "Төлсөн";
  if (state === "CANCELLED") return "Цуцлагдсан";
  if (state === "CREATED") return "Хүлээгдэж буй";
  return state || "";
}

export function productImage(product: { img?: string; image?: string[] }) {
  return product.image?.[0] || product.img || "";
}
