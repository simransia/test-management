import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  useTestStore,
  type LocalQuestion,
  createEmptyQuestion,
} from "@/stores/test-store";
import {
  fetchTestById,
  fetchBulkQuestions,
  bulkCreateQuestions,
  updateTest,
  fetchSubjects,
  fetchTopicsBySubject,
  fetchSubTopicsByMultiTopics,
} from "@/api/test";
import { getApiErrorMessage } from "@/lib/api";
import type { Subject, Topic, SubTopic } from "@/types/test";
import {
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronLeft,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatTestType,
  formatDifficulty,
  getDifficultyStyles,
} from "@/lib/test-utils";
import { EditTestModal } from "@/components/tests/edit-test-modal";

export default function QuestionsPage() {
  const navigate = useNavigate();
  const { testId: paramTestId } = useParams<{ testId: string }>();

  const {
    testId: storeTestId,
    testData,
    setTestData,
    setTestId,
    setStep,
    setSidebarCollapsed,
    localQuestions,
    activeQuestionIndex,
    setActiveQuestionIndex,
    addLocalQuestion,
    updateLocalQuestion,
    removeLocalQuestion,
    setSavedQuestions,
    setLocalQuestions,
  } = useTestStore();

  const testId = paramTestId || storeTestId;

  const [loading, setLoading] = useState(!testData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questionPanelCollapsed, setQuestionPanelCollapsed] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Dropdown data for question settings
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);

  // Load test data if not in store
  useEffect(() => {
    setSidebarCollapsed(true);
    setStep("questions");

    async function load() {
      if (!testId) {
        navigate("/tests/create");
        return;
      }
      try {
        if (!testData) {
          const res = await fetchTestById(testId);
          if (res.status === "success" && res.data) {
            setTestData(res.data);
            setTestId(res.data.id);
            if (res.data.questions && res.data.questions.length > 0) {
              const qRes = await fetchBulkQuestions(res.data.questions);
              if (qRes.status === "success" && qRes.data) {
                setSavedQuestions(qRes.data);
              }
            }
          }
        }
        // Load subjects for question settings
        const sRes = await fetchSubjects();
        setSubjects(sRes.data ?? []);
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [
    testId,
    testData,
    navigate,
    setTestData,
    setTestId,
    setStep,
    setSidebarCollapsed,
    setSavedQuestions,
  ]);

  // Initialize empty questions if testData is loaded and local questions are in initial state
  useEffect(() => {
    if (testData && testData.total_questions > 1) {
      if (localQuestions.length === 1 && localQuestions[0].question === "") {
        const initialQs = [];
        for (let i = 0; i < testData.total_questions; i++) {
          initialQs.push(createEmptyQuestion());
        }
        setLocalQuestions(initialQs);
      }
    }
  }, [testData, localQuestions, setLocalQuestions]);

  // Load topics when testData subject is available
  useEffect(() => {
    if (!testData?.subject) return;
    // find subject id — testData.subject might be a name, we need to find the id
    const subjectObj = subjects.find(
      (s) => s.name === testData.subject || s.id === testData.subject,
    );
    if (subjectObj) {
      fetchTopicsBySubject(subjectObj.id)
        .then((res) => setTopics(res.data ?? []))
        .catch(() => {});
    }
  }, [testData?.subject, subjects]);

  // Load subtopics
  useEffect(() => {
    if (topics.length === 0) return;
    const topicIds = topics.map((t) => t.id);
    fetchSubTopicsByMultiTopics(topicIds)
      .then((res) => setSubTopics(res.data ?? []))
      .catch(() => {});
  }, [topics]);

  const getSubjectName = (id: string) => {
    const s = subjects.find((s) => s.id === id || s.name === id);
    return s ? s.name : id;
  };

  const getTopicName = (id: string) => {
    const t = topics.find((t) => t.id === id || t.name === id);
    return t ? t.name : id;
  };

  const currentQuestion: LocalQuestion | undefined =
    localQuestions[activeQuestionIndex];

  const updateCurrent = useCallback(
    (data: Partial<LocalQuestion>) => {
      if (currentQuestion) {
        updateLocalQuestion(currentQuestion.localId, data);
      }
    },
    [currentQuestion, updateLocalQuestion],
  );

  const isQuestionFilled = (q: LocalQuestion) =>
    q.question.trim() !== "" &&
    q.option1.trim() !== "" &&
    q.option2.trim() !== "" &&
    q.option3.trim() !== "" &&
    q.option4.trim() !== "";

  const handleSaveAndContinue = async () => {
    // Validate at least 1 question
    const filledQuestions = localQuestions.filter(isQuestionFilled);
    if (filledQuestions.length === 0) {
      setError("Add at least 1 question with all options filled.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      // Build payloads
      const payloads = filledQuestions.map((q) => ({
        type: "mcq" as const,
        question: q.question,
        option1: q.option1,
        option2: q.option2,
        option3: q.option3,
        option4: q.option4,
        correct_option: q.correct_option,
        explanation: q.explanation || undefined,
        difficulty: q.difficulty || undefined,
        test_id: testId!,
        subject: testData?.subject ?? "",
        topic: q.topic || undefined,
        sub_topic: q.sub_topic || undefined,
        media_url: q.media_url || undefined,
      }));

      const qRes = await bulkCreateQuestions(payloads);
      if (qRes.status === "success" && qRes.data) {
        setSavedQuestions(qRes.data);
        // Update test with question IDs
        const questionIds = qRes.data.map((q) => q.id);
        await updateTest(testId!, {
          questions: questionIds,
          total_questions: questionIds.length,
        });
        // Refresh test data
        const tRes = await fetchTestById(testId!);
        if (tRes.status === "success" && tRes.data) {
          setTestData(tRes.data);
        }
        setStep("publish");
        navigate(`/tests/${testId}/publish`);
      } else {
        setError(qRes.message ?? "Failed to save questions");
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to save questions."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-[#1b5def]" />
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* ── Left Question Panel ── */}
      <div
        className={cn(
          "flex flex-col border-r border-slate-200 bg-white transition-all shrink-0",
          questionPanelCollapsed ? "w-0 overflow-hidden" : "w-[260px]",
        )}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <span className="text-lg font-semibold text-slate-600">
            Question creation
          </span>
          <button
            type="button"
            onClick={() => setQuestionPanelCollapsed(true)}
            className="text-[#1b5def] hover:opacity-80"
          >
            <img
              src="/icons/blue-double-arrow-left.png"
              alt="Collapse"
              className="h-4 w-4 object-contain"
            />
          </button>
        </div>

        <div className="px-6 py-2 pb-6 text-base font-medium text-slate-500">
          Total Questions . {localQuestions.length}
        </div>

        <div className="flex-1 overflow-y-auto px-6 space-y-3 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {localQuestions.map((q, idx) => {
            const filled = isQuestionFilled(q);
            return (
              <button
                key={q.localId}
                type="button"
                onClick={() => setActiveQuestionIndex(idx)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-2xl border text-sm transition-all shadow-sm",
                  filled
                    ? "border-green-500 bg-white text-green-600 font-medium"
                    : "border-slate-200 bg-white text-slate-400 font-medium",
                )}
              >
                <div className="flex items-center gap-3">
                  {filled ? (
                    <span className="flex items-center justify-center h-5 w-5 rounded-full text-white bg-green-500">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                  ) : (
                    <img
                      src="/icons/muted-check.png"
                      alt="Incomplete"
                      className="h-5 w-5 object-contain"
                    />
                  )}
                  <span>Question {idx + 1}</span>
                </div>
                {filled ? (
                  <img
                    src="/icons/green-double-arrow.png"
                    alt="Next"
                    className="h-3 w-auto object-contain"
                  />
                ) : (
                  <img
                    src="/icons/grey-double-arrow.png"
                    alt="Next"
                    className="h-3 w-auto object-contain"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-100 mt-auto">
          <button
            type="button"
            onClick={addLocalQuestion}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#1b5def] py-2.5 text-sm font-semibold text-[#1b5def] hover:bg-[#f4f8ff]"
          >
            <img
              src="/icons/plus.png"
              className="h-4 w-4 object-contain"
              alt="Add"
            />
            Add Question
          </button>
        </div>
      </div>

      {/* ── Collapsed toggle ── */}
      {questionPanelCollapsed && (
        <button
          type="button"
          onClick={() => setQuestionPanelCollapsed(false)}
          className="flex items-center justify-center w-8 border-r border-slate-200 bg-white text-slate-400 hover:text-slate-600"
        >
          <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
        </button>
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <div className="flex-1 overflow-y-auto">
          {/* Test summary banner */}
          {testData && (
            <div className="bg-white border-b border-slate-100 px-8 py-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold text-white"
                    style={{
                      backgroundImage:
                        "linear-gradient(140deg, #07013c 0%, #000a3a 100%)",
                    }}
                  >
                    {formatTestType(testData.type)}
                  </span>
                  <span className="text-sm text-slate-400">✓</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(true)}
                    className="p-1.5 rounded-md hover:bg-slate-100 transition-colors"
                  >
                    <img
                      src="/icons/edit.png"
                      alt="Edit"
                      className="h-4 w-4 object-contain"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAndContinue}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-lg bg-[#1b5def] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-60"
                  >
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                    Publish
                  </button>
                </div>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-base font-bold text-slate-800">
                      Chapter 1
                    </span>
                    <span
                      className={cn(
                        "inline-flex h-6 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-white",
                        getDifficultyStyles(testData.difficulty),
                      )}
                    >
                      <img
                        src="/icons/cognition.png"
                        alt="Difficulty"
                        className="h-3.5 w-3.5 object-contain"
                      />
                      {formatDifficulty(testData.difficulty)}
                    </span>
                  </div>

                  <div className="grid grid-cols-[80px_1fr] gap-y-1.5 text-xs text-slate-500 max-w-md">
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
                </div>

                <div className="flex items-center gap-4 mt-4 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg px-4 py-2 w-fit">
                  <span className="flex items-center gap-2">
                    <img
                      src="/icons/timer.png"
                      className="h-4 w-4 object-contain opacity-50"
                      alt="Time"
                    />{" "}
                    {testData.total_time} Min
                  </span>
                  <span className="text-slate-200 text-lg font-light leading-none">
                    |
                  </span>
                  <span className="flex items-center gap-2">
                    <img
                      src="/icons/quiz.png"
                      className="h-4 w-4 object-contain opacity-50"
                      alt="Questions"
                    />{" "}
                    {testData.total_questions} Q's
                  </span>
                  <span className="text-slate-200 text-lg font-light leading-none">
                    |
                  </span>
                  <span className="flex items-center gap-2">
                    <img
                      src="/icons/marks.png"
                      className="h-4 w-4 object-contain opacity-50"
                      alt="Marks"
                    />{" "}
                    {testData.total_marks} Marks
                  </span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mx-8 mt-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              <AlertCircle className="size-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Current question form */}
          {currentQuestion && (
            <div className="px-8 py-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-700">
                  Question {activeQuestionIndex + 1}{" "}
                  <span className="text-slate-400 font-normal">
                    / {localQuestions.length}
                  </span>
                </h3>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <img
                      src="/icons/plus.png"
                      className="h-3 w-3 object-contain opacity-50"
                      alt="Add"
                    />{" "}
                    MCQ
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <img
                      src="/icons/download.png"
                      className="h-3.5 w-3.5 object-contain opacity-50"
                      alt="Import"
                    />{" "}
                    CSV
                  </button>
                </div>
              </div>

              {/* Delete link */}
              {localQuestions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLocalQuestion(currentQuestion.localId)}
                  className="text-xs font-semibold text-[#ff6b6b] hover:text-red-600 mb-4 flex items-center gap-1.5"
                >
                  <img
                    src="/icons/trash-grey.png"
                    alt="Delete All Edits"
                    className="h-3.5 w-3.5 object-contain"
                  />
                  Delete All Edits
                </button>
              )}

              {/* Question text */}
              <div className="mb-6 relative">
                <ReactQuill
                  theme="snow"
                  value={currentQuestion.question}
                  onChange={(val) => updateCurrent({ question: val })}
                  className="bg-white rounded-lg mb-8 [&_.ql-toolbar]:rounded-t-lg [&_.ql-container]:rounded-b-lg [&_.ql-container]:min-h-[120px]"
                  placeholder="Type here"
                />
                <button
                  type="button"
                  onClick={() => updateCurrent({ question: "" })}
                  className="absolute top-3 right-3 opacity-50 hover:opacity-100 transition-opacity"
                >
                  <img
                    src="/icons/trash-grey.png"
                    alt="Clear"
                    className="h-4 w-4 object-contain"
                  />
                </button>
              </div>

              {/* Options */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">
                  Type the options below
                </h4>
                <div className="space-y-3">
                  {(["option1", "option2", "option3", "option4"] as const).map(
                    (key, i) => (
                      <label
                        key={key}
                        className="flex items-center gap-3 group"
                      >
                        <input
                          type="radio"
                          name={`correct-${currentQuestion.localId}`}
                          value={key}
                          checked={currentQuestion.correct_option === key}
                          onChange={() =>
                            updateCurrent({ correct_option: key })
                          }
                          className="h-4 w-4 accent-[#1b5def]"
                        />
                        <div className="flex-1 relative flex items-center">
                          <input
                            type="text"
                            value={currentQuestion[key]}
                            onChange={(e) =>
                              updateCurrent({ [key]: e.target.value })
                            }
                            placeholder={`Type Option here`}
                            className="w-full h-11 rounded-lg border border-slate-300 bg-white px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5def]/30 focus:border-[#1b5def]"
                          />
                          <button
                            type="button"
                            onClick={() => updateCurrent({ [key]: "" })}
                            className="absolute right-3 opacity-50 hover:opacity-100 transition-opacity"
                          >
                            <img
                              src="/icons/trash-grey.png"
                              alt="Clear"
                              className="h-4 w-4 object-contain"
                            />
                          </button>
                        </div>
                      </label>
                    ),
                  )}
                </div>
              </div>

              {/* Add Solution */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-700 mb-2">
                  Add Solution
                </h4>
                <div className="relative">
                  <ReactQuill
                    theme="snow"
                    value={currentQuestion.explanation}
                    onChange={(val) => updateCurrent({ explanation: val })}
                    className="bg-white rounded-lg mb-8 [&_.ql-toolbar]:rounded-t-lg [&_.ql-container]:rounded-b-lg [&_.ql-container]:min-h-[100px]"
                    placeholder="Type here"
                  />
                  <button
                    type="button"
                    onClick={() => updateCurrent({ explanation: "" })}
                    className="absolute top-3 right-3 opacity-50 hover:opacity-100 transition-opacity"
                  >
                    <img
                      src="/icons/trash-grey.png"
                      alt="Clear"
                      className="h-4 w-4 object-contain"
                    />
                  </button>
                </div>
              </div>

              {/* Question Settings */}
              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-sm font-semibold text-slate-700 mb-4">
                  Question settings
                </h4>

                <div className="grid grid-cols-1 gap-4 max-w-lg">
                  {/* Difficulty */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-500">
                      Level of Difficulty
                    </label>
                    <div className="relative">
                      <select
                        value={currentQuestion.difficulty}
                        onChange={(e) =>
                          updateCurrent({ difficulty: e.target.value })
                        }
                        className="w-full h-10 rounded-lg border border-slate-300 bg-white px-4 pr-10 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#1b5def]/30"
                      >
                        <option value="">Select from Drop-down</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Topic */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-500">
                      Topic
                    </label>
                    <div className="relative">
                      <select
                        value={currentQuestion.topic}
                        onChange={(e) =>
                          updateCurrent({ topic: e.target.value })
                        }
                        className="w-full h-10 rounded-lg border border-slate-300 bg-white px-4 pr-10 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#1b5def]/30"
                      >
                        <option value="">Select from Drop-down</option>
                        {topics.map((t) => (
                          <option key={t.id} value={t.name}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Sub-topic */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-500">
                      Sub-topic
                    </label>
                    <div className="relative">
                      <select
                        value={currentQuestion.sub_topic}
                        onChange={(e) =>
                          updateCurrent({ sub_topic: e.target.value })
                        }
                        className="w-full h-10 rounded-lg border border-slate-300 bg-white px-4 pr-10 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#1b5def]/30"
                      >
                        <option value="">Select from Drop-down</option>
                        {subTopics.map((st) => (
                          <option key={st.id} value={st.name}>
                            {st.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Media URL */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-500">
                      Media URL (optional)
                    </label>
                    <input
                      type="url"
                      value={currentQuestion.media_url}
                      onChange={(e) =>
                        updateCurrent({ media_url: e.target.value })
                      }
                      placeholder="https://..."
                      className="w-full h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5def]/30"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-8 py-4">
          <button
            type="button"
            onClick={() => {
              setSidebarCollapsed(false);
              navigate("/tests/create");
            }}
            className="rounded-lg bg-[#ff6b6b] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#ff5252]"
          >
            Exit Test Creation
          </button>
          <button
            type="button"
            onClick={handleSaveAndContinue}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#5988ef] px-8 py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-90 disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Next
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
