"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin";
import { formatMnt } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useAdminUser } from "@/components/admin-user";

export default function AdminProductsPage() {
  const { canDelete } = useAdminUser();
  const [products, setProducts] = useState<Product[]>([]);

  async function load() {
    const data = await adminFetch<Product[]>("/product/list");
    setProducts(data);
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  async function remove(id: Product["id"]) {
    if (!confirm("Устгах уу?")) return;
    await adminFetch(`/product/delete/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">Бараа</h1>
        <Link href="/admin/products/new" className="bg-brand px-5 py-2 text-xs uppercase tracking-[0.16em] text-cream">
          Шинэ бараа
        </Link>
      </div>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-[11px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="py-3">Нэр</th>
              <th>Үнэ</th>
              <th>Нөөц</th>
              <th>Категори</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={String(p.id)} className="border-b border-line">
                <td className="py-3">
                  {p.name}
                  {p.nameEn ? <span className="ml-2 text-muted">{p.nameEn}</span> : null}
                </td>
                <td>{formatMnt(p.price)}</td>
                <td>{p.stock == null ? "—" : p.stock}</td>
                <td>
                  {[p.parentCategory, p.childCategory].filter(Boolean).join(" — ")}
                </td>
                <td className="text-right">
                  <Link href={`/admin/products/${p.id}`} className="mr-3 text-brand">Засах</Link>
                  {canDelete ? (
                    <button onClick={() => remove(p.id)} className="text-accent">Устгах</button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
