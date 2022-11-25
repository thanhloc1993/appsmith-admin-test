import { aliasLocationId } from '@legacy-step-definitions/alias-keys/lesson';
import {
    teacherAppliesSelectedLocationOnTeacherApp,
    teacherOpenLocationFilterDialogOnTeacherApp,
} from '@legacy-step-definitions/lesson-teacher-sees-respective-course-after-applying-location-in-location-settings-definitions';
import {
    getCMSInterfaceByRole,
    getLearnerInterfaceFromRole,
    getStudentIdFromContextWithAccountRole,
    getTeacherInterfaceFromRole,
    isParentRole,
    randomInteger,
    splitRolesStringToAccountRoles,
} from '@legacy-step-definitions/utils';

import { Given, When } from '@cucumber/cucumber';

import { AccountRoles, CMSInterface, IMasterWorld } from '@supports/app-types';
import { MenuUnion } from '@supports/enum';

import {
    aliasCreatedNotificationName,
    aliasCreatedNotificationID,
    aliasCreatedScheduleNotificationName,
} from './alias-keys/communication';
import {
    changeStatusOfAssignmentToReturned,
    clickActionButtonByName,
    clickUpsertAndSendNotification,
    createABookWithAnAssignment,
    createStudentWithCountryCode,
    createStudentWithCourseAndGrade,
    createStudyPlanWithAssignmentForStudent,
    getActionButtonNotification,
    learnerClickOnNotificationIcon,
    learnerClickOnNotificationItem,
    learnerCloseNotificationDetail,
    learnerSelectConversation,
    learnerSelectParentGroupChat,
    moveLearnerToMessagePage,
    moveTeacherToMessagePage,
    openComposeMessageDialog,
    learnerReloadConversationList,
    teacherJoinLearnerConversation,
    teacherSelectConversation,
    teacherSelectedJoinedTab,
    teacherTapApplyFilterButton,
    teacherTapFilterIconButton,
    teacherReloadMessagingScreen,
    teacherHasFilterLocationsOnTeacherApp,
    searchNotificationTitleOnCMS,
    teacherHasFilterFistLocationOnTeacherApp,
    getFirstLocationId,
} from './communication-common-definitions';
import { getNotificationIdByTitleWithHasura } from './communication-notification-hasura';
import { Country } from 'manabuf/common/v1/enums_pb';
// FIX: Cannot move studentSubmitsAssignment into common because it's not a pure function
import { studentSubmitsAssignment } from 'test-suites/squads/syllabus/step-definitions/syllabus-edit-studyplan-item-assignment-time-definitions';
import { applyOrgForLocationSetting } from 'test-suites/squads/user-management/step-definitions/user-definition-utils';

Given(
    '{string} is at the conversation screen on Learner App',
    async function (this: IMasterWorld, roles: string): Promise<void> {
        const learnerRoles = splitRolesStringToAccountRoles(roles);

        for (const learnerRole of learnerRoles) {
            const learner = getLearnerInterfaceFromRole(this, learnerRole);
            const studentId = await this.learner.getUserId();
            const isParent = isParentRole(learnerRole);

            await learner.instruction(
                `${learner} open conversation screen`,
                async function (learner) {
                    await moveLearnerToMessagePage(learner);
                }
            );

            await learner.instruction(
                `${learner} select a conversation detail`,
                async function (learner) {
                    await learnerSelectConversation(learner, isParent, studentId);
                }
            );
        }
    }
);

Given(
    '{string} of {string} is at the conversation screen on Learner App',
    async function (this: IMasterWorld, accountRolesString: string, learnerRole: AccountRoles) {
        const accountRoles = splitRolesStringToAccountRoles(accountRolesString);
        const studentId = getStudentIdFromContextWithAccountRole(this.scenario, learnerRole);

        for (const accountRole of accountRoles) {
            const learner = getLearnerInterfaceFromRole(this, accountRole);
            const isParent = isParentRole(accountRole);

            await learner.instruction(
                `${learner} open conversation screen`,
                async function (learner) {
                    await moveLearnerToMessagePage(learner);
                }
            );

            await learner.instruction(
                `${learner} select a conversation detail`,
                async function (learner) {
                    await learnerSelectConversation(learner, isParent, studentId);
                }
            );
        }
    }
);

Given(
    '{string} is at the conversation screen on Teacher App',
    async function (this: IMasterWorld, roles: string): Promise<void> {
        const teacherRoles = splitRolesStringToAccountRoles(roles);

        for (const role of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, role);
            await teacher.instruction(
                `${teacher} open conversation page`,
                async function (teacher) {
                    await moveTeacherToMessagePage(teacher);
                }
            );
        }
    }
);

