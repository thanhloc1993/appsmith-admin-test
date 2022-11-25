import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    learnerSeesAnnotateIconOnLearnerApp,
    learnerSeesWhiteboardBarOnLearnerApp,
    teacherEnablesWhiteboardAnnotateForLearner,
    teacherEnablesWhiteboardForAllLearnerOnTeacherApp,
    teacherSeesAnnotateIconInStudentListOnTeacherApp,
    teacherSeesAnnotationButtonOnTeacherApp,
} from './lesson-teacher-can-enable-or-disable-student-white-board-definitions';
import { getUserIdFromRole } from './lesson-utils';
import {
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
    splitRolesStringToAccountRoles,
} from './utils';

Given(
    `{string} has enabled white board bar of all students on Teacher App`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} has enabled white board bar of all students on Teacher App`,
            async function () {
                await teacherEnablesWhiteboardForAllLearnerOnTeacherApp(teacher, true);
            }
        );
    }
);

Given(
    `{string} has enabled white board of {string} on Teacher App`,
    async function (this: IMasterWorld, teacherRole: AccountRoles, learnerRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const learnerId = getUserIdFromRole(this, learnerRole);

        await teacher.instruction(
            `${teacherRole} has enabled white board of ${learnerRole} on Teacher App`,
            async function () {
                await teacherEnablesWhiteboardAnnotateForLearner(teacher, learnerId, true);
            }
        );
    }
);

When(
    `{string} enables white board bar of {string} on Teacher App`,
    async function (this: IMasterWorld, teacherRole: AccountRoles, learnerRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const learnerId = getUserIdFromRole(this, learnerRole);
        await teacher.instruction(
            `${teacherRole} enables white board bar of ${learnerRole} on Teacher App`,
            async function () {
                await teacherEnablesWhiteboardAnnotateForLearner(teacher, learnerId, true);
            }
        );
    }
);

When(
    `{string} enables white board bar of all students on Teacher App`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} has enabled white board bar of all students on Teacher App`,
            async function () {
                await teacherEnablesWhiteboardForAllLearnerOnTeacherApp(teacher, true);
            }
        );
    }
);

When(
    `{string} disables white board bar of all students on Teacher App`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} disables white board bar of all students on Teacher App`,
            async function () {
                await teacherEnablesWhiteboardForAllLearnerOnTeacherApp(teacher, false);
            }
        );
    }
);

When(
    `{string} disables white board bar of {string} on Teacher App`,
    async function (this: IMasterWorld, teacherRole: AccountRoles, learnerRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const learnerId = getUserIdFromRole(this, learnerRole);
        await teacher.instruction(
            `${teacherRole} disables white board bar of ${learnerRole} on Teacher App`,
            async function () {
                await teacherEnablesWhiteboardAnnotateForLearner(teacher, learnerId, false);
            }
        );
    }
);

Then(
    `{string} sees {string} annotation icon on Teacher App`,
    async function (this: IMasterWorld, teacherRole: AccountRoles, active: string) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const iconActive = active === 'active';
        await teacher.instruction(
            `${teacherRole} sees active annotation icon on Teacher App`,
            async function () {
                await teacherSeesAnnotationButtonOnTeacherApp(teacher, iconActive);
            }
        );
    }
);

Then(
    `{string} sees {string} {string} annotate icon in student list on Teacher App`,
    async function (
        this: IMasterWorld,
        teacherRole: AccountRoles,
        active: string,
        learnerRole: AccountRoles
    ) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const learnerId = getUserIdFromRole(this, learnerRole);
        const iconActive = active === 'active';
        await teacher.instruction(
            `${teacherRole} sees ${active} ${learnerRole} annotate icon in student list on Teacher App`,
            async function () {
                await teacherSeesAnnotateIconInStudentListOnTeacherApp(
                    teacher,
                    learnerId,
                    iconActive
                );
            }
        );
    }
);

Then(
    `{string} still sees {string} annotation icon on Teacher App`,
    async function (this: IMasterWorld, teacherRole: AccountRoles, active: string) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const iconActive = active === 'active';
        await teacher.instruction(
            `${teacherRole} still sees ${active} annotation icon on Teacher App`,
            async function () {
                await teacherSeesAnnotationButtonOnTeacherApp(teacher, iconActive);
            }
        );
    }
);

Then(
    `{string} sees white board bar on Learner App`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(`${role} sees white board bar on Learner App`, async function () {
            await learnerSeesWhiteboardBarOnLearnerApp(learner, true);
        });
    }
);

Then(
    `{string} see white board bar on Learner App`,
    async function (this: IMasterWorld, accountRoles: string) {
        const roles = splitRolesStringToAccountRoles(accountRoles);
        for (const role of roles) {
            const learner = getLearnerInterfaceFromRole(this, role);
            await learner.instruction(
                `${role} sees white board bar on Learner App`,
                async function () {
                    await learnerSeesWhiteboardBarOnLearnerApp(learner, true);
                }
            );
        }
    }
);

Then(
    `{string} still sees white board bar on Learner App`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} still sees white board bar on Learner App`,
            async function () {
                await learnerSeesWhiteboardBarOnLearnerApp(learner, true);
            }
        );
    }
);

Then(
    `{string} does not see white board bar on Learner App`,
    {
        timeout: 80000,
    },
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} does not see white board bar on Learner App`,
            async function () {
                await learnerSeesWhiteboardBarOnLearnerApp(learner, false);
            }
        );
    }
);

Then(
    `{string} do not see white board bar on Learner App`,
    {
        timeout: 160000,
    },
    async function (this: IMasterWorld, accountRoles: string) {
        const roles = splitRolesStringToAccountRoles(accountRoles);
        for (const role of roles) {
            const learner = getLearnerInterfaceFromRole(this, role);
            await learner.instruction(
                `${role} do not see white board bar on Learner App`,
                async function () {
                    await learnerSeesWhiteboardBarOnLearnerApp(learner, false);
                }
            );
        }
    }
);

Then(
    `{string} sees annotate icon on Learner App`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(`${role} sees annotate icon on Learner App`, async function () {
            await learnerSeesAnnotateIconOnLearnerApp(learner, false);
        });
    }
);

Then(
    `{string} see annotate icon on Learner App`,
    async function (this: IMasterWorld, accountRoles: AccountRoles) {
        const roles = splitRolesStringToAccountRoles(accountRoles);
        for (const role of roles) {
            const learner = getLearnerInterfaceFromRole(this, role);
            await learner.instruction(
                `${role} sees annotate icon on Learner App`,
                async function () {
                    await learnerSeesAnnotateIconOnLearnerApp(learner, false);
                }
            );
        }
    }
);

Then(
    `{string} still sees annotate icon on Learner App`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} still sees annotate icon on Learner App`,
            async function () {
                await learnerSeesAnnotateIconOnLearnerApp(learner, false);
            }
        );
    }
);

Then(
    `{string} does not see annotate icon on Learner App`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} does not see annotate icon on Learner App`,
            async function () {
                await learnerSeesAnnotateIconOnLearnerApp(learner, true);
            }
        );
    }
);

Then(
    `{string} do not see annotate icon on Learner App`,
    async function (this: IMasterWorld, accountRoles: AccountRoles) {
        const roles = splitRolesStringToAccountRoles(accountRoles);
        for (const role of roles) {
            const learner = getLearnerInterfaceFromRole(this, role);
            await learner.instruction(
                `${role} do not see annotate icon on Learner App`,
                async function () {
                    await learnerSeesAnnotateIconOnLearnerApp(learner, true);
                }
            );
        }
    }
);
