import { cn } from "@/lib/utils/cn";
import { calculateDiscountPercent } from "@/lib/utils/format";

interface DiscountBadgeProps {
  originalPrice: number;
  salePrice: number;
  className?: string;
}

export default function DiscountBadge({
  originalPrice,
  salePrice,
  className,
}: DiscountBadgeProps) {
  const pct = calculateDiscountPercent(originalPrice, salePrice);
  if (pct <= 0) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-bold tracking-wide",
        "bg-red-600 text-white rounded",
        className
      )}
    >
      -{pct}%
    </span>
  );
}