Given(
    'teacher has joined conversation with created student and parent',
    async function (this: IMasterWorld): Promise<void> {
        const teacher = this.teacher;
        const studentId = await this.learner.getUserId();
        const studentProfile = await this.learner.getProfile();
        const studentName = studentProfile.name;

        await teacher.instruction('Teacher select message button', async function (teacher) {
            await moveTeacherToMessagePage(teacher);
        });

        await teacher.instruction('Teacher join student chat group', async function () {
            await teacherJoinLearnerConversation(teacher, studentId, studentName, false);
        });

        await teacher.instruction('Teacher join parent chat group', async function () {
            await teacherJoinLearnerConversation(teacher, studentId, studentName, true);
        });
    }
);

Given(
    '{string} has accessed to the conversation of {string} chat group',
    async function (
        this: IMasterWorld,
        teacherRole: AccountRoles,
        learnerRoles: AccountRoles
    ): Promise<void> {
        const studentId = getStudentIdFromContextWithAccountRole(this.scenario, learnerRoles);
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const isParent = isParentRole(learnerRoles);

        await teacher.instruction(`Teacher accesses chat group`, async function (teacher) {
            await teacherSelectConversation(teacher, isParent, studentId);
        });
    }
);

Given(
    '{string} is at {string} page on CMS',
    async function (this: IMasterWorld, role: AccountRoles, menuType: MenuUnion): Promise<void> {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(`Navigate to ${menuType} page`, async function (cms) {
            await cms.selectMenuItemInSidebarByAriaLabel(menuType);
        });
    }
);

Given(
    '{string} has created a student with grade, course and parent info',
    async function (role: AccountRoles): Promise<void> {
        const cms = getCMSInterfaceByRole(this, role);
        await createStudentWithCourseAndGrade(cms, this.scenario);
    }
);

Given(
    `school admin has opened compose new notification full-screen dialog`,
    async function (this: IMasterWorld): Promise<void> {
        await this.cms.instruction('Opens compose dialog', async function (cms: CMSInterface) {
            await openComposeMessageDialog(cms);
        });
    }
);

When(`school admin clicks {string} button`, async function (buttonName: string) {
    const randIndex = randomInteger(0, 1);
    const buttonAction = getActionButtonNotification(buttonName, randIndex);

    await this.cms.instruction(`Clicks button ${buttonAction}`, async () => {
        await clickActionButtonByName(buttonAction, this.cms, this.scenario);
    });
});

When(
    '{string} can access the {string} conversation on Teacher App',
    async function (this: IMasterWorld, teacherRole: AccountRoles, learnerRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const studentId = getStudentIdFromContextWithAccountRole(this.scenario, learnerRole);
        const isParent = isParentRole(learnerRole);

        await teacher.instruction(`Teacher accesses the chat group`, async function (teacher) {
            await teacherTapFilterIconButton(teacher);
            await teacherTapApplyFilterButton(teacher);
            await teacherSelectConversation(teacher, isParent, studentId);
        });
    }
);

When(
    '{string} refresh page & access the {string} conversation on Teacher App',
    async function (this: IMasterWorld, teacherRole: AccountRoles, learnerRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const studentId = getStudentIdFromContextWithAccountRole(this.scenario, learnerRole);
        const isParent = isParentRole(learnerRole);

        await teacher.instruction(
            `${teacherRole} refresh page & accesses the ${learnerRole} chat group`,
            async function (teacher) {
                await teacherReloadMessagingScreen(teacher);
                await teacherSelectedJoinedTab(teacher);
                await teacherSelectConversation(teacher, isParent, studentId);
            }
        );
    }
);

When(
    '{string} of {string} can access the conversation after reload conversation list on Learner App',
    async function (this: IMasterWorld, parentRole: AccountRoles, learnerRole: AccountRoles) {
        const parent = getLearnerInterfaceFromRole(this, parentRole);
        const studentId = getStudentIdFromContextWithAccountRole(this.scenario, learnerRole);

        await parent.instruction(
            `${parentRole} of ${learnerRole} reload the conversation list`,
            async () => {
                await learnerReloadConversationList(parent);
            }
        );

        await parent.instruction(
            `${parentRole} of ${learnerRole} can access the conversation`,
            async () => {
                await learnerSelectParentGroupChat(parent, studentId);
            }
        );
    }
);
Given(
    '{string} has created study plan with assignment and add for student',
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(`Create a book with an assignment `, async () => {
            await createABookWithAnAssignment(cms, this.scenario);
        });

        await cms.instruction(`Create study plan with assignment for student`, async () => {
            await createStudyPlanWithAssignmentForStudent(cms, this.scenario);
        });
    }
);

Given(
    '{string} has changed status of assignment to returned',
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(`Teacher change status of assignment to returned`, async () => {
            await changeStatusOfAssignmentToReturned(teacher, this.scenario);
        });
    }
);

When(
    '{string} changes status of assignment to returned',
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(`Teacher change status of assignment to returned`, async () => {
            await changeStatusOfAssignmentToReturned(teacher, this.scenario);
        });
    }
);

Given(
    `{string} has submitted assignment`,
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const context = this.scenario;
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(`Change status of assignment to returned`, async () => {
            await studentSubmitsAssignment(learner, context);
        });
    }
);

