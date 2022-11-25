import { TeacherKeys } from '@common/teacher-keys';
import { getTeacherInterfaceFromRole } from '@legacy-step-definitions/utils';

import { When, Then, Given } from '@cucumber/cucumber';

import { IMasterWorld, AccountRoles } from '@supports/app-types';

import { getCommentContentByType } from './user-definition-utils';
import { teacherPostCommentInHistory } from './user-enable-hyperlink-definitions';
import {
    clicksOnIconDelete,
    clicksOnConfirmButton,
    clicksOnCancelButton,
    clicksOnCloseButton,
    teacherCommentInHistory,
    ButtonNameType,
} from './user-teacher-deletes-student-comment-definitions';
import { ByText } from 'flutter-driver-x';

Given(
    '{string} logout Teacher App',
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(`${role} logout Teacher App`, async function () {
            await teacher.logout();
        });
    }
);

Given(
    '{string} gives a {string}',
    async function (this: IMasterWorld, role: AccountRoles, comment: string): Promise<void> {
        if (!role.includes('teacher')) throw new Error('we do not allow other role');

        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;

        await teacher.instruction(
            `Teacher types text a comment content ${comment}`,
            async function () {
                await teacherCommentInHistory(teacher, comment);
            }
        );

        await teacher.instruction(`Teacher posts a comment content ${comment}`, async function () {
            await teacherPostCommentInHistory(teacher, scenario);
        });
    }
);

When(
    '{string} deletes {string}',
    async function (this: IMasterWorld, role: AccountRoles, comment: string) {
        if (!role.includes('teacher')) throw new Error('we do not allow other role');
        const teacher = getTeacherInterfaceFromRole(this, role);

        const commentContent = getCommentContentByType(comment, true);
        await teacher.instruction(`check comment in screen`, async function () {
            await teacher.flutterDriver!.waitFor(new ByText(commentContent), 5000);
        });

        const keyDeleteComment = TeacherKeys.studentCommentDeleteButtonWithIndex(0);
        await clicksOnIconDelete(teacher, keyDeleteComment);

        await clicksOnConfirmButton(teacher);
    }
);

Then(
    `{string} reloads web`,
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        if (!role.includes('teacher')) throw new Error('we do not allow other role');
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(`teacher reloads the page`, async function () {
            await teacher.flutterDriver!.reload();
        });
    }
);

Then(
    `{string} sees the {string} deleted`,
    async function (this: IMasterWorld, role: AccountRoles, comment: string): Promise<void> {
        if (!role.includes('teacher')) throw new Error('we do not allow other role');
        const teacher = getTeacherInterfaceFromRole(this, role);

        const commentContent = getCommentContentByType(comment, true);

        await teacher.instruction(
            `Teacher sees comment ${commentContent} deleted`,
            async function () {
                await teacher.flutterDriver!.waitForAbsent(new ByText(commentContent), 5000);
            }
        );
    }
);

Then(
    `{string} sees the {string} undeleted`,
    async function (this: IMasterWorld, role: AccountRoles, comment: string): Promise<void> {
        if (!role.includes('teacher')) throw new Error('we do not allow other role');
        const teacher = getTeacherInterfaceFromRole(this, role);

        const commentContent = getCommentContentByType(comment, true);
        await teacher.instruction(
            `Teacher sees comment ${commentContent} undeleted`,
            async function () {
                await teacher.flutterDriver!.waitFor(new ByText(commentContent), 5000);
            }
        );
    }
);

When(
    '{string} cancels delete comment using {string}',
    async function (this: IMasterWorld, role: AccountRoles, buttonName: ButtonNameType) {
        if (!role.includes('teacher')) throw new Error('we do not allow other role');
        const teacher = getTeacherInterfaceFromRole(this, role);

        const keyDeleteComment = TeacherKeys.studentCommentDeleteButtonWithIndex(0);
        await clicksOnIconDelete(teacher, keyDeleteComment);

        buttonName === 'cancel'
            ? await clicksOnCancelButton(teacher)
            : await clicksOnCloseButton(teacher);
    }
);
