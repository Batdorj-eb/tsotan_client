import { ShopCatalog } from "@/components/shop-catalog";
import { getCategories, getProducts } from "@/lib/api";
import { fallbackCategories } from "@/lib/site";

export const metadata = { title: "Бүтээгдэхүүн" };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ parent?: string; child?: string; category?: string }>;
}) {
  const params = await searchParams;
  const [products, fetched] = await Promise.all([getProducts(), getCategories()]);
  const categories = fetched.length ? fetched : fallbackCategories;
  const parent = typeof params.parent === "string" ? params.parent : undefined;
  const child = typeof params.child === "string" ? params.child : undefined;
  const category = typeof params.category === "string" ? params.category : undefined;

  return (
    <ShopCatalog
      products={products}
      categories={categories}
      title={child || parent}
      parent={parent}
      child={child}
      category={category}
    />
  );
}
