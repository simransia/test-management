import { useState, useEffect, useCallback } from "react";
import { fetchBulkQuestions } from "@/api/test";
import type { Question } from "@/types/test";
import { getApiErrorMessage } from "@/lib/api";

export function useQuestions(questionIds: string[] | undefined | null) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuestions = useCallback(async () => {
    if (!questionIds || questionIds.length === 0) {
      setQuestions([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchBulkQuestions(questionIds);
      if (res.status === "success" || res.success) {
        setQuestions(res.data ?? []);
      } else {
        setError(res.message ?? "Failed to load questions.");
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "An error occurred while loading questions."));
    } finally {
      setIsLoading(false);
    }
  }, [questionIds]);

  const serializedIds = questionIds?.join(",") ?? "";

  useEffect(() => {
    loadQuestions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedIds, loadQuestions]);

  return { questions, isLoading, error, reloadQuestions: loadQuestions, setQuestions };
}
