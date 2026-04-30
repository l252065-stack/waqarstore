import { cn } from "@/lib/utils/cn";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      primary:
        "bg-[#0a0a0a] text-white hover:bg-[#c9a84c] focus-visible:ring-[#c9a84c]",
      secondary:
        "bg-[#f5f4f2] text-[#0a0a0a] hover:bg-gray-200 focus-visible:ring-gray-400",
      outline:
        "border border-[#0a0a0a] text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white focus-visible:ring-[#0a0a0a]",
      ghost:
        "text-[#0a0a0a] hover:bg-[#f5f4f2] focus-visible:ring-gray-400",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
    };

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-5 py-2.5 text-sm",
      lg: "px-7 py-3.5 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium tracking-wide",
          "transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span>Loading…</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
