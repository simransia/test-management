import * as React from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  onRemove: () => void;
  variant?: "topic" | "subtopic";
}

export function Chip({
  label,
  onRemove,
  className,
  variant = "topic",
  ...props
}: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center gap-1 bg-[#f4f8ff] px-2 py-1 text-xs font-medium text-primary transition-colors",
        variant === "topic" ? "rounded-full" : "rounded-md",
        className
      )}
      {...props}
    >
      {label}
      <Button
        type="button"
        onClick={onRemove}
        className={cn(
          "text-primary/60 hover:text-primary bg-transparent border-none shadow-none p-0 hover:bg-transparent font-normal cursor-pointer",
          variant === "topic" ? "h-3 w-auto min-w-0" : "ml-0.5 h-auto w-auto min-w-0"
        )}
      >
        ×
      </Button>
    </span>
  );
}
