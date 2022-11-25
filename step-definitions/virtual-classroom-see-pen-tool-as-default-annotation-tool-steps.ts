import { Given, Then } from '@cucumber/cucumber';

import { IMasterWorld, AccountRoles } from '@supports/app-types';

import { teacherEnablesWhiteboardAnnotateForLearner } from './lesson-teacher-can-enable-or-disable-student-white-board-definitions';
import { getUserIdFromRole } from './lesson-utils';
import { getTeacherInterfaceFromRole, getLearnerInterfaceFromRole } from './utils';
import {
    seesDefaultGreenColourIconUnderLineSizeIconInWhiteBoardOnLearnerApp,
    seesDefaultGreenColourIconUnderLineSizeIconInWhiteBoardOnTeacherApp,
    seesDefaultLineSizeIconUnderPenToolIconInWhiteBoardOnLearnerApp,
    seesDefaultLineSizeIconUnderPenToolIconInWhiteBoardOnTeacherApp,
} from './virtual-classroom-see-pen-tool-as-default-annotation-tool-definitions';

Given(
    `{string} enables white board of {string} on Teacher App`,
    async function (this: IMasterWorld, teacherRole: AccountRoles, learnerRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const learnerId = getUserIdFromRole(this, learnerRole);
        await teacher.instruction(
            `${teacherRole} enables white board of ${learnerRole} on Teacher App`,
            async function () {
                await teacherEnablesWhiteboardAnnotateForLearner(teacher, learnerId, true);
            }
        );
    }
);

Then(
    `{string} sees default line size icon under pen tool icon in white board`,
    async function (this: IMasterWorld, accountRole: AccountRoles) {
        if (accountRole.includes('teacher')) {
            const teacher = getTeacherInterfaceFromRole(this, accountRole);
            await teacher.instruction(
                `${accountRole} sees default line size icon under pen tool icon in white board`,
                async function () {
                    await seesDefaultLineSizeIconUnderPenToolIconInWhiteBoardOnTeacherApp(teacher);
                }
            );
        } else if (accountRole.includes('student')) {
            const learner = getLearnerInterfaceFromRole(this, accountRole);
            await learner.instruction(
                `${accountRole} sees default line size icon under pen tool icon in white board`,
                async function () {
                    await seesDefaultLineSizeIconUnderPenToolIconInWhiteBoardOnLearnerApp(learner);
                }
            );
        }
    }
);

Then(
    `{string} sees default green colour icon under line size icon in white board`,
    async function (this: IMasterWorld, accountRole: AccountRoles) {
        if (accountRole.includes('teacher')) {
            const teacher = getTeacherInterfaceFromRole(this, accountRole);
            await teacher.instruction(
                `${accountRole} sees default green colour icon under line size icon in white board`,
                async function () {
                    await seesDefaultGreenColourIconUnderLineSizeIconInWhiteBoardOnTeacherApp(
                        teacher
                    );
                }
            );
        } else if (accountRole.includes('student')) {
            const learner = getLearnerInterfaceFromRole(this, accountRole);
            await learner.instruction(
                `${accountRole} sees default green colour icon under line size icon in white board`,
                async function () {
                    await seesDefaultGreenColourIconUnderLineSizeIconInWhiteBoardOnLearnerApp(
                        learner
                    );
                }
            );
        }
    }
);
