"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const gradientButtonVariants = cva(
  [
    "inline-flex items-center justify-center rounded-xl",
    "cursor-pointer select-none font-bold tracking-tight",
    "transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
    "disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  ],
  {
    variants: {
      variant: {
        default: "bg-orange-500 hover:bg-orange-600 text-black font-black",
        secondary: [
          "text-slate-100 font-bold border border-slate-700/80 hover:border-amber-400/50 hover:text-white",
          "bg-slate-900/90 hover:bg-slate-800/90",
        ].join(" "),
        variant: [
          "text-slate-100 font-bold border border-slate-700/80 hover:border-amber-400/50 hover:text-white",
          "bg-slate-900/90 hover:bg-slate-800/90",
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
  ({ className, variant = "default", size, style, asChild = false, children, ...props }, ref) => {
    const isDark = variant === "secondary" || variant === "variant";
    const textStyle: React.CSSProperties = isDark ? style || {} : { color: "#000000", ...style };

    if (asChild) {
      return (
        <Slot
          className={cn(gradientButtonVariants({ variant, size, className }), !isDark && "text-black !text-black")}
          style={textStyle}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        className={cn(gradientButtonVariants({ variant, size, className }), !isDark && "text-black !text-black")}
        style={textStyle}
        ref={ref}
        {...props}
      >
        <span className={cn("inline-flex items-center justify-center gap-2.5", !isDark && "text-black !text-black font-black")}>
          {children}
        </span>
      </button>
    );
  }
);

GradientButton.displayName = "GradientButton";

export { GradientButton, gradientButtonVariants };
