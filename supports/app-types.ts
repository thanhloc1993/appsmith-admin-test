import { TestStepResultStatus } from '@cucumber/messages';

import { BrowserContext, Page, Response } from 'playwright';

import AbstractDriver, { ConnectOptions } from '@drivers/abstract-driver';

import { Menu, MenuUnion } from '@supports/enum';

import { CourseListEntity } from './entities/course-list-entity';
import { EntryExitListEntity } from './entities/entry-exit-list-entity';
import { KidsOfParentEntity } from './entities/kid-of-parents-entity';
import { UserProfileEntity } from './entities/user-profile-entity';
import GraphqlClient from './packages/graphql-client';
import { ScenarioContext } from './scenario-context';
import {
    ActionButtonType,
    ActionOptions,
    CMSProfile,
    ContentBasic,
    FileTypes,
    SelectDatePickerParams,
    Timezone,
} from './types/cms-types';

export { ConnectOptions };
export interface ScenarioContextInterface {
    context: Map<string, any>;
    set(
        key: string,
        value: any,
        options?: {
            ignoreStrictData?: boolean;
        }
    ): ScenarioContextInterface['context'];
    get(key: string): any;
    has(key: any): boolean;
}

export interface LearnerInterface extends AbstractDriver {
    driverName: string;
    connect: (options: ConnectOptions) => Promise<void>;
    quit: () => Promise<void>;
    getToken: () => Promise<string>;
    instruction(
        this: LearnerInterface,
        description: string,
        fn: (learner: LearnerInterface) => Promise<void>
    ): Promise<void>;
    getUserId: () => Promise<string>;
    getAvatarUrl: () => Promise<string>;
    getProfile: () => Promise<UserProfileEntity>;
    getKidsOfParent: () => Promise<KidsOfParentEntity>;
    openHomeDrawer: () => Promise<void>;
    clickOnTab: (tabButtonKey: string, tabPageKey: string) => Promise<void>;
    logout: () => Promise<void>;
    checkUserName: (username: string) => Promise<void>;
    verifyAvatarInHomeScreen: (avatarUrl: string) => Promise<void>;
    getCourseList: () => Promise<CourseListEntity>;
    getQuizNameList: () => Promise<string[]>;
    getEntryExitRecords: () => Promise<EntryExitListEntity>;
    prepareUploadAttachmentType: (fileType: string) => Promise<void>;
    killAppOnWeb: () => Promise<void>;
    sendZipFile: () => Promise<void>;
}

export interface TeacherInterface extends AbstractDriver {
    driverName: string;
    connect: (options: ConnectOptions) => Promise<void>;
    quit: () => Promise<void>;
    instruction(
        this: TeacherInterface,
        description: string,
        fn: (teacher: TeacherInterface) => Promise<void>,
        bufferScreenshot?: Buffer | string
    ): Promise<void>;
    logout: () => Promise<void>;
    prepareUploadAttachmentType: (fileType: string) => Promise<void>;
    sendZipFile: () => Promise<void>;
}

