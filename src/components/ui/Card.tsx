/**
 * Card — Reusable card container component.
 */

import { type HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass";
  padding?: "sm" | "md" | "lg";
}

const paddingStyles: Record<string, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padding = "md",
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = "bg-white border border-gray-200 shadow-sm";

    return (
      <div
        ref={ref}
        className={`
          rounded-2xl ${baseStyles} ${paddingStyles[padding]} ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
