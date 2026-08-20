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

export function productImage(product: { img?: string; image?: string[] }) {
  return product.image?.[0] || product.img || "";
}
