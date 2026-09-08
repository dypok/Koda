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
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-slate-800/80 disabled:bg-none disabled:text-slate-500 disabled:border-slate-800 disabled:shadow-none disabled:opacity-40",
  ],
  {
    variants: {
      variant: {
        default: [
          "text-slate-950 font-black",
          "bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:brightness-105 active:brightness-95",
          "border border-amber-400/25",
          "shadow-sm shadow-orange-950/20",
        ].join(" "),
        secondary: [
          "text-slate-200 font-bold",
          "border border-slate-700/80 bg-slate-900/80 hover:bg-slate-800/90 hover:text-white hover:border-slate-600",
          "shadow-sm shadow-slate-950/50",
        ].join(" "),
        variant: [
          "text-slate-200 font-bold",
          "border border-slate-700/80 bg-slate-900/80 hover:bg-slate-800/90 hover:text-white hover:border-slate-600",
          "shadow-sm shadow-slate-950/50",
        ].join(" "),
      },
      size: {
        default: "px-7 py-3 text-sm min-h-[44px]",
        sm: "px-5 py-2.5 text-sm min-h-[38px]",
        lg: "px-8 py-3.5 text-sm sm:text-base min-h-[48px]",
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
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(gradientButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <span className="relative z-10 inline-flex items-center justify-center gap-2">
          {children}
        </span>
      </Comp>
    );
  }
);
GradientButton.displayName = "GradientButton";

export { GradientButton, gradientButtonVariants };

