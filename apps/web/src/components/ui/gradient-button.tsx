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
    "disabled:pointer-events-none disabled:opacity-50 active:scale-[0.975]",
  ],
  {
    variants: {
      variant: {
        default: [
          "text-slate-950 font-black",
          "bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500",
          "shadow-[0_2px_8px_-2px_rgba(234,88,12,0.3)] hover:shadow-[0_8px_30px_-4px_rgba(249,115,22,0.5)]",
          "before:absolute before:inset-0 before:rounded-[inherit] before:p-[1px] before:pointer-events-none before:z-[1]",
          "before:bg-gradient-to-br before:from-yellow-200/70 before:via-amber-500/40 before:to-orange-600/80",
          "before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[mask-composite:exclude]",
          "hover:before:bg-gradient-to-br hover:before:from-white/95 hover:before:via-yellow-200/85 hover:before:to-orange-500/95 before:transition-colors before:duration-300",
          "after:absolute after:inset-0 after:rounded-[inherit] after:pointer-events-none after:-z-[1] after:opacity-0 hover:after:opacity-100",
          "after:bg-gradient-to-br after:from-yellow-200 after:via-amber-400 after:to-orange-600 after:transition-opacity after:duration-300",
        ].join(" "),
        secondary: [
          "text-slate-100 font-bold border border-slate-700/80 hover:border-amber-400/50 hover:text-white",
          "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950",
          "shadow-[0_2px_8px_-2px_rgba(15,23,42,0.5)] hover:shadow-[0_8px_25px_-4px_rgba(245,158,11,0.25)]",
          "after:absolute after:inset-0 after:rounded-[inherit] after:pointer-events-none after:-z-[1] after:opacity-0 hover:after:opacity-100",
          "after:bg-gradient-to-br after:from-slate-700 after:via-slate-800 after:to-slate-900 after:transition-opacity after:duration-300",
        ].join(" "),
        variant: [
          "text-slate-100 font-bold border border-slate-700/80 hover:border-amber-400/50 hover:text-white",
          "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950",
          "shadow-[0_2px_8px_-2px_rgba(15,23,42,0.5)] hover:shadow-[0_8px_25px_-4px_rgba(245,158,11,0.25)]",
          "after:absolute after:inset-0 after:rounded-[inherit] after:pointer-events-none after:-z-[1] after:opacity-0 hover:after:opacity-100",
          "after:bg-gradient-to-br after:from-slate-700 after:via-slate-800 after:to-slate-900 after:transition-opacity after:duration-300",
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
      <button className={cn(gradientButtonVariants({ variant, size, className }))} ref={ref} {...props}>
        <span
          className="pointer-events-none absolute inset-0 z-[2] h-full w-full -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-full"
          aria-hidden="true"
        />
        <span className="relative z-10 inline-flex items-center justify-center gap-2.5">{children}</span>
      </button>
    );
  }
);
GradientButton.displayName = "GradientButton";

export { GradientButton, gradientButtonVariants };
