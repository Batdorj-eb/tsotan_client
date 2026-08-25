import Link from "next/link";
import { formatMnt, productImage } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const image = productImage(product);

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-line">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            Зураггүй
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1">
          {product.isSpecial ? (
            <span className="bg-brand px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-cream">
              Онцгой
            </span>
          ) : null}
        {product.isNew ? (
            <span className="bg-cream px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-brand">
              Шинэ
            </span>
          ) : null}
          {product.stock === 0 ? (
            <span className="bg-accent px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-cream">
              Дууссан
            </span>
          ) : null}
        </div>
      </div>
      <div className="pt-4">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
          {product.parentCategory || "Tsotan"}
        </p>
        <h3 className="mt-1 font-display text-xl leading-snug text-ink group-hover:text-brand">
          {product.name}
        </h3>
        <p className="mt-1.5 text-sm text-ink/80">{formatMnt(product.price)}</p>
      </div>
    </Link>
  );
}
