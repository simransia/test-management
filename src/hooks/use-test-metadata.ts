import { useState, useEffect, useCallback } from "react";
import { fetchSubjects, fetchTopicsBySubject, fetchSubTopicsByMultiTopics } from "@/api/test";
import type { Subject, Topic, SubTopic } from "@/types/test";
import { getApiErrorMessage } from "@/lib/api";

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSubjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchSubjects();
      setSubjects(res.data ?? []);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load subjects."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  return { subjects, isLoading, error, reloadSubjects: loadSubjects };
}

export function useTopics(subjectId: string | undefined | null) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTopics = useCallback(async () => {
    if (!subjectId) {
      setTopics([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchTopicsBySubject(subjectId);
      setTopics(res.data ?? []);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load topics."));
    } finally {
      setIsLoading(false);
    }
  }, [subjectId]);

  useEffect(() => {
    loadTopics();
  }, [loadTopics]);

  return { topics, isLoading, error, reloadTopics: loadTopics };
}

export function useSubTopics(topicIds: string[] | undefined | null) {
  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSubTopics = useCallback(async () => {
    if (!topicIds || topicIds.length === 0) {
      setSubTopics([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchSubTopicsByMultiTopics(topicIds);
      setSubTopics(res.data ?? []);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load sub-topics."));
    } finally {
      setIsLoading(false);
    }
  }, [topicIds]);

  // Deep comparison of topicIds would be better, but for simplicity, we serialize it
  const serializedIds = topicIds?.join(",") ?? "";
  
  useEffect(() => {
    loadSubTopics();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedIds, loadSubTopics]);

  return { subTopics, isLoading, error, reloadSubTopics: loadSubTopics };
}
