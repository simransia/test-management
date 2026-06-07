import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useTestStore } from "@/stores/test-store";
import {
  fetchTestById,
  fetchBulkQuestions,
  updateTest,
} from "@/api/test";
import { getApiErrorMessage } from "@/lib/api";
import type { Question } from "@/types/test";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronDown,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTestType, formatDifficulty, getDifficultyStyles } from "@/lib/test-utils";
import { EditTestModal } from "@/components/tests/edit-test-modal";
import { fetchSubjects, fetchTopicsBySubject } from "@/api/test";
import type { Subject, Topic } from "@/types/test";

import { useTest } from "@/hooks/use-tests";
import { useQuestions } from "@/hooks/use-questions";
import { useSubjects, useTopics } from "@/hooks/use-test-metadata";

export default function PublishPage() {
  const navigate = useNavigate();
  const { testId: paramTestId } = useParams<{ testId: string }>();

  const {
    testId: storeTestId,
    testData,
    setTestData,
    setTestId,
    setStep,
    setSidebarCollapsed,
    savedQuestions,
    setSavedQuestions,
    reset,
  } = useTestStore();

  const testId = paramTestId || storeTestId;

  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Set sidebar and step
  useEffect(() => {
    setSidebarCollapsed(true);
    setStep("publish");
  }, [setSidebarCollapsed, setStep]);

  // If no testId at all, redirect
  useEffect(() => {
    if (!testId) {
      navigate("/tests/create");
    }
  }, [testId, navigate]);

  // Fetch test if not in store
  const { testData: fetchedTest, isLoading: testLoading, error: testError, reloadTest } = useTest(!testData ? testId : null);
  
  useEffect(() => {
    if (fetchedTest && !testData) {
      setTestData(fetchedTest);
      setTestId(fetchedTest.id);
    }
  }, [fetchedTest, testData, setTestData, setTestId]);

  // Fetch bulk questions if they exist in the fetched test
  const { questions, isLoading: questionsLoading } = useQuestions(
    (!testData && fetchedTest?.questions) ? fetchedTest.questions : null
  );

  useEffect(() => {
    if (questions && questions.length > 0) {
      setSavedQuestions(questions);
    }
  }, [questions, setSavedQuestions]);

  // Use the questions from the hook if available, otherwise use from store
  const displayQuestions = questions.length > 0 ? questions : savedQuestions;

  // Load subjects, topics using custom hooks
  const { subjects, isLoading: subjectsLoading } = useSubjects();

  const subjectObj = subjects.find(
    (s) => s.name === testData?.subject || s.id === testData?.subject,
  );
  
  const { topics, isLoading: topicsLoading } = useTopics(subjectObj?.id);

  const loading = testLoading || subjectsLoading;

  useEffect(() => {
    if (testError) setError(testError);
  }, [testError]);

  const getSubjectName = (id: string) => {
    const s = subjects.find((s) => s.id === id || s.name === id);
    return s ? s.name : id;
  };

  const getTopicName = (id: string) => {
    const t = topics.find((t) => t.id === id || t.name === id);
    return t ? t.name : id;
  };

  const handlePublish = async () => {
    if (!testId) return;
    setPublishing(true);
    setError(null);
    try {
      const res = await updateTest(testId, { status: "live" });
      if (res.status === "success") {
        setPublished(true);
        // Wait briefly then redirect to dashboard
        setTimeout(() => {
          reset();
          navigate("/");
        }, 2000);
      } else {
        setError(res.message ?? "Failed to publish test");
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to publish test."));
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-[#1b5def]" />
      </div>
    );
  }

  if (published) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
        <h2 className="text-2xl font-bold text-slate-800">
          Test Published Successfully!
        </h2>
        <p className="text-sm text-slate-500">
          Redirecting to dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full">

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <h1 className="text-lg font-bold text-slate-800 mb-6">
            Test creation
          </h1>

          {/* Success status */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-sm font-semibold text-slate-700">
                Test created
              </span>
            </div>
            <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600 border border-green-200">
              All {displayQuestions.length} Questions done ✓
            </span>
          </div>

          {/* Test summary */}
          {testData && (
            <div className="bg-white rounded-lg border border-slate-200 p-5 mb-8">
              <div className="flex items-center justify-between mb-3">
                <span
                  className="inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold text-white"
                  style={{
                    backgroundImage:
                      "linear-gradient(140deg, #07013c 0%, #000a3a 100%)",
                  }}
                >
                  {formatTestType(testData.type)}
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-1.5 rounded-md hover:bg-slate-100 transition-colors"
                >
                  <img src="/icons/edit.png" alt="Edit" className="h-4 w-4 object-contain" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <span className="text-base font-bold text-slate-800">
                  Chapter 1
                </span>
                <span
                  className={cn(
                    "inline-flex h-6 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-white",
                    getDifficultyStyles(testData.difficulty),
                  )}
                >
                  <img src="/icons/cognition.png" alt="Difficulty" className="h-3.5 w-3.5 object-contain" />
                  {formatDifficulty(testData.difficulty)}
                </span>
              </div>

              <div className="grid grid-cols-[80px_1fr] gap-y-1.5 text-xs text-slate-500 max-w-md mb-3">
                <span>Subject</span>
                <span className="text-slate-700 font-medium">
                  : {getSubjectName(testData.subject)}
                </span>
                <span>Topics</span>
                <span className="flex flex-wrap items-center gap-1">
                  :{" "}
                  {testData.topics?.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-md border border-amber-300 px-1.5 py-0.5 text-[10px] text-amber-500"
                    >
                      {getTopicName(t)}
                    </span>
                  ))}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>{testData.total_time} Min</span>
                <span className="text-slate-300">|</span>
                <span>{testData.total_questions} Q's</span>
                <span className="text-slate-300">|</span>
                <span>{testData.total_marks} Marks</span>
              </div>
            </div>
          )}

          {/* Publishing Options */}
          <div className="mb-10">
            <div className="flex items-center gap-6 border-b border-slate-200 mb-6">
              <button
                type="button"
                className="pb-2 border-b-2 border-[#1b5def] text-sm font-bold text-[#1b5def]"
              >
                Publish Now
              </button>
              <button
                type="button"
                className="pb-2 text-sm font-semibold text-slate-400 hover:text-slate-600"
              >
                Schedule Publish
              </button>
            </div>

            <h3 className="text-sm font-bold text-slate-800 mb-2">Live Until</h3>
            <p className="text-xs text-slate-500 mb-6">
              Choose how long this test should remain available on the platform.
            </p>

            <div className="grid grid-cols-2 gap-y-4 gap-x-12 mb-8 max-w-2xl">
              {(
                [
                  "Always Available",
                  "3 Weeks",
                  "1 Week",
                  "1 Month",
                  "2 Weeks",
                  "Custom Duration",
                ] as const
              ).map((option) => (
                <label key={option} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="live_until"
                    value={option}
                    defaultChecked={option === "Custom Duration"}
                    className="h-4 w-4 text-[#1b5def] accent-[#1b5def]"
                  />
                  <span className="text-sm text-slate-600">{option}</span>
                </label>
              ))}
            </div>

            <div className="flex items-center gap-4 max-w-2xl">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Select End Date"
                  className="w-full h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5def]/30 focus:border-[#1b5def]"
                />
              </div>
              <div className="flex-1 relative">
                <select className="w-full h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#1b5def]/30 focus:border-[#1b5def] text-slate-400">
                  <option value="">Select End Time</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Questions preview */}
          <div className="mb-6">
            <h2 className="text-sm font-bold text-slate-700 mb-4">
              Questions Preview
            </h2>
            <div className="space-y-4">
              {displayQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="rounded-lg border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium text-slate-700">
                      <span className="text-[#1b5def] font-bold">
                        Q{idx + 1}.{" "}
                      </span>
                      {q.question}
                    </p>
                    {q.difficulty && (
                      <span
                        className={cn(
                          "inline-flex h-5 items-center gap-1.5 rounded px-2 text-[10px] font-semibold text-white shrink-0 ml-4",
                          getDifficultyStyles(q.difficulty),
                        )}
                      >
                        <img src="/icons/cognition.png" alt="Difficulty" className="h-3 w-3 object-contain" />
                        {formatDifficulty(q.difficulty)}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    {(
                      [
                        ["option1", q.option1],
                        ["option2", q.option2],
                        ["option3", q.option3],
                        ["option4", q.option4],
                      ] as const
                    ).map(([key, val]) => (
                      <div
                        key={key}
                        className={cn(
                          "flex items-center gap-2 rounded-md border px-3 py-2",
                          q.correct_option === key
                            ? "border-green-300 bg-green-50 text-green-700 font-medium"
                            : "border-slate-200 bg-slate-50",
                        )}
                      >
                        {q.correct_option === key && (
                          <Check className="h-3 w-3 text-green-600" />
                        )}
                        {val}
                      </div>
                    ))}
                  </div>
                  {q.explanation && (
                    <p className="mt-2 text-xs text-slate-400">
                      <span className="font-medium">Explanation:</span>{" "}
                      {q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              <AlertCircle className="size-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-end gap-4 border-t border-slate-200 bg-white px-8 py-4">
          <button
            type="button"
            onClick={() => navigate(`/tests/${testId}/questions`)}
            className="px-6 py-2.5 rounded-lg bg-[#f4f8ff] text-sm font-bold text-[#1b5def] hover:bg-[#ebf2ff]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={publishing}
            className="flex items-center gap-2 rounded-lg bg-[#5988ef] px-8 py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-90 disabled:opacity-60"
          >
            {publishing && <Loader2 className="h-4 w-4 animate-spin" />}
            Confirm
          </button>
        </div>
      </div>

      {/* Edit Test Modal */}
      {isEditModalOpen && testId && (
        <EditTestModal
          testId={testId}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            fetchTestById(testId).then((res) => {
              if (res.status === "success" && res.data) {
                setTestData(res.data);
              }
            });
          }}
        />
      )}
    </div>
  );
}
