"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { formatMnt, productImage } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductBuyBox({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const images = product.image?.length ? product.image : product.img ? [product.img] : [];
  const [active, setActive] = useState(0);

  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
      <div>
        <div className="aspect-[4/5] overflow-hidden bg-line sm:aspect-square">
          {images[active] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={images[active]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted">Зураггүй</div>
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
          {product.parentCategory}
        </p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">
          {product.name}
        </h1>
        <div className="mt-5 flex items-baseline gap-4">
          <span className="text-xl">{formatMnt(product.price)}</span>
          {product.usdPrice ? (
            <span className="text-sm text-muted">${product.usdPrice}</span>
          ) : null}
        </div>
        {product.description ? (
          <p className="mt-6 max-w-md text-sm leading-7 text-muted">{product.description}</p>
        ) : null}

        <div className="mt-8 flex items-center gap-3">
          <div className="flex border border-line">
            <button className="px-3 py-3" onClick={() => setQty((q) => Math.max(1, q - 1))}>
              −
            </button>
            <span className="w-10 py-3 text-center text-sm">{qty}</span>
            <button className="px-3 py-3" onClick={() => setQty((q) => q + 1)}>
              +
            </button>
          </div>
          <button
            onClick={() =>
              add(
                {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  usdPrice: product.usdPrice,
                  img: productImage(product),
                },
                qty,
              )
            }
            className="bg-brand px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-cream hover:bg-brand-dark"
          >
            Сагсанд нэмэх
          </button>
        </div>

        <dl className="mt-10 space-y-3 border-t border-line pt-8 text-sm">
          {product.size ? (
            <div className="flex gap-4">
              <dt className="w-32 text-muted">Хэмжээ</dt>
              <dd>{product.size}</dd>
            </div>
          ) : null}
          {product.material ? (
            <div className="flex gap-4">
              <dt className="w-32 text-muted">Материал</dt>
              <dd>{product.material}</dd>
            </div>
          ) : null}
          {product.instruction ? (
            <div className="flex gap-4">
              <dt className="w-32 text-muted">Угаах заавар</dt>
              <dd>{product.instruction}</dd>
            </div>
          ) : null}
        </dl>
      </div>
    </div>
  );
}
