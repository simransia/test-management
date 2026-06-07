import { useEffect, useState } from "react";
import { fetchAllTests, deleteTest } from "@/api/test";
import type { Test } from "@/types/test";
import { getApiErrorMessage } from "@/lib/api";
import { TestDetailCard } from "@/components/dashboard/test-detail-card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { DashboardDeleteModal } from "@/components/dashboard/dashboard-delete-modal";
import { AlertCircle } from "lucide-react";

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
      <DashboardHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

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
          <DashboardEmptyState
            totalTests={tests.length}
            hasSearchQuery={searchQuery.length > 0}
            onClearSearch={() => setSearchQuery("")}
          />
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

      {testToDelete && (
        <DashboardDeleteModal
          test={testToDelete}
          isDeleting={isDeleting}
          deleteError={deleteError}
          onCancel={() => {
            setTestToDelete(null);
            setDeleteError(null);
          }}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
