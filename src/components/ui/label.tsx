"use client";

import * as React from "react";
import { Label as LabelPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

export interface LabelProps extends React.ComponentProps<
  typeof LabelPrimitive.Root
> {
  variant?: "default" | "login" | "muted" | "inline";
}

function Label({ className, variant = "default", ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "select-none transition-colors",
        variant === "muted"
          ? "text-xs font-medium text-slate-500"
          : "text-sm font-medium text-secondary",
        variant === "inline" &&
          "flex items-center gap-2 cursor-pointer text-sm font-medium text-secondary",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
