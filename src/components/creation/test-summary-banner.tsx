import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatTestType,
  formatDifficulty,
  getDifficultyStyles,
} from "@/lib/test-utils";
import TimerIcon from "@/assets/timer-icon";
import QuizIcon from "@/assets/quiz-icon";
import LeaderboardIcon from "@/assets/leaderboard-icon";
import Difficulty from "@/components/dashboard/difficulty";

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
    <div className="bg-white border border-[#E5E7EB] rounded-[8px] mx-5 p-5">
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
          onClick={onEditClick}
          className="p-1 rounded-md hover:bg-slate-50 transition-colors"
        >
          <img
            src="/icons/edit.png"
            alt="Edit"
            className="h-4 w-4 object-contain"
          />
        </button>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="flex items-center gap-2 text-base font-bold text-slate-800">
              <img
                src="/icons/chapter.png"
                alt="Chapter"
                className="h-6 w-6 object-contain"
              />
              Chapter 1
            </span>
            <Difficulty difficulty={testData.difficulty} />
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
                  className="inline-flex items-center rounded-[8px] border border-[#FFC82C] px-2 py-0.5 text-[11px] text-[#FFC82C] bg-white"
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
                      className="inline-flex items-center rounded-[8px] border border-[#FFC82C] px-2 py-0.5 text-[11px] text-[#FFC82C] bg-white"
                    >
                      {getSubTopicName(st)}
                    </span>
                  ))}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs rounded-[8px] font-medium text-slate-600 bg-white border border-[#E5E7EB] p-2 w-fit">
          <span className="flex items-center gap-2">
            <TimerIcon />
            {testData.total_time} Min
          </span>
          <span className="text-slate-200 text-lg font-light leading-none">
            |
          </span>
          <span className="flex items-center gap-2">
            <QuizIcon />
            {testData.total_questions} Q's
          </span>
          <span className="text-slate-200 text-lg font-light leading-none">
            |
          </span>
          <span className="flex items-center gap-2">
            <LeaderboardIcon />
            {testData.total_marks} Marks
          </span>
        </div>
      </div>
    </div>
  );
}
