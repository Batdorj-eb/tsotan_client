import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer id="social" className="bg-brand-dark text-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="Tsotan" className="h-10 w-auto bg-cream object-contain p-1" />
          <p className="mt-6 text-sm leading-7 text-cream/70">
            {site.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-[0.22em] text-gold">Цэс</h3>
          <ul className="mt-5 space-y-3 text-sm text-cream/80">
            <li><Link href="/shop" className="hover:text-cream">Бүтээгдэхүүн</Link></li>
            <li><Link href="/shop-new" className="hover:text-cream">Шинэ бараа</Link></li>
            <li><Link href="/contact" className="hover:text-cream">Холбоо барих</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-[0.22em] text-gold">Follow us</h3>
          <ul className="mt-5 space-y-3 text-sm text-cream/80">
            {site.social.map((item) => (
              <li key={item.label}>
                <a href={item.href} target="_blank" rel="noreferrer" className="hover:text-cream">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-[0.22em] text-gold">Хаяг</h3>
          <p className="mt-5 text-sm leading-7 text-cream/80">
            <a href={site.phoneHref} className="block hover:text-cream">{site.phone}</a>
            <a href={`mailto:${site.email}`} className="block hover:text-cream">{site.email}</a>
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs tracking-wide text-cream/50">
        © {new Date().getFullYear()} Tsotan. All Rights Reserved
      </div>
    </footer>
  );
}
