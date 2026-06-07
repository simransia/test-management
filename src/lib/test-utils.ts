import type { TestDifficulty, TestType } from "@/types/test";

export function formatTestType(type: TestType): string {
  switch (type?.toLowerCase()) {
    case "chapterwise":
      return "Chapter Wise";
    case "mock":
      return "Mock Test";
    case "pyq":
      return "PYQ";
    case "practice":
      return "Practice";
    default:
      return type || "Test";
  }
}

export function formatDifficulty(difficulty: TestDifficulty): string {
  if (!difficulty) return "Easy";
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
}

export function getDifficultyStyles(difficulty: TestDifficulty): string {
  switch (difficulty?.toLowerCase()) {
    case "medium":
      return "bg-[#f59e0b]";
    case "hard":
      return "bg-[#ef4444]";
    default:
      return "bg-[#2ab7a9]";
  }
}

export function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}
