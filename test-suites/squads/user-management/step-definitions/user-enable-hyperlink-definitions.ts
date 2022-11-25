import { TeacherKeys } from '@common/teacher-keys';
import {
    staffProfileAliasWithAccountRoleSuffix,
    commentListHistoryTeacherAlias,
} from '@user-common/alias-keys/user';

import { AccountRoles, TeacherInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import createGrpcMessageDecoder from '@supports/packages/grpc-message-decoder/grpc-message-decoder';
import { ScenarioContext } from '@supports/scenario-context';

import { ByValueKey, ByText } from 'flutter-driver-x';
import { RetrieveStudentCommentResponse } from 'manabie-bob/student_pb';
import moment from 'moment';

export enum ResultHyperlinks {
    CAN = 'can',
    CANNOT = 'cannot',
}

export enum ConditionHyperlinks {
    INCLUDED = 'included',
    EXCLUDED = 'excluded',
}

export enum TextHyperlinks {
    HTTP = 'http://',
    HTTPS = 'https://',
}

export enum Content {
    HYPER_LINKS = 'manabie.com',
    ONLY_TEXT = 'only comment',
}

export const teacherGenStudentStudyPlanUrl = async (
    teacher: TeacherInterface,
    courseId: string,
    studentId: string
) => {
    const origin = await teacher.flutterDriver?.webDriver?.getUrlOrigin();
    return `${origin}courseDetail?course_id=${courseId}/studentStudyPlan?student_id=${studentId}`;
};

export async function teacherGoToCommentHistoryScreenByUrl(
    teacher: TeacherInterface,
    courseId: string,
    studentId: string
) {
    const driver = teacher.flutterDriver!;

    const url = await teacherGenStudentStudyPlanUrl(teacher, courseId, studentId);

    await driver?.webDriver?.page.goto(url);

    const keyStudentInfoTab = new ByValueKey(TeacherKeys.studentInfoTab);

    await driver.tap(keyStudentInfoTab, 40000);
}

export async function teacherGoToCommentHistoryScreen(
    teacher: TeacherInterface,
    studentId: string
) {
    const driver = teacher.flutterDriver!;

    const keyStudentId = new ByValueKey(TeacherKeys.student(studentId));

    await driver.tap(keyStudentId, 40000);

    const keyStudentInfoTab = new ByValueKey(TeacherKeys.studentInfoTab);

    await driver.tap(keyStudentInfoTab, 40000);
}

export async function teacherTypeCommentInHistory(
    teacher: TeacherInterface,
    condition: ConditionHyperlinks,
    text: TextHyperlinks
) {
    const driver = teacher.flutterDriver!;

    const keyStudentCommentTextField = new ByValueKey(TeacherKeys.studentCommentTextField);

    await driver.tap(keyStudentCommentTextField);

    const commentContent =
        condition === ConditionHyperlinks.INCLUDED ? text + Content.HYPER_LINKS : Content.ONLY_TEXT;

    await driver.enterText(commentContent);
}

export async function teacherPostCommentInHistory(
    teacher: TeacherInterface,
    scenarioContext: ScenarioContext
) {
    const driver = teacher.flutterDriver!;

    const keyStudentCommentPostButton = new ByValueKey(TeacherKeys.studentCommentPostButton);

    const [response] = await Promise.all([
        driver.webDriver?.page.waitForResponse((resp) => {
            return resp.ok() && resp.url().includes('RetrieveStudentComment');
        }),
        driver.tap(keyStudentCommentPostButton),
    ]);

    const decoder = createGrpcMessageDecoder(RetrieveStudentCommentResponse, 'application/grpc');

    const encodedResponseText = await response?.body();

    const decodedResponse = decoder.decodeMessage(encodedResponseText)?.toObject().commentList;

    scenarioContext.set(commentListHistoryTeacherAlias, decodedResponse);
}

export async function teacherSeeCommentCorrectly(
    teacher: TeacherInterface,
    findCommentByText: ByText,
    scenarioContext: ScenarioContext,
    role: AccountRoles
) {
    const driver = teacher.flutterDriver!;

    const staffProfile = scenarioContext.get<UserProfileEntity>(
        staffProfileAliasWithAccountRoleSuffix(role)
    );

    const commentList = scenarioContext.get<RetrieveStudentCommentResponse.AsObject['commentList']>(
        commentListHistoryTeacherAlias
    );

    const dateTimeString = moment(commentList[0].studentComment?.createdAt?.seconds * 1000).format(
        'MM/DD, HH:mm'
    );

    const keyCommentAt = new ByValueKey(TeacherKeys.commentAt(dateTimeString));

    const keyNameTeacher = new ByValueKey(TeacherKeys.teacherName(staffProfile.name));

    await driver.waitFor(keyNameTeacher);

    await driver.waitFor(keyCommentAt);

    await driver.waitFor(findCommentByText);
}

export async function teacherCanTapToOpenHyperlinks(
    teacher: TeacherInterface,
    findCommentByText: ByText,
    conditionGetText: string
) {
    const driver = teacher.flutterDriver!;

    const [newPage] = await Promise.all([
        teacher.page?.context().waitForEvent('page'),

        driver.tap(findCommentByText),
    ]);

    await newPage?.waitForLoadState('domcontentloaded');

    const newUrl = newPage?.url();

    const buffer = await newPage?.screenshot();

    await teacher.instruction(
        'Teacher can see new page which is opened',
        async function () {
            weExpect(newUrl, 'Url new page should include hyperlinks').toContain(conditionGetText);
        },
        buffer
    );
}
