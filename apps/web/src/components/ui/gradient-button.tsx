"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const gradientButtonVariants = cva(
  [
    "group relative isolate inline-flex items-center justify-center overflow-hidden rounded-xl",
    "cursor-pointer select-none font-bold tracking-tight transform-gpu",
    "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:shadow-none active:scale-[0.975]",
  ],
  {
    variants: {
      variant: {
        default: [
          "text-white font-bold",
          "bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600",
          "border border-orange-400/30 hover:border-orange-300/50",
          "shadow-[0_2px_10px_-2px_rgba(234,88,12,0.25)] hover:shadow-[0_4px_16px_-2px_rgba(249,115,22,0.35)]",
          "hover:brightness-105 active:brightness-95",
          "disabled:bg-none disabled:bg-slate-800/90 disabled:text-slate-400 disabled:border-slate-700/50 disabled:shadow-none",
        ].join(" "),
        secondary: [
          "text-slate-100 font-bold border border-slate-700/80 hover:border-amber-400/50 hover:text-white",
          "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950",
          "shadow-[0_2px_8px_-2px_rgba(15,23,42,0.5)] hover:shadow-[0_8px_25px_-4px_rgba(245,158,11,0.25)]",
          "disabled:bg-slate-900 disabled:text-slate-600 disabled:border-slate-800",
        ].join(" "),
        variant: [
          "text-slate-100 font-bold border border-slate-700/80 hover:border-amber-400/50 hover:text-white",
          "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950",
          "shadow-[0_2px_8px_-2px_rgba(15,23,42,0.5)] hover:shadow-[0_8px_25px_-4px_rgba(245,158,11,0.25)]",
          "disabled:bg-slate-900 disabled:text-slate-600 disabled:border-slate-800",
        ].join(" "),
      },
      size: {
        default: "px-7 py-3 text-sm min-h-[44px]",
        sm: "px-5 py-2.5 text-sm min-h-[38px]",
        lg: "px-8 py-4 text-base min-h-[52px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof gradientButtonVariants> {
  asChild?: boolean;
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot className={cn(gradientButtonVariants({ variant, size, className }))} ref={ref} {...props}>
          {children}
        </Slot>
      );
    }

    return (
      <button
        className={cn(gradientButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <span className="relative z-10 inline-flex items-center justify-center gap-2.5">
          {children}
        </span>
      </button>
    );
  }
);
GradientButton.displayName = "GradientButton";

export { GradientButton, gradientButtonVariants };

