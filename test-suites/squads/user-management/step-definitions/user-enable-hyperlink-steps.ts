import { randomInteger, getTeacherInterfaceFromRole } from '@legacy-step-definitions/utils';
import { learnerProfileAlias, studentCoursePackagesAlias } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';
import { StudentCoursePackageEntity } from '@supports/entities/student-course-package-entity';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import {
    ConditionHyperlinks,
    Content,
    ResultHyperlinks,
    teacherCanTapToOpenHyperlinks,
    teacherGoToCommentHistoryScreen,
    teacherSeeCommentCorrectly,
    TextHyperlinks,
    teacherPostCommentInHistory,
    teacherTypeCommentInHistory,
    teacherGoToCommentHistoryScreenByUrl,
} from './user-enable-hyperlink-definitions';
import { verifyNewlyLearnerOnTeacherApp } from './user-view-course-definitions';
import { ByText } from 'flutter-driver-x';

Given('{string} is on Comment History screen', async function (this, role: AccountRoles) {
    if (!role.includes('teacher')) throw new Error('we do not allow other role');

    const teacher = getTeacherInterfaceFromRole(this, role);

    const scenario = this.scenario;

    const studentCoursePackages = scenario.get<Array<StudentCoursePackageEntity>>(
        studentCoursePackagesAlias
    );

    const learnerProfile = scenario.get<UserProfileEntity>(learnerProfileAlias);

    if (!studentCoursePackages.length) throw new Error('Not found student course packages');

    const randomNumberInt = randomInteger(0, 1);

    // Random go to by url or tap
    if (randomNumberInt) {
        await verifyNewlyLearnerOnTeacherApp(
            teacher,
            learnerProfile,
            studentCoursePackages[0].courseId,
            studentCoursePackages[0].courseName
        );
        await this.teacher.instruction(
            `Teacher goes to comment history screen of student ${learnerProfile.name} in course ${studentCoursePackages[0].courseName}`,
            async function () {
                await teacherGoToCommentHistoryScreen(teacher, learnerProfile.id);
            }
        );
    } else {
        await this.teacher.instruction(
            `Teacher goes to comment history screen of student ${learnerProfile.name} in course ${studentCoursePackages[0].courseName}`,
            async function () {
                await teacherGoToCommentHistoryScreenByUrl(
                    teacher,
                    studentCoursePackages[0].courseId,
                    learnerProfile.id
                );
            }
        );
    }
});

When(
    '{string} gives a comment {string} {string}',
    async function (
        this,
        role: AccountRoles,
        condition: ConditionHyperlinks,
        text: TextHyperlinks
    ) {
        if (role !== 'teacher') throw new Error('we do not allow other role');

        const teacher = this.teacher;

        const scenarioContext = this.scenario;

        await this.teacher.instruction(
            `Teacher types text a comment content ${condition} ${text}`,
            async function () {
                await teacherTypeCommentInHistory(teacher, condition, text);
            }
        );

        await this.teacher.instruction(
            `Teacher posts a comment content ${condition} ${text}`,
            async function () {
                await teacherPostCommentInHistory(teacher, scenarioContext);
            }
        );
    }
);

Then(
    '{string} {string} see and click to open the hyperlink text {string} the comment',
    async function (
        this,
        role: AccountRoles,
        result: ResultHyperlinks,
        condition: ConditionHyperlinks
    ) {
        if (role !== 'teacher') throw new Error('we do not allow other role');

        const teacher = this.teacher;

        const scenarioContext = this.scenario;

        const isIncludeHyperlinks = condition === ConditionHyperlinks.INCLUDED;

        const conditionGetText = isIncludeHyperlinks ? Content.HYPER_LINKS : Content.ONLY_TEXT;

        const findCommentByText = new ByText(conditionGetText);

        await teacher.instruction(
            `Teacher sees a comment text and ${result} click to open hyperlink ${condition} in the comment`,
            async function () {
                await teacherSeeCommentCorrectly(teacher, findCommentByText, scenarioContext, role);
            }
        );

        if (isIncludeHyperlinks) {
            await teacherCanTapToOpenHyperlinks(teacher, findCommentByText, conditionGetText);
        }
    }
);