export interface CMSInterface extends AbstractDriver {
    page?: Page;
    context?: BrowserContext;
    origin: string;
    graphqlClient?: GraphqlClient;
    connect: (options: ConnectOptions) => Promise<void>;
    quit: () => Promise<void>;
    getToken: () => Promise<string>;
    instruction(
        this: CMSInterface,
        description: string,
        fn: (cms: CMSInterface) => Promise<void>
    ): Promise<void>;
    getContentBasic: () => Promise<ContentBasic>;
    getProfile: () => Promise<CMSProfile>;
    getTimezone: () => Promise<Timezone>;
    selectMenuItemInSidebarByAriaLabel: (ariaLabel: MenuUnion) => Promise<void>;
    selectAButtonByAriaLabel: (
        ariaLabel: string,
        options?: { onClickTimes?: number; parentSelector?: string }
    ) => Promise<void>;
    selectElementByDataTestId: (dataTestId: string) => Promise<void>;
    selectElementByDataValue: (dataTestId: string) => Promise<void>;
    selectElementWithinWrapper: (
        wrapperSelector: string,
        elementSelector: string,
        options?: { text?: string }
    ) => Promise<void>;
    assertThePageTitle: (title: string) => Promise<void>;
    assertTheDialogTitleByDataTestId: (dataTestId: string, title: string) => Promise<void>;
    assertNotification: (message: string) => Promise<void>;
    closeSnackbar: () => Promise<void>;
    selectActionButton: (
        action: ActionOptions,
        options?: { target?: ActionButtonType; wrapperSelector?: string; suffix?: string }
    ) => Promise<void>;
    schoolAdminIsOnThePage(menu: Menu, title: string): Promise<void>;
    waitForSkeletonLoading: () => Promise<void>;
    waitingForProgressBar: () => Promise<void>;
    waitingForLoadingIcon: () => Promise<void>;
    waitingForLoadMoreButton: () => Promise<void>;
    waitingAutocompleteLoading: (dataTestId?: string) => Promise<void>;
    chooseOptionInAutoCompleteBoxByText: (text: string) => Promise<void>;
    chooseOptionInAutoCompleteBoxByExactText: (text: string) => Promise<void>;
    chooseOptionInAutoCompleteBoxByOrder: (nth: number) => Promise<void>;
    chooseOptionInAutoCompleteBoxByDataValue: (dataValue: string) => Promise<void>;
    waitForSelectorWithText: (
        selector: string,
        value: string
    ) => ReturnType<Page['waitForSelector']>;
    waitForSelectorHasText: (
        selector: string,
        value: string
    ) => ReturnType<Page['waitForSelector']>;
    waitForSelectorHasTextWithOptions: (
        selector: string,
        value: string,
        options: Parameters<Page['waitForSelector']>[1]
    ) => ReturnType<Page['waitForSelector']>;
    waitForGRPCResponse: (
        endpointOrPredicate: string | ((response: Response) => boolean | Promise<boolean>),
        options?: Parameters<Page['waitForResponse']>[1]
    ) => ReturnType<Page['waitForResponse']>;
    waitForDataTestId: (dataTestId: string) => ReturnType<Page['waitForSelector']>;
    waitForDataValue: (dataTestId: string) => ReturnType<Page['waitForSelector']>;
    getValueOfInput: (selector: string) => Promise<string>;
    waitForHasuraResponse: (
        entityName: string,
        options?: Parameters<Page['waitForResponse']>[1]
    ) => Promise<any>;
    confirmDialogAction: () => Promise<void>;
    cancelDialogAction: () => Promise<void>;
    closeDialogAction: () => Promise<void>;
    uploadAttachmentFiles: (
        filePaths: string | string[],
        fileTypes?: FileTypes,
        testid?: string,
        scenario?: ScenarioContext
    ) => Promise<void>;
    assertAttachmentFiles: (scenario: ScenarioContext) => Promise<void>;
    assertTypographyWithTooltip: (
        selector: string,
        value: string
    ) => ReturnType<Page['waitForSelector']>;
    selectDatePickerMonthAndDay: ({
        day,
        monthDiff,
        datePickerSelector,
    }: SelectDatePickerParams) => Promise<Date>;
    clearListAutoCompleteInput: (autocompleteInputSelectors: string[]) => Promise<void>;
    waitForTabListItem: (tabName: string) => ReturnType<Page['waitForSelector']>;
    selectTabButtonByText: (selector: string, textTitle: string) => Promise<void>;
    searchInFilter: (text: string, shouldEnter?: boolean) => Promise<void>;
    getTextContentElement: (selector: string) => Promise<string | null>;
    getTextContentMultipleElements: (selector: string) => Promise<(string | null)[]>;
    importLocationData: () => Promise<void>;
}

export interface UnleashAdminInterface extends AbstractDriver {
    page?: Page;
    context?: BrowserContext;
    origin: string;
    connect: (options: ConnectOptions) => Promise<void>;
    quit: () => Promise<void>;
    instruction(
        this: UnleashAdminInterface,
        description: string,
        fn: (cms: UnleashAdminInterface) => Promise<void>
    ): Promise<void>;
    archiveFeature(featureName: string): Promise<void>;
}

