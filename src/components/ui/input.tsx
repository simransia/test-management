import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  variant?: "default" | "login" | "unstyled";
  error?: boolean;
}

function Input({
  className,
  type = "text",
  variant = "default",
  error,
  ...props
}: InputProps) {
  const hasError =
    error || props["aria-invalid"] === true || props["aria-invalid"] === "true";

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full transition-colors outline-none",
        variant === "default" &&
          cn(
            "h-11 rounded-lg border bg-white px-4 text-sm focus:outline-none hover:border-primary focus:border-primary",
            hasError ? "border-red-400" : "border-slate-300",
          ),
        variant === "login" &&
          "h-[50px] rounded-lg border border-[#60a5fa] bg-white px-4 text-base font-normal text-secondary placeholder-[#d1d5db] focus:border-[#5988ef] focus:outline-none focus:ring-1 focus:ring-[#5988ef]",
        variant === "unstyled" &&
          "bg-transparent w-full h-full text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