When(
    `{string} re-submits assignment`,
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const context = this.scenario;
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(`Change status of assignment to returned`, async () => {
            await studentSubmitsAssignment(learner, context);
        });
    }
);

When(
    `{string} accesses to notification list`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(`${role} click on notification icon`, async () => {
            await learnerClickOnNotificationIcon(learner);
        });
    }
);

When(
    `{string} accesses to notification detail`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(`${role} click on notification icon`, async () => {
            await learnerClickOnNotificationIcon(learner);
        });
        await learner.instruction(`${role} click on notification item`, async () => {
            await learnerClickOnNotificationItem(learner, true);
        });
    }
);

Given(
    '{string} has created a student with {string} country code',
    async function (role: AccountRoles, countryCodeString: string): Promise<void> {
        const cms = getCMSInterfaceByRole(this, role);
        let countryCode = Country.COUNTRY_VN;
        switch (countryCodeString) {
            case 'VN':
                countryCode = Country.COUNTRY_VN;
                break;
            case 'JP':
                countryCode = Country.COUNTRY_JP;
                break;
            case 'SG':
                countryCode = Country.COUNTRY_SG;
                break;
            case 'ID':
                countryCode = Country.COUNTRY_ID;
                break;
            default:
        }
        await cms.instruction(`Create student with country code`, async () => {
            await createStudentWithCountryCode(cms, this.scenario, countryCode);
        });
    }
);

When(
    `{string} reads notification`,
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(`${role} click notification bell icon`, async () => {
            await learnerClickOnNotificationIcon(learner);
        });

        await learner.instruction(`${role} click on unread notification`, async () => {
            await learnerClickOnNotificationItem(learner, true);
        });

        await learner.instruction(`${role} close notification detail`, async () => {
            await learnerCloseNotificationDetail(learner);
        });
    }
);

Given(
    '{string} has accessed to notification detail',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(`Student has accessed to notification detail`, async () => {
            await learnerClickOnNotificationIcon(learner);
            await learnerClickOnNotificationItem(learner, true);
        });
    }
);

When('{string} has sent the notification', async function (this: IMasterWorld, role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const scenario = this.scenario;
    await cms.instruction(
        'Click send button on the compose dialog',
        async function (this: CMSInterface) {
            await clickUpsertAndSendNotification(this, scenario);
        }
    );
});

Given(
    '{string} has filtered location in location settings on Teacher App with student locations',
    async function (roles: AccountRoles) {
        const teacherRoles = splitRolesStringToAccountRoles(roles);
        const scenario = this.scenario;
        const locationId = getFirstLocationId(scenario);

        for (const role of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, role);
            await teacher.instruction(
                `${role} has open location settings dialog on Teacher App`,
                async function () {
                    await teacherOpenLocationFilterDialogOnTeacherApp(teacher);
                }
            );

            await teacher.instruction(
                `${role} has filtered location in location settings dialog on Teacher App`,
                async function () {
                    await teacherHasFilterFistLocationOnTeacherApp(teacher, locationId);
                }
            );

            await teacher.instruction(
                `${role} has applied filtered location in location settings dialog on Teacher App`,
                async function () {
                    await teacherAppliesSelectedLocationOnTeacherApp(teacher);
                }
            );
        }
    }
);

Given(
    '{string} has filtered location in location settings on Teacher App with the lesson location',
    async function (roles: AccountRoles) {
        const teacherRoles = splitRolesStringToAccountRoles(roles);
        const scenario = this.scenario;
        const studentLocationIds = [scenario.get(aliasLocationId)];

        for (const role of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, role);
            await teacher.instruction(
                `${role} has open location settings dialog on Teacher App`,
                async function () {
                    await teacherOpenLocationFilterDialogOnTeacherApp(teacher);
                }
            );

            await teacher.instruction(
                `${role} has filtered location in location settings dialog on Teacher App`,
                async function () {
                    await teacherHasFilterLocationsOnTeacherApp(teacher, studentLocationIds);
                }
            );

            await teacher.instruction(
                `${role} has applied filtered location in location settings dialog on Teacher App`,
                async function () {
                    await teacherAppliesSelectedLocationOnTeacherApp(teacher);
                }
            );
        }
    }
);

Given(
    '{string} has filtered organization on location settings',
    async function (roles: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, roles);

        await cms.instruction(
            `School admin has filtered organization on location settings`,
            async function () {
                await applyOrgForLocationSetting(cms);
            }
        );
    }
);

When(`{string} searches this notification`, async function (roles: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, roles);
    const scenario = this.scenario;

    const title = scenario.get(aliasCreatedNotificationName);
    const scheduleTitle = scenario.get(aliasCreatedScheduleNotificationName);

    const notificationId = await getNotificationIdByTitleWithHasura(cms, title ?? scheduleTitle);

    scenario.set(aliasCreatedNotificationID, notificationId);

    if (!notificationId) throw Error('Cannot find notification id');

    await searchNotificationTitleOnCMS(cms, title, notificationId);
});
