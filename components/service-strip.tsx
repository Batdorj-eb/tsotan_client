import { services } from "@/lib/site";

function ServiceCards({ hidden }: { hidden?: boolean }) {
  return (
    <div className="flex gap-8 pr-8" aria-hidden={hidden}>
      {services.map((item) => (
        <div key={item.title} className="w-52 shrink-0 sm:w-60">
          <div className="aspect-[4/5] overflow-hidden bg-paper">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
          </div>
          <h3 className="mt-3 text-center text-sm">{item.title}</h3>
        </div>
      ))}
    </div>
  );
}

export function ServiceStrip() {
  return (
    <section id="service" className="border-t border-line bg-cream py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 text-center lg:px-8">
        <p className="text-[11px] uppercase tracking-[0.24em] text-gold">Үйлчилгээ</p>
        <h2 className="mt-2 font-display text-4xl">Манай үйлчилгээ</h2>
      </div>

      <div className="group relative mt-12 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div className="flex w-max animate-marquee">
          <ServiceCards />
          <ServiceCards hidden />
        </div>
      </div>
    </section>
  );
}