export interface IMasterWorld {
    cms: CMSInterface;
    cms2: CMSInterface;
    cms3: CMSInterface;
    cms4: CMSInterface;
    teacher: TeacherInterface;
    teacher2: TeacherInterface;
    learner: LearnerInterface;
    learner2: LearnerInterface;
    learner3: LearnerInterface;
    parent: LearnerInterface;
    parent2: LearnerInterface;
    unleashAdmin: UnleashAdminInterface;
    scenario: ScenarioContext;
    counter: number;
    attachMessageAndStatusInstance: (
        message: string,
        status: TestStepResultStatus
    ) => Promise<void>;
}

export type AccountRoles =
    | 'school admin'
    | 'unleash admin'
    | 'school admin 1'
    | 'school admin 2'
    | 'teacher'
    | 'student'
    | 'parent P1'
    | 'parent P2'
    | 'parent P3'
    | 'teacher T1'
    | 'teacher T2'
    | 'student S1'
    | 'student S2'
    | 'student S3';

export type Platform = 'CMS' | 'Teacher App' | 'Learner App';

export type LOType =
    | 'learning objective'
    | 'assignment'
    | 'task assignment'
    | 'flashcard'
    | 'exam LO';

export type StudyPlanItemStatus =
    | 'active'
    | 'archived'
    | 'default'
    | 'completed'
    | 'incomplete'
    | 'returned'
    | 'marked'
    | 'not marked'
    | 'in progress';

export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;
export type AwaitedReturn<T extends (...args: any) => PromiseLike<any>> = Awaited<ReturnType<T>>;

export interface BrightcoveVideoInfo {
    accountId: string;
    videoId: string;
}

export type CMSDriverNames = 'cms' | 'cms_2' | 'cms_3' | 'cms_4';
export type TeacherDriverNames = 'teacher_1' | 'teacher_2';
export type LeanerDriverNames = 'learner_1' | 'learner_2' | 'learner_3';
export type ParentDriverNames = 'parent_1' | 'parent_2';
export type UnleashDriverName = 'unleash_admin';

export interface DriverOptions {
    driverName:
        | CMSDriverNames
        | TeacherDriverNames
        | LeanerDriverNames
        | ParentDriverNames
        | UnleashDriverName;
}

export type LearnerInterfaceWithTenant = LearnerRolesWithTenant | ParentRolesWithTenant;

export type SchoolAdminRolesWithTenant = 'school admin Tenant S1' | 'school admin Tenant S2';
export type LearnerRolesWithTenant = 'student Tenant S1' | 'student Tenant S2';
export type ParentRolesWithTenant = 'parent Tenant S1' | 'parent Tenant S2';
export type TeacherRolesWithTenant = 'teacher Tenant S1' | 'teacher Tenant S2';
export type CourseWithTenant = 'course Tenant S1' | 'course Tenant S2';
export type BookWithTenant = 'book Tenant S1' | 'book Tenant S2';
export type StudyPlanWithTenant = 'studyplan Tenant S1' | 'studyplan Tenant S2';
export type Tenant = 'Tenant S1' | 'Tenant S2';
export type TeacherPages = 'To Review' | 'Message';
export type MultiTenantAccountType = 'student' | 'parent' | 'school admin' | 'teacher';
export type LoginStatus = 'successfully' | 'failed';
export type AccountAction = 'sees' | 'does not see';

export type Locations = 'location' | 'location L1' | 'location L2' | 'location L1 & location L2';
export type Classes =
    | 'no class'
    | 'any class'
    | 'class'
    | 'class C1'
    | 'class C2'
    | 'class C3'
    | 'class C1 & class C2'
    | 'class C1 & class C2 & class C3';
export type Courses = 'course' | 'course C1' | 'course C2' | 'course C1 & course C2';
export type Lessons = 'lesson L1' | 'lesson L2';
export type Books = 'book' | 'book B1' | 'book B2';
export type StudyPlans = 'study plan' | 'study plan SP1' | 'study plan SP2';
export type PhoneNumberField =
    | 'student phone number'
    | 'home phone number'
    | 'all student phone number'
    | 'all fields empty';
export type ContactPreference = 'student phone number' | 'home phone number';
