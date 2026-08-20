"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/types";

const STORAGE_KEY = "tsotan-cart";

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  remove: (id: CartItem["id"]) => void;
  setQuantity: (id: CartItem["id"], quantity: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      setItems([]);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      items,
      count,
      total,
      open,
      setOpen,
      add: (item, quantity = 1) => {
        setItems((prev) => {
          const found = prev.find((p) => String(p.id) === String(item.id));
          if (found) {
            return prev.map((p) =>
              String(p.id) === String(item.id)
                ? { ...p, quantity: p.quantity + quantity }
                : p,
            );
          }
          return [...prev, { ...item, quantity }];
        });
        setOpen(true);
      },
      remove: (id) => {
        setItems((prev) => prev.filter((p) => String(p.id) !== String(id)));
      },
      setQuantity: (id, quantity) => {
        setItems((prev) =>
          prev
            .map((p) =>
              String(p.id) === String(id) ? { ...p, quantity } : p,
            )
            .filter((p) => p.quantity > 0),
        );
      },
      clear: () => setItems([]),
    };
  }, [items, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
