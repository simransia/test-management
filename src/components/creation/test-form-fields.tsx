import { useEffect } from "react";
import {
  Control,
  Controller,
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import type { TestDifficulty, TestType } from "@/types/test";
import {
  useSubjects,
  useTopics,
  useSubTopics,
} from "@/hooks/use-test-metadata";
import TestTypeTabs from "@/components/creation/test-type";
import { cn } from "@/lib/utils";
import {
  Input,
  Label,
  Radio,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Chip,
} from "@/components/ui";

export interface FormValues {
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

interface TestFormFieldsProps {
  control: Control<FormValues>;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  watch: UseFormWatch<FormValues>;
  setValue: UseFormSetValue<FormValues>;
}

export function TestFormFields({
  control,
  register,
  errors,
  watch,
  setValue,
}: TestFormFieldsProps) {
  const selectedSubject = watch("subject");
  const selectedTopics = watch("topics");

  const { subjects, isLoading: loadingSubjects } = useSubjects();
  const { topics, isLoading: loadingTopics } = useTopics(selectedSubject);
  const { subTopics, isLoading: loadingSubTopics } =
    useSubTopics(selectedTopics);

  return (
    <>
      {/* Test Type Tabs */}
      <TestTypeTabs />

      {/* Form grid */}
      <div className="grid grid-cols-2 gap-x-10 gap-y-6">
        {/* Subject */}
        <div className="flex flex-col gap-1.5">
          <Label variant="default">Subject</Label>
          <Controller
            name="subject"
            control={control}
            rules={{ required: "Subject is required" }}
            render={({ field }) => (
              <Select
                disabled={loadingSubjects || subjects.length === 0}
                value={field.value}
                onValueChange={(val) => {
                  field.onChange(val);
                  // Clear dependent topics and sub-topics when subject changes
                  setValue("topics", []);
                  setValue("sub_topics", []);
                }}
              >
                <SelectTrigger error={!!errors.subject}>
                  <SelectValue placeholder="Choose from Drop-down" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
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
              <Select
                disabled={loadingTopics || topics.length === 0}
                value=""
                onValueChange={(val) => {
                  if (val && !field.value.includes(val)) {
                    field.onChange([...field.value, val]);
                    // Clear sub-topics when topic list changes to keep it clean
                    setValue("sub_topics", []);
                  }
                }}
              >
                <SelectTrigger error={!!errors.topics}>
                  <SelectValue
                    placeholder={
                      loadingTopics
                        ? "Loading..."
                        : topics.length === 0
                          ? "Select subject first"
                          : "Choose from Drop-down"
                    }
                  />
                </SelectTrigger>
                <SelectContent position="popper">
                  {topics
                    .filter(
                      (t) =>
                        !field.value.includes(t.id) &&
                        !field.value.includes(t.name),
                    )
                    .map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          />
          {/* Selected topic chips */}
          {selectedTopics.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {selectedTopics.map((tid) => {
                const t = topics.find((x) => x.id === tid || x.name === tid);
                return (
                  <Chip
                    key={tid}
                    label={t?.name ?? tid}
                    variant="topic"
                    onRemove={() => {
                      const updated = selectedTopics.filter((x) => x !== tid);
                      setValue("topics", updated);
                      setValue("sub_topics", []);
                    }}
                  />
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
              <Select
                disabled={
                  loadingSubTopics ||
                  (selectedTopics || []).length === 0 ||
                  subTopics.length === 0
                }
                value=""
                onValueChange={(val) => {
                  if (val && !field.value.includes(val)) {
                    field.onChange([...field.value, val]);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingSubTopics
                        ? "Loading..."
                        : (selectedTopics || []).length === 0
                          ? "Select topic first"
                          : subTopics.length === 0
                            ? "No sub-topics available"
                            : "Choose from Drop-down"
                    }
                  />
                </SelectTrigger>
                <SelectContent position="popper">
                  {subTopics
                    .filter(
                      (st) =>
                        !field.value.includes(st.id) &&
                        !field.value.includes(st.name),
                    )
                    .map((st) => (
                      <SelectItem key={st.id} value={st.id}>
                        {st.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          />
          {/* Selected sub-topic chips */}
          {watch("sub_topics").length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {watch("sub_topics").map((stId) => {
                const st = subTopics.find(
                  (x) => x.id === stId || x.name === stId,
                );
                return (
                  <Chip
                    key={stId}
                    label={st?.name ?? stId}
                    variant="subtopic"
                    onRemove={() =>
                      setValue(
                        "sub_topics",
                        watch("sub_topics").filter((x) => x !== stId),
                      )
                    }
                  />
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
            <p className="text-xs text-red-500">{errors.total_time.message}</p>
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
    </>
  );
}
