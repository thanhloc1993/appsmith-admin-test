// TODO: Please help remove import cross from 'test-suites/squads/syllabus/*'
import { aliasFirstGrantedLocation } from '@legacy-step-definitions/alias-keys/architecture';
import {
    aliasAttachmentDownloadUrl,
    aliasAttachmentFileNames,
} from '@legacy-step-definitions/alias-keys/file';
import {
    aliasAssignmentName,
    aliasAssignments,
    aliasBooks,
    aliasCourseId,
    aliasStudyPlanName,
    aliasTopicName,
} from '@legacy-step-definitions/alias-keys/syllabus';
import { closeDialogButton } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { homeScreenDrawerButtonKey } from '@legacy-step-definitions/learner-keys/home-screen';
import { LearnerKeys } from '@legacy-step-definitions/learner-keys/learner-key';
import { addACourseForStudentsByGRPC } from '@legacy-step-definitions/lesson-teacher-submit-individual-lesson-report-definitions';
import { TeacherKeys } from '@legacy-step-definitions/teacher-keys/teacher-keys';
import { Book } from '@legacy-step-definitions/types/content';
import {
    convertOneOfStringTypeToArray,
    getRandomNumber,
    getUserProfileFromContext,
    NumberOfRowsPerPage,
    randomInteger,
} from '@legacy-step-definitions/utils';
import {
    learnerProfileAlias,
    learnerProfileAliasWithAccountRoleSuffix,
    parentProfilesAlias,
    parentProfilesAliasWithAccountRoleSuffix,
    studentCoursePackagesAlias,
} from '@user-common/alias-keys/user';
import { tableBaseBody, tableBaseRow } from '@user-common/cms-selectors/students-page';

import { ElementHandle } from 'playwright';

import {
    AccountRoles,
    CMSInterface,
    LearnerInterface,
    TeacherInterface,
} from '@supports/app-types';
import { samplePDFFilePath } from '@supports/constants';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { LocationItemCheckBoxStatus } from '@supports/enum';
import createGrpcMessageDecoder from '@supports/packages/grpc-message-decoder';
import { ScenarioContext } from '@supports/scenario-context';
import NsMasterCourseService from '@supports/services/master-course-service/request-types';
import { FileTypes, LocationObjectGRPC, SelectDatePickerParams } from '@supports/types/cms-types';

import {
    aliasCreatedNotificationContent,
    aliasCreatedNotificationContentLink,
    aliasCreatedNotificationID,
    aliasCreatedNotificationName,
    aliasCreatedScheduleNotificationID,
    aliasNotificationCreatedCourseName,
    aliasNotificationGradeName,
    aliasWaitTimeForSchedule,
} from './alias-keys/communication';
import * as CommunicationSelectors from './cms-selectors/communication';
import {
    teacherSelectParentGroupChat,
    teacherSelectStudentChatGroup,
    teacherTapJoinChatGroupButton,
} from './communication-join-chat-group-definitions';
import {
    getNotificationIdByTitleWithHasura,
    getInfoNotificationStatusAndCountReadByNotificationIdWithHasura,
} from './communication-notification-hasura';
import {
    CheckNotificationStatusInTimeReturn,
    mappingResponseOfCheckNotificationStatusInTime,
} from './communication-schedule-notification-common';
import { teacherSearchConversationByStudentName } from './communication-search-chat-group-definitions';
import { getNotificationStatusText } from './communication-utils';
import {
    UPSERT_NOTIFICATION_ENDPOINT,
    SEND_NOTIFICATION_ENDPOINT,
} from './endpoints/notificationmgmt-notification';
import {
    attachmentPdfKey,
    messagesTabKey,
    notificationBadge,
    notificationItem,
    readNotificationStatus,
} from './learner-keys/communication-key';
import {
    imageViewerKey,
    messageFileKey,
    messageImageKey,
    messageTextKey,
    messageZipContentKey,
    messageZipFileKey,
    messagingScreen,
    parentConversationLabel,
    parentConversationName,
    pdfViewerKey,
    studentConversationName,
    userAvatarConversationKey,
    userNameConversationKey,
} from './teacher-keys/communication-key';
import { ByValueKey } from 'flutter-driver-x';
import { ResumableUploadURLResponse } from 'manabuf/bob/v1/uploads_pb';
import { Country } from 'manabuf/common/v1/enums_pb';
import { UpsertNotificationResponse } from 'manabuf/notificationmgmt/v1/notifications_pb';
import { teacherGoesToStudyPlanItemDetails } from 'test-suites/common/step-definitions/teacher-study-plan-definitions';
import {
    teacherGoesToStudyPlanDetails,
    teacherSeeStudyPlanItem,
} from 'test-suites/common/step-definitions/teacher-study-plan-definitions';
import { teacherReturnsAndSavesChanges } from 'test-suites/squads/syllabus/step-definitions//syllabus-return-teacher-assignment-text-feedbacks-definitions';
import { schoolAdminHasCreatedStudyPlanV2 } from 'test-suites/squads/syllabus/step-definitions//syllabus-study-plan-common-definitions';
import { Assignment } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';
import {
    createRandomAssignments,
    createRandomBookByGRPC,
    createRandomChapters,
    createRandomTopics,
} from 'test-suites/squads/syllabus/step-definitions/syllabus-content-book-create-definitions';
import {
    createARandomStudentGRPC,
    createAStudentPromise,
} from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';

export const firstIndex = 0;

export const getSelectDateOfDatePicker = () => {
    const currentDate = new Date();
    const selectedDate = new Date(new Date().setDate(currentDate.getDate() + 1));

    const monthDiff = selectedDate.getMonth() - currentDate.getMonth();

    return {
        day: selectedDate.getDate(),
        monthDiff,
        selectedDate,
    };
};

export const datePickerParams: SelectDatePickerParams = {
    day: getSelectDateOfDatePicker().day,
    monthDiff: getSelectDateOfDatePicker().monthDiff,
    datePickerSelector: CommunicationSelectors.notificationScheduleDatePicker,
};

export enum MessageType {
    text = 'text',
    image = 'image',
    pdf = 'pdf',
    hyperlink = 'hyperlink',
    zip = 'zip',
}
export enum AccountType {
    student = 'student',
    parent = 'parent',
    teacher = 'teacher',
}
export enum SectionType {
    'All' = 'All',
    'Sent' = 'Sent',
}

export enum MessageTypeFilter {
    all = 'all',
    notReply = 'not reply',
}

export enum ContactFilter {
    all = 'all',
    parent = 'parent',
    student = 'student',
}

export type CourseFilter = 'Course C1' | 'Course C2' | 'Course C1 & Course C2' | 'all courses';

export type NotificationAction = 'read' | 'unread';

export type UnreadStatusBehavior = 'displays' | 'does not display';

export type NotificationBadgeBehavior = 'without number' | number;

export type NotificationActionButton =
    | 'Close'
    | 'Clone'
    | 'Save draft'
    | 'Send'
    | 'Discard'
    | 'Save schedule'
    | 'Discard and confirm';
export type UserGroupType = 'All' | 'Parent' | 'Student';
export type NotificationType = 'Now' | 'Schedule';
export type SelectType = 'All' | 'Specific';
export type ComposeType = 'Sent' | 'Draft' | 'Scheduled';
export type NotificationCategory = ComposeType | 'All';
export type ReadNotificationAccountType = AccountRoles | 'student and parent P1';
export type NotificationFields =
    | 'Title'
    | 'Content'
    | 'Title & Content'
    | 'Date'
    | 'Time'
    | 'Grade'
    | 'Course'
    | 'Individual Recipient'
    | 'Attach File'
    | 'Recipient Group'
    | 'All Fields';
