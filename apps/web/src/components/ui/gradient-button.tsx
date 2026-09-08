"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const gradientButtonVariants = cva(
  [
    "group relative isolate inline-flex items-center justify-center overflow-hidden rounded-xl",
    "cursor-pointer select-none font-bold tracking-tight transform-gpu",
    "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
    "active:scale-[0.98]",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100",
  ],
  {
    variants: {
      variant: {
        default: [
          "text-slate-950 font-black",
          "bg-gradient-to-r from-orange-600 via-amber-400 to-orange-600",
          "bg-[length:200%_auto] bg-left hover:bg-right",
          "border border-amber-400/30 hover:border-amber-400/60",
          "hover:scale-[1.015]",
          "after:absolute after:inset-0 after:rounded-[inherit] after:pointer-events-none after:-z-[1]",
          "after:bg-gradient-to-r after:from-amber-400 after:via-orange-500 after:to-amber-400",
          "after:bg-[length:200%_auto] after:bg-left hover:after:bg-right",
          "after:opacity-0 hover:after:opacity-100 after:transition-all after:duration-500",
        ].join(" "),
        secondary: [
          "text-slate-100 font-bold",
          "border border-slate-700/80 hover:border-amber-400/40 hover:text-white",
          "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900",
          "bg-[length:200%_auto] bg-left hover:bg-right",
          "hover:scale-[1.015]",
        ].join(" "),
        variant: [
          "text-slate-100 font-bold",
          "border border-slate-700/80 hover:border-amber-400/40 hover:text-white",
          "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900",
          "bg-[length:200%_auto] bg-left hover:bg-right",
          "hover:scale-[1.015]",
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


