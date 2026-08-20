import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { fallbackCategories } from "@/lib/site";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header categories={fallbackCategories} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
