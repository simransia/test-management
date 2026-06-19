import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { fetchTestById, updateTest, fetchSubjects } from "@/api/test";
import { getApiErrorMessage } from "@/lib/api";
import type { TestType, TestDifficulty } from "@/types/test";
import { Loader2, AlertCircle, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui";
import { TestFormFields, type FormValues } from "./test-form-fields";

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
  const [loading, setLoading] = useState(true);
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

          const subjectsList = subjectsRes.data || [];
          const subjectObj = subjectsList.find(
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
            <div className="flex items-center justify-between px-8 py-5 shrink-0">
              <h2 className="text-base font-medium text-black/60">
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
              <div className="flex-1 overflow-y-auto px-5">
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

              <div className="flex items-center justify-end gap-4 border-t border-slate-100 bg-white px-8 py-5 shrink-0">
                <Button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-lg bg-[#f4f8ff] text-base font-medium text-primary-accent hover:bg-[#ebf2ff] h-auto border-none shadow-none cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-lg bg-primary hover:bg-primary/90 px-10 py-2.5 text-base font-medium text-white shadow-sm disabled:opacity-60 border-none h-auto cursor-pointer"
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
