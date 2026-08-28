"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { clearAdminToken, getAdminToken } from "@/lib/admin";
import { AdminToastHost } from "@/components/admin-toast";
import { AdminUserProvider, useAdminUser } from "@/components/admin-user";

const links = [
  { href: "/admin", label: "Хянах самбар" },
  { href: "/admin/products", label: "Бараа" },
  { href: "/admin/categories", label: "Категори" },
  { href: "/admin/banners", label: "Нүүр хуудас" },
  { href: "/admin/orders", label: "Захиалга" },
  { href: "/admin/services", label: "Үйлчилгээ" },
  { href: "/admin/contact", label: "Холбоо барих" },
  { href: "/admin/messages", label: "Санал хүсэлт" },
  { href: "/admin/users", label: "Хэрэглэгч", adminOnly: true },
];

function AdminChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin } = useAdminUser();
  const visibleLinks = links.filter((link) => !link.adminOnly || isAdmin);

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="hidden w-56 shrink-0 bg-brand-dark px-5 py-8 text-cream md:block">
        <p className="font-display text-2xl">Tsotan</p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-gold">
          {isAdmin ? "Admin" : "Editor"}
        </p>
        {user?.username ? (
          <p className="mt-2 truncate text-xs text-cream/60">{user.username}</p>
        ) : null}
        <nav className="mt-10 flex flex-col gap-3 text-sm">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href))
                  ? "text-gold"
                  : "text-cream/80 hover:text-cream"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          className="mt-12 text-xs text-cream/60 hover:text-cream"
          onClick={() => {
            clearAdminToken();
            router.push("/admin/login");
          }}
        >
          Гарах
        </button>
      </aside>
      <div className="flex-1">
        <div className="flex items-center justify-between border-b border-line px-5 py-4 md:hidden">
          <span className="font-display text-xl">Admin</span>
          <Link href="/" className="text-xs">
            Сайт
          </Link>
        </div>
        <div className="p-6 lg:p-10">{children}</div>
      </div>
      <AdminToastHost />
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin) {
      setReady(true);
      return;
    }
    if (!getAdminToken()) {
      router.replace("/admin/login");
      return;
    }
    setReady(true);
  }, [isLogin, router, pathname]);

  if (isLogin) return <>{children}</>;
  if (!ready) return <div className="p-10 text-sm text-muted">Уншиж байна...</div>;

  return (
    <AdminUserProvider>
      <AdminChrome>{children}</AdminChrome>
    </AdminUserProvider>
  );
}
