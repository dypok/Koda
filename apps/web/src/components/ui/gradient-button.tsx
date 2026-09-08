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
    "[&>*]:relative [&>*]:z-10",
  ],
  {
    variants: {
      variant: {
        default: [
          "text-slate-950 font-black",
          "bg-gradient-to-r from-orange-600 via-amber-400 to-orange-500",
          "bg-[length:200%_auto] bg-left hover:bg-right",
          "border border-amber-300/40 hover:border-amber-200/70",
          "shadow-[0_4px_20px_-2px_rgba(249,115,22,0.45),inset_0_1px_0_0_rgba(255,255,255,0.35)]",
          "hover:shadow-[0_8px_32px_-2px_rgba(249,115,22,0.65),inset_0_1px_0_0_rgba(255,255,255,0.5)]",
          "hover:scale-[1.015]",
          "before:absolute before:inset-0 before:w-full before:h-full before:-translate-x-full hover:before:translate-x-full",
          "before:bg-[linear-gradient(105deg,transparent_20%,rgba(255,255,255,0.35)_50%,transparent_80%)]",
          "before:transition-transform before:duration-700 before:ease-[cubic-bezier(0.16,1,0.3,1)]",
          "before:pointer-events-none before:z-0",
        ].join(" "),
        secondary: [
          "text-slate-100 font-bold hover:text-white",
          "border border-slate-700/80 hover:border-amber-400/50",
          "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950",
          "shadow-[0_2px_8px_-2px_rgba(15,23,42,0.5)] hover:shadow-[0_8px_25px_-4px_rgba(245,158,11,0.25)]",
          "hover:scale-[1.015]",
        ].join(" "),
        variant: [
          "text-slate-100 font-bold hover:text-white",
          "border border-slate-700/80 hover:border-amber-400/50",
          "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950",
          "shadow-[0_2px_8px_-2px_rgba(15,23,42,0.5)] hover:shadow-[0_8px_25px_-4px_rgba(245,158,11,0.25)]",
          "hover:scale-[1.015]",
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
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(gradientButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

GradientButton.displayName = "GradientButton";

export { GradientButton, gradientButtonVariants };
