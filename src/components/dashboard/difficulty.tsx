import React from "react";
import { cn } from "@/lib/utils";
import { formatDifficulty, getDifficultyStyles } from "@/lib/test-utils";

const Difficulty = ({ difficulty }: { difficulty: string }) => {
  return (
    <div
      className={cn(
        "flex justify-center items-center h-6 min-w-[100px] gap-1.5 rounded-[8px] text-sm text-[#FEFEFF]",
        getDifficultyStyles(difficulty),
      )}
    >
      <img
        src="/icons/cognition.png"
        alt="Difficulty"
        className="h-4.5 w-4.5"
      />
      <span className="pb-[1px]">{formatDifficulty(difficulty)}</span>
    </div>
  );
};

export default Difficulty;
