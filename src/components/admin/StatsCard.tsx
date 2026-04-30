import { cn } from "@/lib/utils/cn";
import { type LucideIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";

interface StatsCardProps {
  title: string;
  value: number | string;
  change?: number;
  icon: LucideIcon;
  format?: "currency" | "number" | "none";
  className?: string;
}

export default function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  format = "none",
  className,
}: StatsCardProps) {
  const displayValue =
    format === "currency" && typeof value === "number"
      ? formatCurrency(value)
      : typeof value === "number"
      ? value.toLocaleString()
      : value;

  const isPositive = change !== undefined && change >= 0;

  return (
    <div
      className={cn(
        "bg-white border border-gray-100 p-6 rounded-none shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-[#0a0a0a] tracking-tight">
            {displayValue}
          </p>
          {change !== undefined && (
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                isPositive ? "text-green-600" : "text-red-500"
              )}
            >
              {isPositive ? "+" : ""}
              {change}% from last month
            </p>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center bg-[#f5f4f2]">
          <Icon size={22} className="text-[#c9a84c]" />
        </div>
      </div>
    </div>
  );
}
