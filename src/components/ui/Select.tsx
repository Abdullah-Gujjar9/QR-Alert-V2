"use client";
import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  required?: boolean;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, Props>(
  ({ className, label, error, required, options, id, ...p }, ref) => {
    const selId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selId} className="block text-sm font-semibold text-ink-800">
            {label} {required && <span className="text-danger-600">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selId}
          className={cn(
            "w-full rounded-xl border-2 bg-white px-4 py-3 text-sm text-ink-900 transition-colors appearance-none",
            "focus:outline-none focus:border-ink-800",
            error ? "border-danger-400" : "border-ink-200",
            className
          )}
          {...p}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {error && <p className="text-xs font-medium text-danger-600">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
