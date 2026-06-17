"use client";

import * as React from "react";
import { Label as LabelPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

export interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {
  variant?: "default" | "login" | "muted" | "inline";
}

function Label({
  className,
  variant = "default",
  ...props
}: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "select-none transition-colors",
        variant === "default" && "text-sm font-semibold text-slate-700",
        variant === "login" && "text-sm font-medium text-[#374151]",
        variant === "muted" && "text-xs font-medium text-slate-500",
        variant === "inline" && "flex items-center gap-2 cursor-pointer text-sm text-slate-600",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
