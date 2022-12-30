import {
    getLearnerInterfaceFromRole,
    getStudentIdFromContextWithAccountRole,
    getTeacherInterfaceFromRole,
    getUserNameFromContextWithAccountRole,
    getUserProfileFromContext,
    randomString,
    splitRolesStringToAccountRoles,
} from '@legacy-step-definitions/utils';
import {
    learnerProfileAliasWithAccountRoleSuffix,
    parentProfilesAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld, TeacherInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import {
    learnerSeeStudentGroupChat,
    moveLearnerToMessagePage,
    moveTeacherToMessagePage,
    parentSeeParentGroupChat,
    teacherSeeParentGroupChat,
    teacherSeeStudentGroupChat,
    teacherCheckStudentGroupChatName,
    teacherSelectedUnJoinedTab,
    teacherCheckParentGroupChatName,
    teacherCheckParentGroupChatParentTag,
    learnerSelectConversation,
    MessageType,
} from './communication-common-definitions';
import {
    cmsAddExistedParentForStudent,
    cmsCreateNewParentAndAddForStudent,
} from './communication-create-group-chat-definitions';
import { teacherSearchConversationByStudentName } from './communication-search-chat-group-definitions';
import {
    learnerEnterTextMessage,
    learnerReceiveMessage,
    learnerSendTextMessage,
} from './communication-send-message-definitions';
import { schoolAdminCreateNewStudentWithExistingParent } from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';

Then('teacher sees student chat group in Unjoined tab on Teacher App', async function () {
    const scenarioContext = this.scenario;
    const learnerProfile = getUserProfileFromContext(
        scenarioContext,
        learnerProfileAliasWithAccountRoleSuffix('student')
    );
    const teacher = this.teacher;
    const studentId = learnerProfile.id;
    const studentName = learnerProfile.name;

    await teacher.instruction(
        'Teacher open conversation page',
        async function (this: TeacherInterface) {
            await moveTeacherToMessagePage(this);
        }
    );

    await teacher.instruction('teacher select unjoinedTab', async function () {
        await teacherSelectedUnJoinedTab(teacher);
    });

    await teacher.instruction(
        'teacher search group chat of student by student name',
        async function () {
            await teacherSearchConversationByStudentName(teacher, studentName);
        }
    );

    await teacher.instruction(`Teacher sees student group chat ${studentId}`, async function () {
        await teacherSeeStudentGroupChat(teacher, studentId);
    });
});

Then(
    'teacher sees both student chat group & parent chat group in Unjoined tab on Teacher App',
    async function () {
        const scenarioContext = this.scenario;
        const learnerProfile = getUserProfileFromContext(
            scenarioContext,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );
        const teacher = this.teacher;
        const studentId = learnerProfile.id;
        const studentName = learnerProfile.name;

        await teacher.instruction(
            'Teacher open conversation page',
            async function (this: TeacherInterface) {
                await moveTeacherToMessagePage(this);
            }
        );

        await teacher.instruction('Select unjoinedTab', async function () {
            await teacherSelectedUnJoinedTab(teacher);
        });

        await teacher.instruction(
            'teacher search group chat of student by student name',
            async function () {
                await teacherSearchConversationByStudentName(teacher, studentName);
            }
        );

        await teacher.instruction(
            `Teacher sees student group chat ${studentId}`,
            async function () {
                await teacherSeeStudentGroupChat(teacher, studentId);
            }
        );

        await teacher.instruction(
            `Teacher sees parent group chat of student ${studentId}`,
            async function () {
                await teacherSeeParentGroupChat(teacher, studentId);
            }
        );
    }
);

Then(
    '{string} of {string} sees parent chat group on Learner App',
    async function (parentRole: AccountRoles, studentRole: AccountRoles) {
        const scenarioContext = this.scenario;
        const learnerProfile = getUserProfileFromContext(
            scenarioContext,
            learnerProfileAliasWithAccountRoleSuffix(studentRole)
        );
        const parent = getLearnerInterfaceFromRole(this, parentRole);
        const studentId = learnerProfile.id;

        await parent.instruction(`${parentRole} open message page`, async function () {
            await moveLearnerToMessagePage(parent);
        });

        await parent.instruction(
            `${parentRole} sees parent group chat of student ${studentId}`,
            async function () {
                await parentSeeParentGroupChat(parent, studentId);
            }
        );
    }
);

Then(
    '{string} sees student chat group on Learner App',
    async function (this: IMasterWorld, studentRole: AccountRoles) {
        const scenarioContext = this.scenario;
        const learner = getLearnerInterfaceFromRole(this, studentRole);
        const learnerProfile = getUserProfileFromContext(
            scenarioContext,
            learnerProfileAliasWithAccountRoleSuffix(studentRole)
        );
        const studentId = learnerProfile.id;

        await learner.instruction(`Learner open message page`, async function () {
            await moveLearnerToMessagePage(learner);
        });

        await learner.instruction(
            `Learner sees student group chat ${studentId}`,
            async function () {
                await learnerSeeStudentGroupChat(learner, studentId);
            }
        );
    }
);

Then('chat groups with students are shown by student name', async function () {
    const scenarioContext = this.scenario;
    const learnerProfile = getUserProfileFromContext(
        scenarioContext,
        learnerProfileAliasWithAccountRoleSuffix('student')
    );
    const teacher = this.teacher;
    const studentId = learnerProfile.id;
    const studentName = learnerProfile.name;

    await teacher.instruction(
        `Teacher check student chat group name ${studentName}`,
        async function (this: TeacherInterface) {
            await teacherCheckStudentGroupChatName(this, studentId, studentName);
        }
    );
});

Then('chat groups with parents are shown by student name and has Parent tag', async function () {
    const scenarioContext = this.scenario;
    const learnerProfile = getUserProfileFromContext(
        scenarioContext,
        learnerProfileAliasWithAccountRoleSuffix('student')
    );
    const teacher = this.teacher;
    const studentId = learnerProfile.id;
    const studentName = learnerProfile.name;

    await teacher.instruction(
        `Teacher check parent chat group name ${studentName}`,
        async function (this: TeacherInterface) {
            await teacherCheckParentGroupChatName(this, studentId, studentName);
        }
    );

    await teacher.instruction(
        `Teacher check parent chat group with parent tag`,
        async function (this: TeacherInterface) {
            await teacherCheckParentGroupChatParentTag(this, studentId);
        }
    );
});

When(
    'school admin adds new {string} for {string} at CMS',
    async function (this: IMasterWorld, parentRole: AccountRoles, studentRole: AccountRoles) {
        const cms = this.cms;
        const { context } = this.scenario;
        const studentProfile = getUserProfileFromContext(
            this.scenario,
            learnerProfileAliasWithAccountRoleSuffix(studentRole)
        );
        const parents = context.get(parentProfilesAliasWithAccountRoleSuffix(studentRole)) ?? [];

        await cms.instruction(`School admin add and fill new ${parentRole} info`, async () => {
            const newParentInfo = await cmsCreateNewParentAndAddForStudent(cms, studentProfile);
            context.set(parentProfilesAliasWithAccountRoleSuffix(studentRole), [
                ...parents,
                newParentInfo,
            ]);
        });
    }
);

Then(
    '{string} sees {string} of {string} chat group in Unjoined tab on Teacher App',
    async function (
        this: IMasterWorld,
        teacherRole: AccountRoles,
        parentRole: AccountRoles,
        learnerRole: AccountRoles
    ) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const studentId = getStudentIdFromContextWithAccountRole(this.scenario, learnerRole);
        const studentName = getUserNameFromContextWithAccountRole(this.scenario, learnerRole);

        await teacher.instruction(`${teacherRole} go to unjoined tab`, async () => {
            await teacherSelectedUnJoinedTab(teacher);
        });

        await teacher.instruction(
            'teacher search group chat of student by student name',
            async function () {
                await teacherSearchConversationByStudentName(teacher, studentName);
            }
        );

        await teacher.instruction(
            `${teacherRole} sees ${parentRole} group chat at unjoined tab`,
            async () => {
                await teacherSeeParentGroupChat(teacher, studentId);
            }
        );

        //Teacher clear filter by student name
        await teacherSearchConversationByStudentName(teacher, '');
    }
);

