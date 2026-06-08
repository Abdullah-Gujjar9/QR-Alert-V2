"use client";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "danger" | "primary" | "whatsapp" | "ghost" | "outline" | "amber";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "primary", size = "md", isLoading, fullWidth, children, disabled, ...p }, ref) => {
    const base =
      "relative inline-flex items-center justify-center font-semibold tracking-wide rounded-2xl transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]";
    const variants: Record<string, string> = {
      danger:   "bg-danger-600 text-white hover:bg-danger-700 focus-visible:ring-danger-500 shadow-lg shadow-danger-600/25",
      primary:  "bg-ink-900 text-white hover:bg-ink-800 focus-visible:ring-ink-700 shadow-md",
      whatsapp: "bg-[#25D366] text-white hover:bg-[#1ebe5d] focus-visible:ring-[#25D366] shadow-lg shadow-[#25D366]/30",
      ghost:    "bg-transparent text-ink-700 hover:bg-ink-100 focus-visible:ring-ink-400",
      outline:  "border-2 border-ink-800 text-ink-900 bg-white hover:bg-ink-900 hover:text-white focus-visible:ring-ink-500",
      amber:    "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-400 shadow-lg shadow-amber-500/25",
    };
    const sizes: Record<string, string> = {
      sm: "h-9 px-4 text-sm gap-1.5",
      md: "h-11 px-5 text-sm gap-2",
      lg: "h-14 px-6 text-base gap-2.5",
      xl: "h-16 px-8 text-lg gap-3",
    };
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
        disabled={disabled || isLoading}
        {...p}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="animate-spin">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
        )}
        <span className={cn("flex items-center gap-inherit", isLoading && "invisible")}>{children}</span>
      </button>
    );
  }
);
Button.displayName = "Button";
