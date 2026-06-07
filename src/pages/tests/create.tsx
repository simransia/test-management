import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import {
  fetchSubjects,
  fetchTopicsBySubject,
  fetchSubTopicsByMultiTopics,
  createTest,
} from "@/api/test";
import { useTestStore } from "@/stores/test-store";
import { getApiErrorMessage } from "@/lib/api";
import type { Subject, Topic, SubTopic, TestType, TestDifficulty } from "@/types/test";
import { Loader2, AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Tab types ── */
const TEST_TYPES: { label: string; value: TestType }[] = [
  { label: "Chapter Wise", value: "chapterwise" },
  { label: "PYQ", value: "pyq" },
  { label: "Mock Test", value: "mock" },
];

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

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [loadingSubTopics, setLoadingSubTopics] = useState(false);
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

  // Reset sidebar collapse on mount (fresh create page)
  useEffect(() => {
    setSidebarCollapsed(false);
    setStep("create");
  }, [setSidebarCollapsed, setStep]);

  // Load subjects
  useEffect(() => {
    async function load() {
      try {
        const res = await fetchSubjects();
        setSubjects(res.data ?? []);
      } catch {
        setError("Failed to load subjects");
      } finally {
        setLoadingSubjects(false);
      }
    }
    load();
  }, []);

  // Load topics when subject changes
  useEffect(() => {
    if (!selectedSubject) {
      setTopics([]);
      setSubTopics([]);
      return;
    }
    setLoadingTopics(true);
    setValue("topics", []);
    setValue("sub_topics", []);
    fetchTopicsBySubject(selectedSubject)
      .then((res) => setTopics(res.data ?? []))
      .catch(() => setTopics([]))
      .finally(() => setLoadingTopics(false));
  }, [selectedSubject, setValue]);

  // Load sub-topics when topics change
  useEffect(() => {
    if (!selectedTopics || selectedTopics.length === 0) {
      setSubTopics([]);
      return;
    }
    setLoadingSubTopics(true);
    setValue("sub_topics", []);
    fetchSubTopicsByMultiTopics(selectedTopics)
      .then((res) => setSubTopics(res.data ?? []))
      .catch(() => setSubTopics([]))
      .finally(() => setLoadingSubTopics(false));
  }, [selectedTopics, setValue]);

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
        navigate(`/tests/${res.data.id}/questions`);
      } else {
        setError(res.message ?? "Failed to create test");
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to create test. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1">
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 pt-6 pb-4">
          {/* Test Type Tabs */}
          <div className="flex items-center gap-1 border border-slate-100 rounded-xl p-1 w-fit mb-8 bg-white shadow-sm">
            {TEST_TYPES.map((tt) => (
              <button
                key={tt.value}
                type="button"
                onClick={() => setValue("type", tt.value)}
                className={cn(
                  "px-6 py-2 text-sm font-semibold transition-colors rounded-lg",
                  selectedType === tt.value
                    ? "bg-[#f4f8ff] text-[#1b5def]"
                    : "text-slate-400 hover:text-slate-600",
                )}
              >
                {tt.label}
              </button>
            ))}
          </div>

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
              <label className="text-sm font-semibold text-slate-700">Subject</label>
              <div className="relative">
                <select
                  {...register("subject", { required: "Subject is required" })}
                  disabled={loadingSubjects}
                  className={cn(
                    "w-full h-11 rounded-lg border bg-white px-4 pr-10 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#1b5def]/30 focus:border-[#1b5def]",
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
              <label className="text-sm font-semibold text-slate-700">Name of Test</label>
              <input
                {...register("name", { required: "Test name is required" })}
                placeholder="Enter name of Test"
                className={cn(
                  "w-full h-11 rounded-lg border bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5def]/30 focus:border-[#1b5def]",
                  errors.name ? "border-red-400" : "border-slate-300",
                )}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Topic */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Topic</label>
              <Controller
                name="topics"
                control={control}
                rules={{ validate: (v) => v.length > 0 || "Select at least one topic" }}
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
                        "w-full h-11 rounded-lg border bg-white px-4 pr-10 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#1b5def]/30 focus:border-[#1b5def]",
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
                        className="inline-flex items-center gap-1 rounded-md bg-[#f4f8ff] px-2 py-1 text-xs font-medium text-[#1b5def]"
                      >
                        {t?.name ?? tid}
                        <button
                          type="button"
                          onClick={() =>
                            setValue(
                              "topics",
                              selectedTopics.filter((x) => x !== tid),
                            )
                          }
                          className="ml-0.5 text-[#1b5def]/60 hover:text-[#1b5def]"
                        >
                          ×
                        </button>
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
              <label className="text-sm font-semibold text-slate-700">Sub Topic</label>
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
                      className="w-full h-11 rounded-lg border border-slate-300 bg-white px-4 pr-10 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#1b5def]/30 focus:border-[#1b5def]"
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
                        className="inline-flex items-center gap-1 rounded-md bg-[#f4f8ff] px-2 py-1 text-xs font-medium text-[#1b5def]"
                      >
                        {st?.name ?? stId}
                        <button
                          type="button"
                          onClick={() =>
                            setValue(
                              "sub_topics",
                              watch("sub_topics").filter((x) => x !== stId),
                            )
                          }
                          className="ml-0.5 text-[#1b5def]/60 hover:text-[#1b5def]"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Duration (Minutes) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Duration (Minutes)</label>
              <input
                type="number"
                {...register("total_time", {
                  required: "Duration is required",
                  min: { value: 1, message: "Must be at least 1" },
                })}
                placeholder="Enter the time"
                className={cn(
                  "w-full h-11 rounded-lg border bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5def]/30 focus:border-[#1b5def]",
                  errors.total_time ? "border-red-400" : "border-slate-300",
                )}
              />
              {errors.total_time && (
                <p className="text-xs text-red-500">{errors.total_time.message}</p>
              )}
            </div>

            {/* Test Difficulty Level */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Test Difficulty Level</label>
              <div className="flex items-center gap-6 h-11">
                {(["easy", "medium", "hard"] as TestDifficulty[]).map((d) => (
                  <label key={d} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value={d}
                      {...register("difficulty")}
                      className="h-4 w-4 text-[#1b5def] accent-[#1b5def]"
                    />
                    <span className="text-sm text-slate-600 capitalize">
                      {d === "hard" ? "Difficult" : d.charAt(0).toUpperCase() + d.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Marking Scheme */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Marking Scheme:</h3>
            <div className="grid grid-cols-5 gap-6">
              {/* Wrong Answer */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-500">Wrong Answer</label>
                <input
                  type="number"
                  {...register("wrong_marks")}
                  className="w-full h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5def]/30 focus:border-[#1b5def]"
                />
              </div>

              {/* Unattempted */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-500">Unattempted</label>
                <input
                  type="number"
                  {...register("unattempt_marks")}
                  className="w-full h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5def]/30 focus:border-[#1b5def]"
                />
              </div>

              {/* Correct Answer */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-500">Correct Answer</label>
                <input
                  type="number"
                  {...register("correct_marks")}
                  className="w-full h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5def]/30 focus:border-[#1b5def]"
                />
              </div>

              {/* No of Questions */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-500">No of Questions</label>
                <input
                  type="number"
                  {...register("total_questions", {
                    required: "Required",
                    min: { value: 1, message: "At least 1" },
                  })}
                  placeholder="Ex.250 Marks"
                  className={cn(
                    "w-full h-11 rounded-lg border bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5def]/30 focus:border-[#1b5def]",
                    errors.total_questions ? "border-red-400" : "border-slate-300",
                  )}
                />
              </div>

              {/* Total Marks */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-500">Total Marks</label>
                <input
                  type="number"
                  {...register("total_marks", {
                    required: "Required",
                    min: { value: 1, message: "At least 1" },
                  })}
                  placeholder="Ex.250 Marks"
                  className={cn(
                    "w-full h-11 rounded-lg border bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5def]/30 focus:border-[#1b5def]",
                    errors.total_marks ? "border-red-400" : "border-slate-300",
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="flex items-center justify-end gap-4 border-t border-slate-200 bg-white px-8 py-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-6 py-2.5 rounded-lg bg-[#f4f8ff] text-sm font-bold text-[#1b5def] hover:bg-[#ebf2ff]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 rounded-lg bg-[#5988ef] px-8 py-2.5 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Next
          </button>
        </div>
      </form>
    </div>
  );
}
