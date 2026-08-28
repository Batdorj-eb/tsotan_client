"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { useLanguage } from "@/components/language-provider";
import { Price } from "@/components/price";
import { productImage } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductBuyBox({ product }: { product: Product }) {
  const { add } = useCart();
  const { t, text } = useLanguage();
  const [qty, setQty] = useState(1);
  const images = product.image?.length ? product.image : product.img ? [product.img] : [];
  const [active, setActive] = useState(0);
  const maxQty = product.stock == null ? undefined : product.stock;
  const outOfStock = maxQty === 0;
  const title = text(product.name, product.nameEn);
  const description = text(product.description, product.descriptionEn);
  const size = text(product.size, product.sizeEn);
  const material = text(product.material, product.materialEn);
  const instruction = text(product.instruction, product.instructionEn);

  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
      <div>
        <div className="aspect-[4/5] overflow-hidden bg-line sm:aspect-square">
          {images[active] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={images[active]}
              alt={title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted">{t("product.noImage")}</div>
          )}
        </div>
        {images.length > 1 ? (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {images.map((src, i) => (
              <button
                key={src + i}
                onClick={() => setActive(i)}
                className={`aspect-square overflow-hidden ${i === active ? "ring-1 ring-brand" : "opacity-70 hover:opacity-100"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="lg:pt-4">
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">
          {text(product.parentCategory, product.parentCategoryEn)}
        </p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">
          {title}
        </h1>
        <div className="mt-5">
          <Price
            mnt={product.price}
            usd={product.usdPrice}
            className="text-xl"
            usdClassName="text-sm text-muted"
          />
        </div>
        {description ? (
          <p className="mt-6 max-w-md text-sm leading-7 text-muted">{description}</p>
        ) : null}

        <div className="mt-8 flex items-center gap-3">
          <div className="flex border border-line">
            <button
              type="button"
              className="px-3 py-3"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <span className="w-10 py-3 text-center text-sm">{qty}</span>
            <button
              type="button"
              className="px-3 py-3"
              onClick={() =>
                setQty((q) => (maxQty == null ? q + 1 : Math.min(maxQty, q + 1)))
              }
            >
              +
            </button>
          </div>
          <button
            type="button"
            disabled={outOfStock}
            onClick={() =>
              add(
                {
                  id: product.id,
                  name: product.name,
                  nameEn: product.nameEn,
                  price: product.price,
                  usdPrice: product.usdPrice,
                  img: productImage(product),
                  stock: product.stock,
                },
                qty,
              )
            }
            className="bg-brand px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-cream hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {outOfStock ? t("product.soldOut") : t("product.addToCart")}
          </button>
        </div>
        {maxQty != null && !outOfStock ? (
          <p className="mt-3 text-xs text-muted">{t("product.stockLeft", { n: maxQty })}</p>
        ) : null}

        <dl className="mt-10 space-y-3 border-t border-line pt-8 text-sm">
          {size ? (
            <div className="flex gap-4">
              <dt className="w-32 text-muted">{t("product.size")}</dt>
              <dd>{size}</dd>
            </div>
          ) : null}
          {material ? (
            <div className="flex gap-4">
              <dt className="w-32 text-muted">{t("product.material")}</dt>
              <dd>{material}</dd>
            </div>
          ) : null}
          {instruction ? (
            <div className="flex gap-4">
              <dt className="w-32 text-muted">{t("product.care")}</dt>
              <dd>{instruction}</dd>
            </div>
          ) : null}
        </dl>
      </div>
    </div>
  );
}
