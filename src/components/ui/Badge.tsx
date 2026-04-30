import { cn } from "@/lib/utils/cn";

// If cva isn't available, we inline a tiny variant helper:
function badge(
  variant: "default" | "success" | "warning" | "danger" | "info" | "outline"
) {
  const map = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    outline: "border border-current bg-transparent",
  };
  return map[variant] ?? map.default;
}

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline";
}

export default function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full",
        badge(variant),
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
