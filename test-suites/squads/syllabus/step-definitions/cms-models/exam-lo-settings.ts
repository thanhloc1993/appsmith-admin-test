export interface ExamLOSettings {
    manualGrading: 'on' | 'off';
    gradeToPass?: string;
    totalQuestions: number;
}

export enum ShowingAnswerKey {
    Immediately = 'immediately',
    AfterDueDate = 'after due date',
}

export enum ManualGrading {
    On = 'on',
    Off = 'off',
}

export interface ExamLODetail {
    name?: string;
    instruction?: string;
    manualGrading?: ManualGrading;
    gradeToPass?: number;
    timeLimit?: number;
    showingAnswerKey?: ShowingAnswerKey;
}

export type ExamLOUpsertField = 'name' | 'instruction';
