import { ShopCatalog } from "@/components/shop-catalog";
import { getProducts } from "@/lib/api";

export const metadata = { title: "Шинэ бараа" };

export default async function ShopNewPage() {
  const products = await getProducts();

  return (
    <ShopCatalog
      products={products}
      categories={[]}
      onlyNew
    />
  );
}
