import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type {
  Test,
  Subject,
  Topic,
  SubTopic,
  Question,
  CreateTestPayload,
  UpdateTestPayload,
  CreateQuestionPayload,
} from "@/types/test";

/* ───── Subjects ───── */
export async function fetchSubjects() {
  const response = await api.get<ApiResponse<Subject[]>>("/subjects");
  return response.data;
}

/* ───── Topics ───── */
export async function fetchTopicsBySubject(subjectId: string) {
  const response = await api.get<ApiResponse<Topic[]>>(
    `/topics/subject/${subjectId}`,
  );
  return response.data;
}

/* ───── Sub-topics ───── */
export async function fetchSubTopicsByTopic(topicId: string) {
  const response = await api.get<ApiResponse<SubTopic[]>>(
    `/sub-topics/topic/${topicId}`,
  );
  return response.data;
}

export async function fetchSubTopicsByMultiTopics(topicIds: string[]) {
  const response = await api.post<ApiResponse<SubTopic[]>>(
    "/sub-topics/multi-topics",
    { topicIds },
  );
  return response.data;
}

/* ───── Tests ───── */
export async function fetchAllTests() {
  const response = await api.get<ApiResponse<Test[]>>("/tests");
  return response.data;
}

export async function fetchTestById(id: string) {
  const response = await api.get<ApiResponse<Test>>(`/tests/${id}`);
  return response.data;
}

export async function createTest(payload: CreateTestPayload) {
  const response = await api.post<ApiResponse<Test>>("/tests", payload);
  return response.data;
}

export async function updateTest(id: string, payload: UpdateTestPayload) {
  const response = await api.put<ApiResponse<Test>>(`/tests/${id}`, payload);
  return response.data;
}

export async function deleteTest(id: string) {
  const response = await api.delete<ApiResponse<null>>(`/tests/${id}`);
  return response.data;
}

/* ───── Questions ───── */
export async function bulkCreateQuestions(questions: CreateQuestionPayload[]) {
  const response = await api.post<ApiResponse<Question[]>>("/questions/bulk", {
    questions,
  });
  return response.data;
}

export async function fetchBulkQuestions(questionIds: string[]) {
  const response = await api.post<ApiResponse<Question[]>>(
    "/questions/fetchBulk",
    { question_ids: questionIds },
  );
  return response.data;
}
