import {
    learnerProfileAlias,
    learnerProfileAliasWithAccountRoleSuffix,
    staffProfileAlias,
} from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import {
    getLearnerInterfaceFromRole,
    getUserIdFromRole,
    getUserProfileFromContext,
    getUsersFromContextByRegexKeys,
} from 'test-suites/common/step-definitions/user-common-definitions';
import { getTeacherInterfaceFromRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import {
    checkSpeakerAndCameraStatusOnLearnerApp,
    checkSpeakerAndCameraStatusOnTeacherApp,
    learnerSeesCameraViewInGalleryViewOnLearnerApp,
    learnerSeesStatusSpeakerIconInGalleryViewOnLearnerApp,
    teacherSeesCameraViewInGalleryViewOnTeacherApp,
    teacherSeesStatusCameraIconInStudentListOnTeacherApp,
    teacherSeesStatusSpeakerIconInGalleryViewOnTeacherApp,
    teacherSeesStatusSpeakerIconInStudentListOnTeacherApp,
    turnOwnCameraStatusOnLearnerApp,
    turnOwnSpeakerStatusOnLearnerApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/turn-on-speaker-and-camera-definitions';
import { StatusCameraAndSpeaker } from 'test-suites/squads/virtual-classroom/utils/types';

Given(
    `all teachers and students's speaker and camera are {string}`,
    { timeout: 160000 },
    async function (deviceStatus: StatusCameraAndSpeaker) {
        const teachers = getUsersFromContextByRegexKeys(this.scenario, staffProfileAlias);
        const learners = getUsersFromContextByRegexKeys(this.scenario, learnerProfileAlias);

        for (let i = 0; i < teachers.length; i++) {
            const teacher = getTeacherInterfaceFromRole(this, `teacher T${i}` as AccountRoles);
            await teacher.instruction(
                `Teacher teacher T${i}'s speaker and camera are ${deviceStatus}`,
                async function () {
                    await checkSpeakerAndCameraStatusOnTeacherApp(teacher, deviceStatus);
                }
            );
        }

        for (let i = 0; i < learners.length; i++) {
            const learner = getLearnerInterfaceFromRole(this, `student S${i}` as AccountRoles);
            await learner.instruction(
                `Student student S${i}'s speaker and camera are ${deviceStatus}`,
                async function () {
                    await checkSpeakerAndCameraStatusOnLearnerApp(learner, deviceStatus);
                }
            );
        }
    }
);

Given(`{string} has turned on their camera on Learner App`, async function (role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);
    await learner.instruction(
        `${role} has turned on their camera on Learner App`,
        async function () {
            await turnOwnCameraStatusOnLearnerApp(learner, false);
        }
    );
});

When(`{string} turns on their speaker on Learner App`, async function (role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);
    await learner.instruction(`${role} turns on their speaker on Learner App`, async function () {
        await turnOwnSpeakerStatusOnLearnerApp(learner, false);
    });
});

When(`{string} turns on their camera on Learner App`, async function (role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);
    await learner.instruction(`${role} turns on their camera on Learner App`, async function () {
        await turnOwnCameraStatusOnLearnerApp(learner, false);
    });
});

Then(
    `all teachers see {string} {string}'s speaker icon in student list on Teacher App`,
    { timeout: 60000 },
    async function (active: string, studentRole: AccountRoles) {
        const teacherRoles = ['teacher T1', 'teacher T2'] as AccountRoles[];
        const learnerProfileFromContext = getUserProfileFromContext(
            this.scenario,
            learnerProfileAliasWithAccountRoleSuffix(studentRole)
        );
        const studentId = learnerProfileFromContext.id;
        const iconActive = active === 'active';
        for (const teacherRole of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, teacherRole);
            await teacher.instruction(
                `${teacherRole} sees ${active} ${studentRole}'s speaker icon in student list on Teacher App`,
                async function () {
                    await teacherSeesStatusSpeakerIconInStudentListOnTeacherApp(
                        teacher,
                        iconActive,
                        studentId
                    );
                }
            );
        }
    }
);

Then(
    `all teachers see {string} {string}'s camera icon in student list on Teacher App`,
    { timeout: 60000 },
    async function (active: string, studentRole: AccountRoles) {
        const teacherRoles = ['teacher T1', 'teacher T2'] as AccountRoles[];
        const learnerProfileFromContext = getUserProfileFromContext(
            this.scenario,
            learnerProfileAliasWithAccountRoleSuffix(studentRole)
        );
        const studentId = learnerProfileFromContext.id;
        const iconActive = active === 'active';
        for (const teacherRole of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, teacherRole);
            await teacher.instruction(
                `${teacherRole} sees ${active} ${studentRole}'s camera icon in student list on Teacher App`,
                async function () {
                    await teacherSeesStatusCameraIconInStudentListOnTeacherApp(
                        teacher,
                        iconActive,
                        studentId
                    );
                }
            );
        }
    }
);

