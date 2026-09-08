"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const gradientButtonVariants = cva(
  [
    "group relative inline-flex items-center justify-center overflow-hidden rounded-xl",
    "cursor-pointer select-none font-bold tracking-tight transform-gpu",
    "transition-all duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
    "active:scale-[0.98]",
    "disabled:pointer-events-none disabled:cursor-not-allowed",
  ],
  {
    variants: {
      variant: {
        default: [
          "text-white font-bold",
          "bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600",
          "border border-amber-500/30",
          "shadow-sm shadow-orange-950/40",
          "hover:from-orange-500 hover:via-amber-500 hover:to-orange-500",
          "hover:border-amber-400/50 hover:shadow-md hover:shadow-orange-950/50",
          "disabled:from-slate-800 disabled:via-slate-800 disabled:to-slate-800 disabled:text-slate-400 disabled:border-slate-700/50",
        ].join(" "),
        secondary: [
          "text-slate-100 font-bold border border-slate-700/80 hover:border-amber-400/40 hover:text-white",
          "bg-slate-900/80 hover:bg-slate-800/90",
          "shadow-sm shadow-black/40",
        ].join(" "),
        variant: [
          "text-slate-100 font-bold border border-slate-700/80 hover:border-amber-400/40 hover:text-white",
          "bg-slate-900/80 hover:bg-slate-800/90",
          "shadow-sm shadow-black/40",
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