export type NotificationAutocompleteFields = Exclude<
    NotificationFields,
    'Title' | 'Content' | 'Date' | 'Attach File' | 'All Fields'
>;

export type VisibleAction = 'sees' | "doesn't sees";

export type RecipientsSelectType = {
    course?: SelectType;
    grade?: SelectType;
    individual?: Exclude<SelectType, 'All'>;
    studentRoles?: AccountRoles;
};

export type CourseRoles = 'Course C1' | 'Course C2';

export type InvalidDateTimeType = 'Date' | 'Time';

export interface TitleContentValues {
    title?: string;
    content?: string;
}

export interface AssertAttachmentOptions {
    shouldAttachmentALink: boolean;
}

export interface GetTotalRecipientStringParam extends CheckNotificationStatusInTimeReturn {}
export interface PageOptions {
    reload: boolean;
    rowsPerPage?: NumberOfRowsPerPage;
}
export const checkStatusScheduleNotification = (status: ComposeType) => status === 'Scheduled';

export async function getNotificationScheduleAtAndWaitTime(
    cms: CMSInterface,
    context: ScenarioContext,
    minuteLater = 1
) {
    const scheduledAt = new Date();
    const currentMinute = scheduledAt.getMinutes();
    const currentSecond = scheduledAt.getSeconds();

    await cms.attach(`Generate scheduleAt object at ${minuteLater} minute(s) later`);
    const scheduledMinute = (currentSecond < 30 ? currentMinute : currentMinute + 1) + minuteLater;

    scheduledAt.setMinutes(scheduledMinute);
    const waitTime = (scheduledMinute - currentMinute) * 60000;

    context.set(aliasWaitTimeForSchedule, waitTime);

    return scheduledAt;
}

export function getMessageType(messageType: string, index: number): MessageType {
    const types = convertOneOfStringTypeToArray(messageType);
    const type = types[index] as MessageType;
    return type;
}

export function getAccountType(accounts: string, index: number): AccountType {
    const types = convertOneOfStringTypeToArray(accounts);
    const type = types[index] as AccountType;
    return type;
}

export function messageKeyForType(messageType: string, message: string | undefined) {
    switch (messageType) {
        case MessageType.image:
            return messageImageKey(firstIndex);
        case MessageType.pdf:
            return messageFileKey(firstIndex);
        case MessageType.zip:
            return messageZipFileKey(firstIndex);
        default:
            return messageTextKey(firstIndex, message);
    }
}

export function messageInteractionKeyForType(messageType: string, message: string | undefined) {
    switch (messageType) {
        case MessageType.image:
            return messageImageKey(firstIndex);
        case MessageType.pdf:
            return messageFileKey(firstIndex);
        case MessageType.zip:
            return messageZipContentKey(firstIndex);
        default:
            return messageTextKey(firstIndex, message);
    }
}

export function viewerKeyForType(messageType: MessageType) {
    return messageType == MessageType.image ? imageViewerKey : pdfViewerKey;
}

export async function moveLearnerToMessagePage(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver!;

    await learner.instruction('Open Drawer Menu', async function () {
        const messageTabFinder = new ByValueKey(homeScreenDrawerButtonKey);
        await driver.tap(messageTabFinder);
    });

    await learner.instruction('Click on Message Tab', async function () {
        const messageTabFinder = new ByValueKey(messagesTabKey);
        await driver.tap(messageTabFinder);
    });
}

export async function moveLearnerToStatsPage(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver!;

    const drawerFinder = new ByValueKey(homeScreenDrawerButtonKey);
    await driver.tap(drawerFinder);

    const statsTabFinder = new ByValueKey(LearnerKeys.stats_tab);
    await driver.tap(statsTabFinder);
}

export async function moveTeacherToMessagePage(teacher: TeacherInterface): Promise<void> {
    const driver = teacher.flutterDriver!;
    const messageButtonFinder = new ByValueKey(TeacherKeys.messageButton);
    await driver.tap(messageButtonFinder);
}

export async function interceptUpsertNotificationResponseAndSetIDToAlias(
    cms: CMSInterface,
    context: ScenarioContext,
    status: ComposeType = 'Draft'
) {
    await cms.instruction(
        'Intercept create notification endpoint and set notificationId to alias',
        async function () {
            const response = await cms.waitForGRPCResponse(UPSERT_NOTIFICATION_ENDPOINT);
            const decoder = createGrpcMessageDecoder(UpsertNotificationResponse);
            const encodedResponseText = await response?.text();
            const decodedResponse = decoder.decodeMessage(encodedResponseText);

            const aliasNotificationId = checkStatusScheduleNotification(status)
                ? aliasCreatedScheduleNotificationID
                : aliasCreatedNotificationID;

            context.set(aliasNotificationId, decodedResponse?.toObject().notificationId);
        }
    );
}

export async function teacherSelectedUnJoinedTab(teacher: TeacherInterface): Promise<void> {
    const driver = teacher.flutterDriver!;
    const unJoinedTabFinder = new ByValueKey(TeacherKeys.unjoinedTab);
    await driver.tap(unJoinedTabFinder, 10000);
}

export async function teacherSelectedJoinedTab(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;

    const joinedTabFinder = new ByValueKey(TeacherKeys.joinedTab);
    await driver.tap(joinedTabFinder);
}

export async function teacherSeeStudentGroupChat(
    teacher: TeacherInterface,
    studentId: string
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const studentGroupChatFinder = new ByValueKey(TeacherKeys.studentConversationItem(studentId));
    await driver.waitFor(studentGroupChatFinder, 10000);
}

export async function teacherSeeParentGroupChat(
    teacher: TeacherInterface,
    studentId: string
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const parentGroupChatFinder = new ByValueKey(TeacherKeys.parentConversationItem(studentId));
    await driver.waitFor(parentGroupChatFinder, 10000);
}

export async function teacherNotSeeStudentGroupChat(
    teacher: TeacherInterface,
    studentId: string
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const studentGroupChatFinder = new ByValueKey(TeacherKeys.studentConversationItem(studentId));
    await driver.waitForAbsent(studentGroupChatFinder);
}

export async function teacherNotSeeParentGroupChat(
    teacher: TeacherInterface,
    studentId: string
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const parentGroupChatFinder = new ByValueKey(TeacherKeys.parentConversationItem(studentId));
    await driver.waitForAbsent(parentGroupChatFinder);
}

export async function learnerSeeStudentGroupChat(
    learner: LearnerInterface,
    studentId: string
): Promise<void> {
    const driver = learner.flutterDriver!;
    const studentGroupChatFinder = new ByValueKey(TeacherKeys.studentConversationItem(studentId));
    await driver.waitFor(studentGroupChatFinder, 10000);
}

export async function teacherCheckStudentGroupChatName(
    teacher: TeacherInterface,
    studentId: string,
    name: string
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const studentGroupChatNameFinder = new ByValueKey(studentConversationName(studentId, name));
    await driver.waitFor(studentGroupChatNameFinder, 10000);
}

export async function teacherCheckParentGroupChatName(
    teacher: TeacherInterface,
    studentId: string,
    name: string
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const parentGroupChatNameFinder = new ByValueKey(parentConversationName(studentId, name));
    await driver.waitFor(parentGroupChatNameFinder, 10000);
}

export async function teacherCheckParentGroupChatParentTag(
    teacher: TeacherInterface,
    studentId: string
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const parentGroupChatParentTagFinder = new ByValueKey(parentConversationLabel(studentId));
    await driver.waitFor(parentGroupChatParentTagFinder, 15000);
}