When(
    'school admin adds existed parent of {string} for {string} at CMS',
    async function (
        this: IMasterWorld,
        studentOfParentRole: AccountRoles,
        studentRole: AccountRoles
    ) {
        const cms = this.cms;
        const { context } = this.scenario;

        const studentProfile = getUserProfileFromContext(
            this.scenario,
            learnerProfileAliasWithAccountRoleSuffix(studentRole)
        );

        const currentParents =
            context.get(parentProfilesAliasWithAccountRoleSuffix(studentRole)) ?? [];

        const existedParentProfile = context.get(
            parentProfilesAliasWithAccountRoleSuffix(studentOfParentRole)
        )[0];

        context.set(parentProfilesAliasWithAccountRoleSuffix(studentRole), [
            ...currentParents,
            existedParentProfile,
        ]);

        await cms.instruction(
            `School admin add existed parent of ${studentOfParentRole} to ${studentRole}`,
            async () => {
                await cmsAddExistedParentForStudent(cms, studentProfile, existedParentProfile);
            }
        );
    }
);

Then(
    '{string} and {string} of {string} are in the same chat group',
    async function (
        this: IMasterWorld,
        parentRole1: AccountRoles,
        parentRole2: AccountRoles,
        studentRole: AccountRoles
    ) {
        const parent1 = getLearnerInterfaceFromRole(this, parentRole1);
        const parent2 = getLearnerInterfaceFromRole(this, parentRole2);
        const studentId = getUserProfileFromContext(
            this.scenario,
            learnerProfileAliasWithAccountRoleSuffix(studentRole)
        ).id;
        const testMessage = randomString(20);

        await parent1.instruction(
            `${parentRole1} sends text message to the parent conversation`,
            async () => {
                await learnerSelectConversation(parent1, true, studentId);
                await learnerEnterTextMessage(parent1, testMessage);
                await learnerSendTextMessage(parent1);
            }
        );

        await parent2.instruction(
            `${parentRole2} sees text message of ${parentRole1} at the same conversation`,
            async () => {
                await learnerSelectConversation(parent2, true, studentId);
                await learnerReceiveMessage(parent2, MessageType.text, testMessage);
            }
        );
    }
);

