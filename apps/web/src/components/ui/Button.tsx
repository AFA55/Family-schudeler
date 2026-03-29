"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "coral" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 ease-out",
          {
            "bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0":
              variant === "primary",
            "bg-white text-primary-600 border-2 border-primary-200 hover:border-primary-300 hover:bg-primary-50":
              variant === "secondary",
            "bg-coral-500 text-white hover:bg-coral-600 shadow-lg shadow-coral-500/25":
              variant === "coral",
            "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100":
              variant === "ghost",
          },
          {
            "px-4 py-2 text-sm": size === "sm",
            "px-6 py-3 text-base": size === "md",
            "px-8 py-4 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
