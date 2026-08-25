export function slugify(text: unknown) {
  return String(text ?? "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .replace(/,/g, "")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function formatMnt(value: number | string | undefined) {
  const amount = Number(value ?? 0);
  if (Number.isNaN(amount)) return "0 ₮";
  return `${new Intl.NumberFormat("mn-MN").format(amount)} ₮`;
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