export async function parentSeeParentGroupChat(
    parent: LearnerInterface,
    studentId: string
): Promise<void> {
    const driver = parent.flutterDriver!;
    const parentGroupChatFinder = new ByValueKey(TeacherKeys.parentConversationItem(studentId));
    await driver.waitFor(parentGroupChatFinder, 20000);
}

export async function createStudentWithCourseAndGrade(
    cms: CMSInterface,
    context: ScenarioContext,
    parentLength = 1,
    studentSuffix: AccountRoles = 'student'
) {
    const studentKey = learnerProfileAliasWithAccountRoleSuffix(studentSuffix);
    const parentKey = parentProfilesAliasWithAccountRoleSuffix(studentSuffix);

    const { courses, student, parents, studentCoursePackages } = await createARandomStudentGRPC(
        cms,
        {
            parentLength,
            studentPackageProfileLength: 1,
        }
    );

    await cms.attach(
        `Create a student ${studentKey} with course, grade and parent ${parentKey} by gRPC:
        \nStudent name: ${student.name}
        \nGrade Master Id: ${student.gradeMaster?.grade_id}
        \nGrade Master Name: ${student.gradeMaster?.name}
        \nGrade: ${student.gradeValue}
        \nParent name: ${parents[0].name}
        \nCourse name: ${studentCoursePackages[0].courseName}`
    );

    const createdCourse: NsMasterCourseService.UpsertCoursesRequest = courses[0];

    const studentGradeName = student.gradeMaster?.name || student.gradeValue;

    context.set(aliasNotificationCreatedCourseName, createdCourse.name);
    context.set(aliasNotificationGradeName, studentGradeName);

    // Set student and parent info for learner app login
    context.set(studentKey, student);
    context.set(parentKey, parents);

    // Support for single profile
    context.set(studentCoursePackagesAlias, studentCoursePackages);
    context.set(learnerProfileAlias, student);
    context.set(parentProfilesAlias, parents);
}

export async function openComposeMessageDialog(cms: CMSInterface) {
    await cms.selectElementByDataTestId(CommunicationSelectors.composeButton);
}

export async function clickCloseComposeDialog(cms: CMSInterface) {
    await cms.selectElementByDataTestId(closeDialogButton);
}

export async function clickCloseDialog(cms: CMSInterface) {
    await cms.selectElementByDataTestId(closeDialogButton);
}

export async function clickDiscardNotificationButton(cms: CMSInterface) {
    await cms.selectElementByDataTestId(CommunicationSelectors.notificationDiscardButton);
}

export async function clickDiscardConfirmNotificationButton(cms: CMSInterface) {
    await cms.page?.click(CommunicationSelectors.notificationDialogConfirmDiscardButton);
}

export async function clickCancelConfirmNotificationButton(cms: CMSInterface) {
    await cms.page?.click(CommunicationSelectors.notificationDialogConfirmCancelButton);
}

export async function clickDisposeConfirmNotificationButton(cms: CMSInterface) {
    await cms.page?.click(CommunicationSelectors.notificationDialogConfirmDisposeButton);
}

export async function clickUpsertAndSendNotification(cms: CMSInterface, context: ScenarioContext) {
    // Note that Promise.all prevents a race condition
    await Promise.all([
        cms.selectElementByDataTestId(CommunicationSelectors.sendNotificationButton),
        interceptUpsertNotificationResponseAndSetIDToAlias(cms, context),
        cms.waitForGRPCResponse(SEND_NOTIFICATION_ENDPOINT),
    ]);
}

export async function clickSendNotification(cms: CMSInterface) {
    // Note that Promise.all prevents a race condition
    await Promise.all([
        cms.selectElementByDataTestId(CommunicationSelectors.sendNotificationButton),
        cms.waitForGRPCResponse(SEND_NOTIFICATION_ENDPOINT),
    ]);
}

export async function clickSaveDraftNotification(cms: CMSInterface, context: ScenarioContext) {
    // Note that Promise.all prevents a race condition
    await Promise.all([
        cms.selectElementByDataTestId(CommunicationSelectors.saveDraftNotificationButton),
        interceptUpsertNotificationResponseAndSetIDToAlias(cms, context),
    ]);
}

export async function clickSaveScheduleNotificationButton(
    cms: CMSInterface,
    context: ScenarioContext
) {
    // Note that Promise.all prevents a race condition
    await Promise.all([
        cms.selectElementByDataTestId(CommunicationSelectors.saveScheduleNotificationButton),
        interceptUpsertNotificationResponseAndSetIDToAlias(cms, context, 'Scheduled'),
    ]);
}

export async function clickSaveScheduleNotificationButtonWithoutWaitForGPRC(cms: CMSInterface) {
    await cms.selectElementByDataTestId(CommunicationSelectors.saveScheduleNotificationButton);
}

export async function clickResendNotification(cms: CMSInterface) {
    await cms.page?.click(CommunicationSelectors.resendNotificationButton);
}

export async function fillIndividualRecipientOnDialog(
    cms: CMSInterface,
    createdStudentEmail: string
) {
    await cms.page!.click(CommunicationSelectors.studentsAutocompleteInput);
    await cms.page!.fill(CommunicationSelectors.studentsAutocompleteInput, createdStudentEmail);
}

export async function fillCourseOnDialog(cms: CMSInterface, createdCourse: string) {
    await cms.page!.click(CommunicationSelectors.coursesAutocompleteInput);
    await cms.page!.fill(CommunicationSelectors.coursesAutocompleteInput, createdCourse);
}

export async function selectIndividualRecipientOnDialog(
    cms: CMSInterface,
    context: ScenarioContext,
    studentRoles?: AccountRoles
) {
    const { name: createdStudentName } = context.get<UserProfileEntity>(
        learnerProfileAliasWithAccountRoleSuffix(studentRoles || 'student')
    );

    await cms.instruction(`Select ${createdStudentName} on compose dialog`, async () => {
        await fillIndividualRecipientOnDialog(cms, createdStudentName);
        await cms.waitingAutocompleteLoading();
        await cms.chooseOptionInAutoCompleteBoxByText(createdStudentName);
    });
}

export async function selectCoursesOnDialog(
    cms: CMSInterface,
    context: ScenarioContext,
    isAll = false
) {
    await cms.page!.click(CommunicationSelectors.coursesAutocompleteInput);

    if (isAll) {
        await cms.instruction('Select all courses on compose dialog', async () => {
            await cms.page!.fill(CommunicationSelectors.coursesAutocompleteInput, 'All Courses');
            await cms.chooseOptionInAutoCompleteBoxByText('All Courses');
        });
    } else {
        const createdCourseName = context.get<string>(aliasNotificationCreatedCourseName);
        await cms.instruction(`Select ${createdCourseName} on compose dialog`, async () => {
            await cms.page!.fill(
                CommunicationSelectors.coursesAutocompleteInput,
                createdCourseName
            );
            await cms.chooseOptionInAutoCompleteBoxByText(createdCourseName);
        });
    }
}

export async function selectGradesOnDialog(
    cms: CMSInterface,
    {
        isGradeAll = false,
        gradeMasterStudent,
    }: { isGradeAll?: boolean; gradeMasterStudent?: string }
) {
    const gradeElement = await cms.page?.$(CommunicationSelectors.gradesAutocompleteInput);

    // TODO: @notification remove after using new form
    await cms.page!.click(
        gradeElement
            ? CommunicationSelectors.gradesAutocompleteInput
            : CommunicationSelectors.gradesMasterAutocompleteHF
    );

    if (isGradeAll) {
        await cms.instruction('Select all grades on compose dialog', async () => {
            await cms.chooseOptionInAutoCompleteBoxByOrder(1);
        });
    } else {
        if (!gradeMasterStudent) throw `Cannot find gradeMasterStudent in selectGradesOnDialog`;

        await cms.instruction(`Select ${gradeMasterStudent} on compose dialog`, async () => {
            await cms.chooseOptionInAutoCompleteBoxByText(gradeMasterStudent);
        });
    }
}

