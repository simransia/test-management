import { useEffect, useState } from "react";
import { Link } from "react-router";
import { fetchAllTests, deleteTest } from "@/api/test";
import type { Test } from "@/types/test";
import { getApiErrorMessage } from "@/lib/api";
import { TestDetailCard } from "@/components/dashboard/test-detail-card";
import {
  Search,
  LayoutGrid,
  List,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function DashboardPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const [testToDelete, setTestToDelete] = useState<Test | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const testsRes = await fetchAllTests();
        if (testsRes.status === "success" || testsRes.success) {
          setTests(testsRes.data ?? []);
        } else {
          setError(testsRes.message ?? "Failed to load tests.");
        }
      } catch (err) {
        setError(getApiErrorMessage(err, "An error occurred while loading data."));
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!testToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await deleteTest(testToDelete.id);
      if (res.status === "success" || res.success) {
        setTests((prev) => prev.filter((t) => t.id !== testToDelete.id));
        setTestToDelete(null);
      } else {
        setDeleteError(res.message ?? "Failed to delete test.");
      }
    } catch (err) {
      setDeleteError(
        getApiErrorMessage(err, "Failed to delete the test. Please try again."),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredTests = tests.filter((test) =>
    test.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col bg-[#f7fbff]">
      {/* Sub-header section inside page content */}
      <div className="flex h-[72px] shrink-0 items-center justify-between px-8 bg-white border-b border-slate-100">
        <p className="text-base font-bold text-slate-800">Tests List</p>

        <div className="flex items-center gap-4">
          {/* Search bar */}
          <div className="relative flex h-10 w-[280px] items-center rounded-lg border border-slate-200 bg-white px-3 shadow-xs">
            <Search className="size-4 shrink-0 text-slate-400" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-2.5 h-full w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* View Toggles */}
          <div className="flex h-10 items-center rounded-lg border border-slate-200 bg-white p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex size-8 items-center justify-center rounded-md transition-colors ${
                viewMode === "grid" ? "bg-[#f4f8ff] text-[#1b5def]" : "text-slate-400"
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="size-4" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex size-8 items-center justify-center rounded-md transition-colors ${
                viewMode === "list" ? "bg-[#f4f8ff] text-[#1b5def]" : "text-slate-400"
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

      {/* Main content grid */}
      <div className="p-8">
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            <AlertCircle className="size-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-[180px] animate-pulse rounded-xl border border-slate-200 bg-white p-6 shadow-xs"
              >
                <div className="mb-4 h-5 w-24 rounded bg-slate-200" />
                <div className="mb-2 h-6 w-1/3 rounded bg-slate-200" />
                <div className="h-4 w-1/2 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-20 text-center shadow-xs">
            <Search className="mb-4 size-10 text-slate-300" strokeWidth={1.5} />
            <h3 className="text-lg font-bold text-slate-700">No tests found</h3>
            <p className="mt-1 max-w-sm text-sm text-slate-400">
              {tests.length === 0
                ? "You haven't created any tests yet. Click Add new to start."
                : "No tests matched your search query. Try another search."}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-4 text-sm font-semibold text-[#1b5def] hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === "list"
                ? "flex flex-col gap-6"
                : "grid gap-6 sm:grid-cols-2 xl:grid-cols-2"
            }
          >
            {filteredTests.map((test) => (
              <TestDetailCard
                key={test.id}
                test={test}
                onDelete={setTestToDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {testToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-slate-800">Delete Test</h3>
            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to delete{" "}
              <strong className="text-slate-700">{testToDelete.name}</strong>? This
              action cannot be undone.
            </p>

            {deleteError && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                <AlertCircle className="size-4 shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setTestToDelete(null);
                  setDeleteError(null);
                }}
                disabled={isDeleting}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-55"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-55"
              >
                {isDeleting && <Loader2 className="size-3.5 animate-spin" />}
                <span>{isDeleting ? "Deleting..." : "Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
