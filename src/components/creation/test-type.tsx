import type { TestType } from "@/types/test";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

const TEST_TYPES: { label: string; value: TestType }[] = [
  { label: "Chapter Wise", value: "chapter-wise" },
  { label: "PYQ", value: "pyq" },
  { label: "Mock Test", value: "mock-test" },
];

const TestTypeTabs = ({
  selectedType = "chapter-wise",
  setValue,
}: {
  selectedType?: string;
  setValue?: (name: any, value: any) => void;
}) => {
  return (
    <div className="flex items-center gap-[6px] border border-[#D1D5DB] rounded-[8px] p-1.5 w-fit mb-8 bg-white">
      {TEST_TYPES.map((tt) => (
        <Button
          key={tt.value}
          type="button"
          onClick={() => setValue?.("type", tt.value)}
          className={cn(
            "px-[11px] py-2 text-sm font-medium transition-colors rounded-lg border-none shadow-none h-auto cursor-pointer",
            selectedType === tt.value
              ? "bg-secondary-foreground text-primary-accent hover:bg-[#f4f8ff]"
              : "bg-transparent text-slate-400 hover:text-slate-600 hover:bg-transparent",
          )}
        >
          {tt.label}
        </Button>
      ))}
    </div>
  );
};

export default TestTypeTabs;
