import { getServicePage } from "@/lib/api";

export async function generateMetadata() {
  const page = await getServicePage();
  return { title: page.title || "Үйлчилгээ" };
}

export default async function ServicePage() {
  const page = await getServicePage();

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
      <div className="max-w-2xl">
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Tsotan Textile</p>
        <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">
          {page.title || "Манай үйлчилгээ"}
        </h1>
        {page.intro ? (
          <p className="mt-4 text-sm leading-7 text-muted">{page.intro}</p>
        ) : null}
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {page.items.map((item) => (
          <article key={item.id || item.title}>
            <div className="aspect-[4/5] overflow-hidden bg-paper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
            </div>
            <h2 className="mt-4 text-center text-sm">{item.title}</h2>
          </article>
        ))}
      </div>
    </section>
  );
}
