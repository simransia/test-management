import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  fetchTestById,
  updateTest,
  fetchSubjects,
  fetchTopicsBySubject,
  fetchSubTopicsByMultiTopics,
} from "@/api/test";
import { getApiErrorMessage } from "@/lib/api";
import type {
  Subject,
  Topic,
  SubTopic,
  TestType,
  TestDifficulty,
} from "@/types/test";
import { Loader2, AlertCircle, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input, Label, Radio, Button } from "@/components/ui";

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

interface EditTestModalProps {
  testId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditTestModal({
  testId,
  isOpen,
  onClose,
  onSuccess,
}: EditTestModalProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);
  const [loading, setLoading] = useState(true);
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
    reset,
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

  useEffect(() => {
    if (!isOpen || !testId) return;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [testRes, subjectsRes] = await Promise.all([
          fetchTestById(testId),
          fetchSubjects(),
        ]);

        if (subjectsRes.data) setSubjects(subjectsRes.data);

        if (testRes.status === "success" && testRes.data) {
          const t = testRes.data;
          reset({
            name: t.name,
            type: t.type,
            subject: t.subject,
            topics: t.topics || [],
            sub_topics: t.sub_topics || [],
            difficulty: t.difficulty,
            total_time: t.total_time,
            correct_marks: t.correct_marks,
            wrong_marks: t.wrong_marks,
            unattempt_marks: t.unattempt_marks,
            total_questions: t.total_questions,
            total_marks: t.total_marks,
          });

          const subjectObj = subjectsRes.data?.find(
            (s) => s.name === t.subject || s.id === t.subject,
          );
          if (subjectObj) {
            setValue("subject", subjectObj.id);
          }
        }
      } catch (err) {
        setError(getApiErrorMessage(err, "Failed to load test"));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [testId, isOpen, reset, setValue]);

  useEffect(() => {
    if (!selectedSubject || loading) {
      if (!loading) {
        setTopics([]);
        setSubTopics([]);
      }
      return;
    }
    setLoadingTopics(true);
    fetchTopicsBySubject(selectedSubject)
      .then((res) => setTopics(res.data ?? []))
      .catch(() => setTopics([]))
      .finally(() => setLoadingTopics(false));
  }, [selectedSubject, loading]);

  useEffect(() => {
    if (!selectedTopics || selectedTopics.length === 0 || loading) {
      if (!loading) setSubTopics([]);
      return;
    }
    setLoadingSubTopics(true);
    fetchSubTopicsByMultiTopics(selectedTopics)
      .then((res) => setSubTopics(res.data ?? []))
      .catch(() => setSubTopics([]))
      .finally(() => setLoadingSubTopics(false));
  }, [selectedTopics, loading]);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await updateTest(testId, {
        ...values,
        total_time: Number(values.total_time),
        total_marks: Number(values.total_marks),
        total_questions: Number(values.total_questions),
        correct_marks: Number(values.correct_marks),
        wrong_marks: Number(values.wrong_marks),
        unattempt_marks: Number(values.unattempt_marks),
      });
      if (res.status === "success") {
        onSuccess?.();
        onClose();
      } else {
        setError(res.message ?? "Failed to update test");
      }
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Failed to update test. Please try again."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl min-w-[75%] p-0 gap-0 overflow-hidden bg-white rounded-2xl shadow-xl border-none [&>button]:hidden flex flex-col max-h-[95vh]">
        {loading ? (
          <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 shrink-0">
              <h2 className="text-base font-bold text-slate-600">
                Edit Test creation
              </h2>
              <Button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-0 h-auto w-auto min-w-0 bg-transparent border-none shadow-none cursor-pointer"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto px-8 pt-6 pb-4">
                <div className="flex items-center gap-1 border border-slate-100 rounded-xl p-1 w-fit mb-8 bg-white shadow-sm">
                  {TEST_TYPES.map((tt) => (
                    <Button
                      key={tt.value}
                      type="button"
                      onClick={() => setValue("type", tt.value)}
                      className={cn(
                        "px-6 py-2 text-sm font-semibold transition-colors rounded-lg border-none shadow-none h-auto cursor-pointer",
                        selectedType === tt.value
                          ? "bg-[#f4f8ff] text-primary hover:bg-[#f4f8ff]"
                          : "bg-transparent text-slate-400 hover:text-slate-600 hover:bg-transparent",
                      )}
                    >
                      {tt.label}
                    </Button>
                  ))}
                </div>

                {error && (
                  <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    <AlertCircle className="size-5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                  {/* Subject */}
                  <div className="flex flex-col gap-1.5">
                    <Label variant="default">Subject</Label>
                    <div className="relative">
                      <select
                        {...register("subject", {
                          required: "Subject is required",
                        })}
                        disabled={subjects.length === 0}
                        className={cn(
                          "w-full h-11 rounded-lg border bg-white px-4 pr-10 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
                          errors.subject
                            ? "border-red-400"
                            : "border-slate-300",
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
                      <p className="text-xs text-red-500">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  {/* Name of Test */}
                  <div className="flex flex-col gap-1.5">
                    <Label variant="default">Name of Test</Label>
                    <Input
                      {...register("name", {
                        required: "Test name is required",
                      })}
                      placeholder="Enter name of Test"
                      error={!!errors.name}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Topic */}
                  <div className="flex flex-col gap-1.5">
                    <Label variant="default">Topic</Label>
                    <Controller
                      name="topics"
                      control={control}
                      rules={{
                        validate: (v) =>
                          v.length > 0 || "Select at least one topic",
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
                              errors.topics
                                ? "border-red-400"
                                : "border-slate-300",
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
                              .filter(
                                (t) =>
                                  !field.value.includes(t.id) &&
                                  !field.value.includes(t.name),
                              )
                              .map((t) => (
                                <option key={t.id} value={t.name}>
                                  {t.name}
                                </option>
                              ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                      )}
                    />
                    {selectedTopics.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {selectedTopics.map((tid) => {
                          const t = topics.find(
                            (x) => x.id === tid || x.name === tid,
                          );
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
                      <p className="text-xs text-red-500">
                        {errors.topics.message}
                      </p>
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
                            disabled={
                              loadingSubTopics || subTopics.length === 0
                            }
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
                              .filter(
                                (st) =>
                                  !field.value.includes(st.id) &&
                                  !field.value.includes(st.name),
                              )
                              .map((st) => (
                                <option key={st.id} value={st.name}>
                                  {st.name}
                                </option>
                              ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                      )}
                    />
                    {watch("sub_topics").length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {watch("sub_topics").map((stId) => {
                          const st = subTopics.find(
                            (x) => x.id === stId || x.name === stId,
                          );
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
                                    watch("sub_topics").filter(
                                      (x) => x !== stId,
                                    ),
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

                  {/* Duration */}
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

                  {/* Test Difficulty */}
                  <div className="flex flex-col gap-1.5">
                    <Label variant="default">Test Difficulty Level</Label>
                    <div className="flex items-center gap-6 h-11">
                      {(["easy", "medium", "hard"] as TestDifficulty[]).map(
                        (d) => (
                          <Label
                            key={d}
                            variant="inline"
                          >
                            <Radio
                              value={d}
                              {...register("difficulty")}
                            />
                            <span className="text-sm text-slate-600 capitalize">
                              {d === "hard"
                                ? "Difficult"
                                : d.charAt(0).toUpperCase() + d.slice(1)}
                            </span>
                          </Label>
                        ),
                      )}
                    </div>
                  </div>
                </div>

                {/* Marking Scheme */}
                <div className="mt-8">
                  <h3 className="text-sm font-semibold text-slate-700 mb-4">
                    Marking Scheme:
                  </h3>
                  <div className="grid grid-cols-5 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <Label variant="muted">Wrong Answer</Label>
                      <Input
                        type="number"
                        {...register("wrong_marks")}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label variant="muted">Unattempted</Label>
                      <Input
                        type="number"
                        {...register("unattempt_marks")}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label variant="muted">Correct Answer</Label>
                      <Input
                        type="number"
                        {...register("correct_marks")}
                      />
                    </div>
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

              <div className="flex items-center justify-end gap-4 border-t border-slate-100 bg-white px-8 py-5 shrink-0">
                <Button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-lg bg-[#f4f8ff] text-sm font-bold text-primary hover:bg-[#ebf2ff] h-auto border-none shadow-none cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-lg bg-primary hover:bg-primary/90 px-10 py-2.5 text-sm font-bold text-white shadow-sm disabled:opacity-60 border-none h-auto cursor-pointer"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
