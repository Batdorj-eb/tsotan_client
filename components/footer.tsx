import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer id="social" className="bg-brand-dark text-cream">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <p className="font-display text-4xl tracking-wide">Tsotan</p>
          <p className="mt-6 text-sm leading-7 text-cream/60">
            {site.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
        <div>
          <h3 className="text-[11px] uppercase tracking-[0.22em] text-gold">Цэс</h3>
          <ul className="mt-6 space-y-3 text-sm text-cream/75">
            <li>
              <Link href="/shop" className="transition hover:text-cream">
                Бүтээгдэхүүн
              </Link>
            </li>
            <li>
              <Link href="/shop-new" className="transition hover:text-cream">
                Шинэ бараа
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition hover:text-cream">
                Холбоо барих
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-[11px] uppercase tracking-[0.22em] text-gold">Follow us</h3>
          <ul className="mt-6 space-y-3 text-sm text-cream/75">
            {site.social.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-cream"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-[11px] uppercase tracking-[0.22em] text-gold">Холбоо</h3>
          <p className="mt-6 text-sm leading-7 text-cream/75">
            <a href={site.phoneHref} className="block transition hover:text-cream">
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="block transition hover:text-cream">
              {site.email}
            </a>
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-[11px] tracking-[0.16em] text-cream/40">
        © {new Date().getFullYear()} Tsotan
      </div>
    </footer>
  );
}
