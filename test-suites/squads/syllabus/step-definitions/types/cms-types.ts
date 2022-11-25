import { ElementHandle } from 'playwright';

import { AwaitedReturn } from '@supports/app-types';

import { Country, Subject } from 'manabie-bob/enum_pb';
import {
    RetrieveLocationsResponse,
    RetrieveLocationTypesResponse,
    RetrieveLowestLevelLocationsResponse,
} from 'manabuf/bob/v1/masterdata_pb';
import { ContentBasicInfo } from 'manabuf/common/v1/contents_pb';

export type ServiceReturn<T extends (...args: any) => PromiseLike<any>> =
    AwaitedReturn<T>['request'];

export type CountryKeys = keyof typeof Country;
export type SubjectKeys = keyof typeof Subject;

export enum InputRange {
    'NUM_1' = 1,
    'NUM_999' = 999,
}

// TODO: remove after BE gen new proto
export type ExcludeSubjectGradeCountry<T> = Omit<T, 'country' | 'subject' | 'grade'>;

export type ActionButtonType = 'moreAction' | 'actionPanelTrigger';

export interface ContentBasic
    extends Pick<
        ContentBasicInfo.AsObject,
        'id' | 'schoolId' | 'country' | 'subject' | 'iconUrl'
    > {}

export interface GradeMap {
    [x: string]: [string, number][];
}
export interface CMSProfile {
    id: string;
    name: string;
    country: number;
    phoneNumber: string;
    email: string;
    avatar: string;
    deviceToken: string;
    userGroup: string;
    schoolIdsList: number[];
    schoolName: string;
    schoolId: number;
    countryName: CountryKeys;
}

export interface Timezone {
    label: string;
    timezoneLabel: string;
    value: string;
}

export interface CreatedAContentBookOption {
    chapterQuantity?: number;
    topicQuantity?: number;
    learningObjectiveQuantity?: number;
    assignmentQuantity?: number;
    questionQuantity?: number;
    taskAssignmentQuantity?: number;
    loWithMaterialQuantity?: number;
    assignmentNotRequireGradeQuantity?: number;
    taskAssignmentWithCorrectnessQuantity?: number;
    enabledFIBHandwritingAnswer?: boolean;
    enabledCourseStatistics?: boolean;
}

export interface SelectActionOptions {
    target?: ActionButtonType;
    wrapperSelector?: string;
    suffix?: string;
}

export interface SelectDatePickerParams {
    day: number;
    monthDiff: number;
    datePickerSelector: string;
    elementSelector?: ElementHandle<SVGElement | HTMLElement> | null;
}

export enum UserType {
    STUDENT = 'student',
    PARENT = 'parent',
}

export enum ActionOptions {
    EDIT = 'Edit',
    ADD = 'Add',
    DELETE = 'Delete',
    DOWNLOAD = 'Download',
    DUPLICATE = 'Duplicate',
    RENAME = 'Rename',
    SAVE = 'Save',
    DOWNLOAD_CSV = 'Download CSV',
    RE_ISSUE_PASSWORD = 'Re-Issue password',
    ARCHIVE = 'Archive',
    UNARCHIVE = 'Unarchive',
    CREATE_ORDER = 'Create order',
    CLOSE = 'Close',
    IMPORT_PARENTS = 'Import Parents',
}

export enum FileTypes {
    ALL = 'application/pdf,audio/*,image/*,video/*',
    PDF = 'application/pdf',
    AUDIO = 'audio/*',
    IMAGE = 'image/*',
    VIDEO = 'video/*',
    CSV = 'text/csv',
}

export enum CourseTab {
    lesson = 0,
    book = 1,
    studyPlan = 2,
    setting = 3,
}

export enum PagePosition {
    First = 'first',
    Last = 'last',
    Other = 'other',
}

export enum PageAction {
    Next = 'next',
    Previous = 'previous',
}

export type Position = 'top' | 'bottom';

export type MoveDirection = 'up' | 'down';

export type LOStatus = 'incomplete' | 'complete';

export type SeeOrNotSee = 'see' | 'not see';

export type QuizTypeTitle =
    | 'multiple choice'
    | 'fill in the blank'
    | 'manual input'
    | 'multiple answer'
    | 'term and definition'
    | 'pair of words';

export type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export enum StudentDetailTab {
    DETAIL = 0,
    FAMILY = 1,
    COURSE = 2,
    ENTRY_EXIT = 3,
}

export enum AddParentOption {
    NEW = 'NEW',
    EXISTING = 'EXISTING',
}

export type DialogButtonType = 'declines' | 'confirm';

export type LocationInfoGRPC = RetrieveLowestLevelLocationsResponse.Location.AsObject;

export type LocationObjectGRPC = RetrieveLocationsResponse.Location.AsObject;

export type LocationTypeGRPC = RetrieveLocationTypesResponse.LocationType.AsObject;

export interface TreeLocationProps extends LocationObjectGRPC {
    children?: TreeLocationProps[];
}

export type CancelButtonTypes = 'close' | 'cancel' | 'escape';

export type ClickingTypes = 'one time' | 'continuously';

export type InvalidEmailTypes = 'invalid email format' | 'blank field ' | 'existed email';

export type QuizEditInfoTitle =
    | 'type'
    | 'description'
    | 'answers'
    | 'number of answers'
    | 'answer config'
    | 'explanation';

export type QuizUpdateInfoValue =
    | string
    | QuizTypeTitle
    | number
    | (string | boolean)[]
    | undefined;
