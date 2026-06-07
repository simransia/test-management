import { useState, useEffect, useCallback } from "react";
import { fetchAllTests, fetchTestById, deleteTest } from "@/api/test";
import type { Test } from "@/types/test";
import { getApiErrorMessage } from "@/lib/api";

export function useTests() {
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const testsRes = await fetchAllTests();
      if (testsRes.status === "success" || testsRes.success) {
        setTests(testsRes.data ?? []);
      } else {
        setError(testsRes.message ?? "Failed to load tests.");
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "An error occurred while loading tests."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const removeTestFromState = useCallback((id: string) => {
    setTests((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { tests, isLoading, error, reloadTests: loadData, removeTestFromState };
}

export function useTest(testId: string | undefined | null) {
  const [testData, setTestData] = useState<Test | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTest = useCallback(async () => {
    if (!testId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchTestById(testId);
      if (res.status === "success" || res.success) {
        setTestData(res.data);
      } else {
        setError(res.message ?? "Failed to load test details.");
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "An error occurred while loading the test."));
    } finally {
      setIsLoading(false);
    }
  }, [testId]);

  useEffect(() => {
    loadTest();
  }, [loadTest]);

  return { testData, isLoading, error, setTestData, reloadTest: loadTest };
}

export function useDeleteTest() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const performDelete = async (testId: string) => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await deleteTest(testId);
      if (res.status === "success" || res.success) {
        return true;
      } else {
        setDeleteError(res.message ?? "Failed to delete test.");
        return false;
      }
    } catch (err) {
      setDeleteError(getApiErrorMessage(err, "Failed to delete the test. Please try again."));
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleting, deleteError, performDelete, setDeleteError };
}
