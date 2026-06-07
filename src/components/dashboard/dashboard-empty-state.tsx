import { Search } from "lucide-react";

interface DashboardEmptyStateProps {
  totalTests: number;
  hasSearchQuery: boolean;
  onClearSearch: () => void;
}

export function DashboardEmptyState({
  totalTests,
  hasSearchQuery,
  onClearSearch,
}: DashboardEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-20 text-center shadow-xs">
      <Search className="mb-4 size-10 text-slate-300" strokeWidth={1.5} />
      <h3 className="text-lg font-bold text-slate-700">No tests found</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-400">
        {totalTests === 0
          ? "You haven't created any tests yet. Click Add new to start."
          : "No tests matched your search query. Try another search."}
      </p>
      {hasSearchQuery && (
        <button
          type="button"
          onClick={onClearSearch}
          className="mt-4 text-sm font-semibold text-[#1b5def] hover:underline"
        >
          Clear search
        </button>
      )}
    </div>
  );
}
