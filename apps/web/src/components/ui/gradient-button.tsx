"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const gradientButtonVariants = cva(
  [
    "gradient-button",
    "inline-flex items-center justify-center",
    "rounded-xl font-bold tracking-tight select-none transition-all",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: "text-slate-950 font-black hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200",
        secondary: "gradient-button-variant text-slate-100 hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200",
        variant: "gradient-button-variant text-slate-100 hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200",
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
)

export interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof gradientButtonVariants> {
  asChild?: boolean
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(gradientButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
GradientButton.displayName = "GradientButton"

export { GradientButton, gradientButtonVariants }
