import { orderStateLabel } from "@/lib/format";

const styles: Record<string, string> = {
  PAID: "border-emerald-700 text-emerald-800",
  CANCELLED: "border-accent text-accent",
  CREATED: "border-gold text-brand",
};

export function OrderStateBadge({ state }: { state?: string }) {
  return (
    <span
      className={`inline-flex border px-2 py-0.5 text-[11px] uppercase tracking-[0.14em] ${
        styles[state || ""] || "border-line text-muted"
      }`}
    >
      {orderStateLabel(state)}
    </span>
  );
}
