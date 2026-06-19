import ReactQuill from "react-quill-new";
import type { LocalQuestion } from "@/stores/test-store";
import type { Topic, SubTopic } from "@/types/test";
import {
  Input,
  Label,
  Textarea,
  Radio,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

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

  const settingsConfig = [
    {
      key: "difficulty" as const,
      label: "Level of Difficulty",
      value: currentQuestion.difficulty,
      options: [
        { value: "easy", label: "Easy" },
        { value: "medium", label: "Medium" },
        { value: "hard", label: "Hard" },
      ],
    },
    {
      key: "topic" as const,
      label: "Topic",
      value: currentQuestion.topic,
      options: topics.map((t) => ({ value: t.name, label: t.name })),
    },
    {
      key: "sub_topic" as const,
      label: "Sub-topic",
      value: currentQuestion.sub_topic,
      options: subTopics.map((st) => ({ value: st.name, label: st.name })),
    },
  ];

  return (
    <div className="px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-700">
          Question {activeQuestionIndex + 1}{" "}
          <span className="text-slate-400 font-normal">/ {totalQuestions}</span>
        </h3>
        <div className="flex items-center gap-3 text-xs font-semibold">
          <Button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors h-auto min-w-0 shadow-none cursor-pointer"
          >
            <img
              src="/icons/plus.png"
              className="h-3 w-3 object-contain opacity-50"
              alt="Add"
            />{" "}
            MCQ
          </Button>
          <Button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors h-auto min-w-0 shadow-none cursor-pointer"
          >
            <img
              src="/icons/download.png"
              className="h-3.5 w-3.5 object-contain opacity-50"
              alt="Import"
            />{" "}
            CSV
          </Button>
        </div>
      </div>

      {canRemove && (
        <Button
          type="button"
          onClick={onRemove}
          className="text-xs font-semibold text-[#ff6b6b] hover:text-red-600 mb-4 flex items-center gap-1.5 bg-transparent border-none shadow-none p-0 h-auto cursor-pointer"
        >
          <img
            src="/icons/trash-grey.png"
            alt="Delete All Edits"
            className="h-3.5 w-3.5 object-contain"
          />
          Delete All Edits
        </Button>
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
        <Button
          type="button"
          onClick={() => updateCurrent({ question: "" })}
          className="absolute top-3 right-3 opacity-50 hover:opacity-100 transition-opacity p-0 h-auto w-auto min-w-0 bg-transparent border-none shadow-none cursor-pointer"
        >
          <img
            src="/icons/trash-grey.png"
            alt="Clear"
            className="h-4 w-4 object-contain"
          />
        </Button>
      </div>

      {/* Options */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">
          Type the options below
        </h4>
        <div className="space-y-3">
          {(["option1", "option2", "option3", "option4"] as const).map(
            (key) => (
              <Label key={key} variant="inline" className="gap-3 group">
                <Radio
                  name={`correct-${currentQuestion.localId}`}
                  value={key}
                  checked={currentQuestion.correct_option === key}
                  onChange={() => updateCurrent({ correct_option: key })}
                />
                <div className="flex-1 relative flex items-center">
                  <Input
                    type="text"
                    value={currentQuestion[key]}
                    onChange={(e) => updateCurrent({ [key]: e.target.value })}
                    placeholder={`Type Option here`}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    onClick={() => updateCurrent({ [key]: "" })}
                    className="absolute right-3 opacity-50 hover:opacity-100 transition-opacity p-0 h-auto w-auto min-w-0 bg-transparent border-none shadow-none cursor-pointer"
                  >
                    <img
                      src="/icons/trash-grey.png"
                      alt="Clear"
                      className="h-4 w-4 object-contain"
                    />
                  </Button>
                </div>
              </Label>
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
          <Textarea
            value={currentQuestion.explanation || ""}
            onChange={(e) => updateCurrent({ explanation: e.target.value })}
            placeholder="Type here"
            className="pr-10"
          />
          <Button
            type="button"
            onClick={() => updateCurrent({ explanation: "" })}
            className="absolute top-4 right-4 opacity-50 hover:opacity-100 transition-opacity p-0 h-auto w-auto min-w-0 bg-transparent border-none shadow-none cursor-pointer"
          >
            <img
              src="/icons/trash-grey.png"
              alt="Clear"
              className="h-4 w-4 object-contain"
            />
          </Button>
        </div>
      </div>

      {/* Question Settings */}
      <div className="border-t border-slate-100 pt-6">
        <h4 className="text-sm font-semibold text-slate-700 mb-4">
          Question settings
        </h4>
        <div className="grid grid-cols-1 gap-4 max-w-lg">
          {settingsConfig.map((field) => (
            <div key={field.key} className="flex flex-col gap-1.5">
              <Label variant="muted">{field.label}</Label>
              <Select
                value={field.value || "none"}
                onValueChange={(val) =>
                  updateCurrent({ [field.key]: val === "none" ? "" : val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select from Drop-down" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="none">Select from Drop-down</SelectItem>
                  {field.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}

          {/* Media URL */}
          <div className="flex flex-col gap-1.5">
            <Label variant="muted">Media URL (optional)</Label>
            <Input
              type="url"
              value={currentQuestion.media_url}
              onChange={(e) => updateCurrent({ media_url: e.target.value })}
              placeholder="https://..."
              className="h-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