export async function fillCoursesOnDialogWithOptions(
    cms: CMSInterface,
    context: ScenarioContext,
    course: SelectType
) {
    await cms.instruction(`Selecting course with type: "${course}"`, async function () {
        await cms.waitingAutocompleteLoading(CommunicationSelectors.coursesAutocompleteInput);

        if (course === 'All') await selectCoursesOnDialog(cms, context, true);
        if (course === 'Specific') await selectCoursesOnDialog(cms, context);

        // https://playwright.dev/docs/api/class-keyboard/
        await cms.page?.keyboard.press('Escape');
    });
}

export async function fillGradesOnDialogWithOptions(
    cms: CMSInterface,
    { gradeMasterStudent, grade }: { gradeMasterStudent?: string; grade: SelectType }
) {
    await cms.instruction(`Selecting grade with type: "${grade}"`, async () => {
        await selectGradesOnDialog(cms, { gradeMasterStudent, isGradeAll: grade === 'All' });
    });
}

export async function selectRecipientsOnDialog(
    cms: CMSInterface,
    context: ScenarioContext,
    recipientsSelectType: RecipientsSelectType
) {
    const { course, grade, individual, studentRoles } = recipientsSelectType;
    const { gradeMaster } = context.get<UserProfileEntity>(
        learnerProfileAliasWithAccountRoleSuffix(studentRoles || 'student')
    );

    if (individual) {
        await cms.instruction(`Selecting individual with type: "${individual}"`, async function () {
            await cms.waitingAutocompleteLoading(CommunicationSelectors.studentsAutocompleteInput);
            await selectIndividualRecipientOnDialog(cms, context, studentRoles);
        });
    }

    if (course) {
        await fillCoursesOnDialogWithOptions(cms, context, course);
    }

    if (gradeMaster && grade) {
        await fillGradesOnDialogWithOptions(cms, { grade, gradeMasterStudent: gradeMaster?.name });
    }
}

export async function selectUserTypesRadioOnDialog(cms: CMSInterface, userType: UserGroupType) {
    if (userType === 'Parent') await cms.page!.click(CommunicationSelectors.userTypeParentRadio);
    if (userType === 'Student') await cms.page!.click(CommunicationSelectors.userTypeStudentRadio);
}

export async function selectNotificationTypesRadioOnDialog(
    cms: CMSInterface,
    notificationType: NotificationType
) {
    if (notificationType === 'Now')
        await cms.page!.click(CommunicationSelectors.notificationTypeNowRadio);
    if (notificationType === 'Schedule')
        await cms.page!.click(CommunicationSelectors.notificationTypeScheduleRadio);
}

export async function fillTitleAndContentOnDialog(
    cms: CMSInterface,
    context: ScenarioContext,
    { title, content }: TitleContentValues
) {
    if (typeof title !== 'undefined') {
        await cms.instruction(`Fill title on notification dialog`, async function () {
            await cms.page?.fill(CommunicationSelectors.notificationTitleInput, title);
            context.set(aliasCreatedNotificationName, title);
        });
    }

    if (typeof content !== 'undefined') {
        await cms.instruction(`Fill content on notification dialog`, async function () {
            await cms.page?.fill(CommunicationSelectors.notificationContentInput, content);
            context.set(aliasCreatedNotificationContent, content);
        });
    }
}

export async function fillEmptyTitleAndContentOnDialog(
    cms: CMSInterface,
    { title, content }: TitleContentValues
) {
    if (typeof title !== 'undefined') {
        await cms.instruction(`Fill empty title on notification dialog`, async function () {
            await cms.page?.fill(CommunicationSelectors.notificationTitleInput, title);
        });
    }

    if (typeof content !== 'undefined') {
        await cms.instruction(`Fill empty content on notification dialog`, async function () {
            await cms.page?.fill(CommunicationSelectors.notificationContentInput, content);
        });
    }
}

export async function openAndInputNotificationDataToComposeForm(
    cms: CMSInterface,
    context: ScenarioContext
) {
    await cms.instruction('Opens compose dialog', async function (this: CMSInterface) {
        await openComposeMessageDialog(this);
    });

    await cms.instruction(
        'Selects courses, grades and individual recipients on the compose dialog',
        async function (this: CMSInterface) {
            await selectRecipientsOnDialog(this, context, {
                course: 'Specific',
                grade: 'Specific',
                individual: 'Specific',
            });
        }
    );

    await cms.instruction(
        'Selects the "All" user type on the compose dialog',
        async function (this: CMSInterface) {
            await selectUserTypesRadioOnDialog(this, 'All');
        }
    );

    await cms.instruction(
        'Fills the title and content of the compose dialog',
        async function (this: CMSInterface) {
            await fillTitleAndContentOnDialog(this, context, {
                title: `Title E2E ${getRandomNumber()}`,
                content: `Content ${getRandomNumber()}`,
            });
        }
    );
}

export async function uploadNotificationAttachmentOnDialog(
    cms: CMSInterface,
    context: ScenarioContext
) {
    await cms.instruction('Upload attachment of the notification', async function () {
        await cms.page?.click(CommunicationSelectors.notificationUploadButton);

        // Note that Promise.all prevents a race condition
        const [response] = await Promise.all([
            cms.waitForGRPCResponse('bob.v1.UploadService/GenerateResumableUploadURL'),
            cms.uploadAttachmentFiles(samplePDFFilePath, FileTypes.PDF, undefined, context),
        ]);

        const decoder = createGrpcMessageDecoder(ResumableUploadURLResponse);
        const encodedResponseText = await response?.text();
        const decodedResponse = decoder.decodeMessage(encodedResponseText);

        context.set(aliasAttachmentDownloadUrl, decodedResponse?.toObject().downloadUrl);
    });

    await cms.waitingForLoadingIcon();
}

export async function selectNotificationCategoryFilter(
    cms: CMSInterface,
    type: NotificationCategory
) {
    await cms.instruction(
        `Choose ${type} category on notification category box`,
        async function () {
            if (type === 'All') await cms.page?.click(CommunicationSelectors.menuItemAll);
            if (type === 'Draft') await cms.page?.click(CommunicationSelectors.menuItemDraft);
            if (type === 'Sent') await cms.page?.click(CommunicationSelectors.menuItemSent);
            if (type === 'Scheduled')
                await cms.page?.click(CommunicationSelectors.menuItemSchedule);

            await cms.waitForSkeletonLoading();
        }
    );
}

export async function clickCreatedNotificationByIdOnTable(
    cms: CMSInterface,
    context: ScenarioContext
) {
    const createdNotificationID = context.get<string>(aliasCreatedNotificationID);

    await cms.instruction(
        `Click on notification by id ${createdNotificationID} in notification table`,
        async () => {
            const notificationTableElement = await cms.page?.waitForSelector(
                CommunicationSelectors.notificationTable
            );
            await cms.waitForSkeletonLoading();

            const notificationRow = await notificationTableElement?.waitForSelector(
                CommunicationSelectors.notificationTableRowWithId(createdNotificationID),
                { timeout: 10000 }
            );

            const notificationTitleAnchor = await notificationRow?.waitForSelector(
                CommunicationSelectors.notificationTitle
            );

            await notificationTitleAnchor?.click();
        }
    );
}

