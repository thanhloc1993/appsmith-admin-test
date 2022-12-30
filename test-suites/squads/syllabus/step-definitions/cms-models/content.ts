import { AwaitedReturn } from '@supports/app-types';
import { KeyQuizType } from '@supports/services/yasuo-course/const';
import { QuizTypeTitle } from '@supports/types/cms-types';

import { KeyAssignmentType, KeyLearningObjectiveType } from '@services/bob-course/const';

import { QuizItemAttributeConfig } from 'manabuf/common/v1/contents_pb';
import { StudyPlanItemStatus } from 'manabuf/eureka/v1/assignments_pb';
import { UpsertStudyPlanRequest } from 'manabuf/eureka/v1/study_plan_modifier_pb';
import {
    Assignment,
    Assignment_V2,
    ExamLO,
    FlashCard,
    LearningObjective,
    LearningObjective_V2,
    TaskAssignment,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/learning-material';
import {
    createRandomBookByGRPC,
    createRandomChapters,
    createRandomTopics,
} from 'test-suites/squads/syllabus/step-definitions/syllabus-content-book-create-definitions';

export type LOType =
    | 'learning objective'
    | 'assignment'
    | 'task assignment'
    | 'flashcard'
    | 'exam LO';

type ServiceReturn<T extends (...args: any) => PromiseLike<any>> = AwaitedReturn<T>['request'];

export type Book = ServiceReturn<typeof createRandomBookByGRPC>['booksList'][0];
export type Chapter = ServiceReturn<typeof createRandomChapters>['chaptersList'][0];
export type Topic = ServiceReturn<typeof createRandomTopics>['topicsList'][0];

export {
    Assignment,
    Assignment_V2,
    ExamLO,
    FlashCard,
    LearningObjective,
    LearningObjective_V2,
    TaskAssignment,
};

export type StudyPlanItem = LearningObjective | Assignment;

export type StudyPlanItemTimeField = 'availableFrom' | 'availableTo' | 'startDate' | 'endDate';

export interface StudyPlanItemStructureTime
    extends Pick<StudyPlanItemStructure, StudyPlanItemTimeField> {}

export interface StudyPlanItemStructure {
    studyPlanId: string;
    studyPlanItemId: string;
    name: string;
    status: StudyPlanItemStatus;
    contentId: string;
    availableFrom?: string;
    availableTo?: string;
    startDate?: string;
    endDate?: string;
}

export type TopicOptionInfo = 'name' | 'icon';

export type StudyPlan = UpsertStudyPlanRequest.AsObject & { bookName: string };

export function isAssignment(data: StudyPlanItem): boolean {
    const id = (data as Assignment).assignmentId;
    return Boolean(id);
}

export interface LOTypeValueProps {
    loType?: LOType;
    loTypeKey?: keyof typeof KeyLearningObjectiveType | keyof typeof KeyAssignmentType;
}

export interface LOTypeValueReturns {
    loTypeKey: string;
    loTypeNumber: number;
    loTypeTitle: string;
}

export interface AssertRandomStudyPlanItemsData {
    chapterList?: Chapter[];
    topicList?: Topic[];
    learningObjectiveList: LearningObjective[];
    assignmentList: Assignment[];
}

export interface CreatedContentBookReturn {
    bookList: Book[];
    chapterList: Chapter[];
    topicList: Topic[];
    studyPlanItemList: StudyPlanItem[];
}

export interface CreatedTenantContentBookReturn {
    bookList: Book[];
    chaptersList: Chapter[];
    topicList: Topic[];
    studyPlanItemList: StudyPlanItem[];
}

export interface ContentBookProps {
    book: Book;
    chapterList: Chapter[];
    topicList: Topic[];
    loList: LearningObjective[];
    assignmentList: Assignment[];
}

export interface QuizTypeValueProps {
    quizTypeTitle?: QuizTypeTitle;
    quizTypeNumber?: number;
    quizTypeKey?: string;
}
export interface QuizTypeValueReturns {
    quizTypeKey: keyof typeof KeyQuizType;
    quizTypeNumber: number;
    quizTypeTitle: QuizTypeTitle;
}

export type Location = {
    locationId: string;
    name: string;
    accessPath?: string;
    locationType?: string;
    parentLocationId?: string;
};

export interface CardFlashcard {
    term: string;
    definition: string;
    image?: boolean;
    language?: QuizItemAttributeConfig;
    imageLink?: string;
}

export interface TopicForm {
    name: string;
    icon?: boolean;
}

export interface ClassCSV {
    course_id: string;
    location_id: string;
    course_name?: string;
    location_name?: string;
    class_name: string;
}

export enum QuizDifficultyLevels {
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
    FIVE = 5,
}

export interface QuizBaseInfo {
    taggedLONames: string[];
    kind: QuizTypeTitle;
    difficultyLevel: QuizDifficultyLevels;
}
