import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductBuyBox } from "@/components/product-buy-box";
import { getProduct } from "@/lib/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  return { title: product?.name || "Бараа" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product || !product.name) notFound();

  return <ProductBuyBox product={product} />;
}
