import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    learnerHidesPollingAnswerBarOnLearnerApp,
    learnerSeesPollingIconWithActiveStatusOnTeacherApp,
    learnerShowsPollingAnswerBarOnLearnerApp,
    teacherDoesNotSeePollingStatsPageOnTeacherApp,
    teacherSeesSetUpPollingPageWithOptionOnTeacherApp,
    teacherSelectPollingButtonWithActiveStatusOnTeacherApp,
    teacherSeePollingStatsPageVisibleOnTeacherApp,
} from './lesson-hide-or-show-again-polling-definitions';
import { getLearnerInterfaceFromRole, getTeacherInterfaceFromRole } from './utils';
import {
    learnerSeesPollingAnswerBarOnLearnerApp,
    teacherSelectPollingButtonOnTeacherApp,
    teacherSetPollingOptionOnTeacherApp,
    teacherStartPollingOnTeacherApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/teacher-create-polling-definitions';
import { teacherIsInPollingStatsPageOnTeacherApp } from 'test-suites/squads/virtual-classroom/step-definitions/teacher-stop-and-end-polling-definitions';

Given(
    '{string} has set correct answer is {string} option',
    async function (this: IMasterWorld, role: AccountRoles, optionName: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(
            `${role} has set correct answer is ${optionName} option`,
            async function (teacher) {
                await teacherSetPollingOptionOnTeacherApp(teacher, optionName, true);
                await teacherSeesSetUpPollingPageWithOptionOnTeacherApp(teacher, optionName, true);
            }
        );
    }
);

Given(
    '{string} has started polling on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(
            `${role} has started polling on Teacher App`,
            async function (teacher) {
                await teacherStartPollingOnTeacherApp(teacher);
                await teacherIsInPollingStatsPageOnTeacherApp(teacher);
            }
        );
    }
);

Given(
    '{string} has started polling with correct option is {string} on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles, option: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(
            `${role} has started polling with correct option is ${option} on Teacher App`,
            async function (teacher) {
                await teacherSelectPollingButtonOnTeacherApp(teacher);
                await teacherSetPollingOptionOnTeacherApp(teacher, option, true);
                await teacherStartPollingOnTeacherApp(teacher);
                await teacherIsInPollingStatsPageOnTeacherApp(teacher);
            }
        );
    }
);

Given(
    '{string} has hidden polling on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(
            `${role} has hidden polling on Teacher App`,
            async function (teacher) {
                await teacherSelectPollingButtonWithActiveStatusOnTeacherApp(teacher, true);
            }
        );
    }
);

When(
    '{string} hides polling on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(`${role} hides polling on Teacher App`, async function (teacher) {
            await teacherSelectPollingButtonWithActiveStatusOnTeacherApp(teacher, true);
        });
    }
);

When(
    '{string} shows again polling on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(
            `${role} shows again polling on Teacher App`,
            async function (teacher) {
                await teacherSelectPollingButtonWithActiveStatusOnTeacherApp(teacher, true);
            }
        );
    }
);

When(
    '{string} hides polling on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(`${role} hides polling on Learner App`, async function () {
            await learnerHidesPollingAnswerBarOnLearnerApp(learner);
        });
    }
);

Then(
    '{string} does not see Stats page on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(
            `${role} does not see Stats page on Teacher App`,
            async function () {
                await teacherDoesNotSeePollingStatsPageOnTeacherApp(teacher);
            }
        );
    }
);

Then(
    '{string} does not see Stats page visible on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(
            `${role} does not see Stats page visible on Teacher App`,
            async function () {
                await teacherSeePollingStatsPageVisibleOnTeacherApp(teacher, false);
            }
        );
    }
);

Then(
    '{string} still sees answer bar on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(
            `${role} still sees answer bar on Learner App`,
            async function () {
                await learnerSeesPollingAnswerBarOnLearnerApp(learner, true);
            }
        );
    }
);

Then(
    '{string} still sees {string} polling icon on Learner App',
    async function (this: IMasterWorld, role: AccountRoles, active: string) {
        const learner = getLearnerInterfaceFromRole(this, role);

        const isPollingIconActive = active === 'active';

        await learner.instruction(
            `${role} still sees Poll Button With ${active} Status on Learner App`,
            async function () {
                await learnerSeesPollingIconWithActiveStatusOnTeacherApp(
                    learner,
                    isPollingIconActive
                );
            }
        );
    }
);

Then(
    '{string} sees Stats page on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(`${role} sees Stats page on Teacher App`, async function () {
            await teacherIsInPollingStatsPageOnTeacherApp(teacher);
        });
    }
);

Given(
    '{string} has hidden polling on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(`${role} has hidden polling on Learner App`, async function () {
            await learnerHidesPollingAnswerBarOnLearnerApp(learner);
            await learnerSeesPollingAnswerBarOnLearnerApp(learner, false);
        });
    }
);

When(
    '{string} shows again polling on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(`${role} shows again polling on Learner App`, async function () {
            await learnerShowsPollingAnswerBarOnLearnerApp(learner);
        });
    }
);

Then(
    '{string} sees answer bar on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(`${role} sees answer bar on Learner App`, async function () {
            await learnerSeesPollingAnswerBarOnLearnerApp(learner, true);
        });
    }
);
