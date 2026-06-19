import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { createTest } from "@/api/test";
import { useTestStore } from "@/stores/test-store";
import { getApiErrorMessage } from "@/lib/api";
import { Loader2, AlertCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { formatTestType } from "@/lib/test-utils";
import { Button } from "@/components/ui";
import {
  TestFormFields,
  type FormValues,
} from "@/components/creation/test-form-fields";

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
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              <AlertCircle className="size-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <TestFormFields
            control={control}
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
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
