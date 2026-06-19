import type { ReactNode } from "react";
import { BookOpen, Eye, Edit } from "lucide-react";
import type { Test } from "@/types/test";
import { formatTestType, formatDate } from "@/lib/test-utils";
import { cn } from "@/lib/utils";
import Difficulty from "./difficulty";
import TimerIcon from "@/assets/timer-icon";
import LeaderboardIcon from "@/assets/leaderboard-icon";
import QuizIcon from "@/assets/quiz-icon";
import { DeleteIcon } from "@/assets/delete-icon";

interface TestDetailCardProps {
  test: Test;
  onView: (test: Test) => void;
  onEdit: (test: Test) => void;
  onDelete: (test: Test) => void;
  viewMode: "list" | "grid";
}

function TopicTag({ label }: { label: string }) {
  return (
    <span className="inline-flex h-6 items-center rounded-lg border border-[#e9b406] px-2.5 text-sm text-[#ffc82c]">
      {label}
    </span>
  );
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-[5px]">
      <span className="w-[100px] shrink-0 text-xs text-[#6b7180]">{label}</span>
      <span className="text-xs text-[#6b7180]">:</span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export function TestDetailCard({
  test,
  onView,
  onEdit,
  onDelete,
  viewMode,
}: TestDetailCardProps) {
  const topics = test.topics ?? [];
  const subTopics = test.sub_topics ?? [];

  return (
    <article className={`rounded-lg border border-[#e5e7eb] bg-white p-5`}>
      <div className="flex justify-between mb-2 items-center min-w-full">
        <div
          className="inline-flex h-6 w-fit items-center rounded-xl px-2.5 text-sm text-secondary-foreground"
          style={{
            backgroundImage:
              "linear-gradient(140.66deg, rgb(7, 1, 60) 0%, rgb(0, 10, 58) 102.39%)",
          }}
        >
          {formatTestType(test.type)}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onView(test)}
            className="flex size-8 items-center cursor-pointer justify-center rounded-lg transition-colors hover:bg-secondary-foreground"
            title="View test"
          >
            <Eye className="size-5 text-[#D1D5DB]" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => onEdit(test)}
            className="flex size-8 items-center cursor-pointer justify-center rounded-lg transition-colors hover:bg-secondary-foreground"
            title="Edit test"
          >
            <Edit className="size-5 text-[#D1D5DB]" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(test)}
            className="flex size-8 items-center cursor-pointer justify-center rounded-lg transition-colors hover:bg-red-50"
            title="Delete test"
          >
            <DeleteIcon color="#D1D5DB" />
          </button>
        </div>
      </div>
      <div
        className={` ${viewMode == "grid" ? "flex-wrap" : ""} flex items-start justify-between gap-6`}
      >
        <div
          className={`flex min-w-0 ${viewMode == "grid" ? "min-w-full" : "flex-1"} flex-col gap-5`}
        >
          <div className="flex flex-wrap items-end gap-2.5">
            <div className="flex items-end gap-1.5">
              <BookOpen
                className="size-6 shrink-0 text-[#384ec7]"
                strokeWidth={1.75}
              />
              <h3 className="text-base font-bold leading-[1.5] text-black">
                {test.name}
              </h3>
            </div>
            <Difficulty difficulty={test.difficulty} />
            <span
              className={cn(
                "inline-flex h-6 items-center rounded-lg px-2.5 text-xs font-medium uppercase tracking-wide",
                test.status === "live"
                  ? "bg-green-50 text-green-700"
                  : "bg-amber-50 text-amber-700",
              )}
            >
              {test.status || "draft"}
            </span>
          </div>

          <div className="flex flex-col gap-[15px]">
            <InfoRow label="Subject">
              <span className="text-base font-medium text-[#6b7280]">
                {test.subject}
              </span>
            </InfoRow>

            {topics.length > 0 && (
              <InfoRow label="Topic">
                <div className="flex flex-wrap gap-1.5">
                  {topics.map((topic) => (
                    <TopicTag key={topic} label={topic} />
                  ))}
                </div>
              </InfoRow>
            )}

            {subTopics.length > 0 && (
              <InfoRow label="Sub Topic">
                <div className="flex flex-wrap gap-1.5">
                  {subTopics.map((topic) => (
                    <TopicTag key={topic} label={topic} />
                  ))}
                </div>
              </InfoRow>
            )}

            <InfoRow label="Created">
              <span className="text-sm text-[#6b7280]">
                {formatDate(test.created_at)}
              </span>
            </InfoRow>
          </div>
        </div>

        <div
          className={`${viewMode == "grid" ? "min-w-full justify-end" : ""} flex shrink-0 flex-col items-end justify-end self-stretch`}
        >
          <div className="flex w-max h-8 items-center gap-[5px] rounded-lg border border-[#e5e7eb] px-[5px]">
            <div className="flex h-full w-20 items-center gap-1.5 px-1">
              <TimerIcon />
              <span className="whitespace-nowrap text-sm text-[#374151]">
                {test.total_time} Min
              </span>
            </div>
            <span className="text-base font-medium text-[#e5e7eb]">|</span>
            <div className="flex h-full w-[100px] items-center justify-center gap-1.5">
              <QuizIcon />
              <span className="whitespace-nowrap text-sm text-[#374151]">
                {test.total_questions} Q&apos;s
              </span>
            </div>
            <span className="text-base font-medium text-[#e5e7eb]">|</span>
            <div className="flex h-full w-[100px] items-center justify-center gap-1.5">
              <LeaderboardIcon />
              <span className="whitespace-nowrap text-sm text-[#374151]">
                {test.total_marks} Marks
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
