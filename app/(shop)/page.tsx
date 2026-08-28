import { HomeView } from "@/components/home-view";
import { getBanners, getProducts } from "@/lib/api";

export default async function Home() {
  const [slider, monthly, videos, products] = await Promise.all([
    getBanners("slider"),
    getBanners("monthly"),
    getBanners("video"),
    getProducts(),
  ]);

  return (
    <HomeView slider={slider} monthly={monthly} videos={videos} products={products} />
  );
}
