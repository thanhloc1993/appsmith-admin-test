import { User_Eibanam_GetListGradeQuery } from '@supports/graphql/bob/bob-types';
import { ILearningMaterialBase } from '@supports/services/common/learning-material';
import { ArrayElement, LocationInfoGRPC, QuizTypeTitle } from '@supports/types/cms-types';

import { KeyAssignmentType, KeyLearningObjectiveType } from '@services/bob-course/const';

import { AwaitedReturn, LOType } from '../../supports/app-types';
import {
    QuizItemAttributeConfig,
    ContentBasicInfo,
    LearningObjective as LearningObjectiveProto,
} from 'manabuf/common/v1/contents_pb';
import {
    StudyPlanItemStatus,
    Assignment as AssignmentProto,
} from 'manabuf/eureka/v1/assignments_pb';
import { UpsertStudyPlanRequest } from 'manabuf/eureka/v1/study_plan_modifier_pb';
import { Int32Value } from 'manabuf/google/protobuf/wrappers_pb';
import { AssignmentBase } from 'manabuf/syllabus/v1/assignment_service_pb';
import { ExamLOBase } from 'manabuf/syllabus/v1/exam_lo_service_pb';
import { TaskAssignmentBase } from 'manabuf/syllabus/v1/task_assignment_service_pb';
import {
    createRandomBookByGRPC,
    createRandomChapters,
    createRandomTopics,
} from 'test-suites/squads/syllabus/step-definitions/syllabus-content-book-create-definitions';
import { UserTag } from 'test-suites/squads/user-management/step-definitions/student-info/user-tag/type';
import {
    EnrollmentStatus,
    GenderType,
} from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';

type ServiceReturn<T extends (...args: any) => PromiseLike<any>> = AwaitedReturn<T>['request'];

export type Book = ServiceReturn<typeof createRandomBookByGRPC>['booksList'][0];
export type Chapter = ServiceReturn<typeof createRandomChapters>['chaptersList'][0];
export type Topic = ServiceReturn<typeof createRandomTopics>['topicsList'][0];

// TODO: Fixed type when migrate to new endpoints
export type LearningObjective = Omit<LearningObjectiveProto.AsObject, 'info'> & {
    info: Pick<ContentBasicInfo.AsObject, 'name' | 'id'>;
};

// TODO: In the future we will remove LearningObjective out of LearningObjective_V2, FlashCard, ExamLO
export interface LearningObjective_V2 extends ILearningMaterialBase, LearningObjective {
    learningObjectiveId: ILearningMaterialBase['learningMaterialId'];
}

export interface FlashCard extends ILearningMaterialBase, LearningObjective {
    flashcardId: ILearningMaterialBase['learningMaterialId'];
}

// @ts-ignore Outdated code squads/syllabus don't it any more
export interface ExamLO
    extends ILearningMaterialBase,
        LearningObjective,
        Omit<ExamLOBase.AsObject, 'base'> {
    examLOId: ILearningMaterialBase['learningMaterialId'];
    gradeToPass: Int32Value.AsObject['value'] | undefined;
}

export type Assignment = Omit<
    AssignmentProto.AsObject,
    'displayOrder' | 'checkList' | 'assignmentStatus'
>;

// TODO: In the future we will remove Assignment out of Assignment_V2, FlashCard, ExamLO
export interface Assignment_V2
    extends ILearningMaterialBase,
        Assignment,
        Omit<AssignmentBase.AsObject, 'base' | 'status'> {
    assignmentId: ILearningMaterialBase['learningMaterialId'];
}

export interface TaskAssignment
    extends ILearningMaterialBase,
        Assignment,
        Omit<TaskAssignmentBase.AsObject, 'base'> {
    taskAssignmentId: ILearningMaterialBase['learningMaterialId'];
}

export type StudyPlanItem = LearningObjective | Assignment;

export type StudyPlanItemTimeField = 'availableFrom' | 'availableTo' | 'startDate' | 'endDate';

export interface StudyPlanItemStructureTime
    extends Pick<StudyPlanItemStructure, StudyPlanItemTimeField> {}
export interface StudyPlanItemStructure {
    studyPlanId: string;
    studyPlanItemId: string;
    name: string;
    status: StudyPlanItemStatus;
    topicId: string;
    topicName: string;
    chapterId: string;
    chapterName: string;
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
    quizTypeKey: string;
    quizTypeNumber: number;
    quizTypeTitle: QuizTypeTitle;
}

export type UserSimpleInformation = {
    userName: string;
    phoneNumber: string;
};

export type EditedParentInformation = {
    id: string;
    relationship: string;
    email: string;
};

export type Location = {
    locationId: string;
    name: string;
    accessPath?: string;
    locationType?: string;
    parentLocationId?: string;
};

export interface StudentInformation {
    name: string;
    firstName: string;
    lastName: string;
    firstNamePhonetic?: string;
    lastNamePhonetic?: string;
    fullNamePhonetic?: string;
    email: string;
    grade: string;
    enrollmentStatus: EnrollmentStatus;
    phoneNumber: string;
    studentExternalId: string;
    studentNote: string;
    birthday: Date;
    gender: GenderType;
    locations?: LocationInfoGRPC[];
    gradeMaster?: ArrayElement<User_Eibanam_GetListGradeQuery['grade']>;
    studentTags?: UserTag[];
}

export type StudentFieldNotRequired = Pick<
    StudentInformation,
    | 'phoneNumber'
    | 'studentExternalId'
    | 'studentNote'
    | 'birthday'
    | 'gender'
    | 'locations'
    | 'firstNamePhonetic'
    | 'lastNamePhonetic'
>;

export type StudentFieldRequired = Pick<
    StudentInformation,
    'name' | 'email' | 'grade' | 'enrollmentStatus'
>;

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

export type ViewStudyPlanOrPreviousReportButtonType = 'View Study Plan' | 'Previous Lesson Report';
export interface StudentCSV {
    name?: string;
    first_name?: string;
    last_name?: string;
    first_name_phonetic?: string;
    last_name_phonetic?: string;
    email: string;
    enrollment_status: string;
    grade: string;
    phone_number?: string;
    birthday?: string;
    gender?: string;
    location?: string;
    postal_code?: string;
    prefecture?: string;
    city?: string;
    first_street?: string;
    second_street?: string;
    student_phone_number?: string;
    home_phone_number?: string;
    student_tag?: string;
    contact_preference?: number;
}

export interface ParentCSV {
    name: string;
    email: string;
    phone_number?: string;
    student_email?: string;
    relationship?: string;
    parent_tag?: string;
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

export type FindStatusStudentTypes = 'sees' | 'does not see';
