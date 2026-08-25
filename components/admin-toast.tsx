"use client";

import { useEffect, useState } from "react";
import { onToast, type ToastDetail } from "@/lib/toast";

type Item = ToastDetail & { id: number };

export function AdminToastHost() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    return onToast((detail) => {
      const id = Date.now() + Math.random();
      setItems((prev) => [...prev.slice(-3), { ...detail, id }]);
      window.setTimeout(() => {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }, 2800);
    });
  }, []);

  if (!items.length) return null;

  return (
    <div className="pointer-events-none fixed right-5 top-5 z-[80] flex w-[min(100%-2.5rem,320px)] flex-col gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={`border px-4 py-3 text-sm shadow-[0_12px_40px_rgba(28,22,20,0.12)] ${
            item.type === "error"
              ? "border-accent bg-cream text-accent"
              : "border-brand bg-cream text-brand-dark"
          }`}
        >
          {item.message}
        </div>
      ))}
    </div>
  );
}
