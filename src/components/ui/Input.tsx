"use client";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  left?: ReactNode;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, label, error, hint, left, id, required, ...p }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-ink-800">
            {label} {required && <span className="text-danger-600">*</span>}
          </label>
        )}
        <div className="relative">
          {left && (
            <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">{left}</div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-xl border-2 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-300 transition-colors",
              "focus:outline-none focus:border-ink-800",
              "disabled:bg-ink-50 disabled:text-ink-400",
              error ? "border-danger-400 focus:border-danger-600" : "border-ink-200",
              left && "pl-10",
              className
            )}
            {...p}
          />
        </div>
        {error && <p className="text-xs font-medium text-danger-600">{error}</p>}
        {hint && !error && <p className="text-xs text-ink-400">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