export async function assertNotificationAttachment(
    cms: CMSInterface,
    context: ScenarioContext,
    options?: AssertAttachmentOptions
) {
    const notificationAttachmentName = context.get<string>(aliasAttachmentFileNames);
    const notificationAttachmentDownloadUrl = context.get<string>(aliasAttachmentDownloadUrl);

    if (!notificationAttachmentName || !notificationAttachmentDownloadUrl) {
        await cms.instruction(`Don't have attach file`, async () => {
            const notificationGeneralInfoAttachmentElement = await cms.page!.$(
                CommunicationSelectors.notificationGeneralInfoAttachmentFiles
            );
            const notificationGeneralInfoAttachmentText =
                await notificationGeneralInfoAttachmentElement?.textContent();

            weExpect(notificationGeneralInfoAttachmentText).toEqual('--');
        });
    } else {
        await cms.instruction(
            `Assert file attachment with name ${notificationAttachmentName}`,
            async function () {
                await cms.assertAttachmentFiles(context);
            }
        );

        if (options?.shouldAttachmentALink) {
            await cms.instruction('Assert file attachment link', async () => {
                await cms.page?.waitForSelector(
                    `${CommunicationSelectors.notificationChipFileContainer} a[target="_blank"][href="${notificationAttachmentDownloadUrl}"]`
                );
            });
        }
    }
}

export async function selectNotificationSentByIdOnTable(
    cms: CMSInterface,
    context: ScenarioContext
) {
    await cms.waitForSkeletonLoading();

    const createdNotificationID = context.get<string>(aliasCreatedNotificationID);

    await cms.instruction(`Select notification by id ${createdNotificationID}`, async function () {
        const selectedNotification = await cms.page?.waitForSelector(
            `[href="/communication/notifications/${createdNotificationID}/show"]`,
            { timeout: 3000 }
        );

        await selectedNotification?.click();
    });
}

export async function assertNotificationSentDetail(cms: CMSInterface, context: ScenarioContext) {
    const createdNotificationName: string = context.get<string>(aliasCreatedNotificationName);
    const createdCourseName: string = context.get<string>(aliasNotificationCreatedCourseName);
    const { name: createdStudentName, gradeMaster } = context.get<UserProfileEntity>(
        learnerProfileAliasWithAccountRoleSuffix('student')
    );

    const createdContent: string = context.get<string>(aliasCreatedNotificationContent);
    const notificationStatus = 'Sent';

    await cms.instruction(`Assert sent notification detail`, async function () {
        await cms.instruction(
            `Assert correct sent notification data with:
             - Title: "${createdNotificationName}"
             - Content: "${createdContent}"
             - Status: "${notificationStatus}"`,
            async function () {
                const notificationTitle = await cms.page!.waitForSelector(
                    CommunicationSelectors.notificationDetailTitle,
                    { timeout: 10000 }
                );

                const notificationTitleText = await notificationTitle?.textContent();

                weExpect(notificationTitleText).toEqual(createdNotificationName);

                await cms.waitForSelectorHasText(
                    CommunicationSelectors.notificationDetailStatus,
                    notificationStatus
                );
                await cms.waitForSelectorHasText(
                    CommunicationSelectors.notificationDetailContent,
                    createdContent
                );
            }
        );

        await cms.instruction(
            `Assert correct sent notification recipient dropdown data with:
             - Course name: ${createdCourseName}
             - Student name: ${createdStudentName}
             - Grade name: ${gradeMaster?.name}`,
            async function () {
                await cms.page?.click(
                    CommunicationSelectors.notificationDetailRecipientDropdownButton
                );
                await cms.waitForSelectorHasText(
                    CommunicationSelectors.notificationDetailRecipientDropdown,
                    createdCourseName
                );
                if (gradeMaster) {
                    await cms.waitForSelectorHasText(
                        CommunicationSelectors.notificationDetailRecipientDropdown,
                        gradeMaster?.name
                    );
                }

                await cms.waitForSelectorHasText(
                    CommunicationSelectors.notificationDetailRecipientDropdown,
                    createdStudentName
                );
                await cms.waitForSelectorHasText(
                    CommunicationSelectors.notificationDetailRecipientDropdown,
                    'Student' || 'Parent'
                );
            }
        );
    });
}

export async function learnerClickOnNotificationIcon(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver!;
    const notificationFinder = new ByValueKey(LearnerKeys.notificationIcon);
    await driver.tap(notificationFinder);
}

export async function learnerVerifyNotificationItem(
    learner: LearnerInterface,
    active: boolean
): Promise<void> {
    const driver = learner.flutterDriver!;

    const activeFinder = new ByValueKey(readNotificationStatus(active, firstIndex));
    await driver.waitFor(activeFinder, 20000);
}

export async function learnerClickOnNotificationItem(
    learner: LearnerInterface,
    active: boolean
): Promise<void> {
    const driver = learner.flutterDriver!;

    await learnerVerifyNotificationItem(learner, active);

    const notificationItemFinder = new ByValueKey(notificationItem(firstIndex));
    await driver.tap(notificationItemFinder);
}

export async function learnerSeesNotificationItem(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver!;

    const notificationItemFinder = new ByValueKey(notificationItem(firstIndex));
    await driver.waitFor(notificationItemFinder);
}

export async function learnerDontSeeNotificationItem(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver!;

    const notificationItemFinder = new ByValueKey(notificationItem(firstIndex));
    await driver.waitForAbsent(notificationItemFinder);
}

export async function learnerInNotificationDetail(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver!;
    const notificationDetailFinder = new ByValueKey(LearnerKeys.notificationDetail);
    await driver.waitFor(notificationDetailFinder);
}

export async function learnerSeesNotificationDetail(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver!;
    const titleDetailFinder = new ByValueKey(LearnerKeys.notificationDetailTitle);
    await driver.waitFor(titleDetailFinder);

    const contentDetailFinder = new ByValueKey(LearnerKeys.notificationDetailContent);
    await driver.waitFor(contentDetailFinder);
}

export async function learnerCloseNotificationDetail(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver!;
    const closeButtonFinder = new ByValueKey(LearnerKeys.close_button);
    await driver.tap(closeButtonFinder);
}

export function getAccountRoles(accounts: string, index: number): AccountRoles {
    const roles = convertOneOfStringTypeToArray(accounts);

    if (roles.length === 1) return accounts as AccountRoles;

    const role = roles[index] as AccountRoles;
    return role;
}

export function getRandomAccountRoles(accounts: string) {
    const roles = convertOneOfStringTypeToArray(accounts);
    if (roles.length === 1) return accounts as AccountRoles;

    const randIndex = randomInteger(0, roles.length - 1);
    const role = roles[randIndex] as AccountRoles;
    return role;
}

export function getActionButtonNotification(
    buttonName: string,
    index: number
): NotificationActionButton {
    if (buttonName.includes('1 of')) {
        const buttonAction = convertOneOfStringTypeToArray(buttonName);
        const buttonActionName = buttonAction[index] as NotificationActionButton;
        return buttonActionName;
    }
    return buttonName as NotificationActionButton;
}

export function getReadNotificationAccountType(
    accounts: string,
    index: number
): ReadNotificationAccountType {
    const roles = convertOneOfStringTypeToArray(accounts);

    if (roles.length === 1) return roles[0] as ReadNotificationAccountType;

    const role = roles[index] as ReadNotificationAccountType;
    return role;
}

export function getCMSSections(pages: string, index: number): NotificationCategory {
    const sections = convertOneOfStringTypeToArray(pages);
    const section = sections[index] as NotificationCategory;
    return section;
}

