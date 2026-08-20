import Link from "next/link";
import { formatMnt, productImage } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const image = productImage(product);

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-line">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            Зураггүй
          </div>
        )}
        {product.isNew ? (
          <span className="absolute left-3 top-3 bg-brand px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cream">
            Шинэ
          </span>
        ) : null}
      </div>
      <div className="pt-4">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
          {product.parentCategory || "Tsotan"}
        </p>
        <h3 className="mt-1 font-display text-xl leading-snug text-ink group-hover:text-brand">
          {product.name}
        </h3>
        <p className="mt-2 text-sm tracking-wide text-ink">
          {formatMnt(product.price)}
        </p>
      </div>
    </Link>
  );
}
