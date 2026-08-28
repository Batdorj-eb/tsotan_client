"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { Price } from "@/components/price";
import { productImage } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const { t, text } = useLanguage();
  const image = productImage(product);
  const title = text(product.name, product.nameEn);

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-line">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            {t("product.noImage")}
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1">
          {product.isSpecial ? (
            <span className="bg-brand px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-cream">
              {t("product.special")}
            </span>
          ) : null}
        {product.isNew ? (
            <span className="bg-cream px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-brand">
              {t("product.isNew")}
            </span>
          ) : null}
          {product.stock === 0 ? (
            <span className="bg-accent px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-cream">
              {t("product.soldOut")}
            </span>
          ) : null}
        </div>
      </div>
      <div className="pt-4">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
          {text(product.parentCategory, product.parentCategoryEn) || "Tsotan"}
        </p>
        <h3 className="mt-1 font-display text-xl leading-snug text-ink group-hover:text-brand">
          {title}
        </h3>
        <p className="mt-1.5">
          <Price
            mnt={product.price}
            usd={product.usdPrice}
            className="text-sm text-ink/80"
            usdClassName="text-xs text-muted"
          />
        </p>
      </div>
    </Link>
  );
}
