import Link from "next/link";
import { Hero } from "@/components/hero";
import { ProductCard } from "@/components/product-card";
import { getBanners, getProducts } from "@/lib/api";
import { services } from "@/lib/site";

export default async function Home() {
  const [slider, monthly, products] = await Promise.all([
    getBanners("slider"),
    getBanners("monthly"),
    getProducts(),
  ]);

  const featured = products.filter((p) => p.isNew).slice(0, 8);
  const showcase = featured.length ? featured : products.slice(0, 8);
  const monthlySlots = [monthly[0] || null, monthly[1] || null];
  const fallbackBanners = [
    { href: "/shop-new", label: "Шинэ бараа", text: "Энэ улирлын шинэ бүтээл" },
    { href: "/#service", label: "Үйлчилгээ", text: "Хэвлэл, хатгамал, лазер" },
  ];

  return (
    <>
      <Hero banners={slider} />

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-16 sm:grid-cols-2 lg:px-8">
        {monthlySlots.map((banner, i) => {
          if (banner) {
            return (
              <Link
                key={banner.id || banner.url}
                href={banner.href || "/shop"}
                className="group overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={banner.url}
                  alt="Tsotan banner"
                  className="h-64 w-full object-cover transition duration-700 group-hover:scale-[1.03] sm:h-80"
                />
              </Link>
            );
          }

          if (monthly.length > 0) {
            return (
              <div
                key={`skeleton-${i}`}
                className="h-64 animate-pulse bg-line sm:h-80"
                aria-hidden
              />
            );
          }

          const item = fallbackBanners[i];
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-56 flex-col justify-end border border-line bg-cream p-8 transition hover:border-brand sm:min-h-80"
            >
              <p className="text-[11px] uppercase tracking-[0.22em] text-gold">{item.label}</p>
              <h3 className="mt-3 font-display text-3xl">{item.text}</h3>
            </Link>
          );
        })}
      </section>

      <section className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/aravch.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-dark/55" />
        <div className="relative mx-auto max-w-7xl px-5 py-28 text-center text-cream lg:px-8">
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Tsotan Textile</p>
          <h2 className="mt-4 font-display text-5xl sm:text-6xl">Дэлгүүрээр зочлох</h2>
          <Link
            href="/shop"
            className="mt-8 inline-flex bg-accent px-10 py-3 text-xs font-semibold uppercase tracking-[0.22em]"
          >
            Зочлох
          </Link>
        </div>
      </section>

      <section id="service" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Үйлчилгээ</p>
          <h2 className="mt-3 font-display text-4xl">Манай үйлчилгээ</h2>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
          {services.map((item) => (
            <div key={item.title} className="text-center">
              <div className="mx-auto aspect-square max-w-[180px] overflow-hidden bg-cream">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
              </div>
              <h3 className="mt-4 text-sm tracking-wide">{item.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {showcase.length > 0 ? (
        <section className="bg-cream py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Коллекц</p>
                <h2 className="mt-3 font-display text-4xl">Шинэ бараа</h2>
              </div>
              <Link href="/shop-new" className="text-xs uppercase tracking-[0.18em] text-brand">
                Бүгдийг харах
              </Link>
            </div>
            <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {showcase.map((product) => (
                <ProductCard key={String(product.id)} product={product} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
