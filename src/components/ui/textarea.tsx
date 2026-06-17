import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  error?: boolean;
}

function Textarea({ className, error, ...props }: TextareaProps) {
  const hasError = error || props["aria-invalid"] === true || props["aria-invalid"] === "true";
  
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full transition-colors outline-none bg-white resize-y min-h-[120px] rounded-lg border p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
        hasError ? "border-red-400" : "border-slate-300",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
