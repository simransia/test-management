import ReactQuill from "react-quill-new";
import { ChevronDown } from "lucide-react";
import type { LocalQuestion } from "@/stores/test-store";
import type { Topic, SubTopic } from "@/types/test";

interface QuestionFormProps {
  currentQuestion: LocalQuestion;
  activeQuestionIndex: number;
  totalQuestions: number;
  topics: Topic[];
  subTopics: SubTopic[];
  updateCurrent: (data: Partial<LocalQuestion>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function QuestionForm({
  currentQuestion,
  activeQuestionIndex,
  totalQuestions,
  topics,
  subTopics,
  updateCurrent,
  onRemove,
  canRemove,
}: QuestionFormProps) {
  const quillModules = {
    toolbar: [
      ["italic", "bold", "underline", "strike"],
      ["blockquote", "code-block", "link"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["image", "formula"],
    ],
  };

  return (
    <div className="px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-700">
          Question {activeQuestionIndex + 1}{" "}
          <span className="text-slate-400 font-normal">/ {totalQuestions}</span>
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

      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
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
          modules={quillModules}
          className="bg-white rounded-lg mb-8 [&_.ql-toolbar]:rounded-t-lg [&_.ql-container]:rounded-b-lg [&_.ql-container]:min-h-[120px] [&_.ql-toolbar]:border-slate-200 [&_.ql-container]:border-slate-200"
          placeholder="Type here"
        />
        <button
          type="button"
          onClick={() => updateCurrent({ question: "" })}
          className="absolute top-3 right-3 opacity-50 hover:opacity-100 transition-opacity"
        >
          <img src="/icons/trash-grey.png" alt="Clear" className="h-4 w-4 object-contain" />
        </button>
      </div>

      {/* Options */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">
          Type the options below
        </h4>
        <div className="space-y-3">
          {(["option1", "option2", "option3", "option4"] as const).map((key) => (
            <label key={key} className="flex items-center gap-3 group">
              <input
                type="radio"
                name={`correct-${currentQuestion.localId}`}
                value={key}
                checked={currentQuestion.correct_option === key}
                onChange={() => updateCurrent({ correct_option: key })}
                className="h-4 w-4 accent-[#1b5def]"
              />
              <div className="flex-1 relative flex items-center">
                <input
                  type="text"
                  value={currentQuestion[key]}
                  onChange={(e) => updateCurrent({ [key]: e.target.value })}
                  placeholder={`Type Option here`}
                  className="w-full h-11 rounded-lg border border-slate-300 bg-white px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5def]/30 focus:border-[#1b5def]"
                />
                <button
                  type="button"
                  onClick={() => updateCurrent({ [key]: "" })}
                  className="absolute right-3 opacity-50 hover:opacity-100 transition-opacity"
                >
                  <img src="/icons/trash-grey.png" alt="Clear" className="h-4 w-4 object-contain" />
                </button>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Add Solution */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-slate-700 mb-2">Add Solution</h4>
        <div className="relative">
          <ReactQuill
            theme="snow"
            value={currentQuestion.explanation}
            onChange={(val) => updateCurrent({ explanation: val })}
            modules={quillModules}
            className="bg-white rounded-lg mb-8 [&_.ql-toolbar]:rounded-t-lg [&_.ql-container]:rounded-b-lg [&_.ql-container]:min-h-[100px] [&_.ql-toolbar]:border-slate-200 [&_.ql-container]:border-slate-200"
            placeholder="Type here"
          />
          <button
            type="button"
            onClick={() => updateCurrent({ explanation: "" })}
            className="absolute top-3 right-3 opacity-50 hover:opacity-100 transition-opacity"
          >
            <img src="/icons/trash-grey.png" alt="Clear" className="h-4 w-4 object-contain" />
          </button>
        </div>
      </div>

      {/* Question Settings */}
      <div className="border-t border-slate-100 pt-6">
        <h4 className="text-sm font-semibold text-slate-700 mb-4">Question settings</h4>
        <div className="grid grid-cols-1 gap-4 max-w-lg">
          {/* Difficulty */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-500">Level of Difficulty</label>
            <div className="relative">
              <select
                value={currentQuestion.difficulty}
                onChange={(e) => updateCurrent({ difficulty: e.target.value })}
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
            <label className="text-xs font-medium text-slate-500">Topic</label>
            <div className="relative">
              <select
                value={currentQuestion.topic}
                onChange={(e) => updateCurrent({ topic: e.target.value })}
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
            <label className="text-xs font-medium text-slate-500">Sub-topic</label>
            <div className="relative">
              <select
                value={currentQuestion.sub_topic}
                onChange={(e) => updateCurrent({ sub_topic: e.target.value })}
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
            <label className="text-xs font-medium text-slate-500">Media URL (optional)</label>
            <input
              type="url"
              value={currentQuestion.media_url}
              onChange={(e) => updateCurrent({ media_url: e.target.value })}
              placeholder="https://..."
              className="w-full h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5def]/30"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
