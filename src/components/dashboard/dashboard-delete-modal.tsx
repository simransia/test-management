import { AlertCircle, Loader2 } from "lucide-react";
import type { Test } from "@/types/test";

interface DashboardDeleteModalProps {
  test: Test;
  isDeleting: boolean;
  deleteError: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DashboardDeleteModal({
  test,
  isDeleting,
  deleteError,
  onCancel,
  onConfirm,
}: DashboardDeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in duration-200">
        <h3 className="text-lg font-bold text-slate-800">Delete Test</h3>
        <p className="mt-2 text-sm text-slate-500">
          Are you sure you want to delete{" "}
          <strong className="text-slate-700">{test.name}</strong>? This action
          cannot be undone.
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
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-55"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-55"
          >
            {isDeleting && <Loader2 className="size-3.5 animate-spin" />}
            <span>{isDeleting ? "Deleting..." : "Delete"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