When(
    'school admin create {string} with parent of {string}',
    async function (this: IMasterWorld, newStudentRole: AccountRoles, studentRole: AccountRoles) {
        const { context } = this.scenario;
        const cms = this.cms;

        const parentProfiles: UserProfileEntity[] = context.get(
            parentProfilesAliasWithAccountRoleSuffix(studentRole)
        );

        await schoolAdminCreateNewStudentWithExistingParent(
            cms,
            this.scenario,
            newStudentRole,
            parentProfiles
        );
    }
);

Then(
    '{string} sees parent chat group of {string} on Learner App',
    async function (this: IMasterWorld, parentRole: AccountRoles, learnerRolesString: string) {
        const parent = getLearnerInterfaceFromRole(this, parentRole);
        const learnerRoles = splitRolesStringToAccountRoles(learnerRolesString);

        await parent.instruction(`${parentRole} goes to message page`, async () => {
            await moveLearnerToMessagePage(parent);
        });

        await parent.instruction(
            `${parentRole} sees parent chat group of ${learnerRolesString}`,
            async () => {
                for (const learnerRole of learnerRoles) {
                    const studentId = getUserProfileFromContext(
                        this.scenario,
                        learnerProfileAliasWithAccountRoleSuffix(learnerRole)
                    ).id;
                    await parentSeeParentGroupChat(parent, studentId);
                }
            }
        );
    }
);

Then(
    '{string} sees student & parent chat group of {string} in Unjoined tab on Teacher App',
    async function (this: IMasterWorld, teacherRole: AccountRoles, learnerRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const studentId = getUserProfileFromContext(
            this.scenario,
            learnerProfileAliasWithAccountRoleSuffix(learnerRole)
        ).id;
        const studentName = getUserNameFromContextWithAccountRole(this.scenario, learnerRole);

        await teacher.instruction(`${teacherRole} selects unjoined tap`, async () => {
            await teacherSelectedUnJoinedTab(teacher);
        });

        await teacher.instruction(
            'teacher search group chat of student by student name',
            async function () {
                await teacherSearchConversationByStudentName(teacher, studentName);
            }
        );

        await teacher.instruction(
            `${teacherRole} sees student & parent chat group of ${learnerRole}`,
            async () => {
                await teacherSeeStudentGroupChat(teacher, studentId);
                await teacherSeeParentGroupChat(teacher, studentId);
            }
        );

        //Teacher clear filter by student name
        await teacherSearchConversationByStudentName(teacher, '');
    }
);
