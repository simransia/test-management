import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "@/stores/auth-store";
import { fetchAllTests, fetchSubjects, deleteTest } from "@/api/test";
import type { Test, Subject } from "@/types/test";
import { getApiErrorMessage } from "@/lib/api";
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Edit,
  Eye,
  LogOut,
  User as UserIcon,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  // State
  const [tests, setTests] = useState<Test[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Deletion state
  const [testToDelete, setTestToDelete] = useState<Test | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const [testsRes, subjectsRes] = await Promise.all([
          fetchAllTests(),
          fetchSubjects(),
        ]);
        if (testsRes.success) {
          setTests(testsRes.data || []);
        } else {
          setError(testsRes.message || "Failed to load tests.");
        }
        if (subjectsRes.success) {
          setSubjects(subjectsRes.data || []);
        }
      } catch (err) {
        setError(getApiErrorMessage(err, "An error occurred while loading data."));
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Handle delete operation
  const handleDeleteConfirm = async () => {
    if (!testToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await deleteTest(testToDelete.id);
      if (res.success) {
        setTests((prev) => prev.filter((t) => t.id !== testToDelete.id));
        setTestToDelete(null);
      } else {
        setDeleteError(res.message || "Failed to delete test.");
      }
    } catch (err) {
      setDeleteError(getApiErrorMessage(err, "Failed to delete the test. Please try again."));
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtering logic
  const filteredTests = tests.filter((test) => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject ? test.subject === selectedSubject : true;
    const matchesStatus = selectedStatus ? test.status === selectedStatus : true;
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-[#f7fbff]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-[#60a5fa]/30 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img
              src="/preproute-logo.svg"
              alt="Preproute"
              className="h-8 w-auto cursor-pointer"
              onClick={() => navigate("/")}
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 border border-slate-200">
              <UserIcon className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">
                {user?.name || "Admin"}
              </span>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:border-red-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          {/* Header Action Row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                Test Dashboard
              </h1>
              <p className="text-sm text-slate-500">
                Manage your created practice sheets and real tests
              </p>
            </div>

            <Link
              to="/tests/create"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#5988ef] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Test</span>
            </Link>
          </div>

          {/* Search & Filters Panel */}
          <div className="grid gap-4 rounded-xl border border-[#60a5fa]/25 bg-white p-5 shadow-sm md:grid-cols-4 items-end">
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Search tests
              </label>
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by test name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:border-[#5988ef] focus:outline-none focus:ring-1 focus:ring-[#5988ef]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:border-[#5988ef] focus:outline-none focus:ring-1 focus:ring-[#5988ef]"
              >
                <option value="">All Subjects</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:border-[#5988ef] focus:outline-none focus:ring-1 focus:ring-[#5988ef]"
              >
                <option value="">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="live">Live</option>
              </select>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Content Loading / List */}
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="animate-pulse rounded-xl border border-slate-200 bg-white p-6"
                >
                  <div className="h-4 w-1/3 rounded bg-slate-200 mb-4" />
                  <div className="h-6 w-3/4 rounded bg-slate-200 mb-2" />
                  <div className="h-4 w-1/2 rounded bg-slate-200 mb-6" />
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="h-4 w-16 rounded bg-slate-200" />
                    <div className="h-8 w-24 rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTests.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 px-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-400 mb-4">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">No tests found</h3>
              <p className="text-sm text-slate-500 max-w-sm mt-1">
                {tests.length === 0
                  ? "You haven't created any tests yet. Click the create button to get started!"
                  : "We couldn't find any tests matching your filters. Try adjusting your query."}
              </p>
              {tests.length > 0 && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSubject("");
                    setSelectedStatus("");
                  }}
                  className="mt-4 text-sm font-semibold text-[#5988ef] hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            /* Grid layout of Tests (Premium look matching Figma) */
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTests.map((test) => (
                <div
                  key={test.id}
                  className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-[#60a5fa]/50"
                >
                  {/* Test Details */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full bg-[#f4f8ff] px-2.5 py-0.5 text-xs font-semibold text-[#5988ef] border border-[#60a5fa]/20">
                      {test.subject}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                        test.status === "live"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {test.status || "draft"}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 line-clamp-1 mb-1">
                    {test.name}
                  </h3>

                  <p className="text-xs text-slate-400 mb-4">
                    Created on {formatDate(test.created_at)}
                  </p>

                  {/* Topics List as Tags */}
                  {test.topics && test.topics.length > 0 ? (
                    <div className="mb-6 flex flex-wrap gap-1.5">
                      {test.topics.slice(0, 3).map((topic, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center rounded bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200"
                        >
                          {topic}
                        </span>
                      ))}
                      {test.topics.length > 3 && (
                        <span className="inline-flex items-center rounded bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                          +{test.topics.length - 3} more
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="mb-6 h-5" />
                  )}

                  {/* Card Actions Footer */}
                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/tests/view/${test.id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/tests/edit/${test.id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-[#5988ef]"
                        title="Edit test"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                    </div>

                    <button
                      onClick={() => setTestToDelete(test)}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-red-100 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                      title="Delete test"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      {testToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-slate-800">Delete Test</h3>
            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to delete <strong className="text-slate-700">{testToDelete.name}</strong>? This action cannot be undone.
            </p>

            {deleteError && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
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
                {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>{isDeleting ? "Deleting..." : "Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
