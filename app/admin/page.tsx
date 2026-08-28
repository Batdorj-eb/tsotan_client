"use client";

import Link from "next/link";
import { useAdminUser } from "@/components/admin-user";

export default function AdminHomePage() {
  const { isAdmin } = useAdminUser();
  const cards = [
    {
      href: "/admin/products",
      label: "Бараа",
      text: isAdmin ? "Нэмэх, засах, устгах" : "Нэмэх, засах",
    },
    { href: "/admin/categories", label: "Категори", text: "Ангилал, дэд ангилал бүртгэх" },
    { href: "/admin/banners", label: "Нүүр хуудас", text: "Hero слайд, баннер, видео" },
    { href: "/admin/orders", label: "Захиалга", text: "Төлбөр, хүргэлт" },
    { href: "/admin/services", label: "Үйлчилгээ", text: "Үйлчилгээ, дэд үйлчилгээ" },
    { href: "/admin/contact", label: "Холбоо барих", text: "Хаяг, утас, газрын зураг" },
    { href: "/admin/messages", label: "Санал хүсэлт", text: "Contact формын ирүүлэлт" },
    ...(isAdmin
      ? [{ href: "/admin/users", label: "Хэрэглэгч", text: "Админ, editor бүртгэх" }]
      : []),
  ];

  return (
    <div>
      <h1 className="font-display text-4xl">Хянах самбар</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="border border-line bg-cream p-6 hover:border-brand">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gold">{card.label}</p>
            <p className="mt-2 text-sm text-muted">{card.text}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
