import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTestType, formatDifficulty, getDifficultyStyles } from "@/lib/test-utils";

interface TestSummaryBannerProps {
  testData: any;
  getSubjectName: (id: string) => string;
  getTopicName: (id: string) => string;
  getSubTopicName: (id: string) => string;
  onEditClick: () => void;
  onPublishClick: () => void;
  saving: boolean;
}

export function TestSummaryBanner({
  testData,
  getSubjectName,
  getTopicName,
  getSubTopicName,
  onEditClick,
  onPublishClick,
  saving,
}: TestSummaryBannerProps) {
  if (!testData) return null;

  return (
    <div className="bg-white border-b border-slate-100 px-8 py-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold text-white"
            style={{
              backgroundImage: "linear-gradient(140deg, #07013c 0%, #000a3a 100%)",
            }}
          >
            {formatTestType(testData.type)}
          </span>
          <span className="text-sm text-slate-400">✓</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onEditClick}
            className="p-1.5 rounded-md hover:bg-slate-100 transition-colors"
          >
            <img src="/icons/edit.png" alt="Edit" className="h-4 w-4 object-contain" />
          </button>
          <button
            type="button"
            onClick={onPublishClick}
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
            <span className="flex items-center gap-2 text-base font-bold text-slate-800">
              <img src="/icons/chapter.png" alt="Chapter" className="h-5 w-5 object-contain" />
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

          <div className="grid grid-cols-[80px_10px_1fr] gap-y-3 text-xs text-slate-500 max-w-md mt-4">
            <span>Subject</span>
            <span>:</span>
            <span className="text-slate-700 font-bold text-[13px]">
              {getSubjectName(testData.subject)}
            </span>

            <span>Topic</span>
            <span>:</span>
            <span className="flex flex-wrap items-center gap-2">
              {testData.topics?.map((t: string) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded border border-amber-300 px-2 py-0.5 text-[11px] text-amber-500 bg-white"
                >
                  {getTopicName(t)}
                </span>
              ))}
            </span>

            {testData.sub_topics && testData.sub_topics.length > 0 && (
              <>
                <span>Sub Topic</span>
                <span>:</span>
                <span className="flex flex-wrap items-center gap-2">
                  {testData.sub_topics.map((st: string) => (
                    <span
                      key={st}
                      className="inline-flex items-center rounded border border-amber-300 px-2 py-0.5 text-[11px] text-amber-500 bg-white"
                    >
                      {getSubTopicName(st)}
                    </span>
                  ))}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-600 bg-white border border-slate-100 rounded-lg px-4 py-2.5 w-fit shadow-sm">
          <span className="flex items-center gap-2">
            <img src="/icons/timer.png" className="h-3.5 w-3.5 object-contain opacity-40" alt="Time" />{" "}
            {testData.total_time} Min
          </span>
          <span className="text-slate-200 text-lg font-light leading-none">|</span>
          <span className="flex items-center gap-2">
            <img src="/icons/quiz.png" className="h-3.5 w-3.5 object-contain opacity-40" alt="Questions" />{" "}
            {testData.total_questions} Q's
          </span>
          <span className="text-slate-200 text-lg font-light leading-none">|</span>
          <span className="flex items-center gap-2">
            <img src="/icons/marks.png" className="h-3.5 w-3.5 object-contain opacity-40" alt="Marks" />{" "}
            {testData.total_marks} Marks
          </span>
        </div>
      </div>
    </div>
  );
}
