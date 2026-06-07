import { useTestStore } from "@/stores/test-store";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionSidebarProps {
  questionPanelCollapsed: boolean;
  setQuestionPanelCollapsed: (collapsed: boolean) => void;
}

export function QuestionSidebar({
  questionPanelCollapsed,
  setQuestionPanelCollapsed,
}: QuestionSidebarProps) {
  const {
    localQuestions,
    activeQuestionIndex,
    setActiveQuestionIndex,
    addLocalQuestion,
  } = useTestStore();

  const isQuestionFilled = (q: any) =>
    q.question.trim() !== "" &&
    q.option1.trim() !== "" &&
    q.option2.trim() !== "" &&
    q.option3.trim() !== "" &&
    q.option4.trim() !== "";

  return (
    <>
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
                  activeQuestionIndex === idx && !filled && "border-[#1b5def] text-[#1b5def]",
                )}
              >
                <div className="flex items-center gap-3">
                  {filled ? (
                    <img
                      src="/icons/green-check.png"
                      alt="Complete"
                      className="h-5 w-5 object-contain"
                    />
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

      {questionPanelCollapsed && (
        <button
          type="button"
          onClick={() => setQuestionPanelCollapsed(false)}
          className="flex items-center justify-center w-8 border-r border-slate-200 bg-white text-slate-400 hover:text-slate-600"
        >
          <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
        </button>
      )}
    </>
  );
}
