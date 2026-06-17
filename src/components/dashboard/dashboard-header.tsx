import { Link } from "react-router";
import { Search, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui";

interface DashboardHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
}

export function DashboardHeader({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
}: DashboardHeaderProps) {
  return (
    <div className="flex h-[72px] shrink-0 items-center justify-between px-8 bg-white border-b border-slate-100">
      <p className="text-base font-bold text-slate-800">Tests List</p>

      <div className="flex items-center gap-4">
        {/* Search bar */}
        <div className="relative flex h-10 w-[280px] items-center rounded-lg border border-slate-200 bg-white px-3 shadow-xs">
          <Search className="size-4 shrink-0 text-slate-400" strokeWidth={2} />
          <Input
            type="text"
            variant="unstyled"
            placeholder="Search tests..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="ml-2.5"
          />
        </div>

        {/* View Toggles */}
        <div className="flex h-10 items-center rounded-lg border border-slate-200 bg-white p-1 shadow-xs">
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={`flex size-8 items-center justify-center rounded-md transition-colors ${
              viewMode === "grid" ? "bg-[#f4f8ff] text-primary" : "text-slate-400"
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid className="size-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={`flex size-8 items-center justify-center rounded-md transition-colors ${
              viewMode === "list" ? "bg-[#f4f8ff] text-primary" : "text-slate-400"
            }`}
            aria-label="List view"
          >
            <List className="size-4" strokeWidth={2} />
          </button>
        </div>

        {/* Add New Button */}
        <Link
          to="/tests/create"
          className="flex h-10 items-center justify-center rounded-lg bg-[#5988ef] px-5 text-sm font-semibold text-white shadow-xs transition-opacity hover:opacity-95"
        >
          Add new
        </Link>
      </div>
    </div>
  );
}
