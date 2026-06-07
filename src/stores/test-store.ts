import { create } from "zustand";
import type {
  Test,
  Question,
  CreateQuestionPayload,
} from "@/types/test";

export type WizardStep = "create" | "questions" | "publish";

/** A local question being edited before saving to server */
export interface LocalQuestion {
  localId: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: string;
  explanation: string;
  difficulty: string;
  topic: string;
  sub_topic: string;
  media_url: string;
  /** Set after bulk-create succeeds */
  serverId?: string;
}

interface TestCreationState {
  /* ── wizard navigation ── */
  step: WizardStep;
  setStep: (step: WizardStep) => void;

  /* ── sidebar collapse (for questions/publish pages) ── */
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;

  /* ── test data ── */
  testId: string | null;
  testData: Test | null;
  setTestId: (id: string) => void;
  setTestData: (data: Test) => void;

  /* ── questions ── */
  localQuestions: LocalQuestion[];
  savedQuestions: Question[];
  activeQuestionIndex: number;
  setActiveQuestionIndex: (idx: number) => void;
  addLocalQuestion: () => void;
  updateLocalQuestion: (localId: string, data: Partial<LocalQuestion>) => void;
  removeLocalQuestion: (localId: string) => void;
  setSavedQuestions: (questions: Question[]) => void;
  setLocalQuestions: (questions: LocalQuestion[]) => void;

  /* ── reset ── */
  reset: () => void;
}

let nextId = 1;
function makeLocalId() {
  return `local-q-${nextId++}`;
}

function createEmptyQuestion(): LocalQuestion {
  return {
    localId: makeLocalId(),
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correct_option: "option1",
    explanation: "",
    difficulty: "easy",
    topic: "",
    sub_topic: "",
    media_url: "",
  };
}

const initialState = {
  step: "create" as WizardStep,
  sidebarCollapsed: false,
  testId: null as string | null,
  testData: null as Test | null,
  localQuestions: [createEmptyQuestion()],
  savedQuestions: [] as Question[],
  activeQuestionIndex: 0,
};

export const useTestStore = create<TestCreationState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

  setTestId: (id) => set({ testId: id }),
  setTestData: (data) => set({ testData: data }),

  setActiveQuestionIndex: (idx) => set({ activeQuestionIndex: idx }),

  addLocalQuestion: () =>
    set((state) => ({
      localQuestions: [...state.localQuestions, createEmptyQuestion()],
      activeQuestionIndex: state.localQuestions.length,
    })),

  updateLocalQuestion: (localId, data) =>
    set((state) => ({
      localQuestions: state.localQuestions.map((q) =>
        q.localId === localId ? { ...q, ...data } : q,
      ),
    })),

  removeLocalQuestion: (localId) =>
    set((state) => {
      const filtered = state.localQuestions.filter(
        (q) => q.localId !== localId,
      );
      return {
        localQuestions:
          filtered.length === 0 ? [createEmptyQuestion()] : filtered,
        activeQuestionIndex: Math.min(
          state.activeQuestionIndex,
          Math.max(0, filtered.length - 1),
        ),
      };
    }),

  setSavedQuestions: (questions) => set({ savedQuestions: questions }),
  setLocalQuestions: (questions) => set({ localQuestions: questions }),

  reset: () => {
    nextId = 1;
    set({ ...initialState, localQuestions: [createEmptyQuestion()] });
  },
}));
