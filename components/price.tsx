import { formatMnt, formatUsd, toUsd } from "@/lib/format";

export function Price({
  mnt,
  usd,
  className = "",
  usdClassName = "text-muted",
}: {
  mnt: number;
  usd?: number | null;
  className?: string;
  usdClassName?: string;
}) {
  const dollar = toUsd(mnt, usd);
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span>{formatMnt(mnt)}</span>
      <span className={usdClassName}>{formatUsd(dollar)}</span>
    </span>
  );
}