export const goToNotificationsPage = async (cms: CMSInterface) => {
    const page = cms.page!;

    await page.goto('/communication/notifications');

    await cms.waitForSkeletonLoading();
};

export async function assertNotificationRowOnTableById(
    cms: CMSInterface,
    {
        notificationId,
        notificationName,
        expectStatus,
        responseCheckRecipientData,
    }: {
        notificationId: string;
        notificationName: string;
        expectStatus: ComposeType;
        responseCheckRecipientData?: CheckNotificationStatusInTimeReturn;
    }
) {
    const notificationTableElement = await cms.page!.waitForSelector(
        CommunicationSelectors.notificationTable
    );

    const notificationRow = await notificationTableElement.waitForSelector(
        CommunicationSelectors.notificationTableRowWithId(notificationId)
    );

    await cms.attach(`Notification Title: ${notificationName}`);

    const notificationTitleElement = await notificationRow.waitForSelector(
        `${CommunicationSelectors.notificationTitle} p`,
        { timeout: 10000 }
    );

    const notificationTitle = await notificationTitleElement.getAttribute('title');
    weExpect(notificationTitle).toEqual(notificationName);

    const notificationReadCountColumnElement = await cms.page?.waitForSelector(
        CommunicationSelectors.notificationReadCountColumn,
        { timeout: 10000 }
    );

    const readNumberColumnValue = await notificationReadCountColumnElement?.textContent();

    const readTextMatch: string =
        expectStatus === 'Sent' && responseCheckRecipientData
            ? getTotalRecipientString(responseCheckRecipientData)
            : '--';

    await cms.attach(`Notification Read: ${readNumberColumnValue}`);
    weExpect(readNumberColumnValue).toEqual(readTextMatch);

    const notificationStatusColumnElement = await cms.page?.$(
        CommunicationSelectors.notificationTableStatus
    );

    const statusColumnValue = await notificationStatusColumnElement?.textContent();
    await cms.attach(`Notification Status: ${statusColumnValue}`);
    weExpect(statusColumnValue).toEqual(expectStatus);
}

export async function passValuesInAssertNotificationRowOnTableById(
    cms: CMSInterface,
    scenario: ScenarioContext
) {
    const title = scenario.get(aliasCreatedNotificationName);
    const notificationId = await getNotificationIdByTitleWithHasura(cms, title);

    if (!notificationId) {
        throw `Cannot find notificationId with notification title ${title}`;
    }

    const responseRecipientData =
        await getInfoNotificationStatusAndCountReadByNotificationIdWithHasura(cms, notificationId);

    if (!responseRecipientData || !responseRecipientData?.status) {
        throw `Empty responseCheckRecipientData ${responseRecipientData}`;
    }

    const notificationStatus = getNotificationStatusText(responseRecipientData.status);

    if (!notificationStatus) {
        throw `Not match notification status`;
    }

    await cms.instruction(`Select notification ${notificationStatus} category`, async () => {
        await selectNotificationCategoryFilter(cms, notificationStatus);
    });

    await cms.waitForSkeletonLoading();
    await cms.page?.waitForSelector(
        CommunicationSelectors.notificationTableRowWithId(notificationId)
    );

    await cms.instruction(`Assert notification data in table`, async () => {
        await assertNotificationRowOnTableById(cms, {
            expectStatus: notificationStatus,
            notificationId,
            notificationName: title,
            responseCheckRecipientData:
                mappingResponseOfCheckNotificationStatusInTime(responseRecipientData),
        });
    });
}

export async function addHyperlinkNotificationEditor(
    cms: CMSInterface,
    context: ScenarioContext,
    link: string
) {
    await cms.selectAButtonByAriaLabel(CommunicationSelectors.notificationEditorLinkAriaLabel);
    await cms.page?.fill(
        `${CommunicationSelectors.notificationEditorInlineLinkInput} > div > input`,
        link
    );
    await cms.page?.click(CommunicationSelectors.notificationEditorAddInlineLinkButton);
    context.set(aliasCreatedNotificationContentLink, link);
}

export async function assertNotificationRecipientTable(cms: CMSInterface, readCount: string) {
    const page = cms.page!;
    const notificationRecipientRows = await page.$$(
        CommunicationSelectors.notificationDetailRecipientStatus
    );
    const notificationAccountRead = [];
    for (const row of notificationRecipientRows) {
        const isRead = await row.$(`p:text-is("Read")`);
        if (isRead) notificationAccountRead.push(row);
    }

    weExpect(notificationAccountRead.length).toEqual(Number(readCount.split('/')[0]));
}

export async function assertNotificationRecipientTableByReaderId(
    cms: CMSInterface,
    readerName: string
): Promise<ElementHandle<SVGElement | HTMLElement>[]> {
    const page = cms.page!;
    const notificationRecipientRows = await page.$$(
        `${CommunicationSelectors.notificationDetailRecipientTable} > ${tableBaseBody} > ${tableBaseRow}`
    );

    const notificationAccountRead = [];

    for (const row of notificationRecipientRows) {
        const isRead = await row.$(`p:text-is("Read")`);
        const isLinkName = await row.$(
            `${CommunicationSelectors.notificationDetailRecipientLinkName}:is(:has-text("${readerName}"))`
        );

        if (isRead && isLinkName) notificationAccountRead.push(row);
    }

    return notificationAccountRead;
}

export async function getUserNamesByAccountRoles(
    learner: LearnerInterface,
    parent: LearnerInterface,
    accountRole: ReadNotificationAccountType
): Promise<string[]> {
    switch (accountRole) {
        case 'student': {
            const studentName = (await learner.getProfile()).name;
            return [studentName];
        }
        case 'parent P1': {
            const parentName = (await parent.getProfile()).name;
            return [parentName];
        }
        case 'student and parent P1': {
            const studentName = (await learner.getProfile()).name;
            const parentName = (await parent.getProfile()).name;
            return [studentName, parentName];
        }
        default:
            return [];
    }
}

export async function teacherSeesLoadingDialog(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;

    await driver.runUnsynchronized(async () => {
        await driver.waitFor(new ByValueKey(TeacherKeys.joinAllLoadingDialog));
    });
}

export async function learnerAssertAttachment(
    learner: LearnerInterface,
    name: string,
    index: number
): Promise<void> {
    const driver = learner.flutterDriver!;
    const attachmentFinder = new ByValueKey(LearnerKeys.notificationAttachmentItem(name, index));
    await driver.tap(attachmentFinder);
}

export async function learnerSeesPDFAttachmentDetail(learner: LearnerInterface, name: string) {
    const driver = learner.flutterDriver!;

    const attachmentFinder = new ByValueKey(attachmentPdfKey(name));
    await driver.waitFor(attachmentFinder);
}

export async function teacherJoinLearnerConversation(
    teacher: TeacherInterface,
    studentId: string,
    studentName: string,
    isParent: boolean
): Promise<void> {
    //Teacher selects unjoined tab'
    await teacherSelectedUnJoinedTab(teacher);

    //'Teacher search student name'
    await teacherSearchConversationByStudentName(teacher, studentName);

    // When create student with parent info. The Event Create Student & Parent Conversation will send in parallel.
    // Parent conversation need create after student Conversation.
    // In case create Parent Conversation while student conversation hasn't created, the function create Parent Conversation will fail, and will retry after 30s.
    try {
        await teacherSelectConversation(teacher, isParent, studentId);
    } catch (error) {
        console.error(error);
        // Retry search student name and select the conversation
        await teacherSearchConversationByStudentName(teacher, studentName);

        await teacherSelectConversation(teacher, isParent, studentId);
    }

    //'Teacher joins chat group'
    await teacherTapJoinChatGroupButton(teacher);
}

