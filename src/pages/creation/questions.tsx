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
import { EditTestModal } from "@/components/creation/edit-test-modal";
import { QuestionSidebar } from "@/components/creation/question-sidebar";
import { TestSummaryBanner } from "@/components/creation/test-summary-banner";
import { QuestionForm } from "@/components/creation/question-form";
import { Breadcrumbs } from "@/components/layout";

import {
  useSubjects,
  useTopics,
  useSubTopics,
} from "@/hooks/use-test-metadata";
import { useTest } from "@/hooks/use-tests";
import { useQuestions } from "@/hooks/use-questions";

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

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questionPanelCollapsed, setQuestionPanelCollapsed] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Set sidebar and step
  useEffect(() => {
    setSidebarCollapsed(true);
    setStep("questions");
  }, [setSidebarCollapsed, setStep]);

  // If no testId at all, redirect
  useEffect(() => {
    if (!testId) {
      navigate("/creation/create");
    }
  }, [testId, navigate]);

  // Fetch test if not in store
  const {
    testData: fetchedTest,
    isLoading: testLoading,
    error: testError,
  } = useTest(!testData ? testId : null);

  useEffect(() => {
    if (fetchedTest && !testData) {
      setTestData(fetchedTest);
      setTestId(fetchedTest.id);
    }
  }, [fetchedTest, testData, setTestData, setTestId]);

  // Fetch bulk questions if they exist in the fetched test
  const { questions: fetchedQuestions, isLoading: questionsLoading } =
    useQuestions(
      !testData && fetchedTest?.questions ? fetchedTest.questions : null,
    );

  useEffect(() => {
    if (fetchedQuestions && fetchedQuestions.length > 0) {
      setSavedQuestions(fetchedQuestions);
    }
  }, [fetchedQuestions, setSavedQuestions]);

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

  // Load subjects, topics, and subtopics using custom hooks
  const { subjects, isLoading: subjectsLoading } = useSubjects();

  const subjectObj = subjects.find(
    (s) => s.name === testData?.subject || s.id === testData?.subject,
  );

  const { topics, isLoading: topicsLoading } = useTopics(subjectObj?.id);

  const topicIds = topics.map((t) => t.id);
  const { subTopics, isLoading: subTopicsLoading } = useSubTopics(topicIds);

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

  const getSubTopicName = (id: string) => {
    const st = subTopics.find((st) => st.id === id || st.name === id);
    return st ? st.name : id;
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
        navigate(`/creation/${testId}/publish`);
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <QuestionSidebar
        questionPanelCollapsed={questionPanelCollapsed}
        setQuestionPanelCollapsed={setQuestionPanelCollapsed}
      />

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <div className="px-8 pt-6 pb-2 flex items-center justify-between select-none">
          <Breadcrumbs
            items={["Test Creation", "Create Test", formatTestType(testData?.type)]}
          />
          <button
            type="button"
            onClick={handleSaveAndContinue}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#5988ef] hover:bg-[#5988ef]/90 px-8 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-60 cursor-pointer h-10 w-40 shrink-0"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Publish
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Test summary banner */}
          <TestSummaryBanner
            testData={testData}
            getSubjectName={getSubjectName}
            getTopicName={getTopicName}
            getSubTopicName={getSubTopicName}
            onEditClick={() => setIsEditModalOpen(true)}
            onPublishClick={handleSaveAndContinue}
            saving={saving}
          />

          {error && (
            <div className="mx-8 mt-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              <AlertCircle className="size-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Current question form */}
          {currentQuestion && (
            <QuestionForm
              currentQuestion={currentQuestion}
              activeQuestionIndex={activeQuestionIndex}
              totalQuestions={localQuestions.length}
              topics={topics}
              subTopics={subTopics}
              updateCurrent={updateCurrent}
              onRemove={() => removeLocalQuestion(currentQuestion.localId)}
              canRemove={localQuestions.length > 1}
            />
          )}
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-8 py-4">
          <button
            type="button"
            onClick={() => {
              setSidebarCollapsed(false);
              navigate("/creation/create");
            }}
            className="rounded-lg bg-[#FF7F7F] px-5 py-2.5 text-sm text-white shadow-sm hover:bg-[#ff5252]"
          >
            Exit Test Creation
          </button>
          <button
            type="button"
            onClick={handleSaveAndContinue}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#5988ef] px-10 py-2.5 text-sm text-white shadow-sm hover:opacity-90 disabled:opacity-60"
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
