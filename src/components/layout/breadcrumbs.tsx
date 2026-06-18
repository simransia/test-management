import { Fragment } from "react";
import { cn } from "@/lib/utils";

interface BreadcrumbsProps {
  items: string[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const isActive = null;
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm text-black/60 select-none",
        className,
      )}
    >
      {items.map((item, index) => {
        return (
          <Fragment key={item}>
            {index > 0 && <span className="">/</span>}
            <span className={cn(isActive ? "" : "")}>{item}</span>
          </Fragment>
        );
      })}
    </div>
  );
}