export async function teacherSelectConversation(
    teacher: TeacherInterface,
    isParent: boolean,
    studentId: string
) {
    isParent
        ? await teacherSelectParentGroupChat(teacher, studentId)
        : await teacherSelectStudentChatGroup(teacher, studentId);
}

export async function learnerSelectStudentChatGroup(
    learner: LearnerInterface,
    studentId: string
): Promise<void> {
    const driver = learner.flutterDriver!;
    const studentGroupChatFinder = new ByValueKey(TeacherKeys.studentConversationItem(studentId));

    await driver.tap(studentGroupChatFinder, 10000);
}

export async function learnerSelectParentGroupChat(
    learner: LearnerInterface,
    studentId: string
): Promise<void> {
    const driver = learner.flutterDriver!;

    const parentGroupChatFinder = new ByValueKey(TeacherKeys.parentConversationItem(studentId));
    await driver.tap(parentGroupChatFinder, 10000);
}

export async function learnerSelectConversation(
    learner: LearnerInterface,
    isParent: boolean,
    studentId: string
) {
    isParent
        ? await learnerSelectParentGroupChat(learner, studentId)
        : await learnerSelectStudentChatGroup(learner, studentId);
}

export async function teacherTapFilterIconButton(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;

    const filterIconFinder = new ByValueKey(TeacherKeys.filterIcon);
    await driver.tap(filterIconFinder);
}

export async function teacherTapApplyFilterButton(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;

    const applyButtonFinder = new ByValueKey(TeacherKeys.applyButton);
    await driver.tap(applyButtonFinder);
}

export async function teacherFilterMessageType(
    teacher: TeacherInterface,
    messageTypeFilter: MessageTypeFilter
) {
    const driver = teacher.flutterDriver!;

    switch (messageTypeFilter) {
        case MessageTypeFilter.all:
            {
                const messageTypeFilterAllFinder = new ByValueKey(TeacherKeys.messageTypeFilterAll);
                await driver.tap(messageTypeFilterAllFinder);
            }
            break;
        case MessageTypeFilter.notReply:
            {
                const messageTypeFilterNotReplyFinder = new ByValueKey(
                    TeacherKeys.messageTypeFilterNotReply
                );
                await driver.tap(messageTypeFilterNotReplyFinder);
            }
            break;
    }
}

export async function teacherFilterContact(
    teacher: TeacherInterface,
    contactFilter: ContactFilter
) {
    const driver = teacher.flutterDriver!;

    switch (contactFilter) {
        case ContactFilter.all:
            {
                const contactFilterAllFinder = new ByValueKey(TeacherKeys.contactFilterAll);
                await driver.tap(contactFilterAllFinder);
            }
            break;
        case ContactFilter.student:
            {
                const contactFilterStudentFinder = new ByValueKey(TeacherKeys.contactFilterStudent);
                await driver.tap(contactFilterStudentFinder);
            }
            break;
        case ContactFilter.parent:
            {
                const contactFilterParentFinder = new ByValueKey(TeacherKeys.contactFilterParent);
                await driver.tap(contactFilterParentFinder);
            }
            break;
    }
}

export async function verifySenderAvatar(
    client: LearnerInterface | TeacherInterface,
    url: string,
    studentId: string
): Promise<void> {
    if (url === '' || url === null) return;

    const driver = client.flutterDriver;

    const avatarFinder = new ByValueKey(userAvatarConversationKey(url, studentId));
    await driver?.waitFor(avatarFinder);
}

export async function verifySenderName(
    client: LearnerInterface | TeacherInterface,
    name: string,
    studentId: string
): Promise<void> {
    const driver = client.flutterDriver;

    const nameFinder = new ByValueKey(userNameConversationKey(name, studentId));
    await driver?.waitFor(nameFinder);
}

export async function verifyNotificationTableOrderLastUpdated(cms: CMSInterface): Promise<void> {
    const page = cms.page!;
    const notificationLastModified = await page.$$(
        CommunicationSelectors.notificationTableLastUpdatedColumn
    );

    if (notificationLastModified && notificationLastModified.length > 1) {
        const notificationLastModified1 = await notificationLastModified[0].evaluate(
            (el) => el.textContent
        );
        const notificationLastModified2 = await notificationLastModified[1].evaluate(
            (el) => el.textContent
        );

        const firstTime = new Date(notificationLastModified1!).getTime();
        const secondsTime = new Date(notificationLastModified2!).getTime();
        weExpect(firstTime - secondsTime).toBeGreaterThan(-1);
    }
}

export async function clickActionButtonByName(
    buttonName: NotificationActionButton,
    cms: CMSInterface,
    context: ScenarioContext
): Promise<void> {
    switch (buttonName) {
        case 'Close':
            await clickCloseComposeDialog(cms);
            break;
        case 'Save draft':
            await clickSaveDraftNotification(cms, context);
            break;
        case 'Send':
            await clickSendNotification(cms);
            break;
        case 'Discard':
            await clickDiscardNotificationButton(cms);
            break;
        case 'Save schedule':
            await clickSaveScheduleNotificationButton(cms, context);
            break;
        case 'Clone':
            await cms.selectElementByDataTestId(CommunicationSelectors.notificationCloneButton);
            break;
        default:
            break;
    }
}

export function getStudentLengthByType(type: UserGroupType, receiverIdsList: string[]): number {
    if (type === 'Parent') return 0;

    return receiverIdsList.length;
}

export function getTotalRecipientString({ all, isSent, read }: GetTotalRecipientStringParam) {
    return isSent ? `${read}/${all}` : '--';
}

export async function fillTitleOrContent(
    cms: CMSInterface,
    context: ScenarioContext,
    emptyField: string
) {
    const scheduleValue = `Schedule Notification E2E ${getRandomNumber()}`;

    const titleContentValues: TitleContentValues = {
        title: `Title ${scheduleValue}`,
        content: `Content ${scheduleValue}`,
    };

    if (emptyField !== 'Title') {
        await fillTitleAndContentOnDialog(cms, context, {
            title: titleContentValues['title'],
        });
    }

    if (emptyField !== 'Content') {
        await fillTitleAndContentOnDialog(cms, context, {
            content: titleContentValues['content'],
        });
    }
}

export function getRandomCourseFilter(courseFiltersString: string): CourseFilter {
    const courses = convertOneOfStringTypeToArray(courseFiltersString);
    const randomIndex = randomInteger(0, courses.length - 1);
    return courses[randomIndex] as CourseFilter;
}

export async function createABookWithAnAssignment(cms: CMSInterface, context: ScenarioContext) {
    const {
        request: { booksList: books },
    } = await createRandomBookByGRPC(cms, context);
    const bookId = books[0].bookId;

    const {
        request: { chaptersList },
    } = await createRandomChapters(
        cms,
        { bookId: bookId },
        {
            quantity: 1,
        }
    );
    const chapterId = chaptersList[0].info!.id;

    const {
        request: { topicsList },
    } = await createRandomTopics(cms, { quantity: 1, chapterId: chapterId });
    const topic = topicsList[0];

    const {
        request: { assignmentsList },
    } = await createRandomAssignments(cms, {
        quantity: 1,
        topicId: topic.id,
        allowResubmission: true,
    });
    const assignmentName = assignmentsList[0].name;

    context.set(aliasBooks, books);
    context.set(aliasAssignments, assignmentsList);
    context.set(aliasTopicName, topic.name);
    context.set(aliasAssignmentName, assignmentName);
}

