export interface Subject {
  id: string;
  name: string;
}

export interface Topic {
  id: string;
  name: string;
  subject_id: string;
}

export interface SubTopic {
  id: string;
  name: string;
  topic_id: string;
}

export type TestStatus = "draft" | "live" | string;
export type TestType = "chapterwise" | "mock" | "pyq" | string;
export type TestDifficulty = "easy" | "medium" | "hard" | string;

export interface Test {
  id: string;
  name: string;
  type: TestType;
  subject: string;
  topics: string[];
  sub_topics: string[];
  questions: string[] | null;
  status: TestStatus;
  difficulty: TestDifficulty;
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  total_marks: number;
  total_time: number;
  total_questions: number;
  created_at: string;
  updated_at?: string | null;
  created_by?: number;
}

export interface CreateTestPayload {
  name: string;
  type: TestType;
  subject: string;
  topics: string[];
  sub_topics: string[];
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  difficulty: TestDifficulty;
  total_time: number;
  total_marks: number;
  total_questions: number;
  status?: string | null;
}

export interface UpdateTestPayload {
  name?: string;
  type?: TestType;
  subject?: string;
  topics?: string[];
  sub_topics?: string[];
  correct_marks?: number;
  wrong_marks?: number;
  unattempt_marks?: number;
  difficulty?: TestDifficulty;
  total_time?: number;
  total_marks?: number;
  total_questions?: number;
  questions?: string[];
  status?: string;
}

export interface Question {
  id: string;
  type: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: string;
  explanation: string | null;
  difficulty: string | null;
  paragraph: string | null;
  media_url: string | null;
  test_id: string;
  subject: string | null;
  topic: string | null;
  sub_topic: string | null;
  created_by?: number;
  created_at?: string;
  updated_by?: number | null;
  updated_at?: string | null;
}

export interface CreateQuestionPayload {
  type: "mcq";
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: string;
  explanation?: string;
  difficulty?: string;
  test_id: string;
  subject: string;
  topic?: string;
  sub_topic?: string;
  media_url?: string;
}
