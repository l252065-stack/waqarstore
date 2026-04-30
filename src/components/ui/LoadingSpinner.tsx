import { cn } from "@/lib/utils/cn";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-4",
};

export default function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "animate-spin rounded-full border-gray-200 border-t-[#0a0a0a]",
        sizeMap[size],
        className
      )}
    />
  );
}
