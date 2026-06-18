import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { createTest } from "@/api/test";
import { useTestStore } from "@/stores/test-store";
import { getApiErrorMessage } from "@/lib/api";
import type { TestType, TestDifficulty } from "@/types/test";
import { Loader2, AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import TestTypeTabs from "@/components/creation/test-type";
import { Breadcrumbs } from "@/components/layout";
import { formatTestType } from "@/lib/test-utils";
import {
  useSubjects,
  useTopics,
  useSubTopics,
} from "@/hooks/use-test-metadata";
import { Input, Label, Radio, Button } from "@/components/ui";

interface FormValues {
  name: string;
  type: TestType;
  subject: string;
  topics: string[];
  sub_topics: string[];
  difficulty: TestDifficulty;
  total_time: number;
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  total_questions: number;
  total_marks: number;
}

export default function CreateTestPage() {
  const navigate = useNavigate();
  const { setTestId, setTestData, setStep, setSidebarCollapsed } =
    useTestStore();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      type: "chapterwise",
      subject: "",
      topics: [],
      sub_topics: [],
      difficulty: "easy",
      total_time: 0,
      correct_marks: 5,
      wrong_marks: -1,
      unattempt_marks: 0,
      total_questions: 0,
      total_marks: 0,
    },
  });

  const selectedType = watch("type");
  const selectedSubject = watch("subject");
  const selectedTopics = watch("topics");

  const { subjects, isLoading: loadingSubjects } = useSubjects();
  const { topics, isLoading: loadingTopics } = useTopics(selectedSubject);
  const { subTopics, isLoading: loadingSubTopics } =
    useSubTopics(selectedTopics);

  // Clear topics and sub_topics when subject changes
  useEffect(() => {
    setValue("topics", []);
    setValue("sub_topics", []);
  }, [selectedSubject, setValue]);

  // Clear sub_topics when topics change
  useEffect(() => {
    setValue("sub_topics", []);
  }, [selectedTopics, setValue]);

  // Reset sidebar collapse on mount (fresh create page)
  useEffect(() => {
    setSidebarCollapsed(false);
    setStep("create");
  }, [setSidebarCollapsed, setStep]);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await createTest({
        ...values,
        total_time: Number(values.total_time),
        total_marks: Number(values.total_marks),
        total_questions: Number(values.total_questions),
        correct_marks: Number(values.correct_marks),
        wrong_marks: Number(values.wrong_marks),
        unattempt_marks: Number(values.unattempt_marks),
        status: "draft",
      });
      if (res.status === "success" && res.data) {
        setTestId(res.data.id);
        setTestData(res.data);
        setStep("questions");
        setSidebarCollapsed(true);
        navigate(`/creation/${res.data.id}/questions`);
      } else {
        setError(res.message ?? "Failed to create test");
      }
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Failed to create test. Please try again."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <Breadcrumbs
        items={["Test Creation", "Create Test", formatTestType(selectedType)]}
        className="px-8 pt-6"
      />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1">
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 pt-6 pb-4">
          {/* Test Type Tabs */}
          <TestTypeTabs />

          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              <AlertCircle className="size-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form grid */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-6">
            {/* Subject */}
            <div className="flex flex-col gap-1.5">
              <Label variant="default">Subject</Label>
              <div className="relative">
                <select
                  {...register("subject", { required: "Subject is required" })}
                  disabled={loadingSubjects}
                  className={cn(
                    "w-full h-11 rounded-lg border bg-white px-4 pr-10 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
                    errors.subject ? "border-red-400" : "border-slate-300",
                  )}
                >
                  <option value="">Choose from Drop-down</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
              {errors.subject && (
                <p className="text-xs text-red-500">{errors.subject.message}</p>
              )}
            </div>

            {/* Name of Test */}
            <div className="flex flex-col gap-1.5">
              <Label variant="default">Name of Test</Label>
              <Input
                {...register("name", { required: "Test name is required" })}
                placeholder="Enter name of Test"
                error={!!errors.name}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Topic */}
            <div className="flex flex-col gap-1.5">
              <Label variant="default">Topic</Label>
              <Controller
                name="topics"
                control={control}
                rules={{
                  validate: (v) => v.length > 0 || "Select at least one topic",
                }}
                render={({ field }) => (
                  <div className="relative">
                    <select
                      disabled={loadingTopics || topics.length === 0}
                      value=""
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val && !field.value.includes(val)) {
                          field.onChange([...field.value, val]);
                        }
                      }}
                      className={cn(
                        "w-full h-11 rounded-lg border bg-white px-4 pr-10 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
                        errors.topics ? "border-red-400" : "border-slate-300",
                      )}
                    >
                      <option value="">
                        {loadingTopics
                          ? "Loading..."
                          : topics.length === 0
                            ? "Select subject first"
                            : "Choose from Drop-down"}
                      </option>
                      {topics
                        .filter((t) => !field.value.includes(t.id))
                        .map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                )}
              />
              {/* Selected topic chips */}
              {selectedTopics.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedTopics.map((tid) => {
                    const t = topics.find((x) => x.id === tid);
                    return (
                      <span
                        key={tid}
                        className="inline-flex items-center gap-1 rounded-md bg-[#f4f8ff] px-2 py-1 text-xs font-medium text-primary"
                      >
                        {t?.name ?? tid}
                        <Button
                          type="button"
                          onClick={() =>
                            setValue(
                              "topics",
                              selectedTopics.filter((x) => x !== tid),
                            )
                          }
                          className="ml-0.5 text-primary/60 hover:text-primary bg-transparent border-none shadow-none h-auto w-auto min-w-0 p-0 font-normal cursor-pointer"
                        >
                          ×
                        </Button>
                      </span>
                    );
                  })}
                </div>
              )}
              {errors.topics && (
                <p className="text-xs text-red-500">{errors.topics.message}</p>
              )}
            </div>

            {/* Sub Topic */}
            <div className="flex flex-col gap-1.5">
              <Label variant="default">Sub Topic</Label>
              <Controller
                name="sub_topics"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <select
                      disabled={loadingSubTopics || subTopics.length === 0}
                      value=""
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val && !field.value.includes(val)) {
                          field.onChange([...field.value, val]);
                        }
                      }}
                      className="w-full h-11 rounded-lg border border-slate-300 bg-white px-4 pr-10 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    >
                      <option value="">
                        {loadingSubTopics
                          ? "Loading..."
                          : subTopics.length === 0
                            ? "Select topic first"
                            : "Choose from Drop-down"}
                      </option>
                      {subTopics
                        .filter((st) => !field.value.includes(st.id))
                        .map((st) => (
                          <option key={st.id} value={st.id}>
                            {st.name}
                          </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                )}
              />
              {/* Selected sub-topic chips */}
              {watch("sub_topics").length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {watch("sub_topics").map((stId) => {
                    const st = subTopics.find((x) => x.id === stId);
                    return (
                      <span
                        key={stId}
                        className="inline-flex items-center gap-1 rounded-md bg-[#f4f8ff] px-2 py-1 text-xs font-medium text-primary"
                      >
                        {st?.name ?? stId}
                        <Button
                          type="button"
                          onClick={() =>
                            setValue(
                              "sub_topics",
                              watch("sub_topics").filter((x) => x !== stId),
                            )
                          }
                          className="ml-0.5 text-primary/60 hover:text-primary bg-transparent border-none shadow-none h-auto w-auto min-w-0 p-0 font-normal cursor-pointer"
                        >
                          ×
                        </Button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Duration (Minutes) */}
            <div className="flex flex-col gap-1.5">
              <Label variant="default">Duration (Minutes)</Label>
              <Input
                type="number"
                {...register("total_time", {
                  required: "Duration is required",
                  min: { value: 1, message: "Must be at least 1" },
                })}
                placeholder="Enter the time"
                error={!!errors.total_time}
              />
              {errors.total_time && (
                <p className="text-xs text-red-500">
                  {errors.total_time.message}
                </p>
              )}
            </div>

            {/* Test Difficulty Level */}
            <div className="flex flex-col gap-1.5">
              <Label variant="default">Test Difficulty Level</Label>
              <div className="flex items-center gap-6 h-11">
                {(["easy", "medium", "hard"] as TestDifficulty[]).map((d) => (
                  <Label key={d} variant="inline">
                    <Radio value={d} {...register("difficulty")} />
                    <span className="text-sm text-slate-600 capitalize">
                      {d === "hard"
                        ? "Difficult"
                        : d.charAt(0).toUpperCase() + d.slice(1)}
                    </span>
                  </Label>
                ))}
              </div>
            </div>
          </div>

          {/* Marking Scheme */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">
              Marking Scheme:
            </h3>
            <div className="grid grid-cols-5 gap-6">
              {/* Wrong Answer */}
              <div className="flex flex-col gap-1.5">
                <Label variant="muted">Wrong Answer</Label>
                <Input type="number" {...register("wrong_marks")} />
              </div>

              {/* Unattempted */}
              <div className="flex flex-col gap-1.5">
                <Label variant="muted">Unattempted</Label>
                <Input type="number" {...register("unattempt_marks")} />
              </div>

              {/* Correct Answer */}
              <div className="flex flex-col gap-1.5">
                <Label variant="muted">Correct Answer</Label>
                <Input type="number" {...register("correct_marks")} />
              </div>

              {/* No of Questions */}
              <div className="flex flex-col gap-1.5">
                <Label variant="muted">No of Questions</Label>
                <Input
                  type="number"
                  {...register("total_questions", {
                    required: "Required",
                    min: { value: 1, message: "At least 1" },
                  })}
                  placeholder="Ex.250 Marks"
                  error={!!errors.total_questions}
                />
              </div>

              {/* Total Marks */}
              <div className="flex flex-col gap-1.5">
                <Label variant="muted">Total Marks</Label>
                <Input
                  type="number"
                  {...register("total_marks", {
                    required: "Required",
                    min: { value: 1, message: "At least 1" },
                  })}
                  placeholder="Ex.250 Marks"
                  error={!!errors.total_marks}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="flex items-center justify-end gap-4 border-t border-slate-200 bg-white px-8 py-4">
          <Button
            type="button"
            onClick={() => navigate("/")}
            className="px-6 w-40 py-2.5 rounded-lg bg-[#f4f8ff] text-base font-medium text-primary-accent hover:bg-[#ebf2ff] border-none shadow-none h-auto cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="flex w-40 items-center gap-2 rounded-lg bg-[#5988ef] hover:bg-[#5988ef]/90 px-8 py-2.5 text-base font-medium text-white shadow-sm transition-opacity disabled:opacity-60 border-none h-auto cursor-pointer"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Next
          </Button>
        </div>
      </form>
    </div>
  );
}