export async function createStudyPlanWithAssignmentForStudent(
    cms: CMSInterface,
    context: ScenarioContext
) {
    const learnerProfile = getUserProfileFromContext(
        context,
        learnerProfileAliasWithAccountRoleSuffix('student')
    );
    const studentId = learnerProfile.id;
    const { courseId } = await addACourseForStudentsByGRPC({
        cms,
        scenario: context,
        studentId: studentId,
    });
    const books = context.get<Book[]>(aliasBooks);
    const assignments = context.get<Assignment[]>(aliasAssignments);

    const { studyPlanName } = await schoolAdminHasCreatedStudyPlanV2(cms, courseId, books, {
        studyPlanItems: assignments,
        studyplanTestCase: 'active',
    });

    context.set(aliasStudyPlanName, studyPlanName);
}

export async function changeStatusOfAssignmentToReturned(
    teacher: TeacherInterface,
    context: ScenarioContext
) {
    const assignmentName = context.get<string>(aliasAssignmentName);
    const courseId = context.get<string>(aliasCourseId);
    const learnerProfile = getUserProfileFromContext(
        context,
        learnerProfileAliasWithAccountRoleSuffix('student')
    );
    const studentId = learnerProfile.id;

    await teacherGoesToStudyPlanDetails(teacher, courseId, studentId);

    await teacherSeeStudyPlanItem(teacher, assignmentName);

    await teacherGoesToStudyPlanItemDetails(teacher, assignmentName);

    await teacherReturnsAndSavesChanges(teacher);
}

export async function learnerSeesNotificationBadge(
    learner: LearnerInterface,
    totalNewNotification: number
) {
    const driver = learner.flutterDriver!;

    const notificationBadgeFinder = new ByValueKey(notificationBadge(totalNewNotification));
    await driver.waitFor(notificationBadgeFinder);
}

export async function learnerNotSeesNotificationBadge(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;

    const notificationBadgeFinder = new ByValueKey(notificationBadge(0));
    await driver.waitForAbsent(notificationBadgeFinder);
}

export async function schoolAdminSeesErrorMessage(cms: CMSInterface, fieldKey: NotificationFields) {
    switch (fieldKey) {
        case 'Title': {
            await seesNotificationTitleError(cms);
            break;
        }
        case 'Content': {
            await seesNotificationContentError(cms);
            break;
        }
        case 'Title & Content': {
            await seesNotificationTitleError(cms);
            await seesNotificationContentError(cms);
            break;
        }
        case 'Recipient Group': {
            await seeNotificationRecipientGroupError(cms);
            break;
        }
        default:
            break;
    }
}

export const seesNotificationTitleError = async (cms: CMSInterface) => {
    const page = cms.page!;

    await cms.instruction('Sees error message for Title input', async () => {
        const notificationTitleInputEl = await page.waitForSelector(
            CommunicationSelectors.notificationTitleInput
        );

        // NOTE: The error message outside for the notification title input
        const notificationTitleInputContainerEl = await notificationTitleInputEl?.getProperty(
            'parentNode'
        );
        const notificationTitleContainerEl = await notificationTitleInputContainerEl?.getProperty(
            'parentNode'
        );
        await notificationTitleContainerEl
            .asElement()
            ?.waitForSelector(CommunicationSelectors.mandatoryFieldErrorTypography);
    });
};

export const seesNotificationContentError = async (cms: CMSInterface) => {
    const page = cms.page!;

    await cms.instruction('Sees error message for Content input', async () => {
        const notificationContentEl = await page.waitForSelector(
            CommunicationSelectors.notificationContent
        );
        await notificationContentEl?.waitForSelector(
            CommunicationSelectors.mandatoryFieldErrorTypography
        );
    });
};

export async function seeNotificationRecipientGroupError(cms: CMSInterface) {
    const page = cms.page!;

    await cms.instruction('See error message for course', async function () {
        const notificationCourse = await page.waitForSelector(
            CommunicationSelectors.coursesAutocompleteHF
        );
        await notificationCourse?.waitForSelector(
            CommunicationSelectors.mandatoryFieldErrorTypography
        );
    });

    await cms.instruction('See error message for grade', async function () {
        const notificationGrade = await page.waitForSelector(
            CommunicationSelectors.gradesMasterAutocompleteHF
        );
        await notificationGrade?.waitForSelector(
            CommunicationSelectors.mandatoryFieldErrorTypography
        );
    });

    await cms.instruction('See error message for individual email', async function () {
        const notificationIndividual = await page.waitForSelector(
            CommunicationSelectors.studentsAutocompleteHF
        );
        await notificationIndividual?.waitForSelector(
            CommunicationSelectors.mandatoryFieldErrorTypography
        );
    });
}

export async function createStudentWithCountryCode(
    cms: CMSInterface,
    context: ScenarioContext,
    countryCode: Country
) {
    const studentSuffix = 'student';
    const studentKey = learnerProfileAliasWithAccountRoleSuffix(studentSuffix);
    const newStudent = await createAStudentPromise(cms, {
        hasPhoneNumber: false,
        countryCode,
    });

    await cms.attach(
        `Create a student ${studentKey} with VN country code:
        \nStudent name: ${newStudent.name}
        \nCountry: ${newStudent.countryEnum}`
    );

    // Set student or learner app login
    context.set(studentKey, newStudent);

    // Support for single profile
    context.set(learnerProfileAlias, newStudent);
}

export async function learnerReloadConversationList(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver!;

    await driver.reload();
    await moveLearnerToMessagePage(learner);
}

export async function teacherReloadMessagingScreen(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;

    await driver.reload();
    await driver.waitFor(new ByValueKey(messagingScreen), 20000);
}

export async function teacherHasFilterLocationsOnTeacherApp(
    teacher: TeacherInterface,
    locationIdList: string[]
) {
    const driver = teacher.flutterDriver!;

    const listKey = new ByValueKey(TeacherKeys.locationTreeViewScrollView);

    for (const locationId of locationIdList) {
        const itemKey = new ByValueKey(
            TeacherKeys.locationCheckStatus(locationId, LocationItemCheckBoxStatus.unCheck)
        );

        await driver.scrollUntilVisible(listKey, itemKey, 0.0, 0.0, -6000, 30000);

        await driver.tap(itemKey, 10000);
    }
}

export async function teacherHasFilterFistLocationOnTeacherApp(
    teacher: TeacherInterface,
    firstLocationId: string
) {
    const driver = teacher.flutterDriver!;

    try {
        const itemKey = new ByValueKey(
            TeacherKeys.locationCheckStatus(firstLocationId, LocationItemCheckBoxStatus.unCheck)
        );

        await driver.tap(itemKey);
    } catch {
        console.log('First location has been selected');
    }
}

export async function searchNotificationTitleOnCMS(
    cms: CMSInterface,
    name: string,
    notificationId: string
) {
    const page = cms.page!;

    await cms.instruction(
        `Search notification title: ${name} on CMS`,
        async function (this: LearnerInterface) {
            await page.fill(
                CommunicationSelectors.formFilterAdvancedTextFieldSearchNotificationFilterInput,
                name
            );

            await page.keyboard.press('Enter');
        }
    );
    await page.waitForSelector(CommunicationSelectors.notificationTableRowWithId(notificationId));
    await cms.waitForSkeletonLoading();
    await cms.page?.waitForTimeout(3000);
}

export function getFirstLocationId(scenario: ScenarioContext): string {
    const firstGrantedLocation = scenario.get<LocationObjectGRPC>(aliasFirstGrantedLocation);
    return firstGrantedLocation.locationId;
}
