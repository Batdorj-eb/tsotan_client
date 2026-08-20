import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <h1 className="font-display text-5xl">Хуудас олдсонгүй</h1>
      <Link href="/" className="mt-8 inline-block bg-brand px-8 py-3 text-xs uppercase tracking-[0.18em] text-cream">
        Нүүр хуудас
      </Link>
    </div>
  );
}
