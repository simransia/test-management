import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import type { Test } from "@/types/test";
import { TestDetailCard } from "@/components/dashboard/test-detail-card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { DashboardDeleteModal } from "@/components/dashboard/dashboard-delete-modal";
import { EditTestModal } from "@/components/creation/edit-test-modal";
import { AlertCircle } from "lucide-react";
import { useTests, useDeleteTest } from "@/hooks/use-tests";
import { useTestStore } from "@/stores/test-store";

export default function DashboardPage() {
  const navigate = useNavigate();
  const resetTestStore = useTestStore((s) => s.reset);
  const { tests, isLoading, error, removeTestFromState, reloadTests } =
    useTests();
  const { isDeleting, deleteError, performDelete, setDeleteError } =
    useDeleteTest();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [testToDelete, setTestToDelete] = useState<Test | null>(null);
  const [testToEdit, setTestToEdit] = useState<Test | null>(null);

  const setSidebarCollapsed = useTestStore((s) => s.setSidebarCollapsed);

  useEffect(() => {
    setSidebarCollapsed(false);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!testToDelete) return;
    const success = await performDelete(testToDelete.id);
    if (success) {
      removeTestFromState(testToDelete.id);
      setTestToDelete(null);
    }
  };

  const filteredTests = tests.filter((test) =>
    test.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col">
      <DashboardHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className="p-8 bg-white">
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
                onView={(t) => {
                  resetTestStore();
                  navigate(`/creation/${t.id}/publish`);
                }}
                onEdit={setTestToEdit}
                onDelete={setTestToDelete}
                viewMode={viewMode}
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

      {testToEdit && (
        <EditTestModal
          testId={testToEdit.id}
          isOpen={Boolean(testToEdit)}
          onClose={() => setTestToEdit(null)}
          onSuccess={reloadTests}
        />
      )}
    </div>
  );
}
