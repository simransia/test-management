import type { ReactNode } from "react";
import { Link } from "react-router";
import { Clock, HelpCircle, BarChart3, Pencil, Eye, Trash2, BookOpen } from "lucide-react";
import type { Test } from "@/types/test";
import {
  formatTestType,
  formatDifficulty,
  getDifficultyStyles,
  formatDate,
} from "@/lib/test-utils";
import { cn } from "@/lib/utils";

interface TestDetailCardProps {
  test: Test;
  onDelete: (test: Test) => void;
}

function TopicTag({ label }: { label: string }) {
  return (
    <span className="inline-flex h-6 items-center rounded-lg border border-[#e9b406] px-2.5 text-sm text-[#ffc82c]">
      {label}
    </span>
  );
}

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-[5px]">
      <span className="w-[100px] shrink-0 text-xs text-[#6b7180]">{label}</span>
      <span className="text-xs text-[#6b7180]">:</span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export function TestDetailCard({ test, onDelete }: TestDetailCardProps) {
  const topics = test.topics ?? [];
  const subTopics = test.sub_topics ?? [];

  return (
    <article className="flex items-start justify-between gap-6 rounded-lg border border-[#e5e7eb] bg-white p-5">
      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <div
          className="inline-flex h-6 w-fit items-center rounded-xl px-2.5 text-sm text-[#f8faff]"
          style={{
            backgroundImage:
              "linear-gradient(140.66deg, rgb(7, 1, 60) 0%, rgb(0, 10, 58) 102.39%)",
          }}
        >
          {formatTestType(test.type)}
        </div>

        <div className="flex flex-wrap items-end gap-2.5">
          <div className="flex items-end gap-1.5">
            <BookOpen className="size-6 shrink-0 text-[#384ec7]" strokeWidth={1.75} />
            <h3 className="text-base font-bold leading-[1.5] text-black">{test.name}</h3>
          </div>
          <span
            className={cn(
              "inline-flex h-6 items-center rounded-lg px-2.5 text-sm text-[#fefeff]",
              getDifficultyStyles(test.difficulty),
            )}
          >
            {formatDifficulty(test.difficulty)}
          </span>
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
            <span className="text-base font-medium text-[#6b7280]">{test.subject}</span>
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
            <span className="text-sm text-[#6b7280]">{formatDate(test.created_at)}</span>
          </InfoRow>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end justify-between self-stretch">
        <div className="flex items-center gap-3">
          <Link
            to={`/tests/view/${test.id}`}
            className="flex size-8 items-center justify-center rounded-lg text-[#6b7180] transition-colors hover:bg-[#f8faff] hover:text-[#384ec7]"
            title="View test"
          >
            <Eye className="size-5" strokeWidth={1.75} />
          </Link>
          <Link
            to={`/tests/edit/${test.id}`}
            className="flex size-8 items-center justify-center rounded-lg text-[#6b7180] transition-colors hover:bg-[#f8faff] hover:text-[#384ec7]"
            title="Edit test"
          >
            <Pencil className="size-5" strokeWidth={1.75} />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(test)}
            className="flex size-8 items-center justify-center rounded-lg text-[#6b7180] transition-colors hover:bg-red-50 hover:text-red-600"
            title="Delete test"
          >
            <Trash2 className="size-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex h-8 items-center gap-[5px] rounded-lg border border-[#e5e7eb] px-[5px]">
          <div className="flex h-full w-20 items-center gap-1.5 px-1">
            <Clock className="size-4 text-[#6b7180]" strokeWidth={1.75} />
            <span className="whitespace-nowrap text-sm text-[#374151]">
              {test.total_time} Min
            </span>
          </div>
          <span className="text-base font-medium text-[#e5e7eb]">|</span>
          <div className="flex h-full w-[100px] items-center justify-center gap-1.5">
            <HelpCircle className="size-5 text-[#6b7180]" strokeWidth={1.75} />
            <span className="whitespace-nowrap text-sm text-[#374151]">
              {test.total_questions} Q&apos;s
            </span>
          </div>
          <span className="text-base font-medium text-[#e5e7eb]">|</span>
          <div className="flex h-full w-[100px] items-center justify-center gap-1.5">
            <BarChart3 className="size-5 text-[#6b7180]" strokeWidth={1.75} />
            <span className="whitespace-nowrap text-sm text-[#374151]">
              {test.total_marks} Marks
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