Then(
    `all teachers see {string}'s image in gallery view on Teacher App`,
    async function (role: AccountRoles) {
        const teacherRoles = ['teacher T1', 'teacher T2'] as AccountRoles[];
        const userId = getUserIdFromRole(this.scenario, role);
        for (const teacherRole of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, teacherRole);

            await teacher.instruction(
                `${teacherRole} sees ${role}'s image in gallery view on Teacher App`,
                async function () {
                    await teacherSeesCameraViewInGalleryViewOnTeacherApp(teacher, userId, true);
                }
            );
        }
    }
);

Then(
    `all teachers do not see {string}'s image in gallery view on Teacher App`,
    async function (role: AccountRoles) {
        const teachers = getUsersFromContextByRegexKeys(this.scenario, staffProfileAlias);
        const userId = getUserIdFromRole(this.scenario, role);

        for (let i = 0; i < teachers.length; i++) {
            const teacher = getTeacherInterfaceFromRole(this, `teacher T${i}` as AccountRoles);
            await teacher.instruction(
                `teacher T${i} do not see ${role}'s image in gallery view on Teacher App`,
                async function () {
                    await teacherSeesCameraViewInGalleryViewOnTeacherApp(teacher, userId, false);
                }
            );
        }
    }
);

Then(
    `all students see {string} {string}'s speaker icon in gallery view on Learner App`,
    { timeout: 60000 },
    async function (active: string, role: AccountRoles) {
        const studentRoles = ['student S1', 'student S2'] as AccountRoles[];
        const userId = getUserIdFromRole(this.scenario, role);
        const iconActive = active === 'active';
        for (const studentRole of studentRoles) {
            const learner = getLearnerInterfaceFromRole(this, studentRole);
            await learner.instruction(
                `${studentRole} see ${active} ${role}'s speaker icon in gallery view on Learner App`,
                async function () {
                    await learnerSeesStatusSpeakerIconInGalleryViewOnLearnerApp(
                        learner,
                        userId,
                        iconActive
                    );
                }
            );
        }
    }
);

Then(
    `all students see {string}'s image in gallery view on Learner App`,
    { timeout: 60000 },
    async function (role: AccountRoles) {
        const userId = getUserIdFromRole(this.scenario, role);
        const learners = getUsersFromContextByRegexKeys(this.scenario, learnerProfileAlias);
        for (let i = 0; i < learners.length; i++) {
            const learner = getLearnerInterfaceFromRole(this, `student S${i}` as AccountRoles);
            await learner.instruction(
                `student S${i} see ${role}'s image in gallery view on Learner App`,
                async function () {
                    await learnerSeesCameraViewInGalleryViewOnLearnerApp(learner, userId, true);
                }
            );
        }
    }
);

Then(
    `all students do not see {string}'s image in gallery view on Learner App`,
    { timeout: 60000 },
    async function (role: AccountRoles) {
        const learners = getUsersFromContextByRegexKeys(this.scenario, learnerProfileAlias);
        const userId = getUserIdFromRole(this.scenario, role);
        for (let i = 0; i < learners.length; i++) {
            const learner = getLearnerInterfaceFromRole(this, `student S${i}` as AccountRoles);
            await learner.instruction(
                `student S${i} see ${role}'s image in gallery view on Learner App`,
                async function () {
                    await learnerSeesCameraViewInGalleryViewOnLearnerApp(learner, userId, false);
                }
            );
        }
    }
);

Then(
    "{string} sees {string} {string}'s speaker icon in gallery view on Teacher App",
    async function (teacherRole: AccountRoles, active: string, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const userId = getUserIdFromRole(this.scenario, role);
        await teacher.instruction(
            `${teacherRole} sees ${active} ${role}'s speaker icon in gallery view on Teacher App`,
            async function () {
                const iconActive = active === 'active';
                await teacherSeesStatusSpeakerIconInGalleryViewOnTeacherApp(
                    teacher,
                    userId,
                    iconActive
                );
            }
        );
    }
);

Then('{string} sees their image on Learner App', async function (role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);
    const learnerId = getUserIdFromRole(this.scenario, role);
    await learner.instruction(`${role} sees their image on Learner App`, async function () {
        await learnerSeesCameraViewInGalleryViewOnLearnerApp(learner, learnerId, true);
    });
});
