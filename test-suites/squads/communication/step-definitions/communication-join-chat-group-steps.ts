import {
    getLearnerInterfaceFromRole,
    getStudentIdFromContextWithAccountRole,
    getTeacherInterfaceFromRole,
    getUserNameFromContextWithAccountRole,
    getUserIdFromContextWithAccountRole,
    isParentRole,
} from '@legacy-step-definitions/utils';

import { Given, When, Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld, TeacherInterface } from '@supports/app-types';

import { aliasMessageType, messageContentKey } from './alias-keys/communication';
import {
    MessageType,
    moveLearnerToMessagePage,
    moveTeacherToMessagePage,
    teacherSeeParentGroupChat,
    teacherSeesLoadingDialog,
    teacherSeeStudentGroupChat as teacherSeesStudentGroupChat,
    teacherSelectedJoinedTab,
    teacherSelectedUnJoinedTab,
} from './communication-common-definitions';
import {
    teacherTapJoinChatGroupButton,
    teacherSelectStudentChatGroup,
    teacherSelectParentGroupChat,
    teacherTapJoinAllButton,
    teacherTapJoinAllDialogButton,
    teacherSeeJoinAllSuccessMessage,
} from './communication-join-chat-group-definitions';
import { teacherSearchConversationByStudentName } from './communication-search-chat-group-definitions';
import {
    teacherEnterTextMessage,
    teacherSendTextMessage,
} from './communication-send-message-definitions';
import { learnerSeesMessage } from './communication-send-receive-message-definitions';

Given('{string} is at Unjoined list', async function (this: IMasterWorld, role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);

    await teacher.instruction('Teacher is at message page', async function () {
        await moveTeacherToMessagePage(teacher);
    });

    await teacher.instruction('Teacher selected unjoined tab', async function () {
        await teacherSelectedUnJoinedTab(teacher);
    });
});

Given('student is at conversation screen', async function () {
    const learner = this.learner;

    await learner.instruction('Student is at conversation screen', async function () {
        await moveLearnerToMessagePage(learner);
    });
});

Given('parent is at conversation screen', async function () {
    const parent = this.parent;

    await parent.instruction('Parent is at conversation screen', async function () {
        await moveLearnerToMessagePage(parent);
    });
});

When(
    '{string} joins {string} chat group',
    async function (this: IMasterWorld, teacherRole: AccountRoles, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const studentId = getStudentIdFromContextWithAccountRole(this.scenario, role);
        const isParent = isParentRole(role);

        await teacher.instruction(`${teacher} selected unjoined tab`, async function () {
            await teacherSelectedUnJoinedTab(teacher);
        });

        await teacher.instruction(`${teacher} selected ${role} group chat`, async function () {
            if (isParent) {
                await teacherSelectParentGroupChat(teacher, studentId);
            } else {
                await teacherSelectStudentChatGroup(teacher, studentId);
            }
        });

        await teacher.instruction(`${teacher} join chat group`, async function () {
            await teacherTapJoinChatGroupButton(teacher);
        });
    }
);

When('teacher sends text message to current conversation', async function (this: IMasterWorld) {
    const teacher = this.teacher;
    const scenario = this.scenario;
    const messageText = 'test';
    scenario.set(aliasMessageType, MessageType.text);
    scenario.set(messageContentKey, messageText);

    await teacher.instruction(
        'Teacher send text message to current conversation',
        async function (teacher: TeacherInterface) {
            await teacherEnterTextMessage(teacher, messageText);
            await teacherSendTextMessage(teacher);
        }
    );
});

Then(
    '{string} sees teacher joins chat group successfully on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const messageType = this.scenario.get<MessageType>(aliasMessageType);
        const messageText = this.scenario.get<string>(messageContentKey);

        await learner.instruction(
            `${role} sees message ${messageType} on learner app`,
            async function () {
                await learnerSeesMessage(learner, messageType, messageText);
            }
        );
    }
);

Then(
    'teacher joins {string} chat group successfully',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = this.teacher;
        const studentId = await this.learner.getUserId();
        const isParent = isParentRole(role);

        await teacher.instruction('Teacher select joined tab', async function () {
            await teacherSelectedJoinedTab(teacher);
        });

        await teacher.instruction(
            `Teacher sees ${role} chat group in joined tab`,
            async function () {
                if (isParent) {
                    await teacherSeeParentGroupChat(teacher, studentId);
                } else {
                    await teacherSeesStudentGroupChat(teacher, studentId);
                }
            }
        );
    }
);

When('teacher joins all chat groups on Teacher App', async function () {
    const teacher = this.teacher;

    await teacher.instruction('Teacher tap join all button', async function () {
        await teacherTapJoinAllButton(teacher);
    });

    await teacher.instruction('Teacher confirm join all', async function () {
        await teacherTapJoinAllDialogButton(teacher);
    });
});

Then(
    'teacher joins all student chat groups and all parent chat groups successfully',
    { timeout: 5 * 60000 },
    async function () {
        const teacher = this.teacher;

        await teacher.instruction('Teacher see loading dialog', async function () {
            await teacherSeesLoadingDialog(teacher);
        });

        await teacher.instruction('Teacher see join all successfully message', async function () {
            await teacherSeeJoinAllSuccessMessage(teacher);
        });
    }
);

Given(
    '{string} joined {string} group chat and {string} group chat successfully',
    { timeout: 60000 },
    async function (
        this: IMasterWorld,
        teacherRole: AccountRoles,
        learnerRole: AccountRoles,
        parentRole: AccountRoles
    ) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const studentId = getUserIdFromContextWithAccountRole(this.scenario, learnerRole);
        const studentName = getUserNameFromContextWithAccountRole(this.scenario, learnerRole);

        await teacherJoinGroupChatInstruction(teacher, learnerRole, studentId, studentName);

        await teacherJoinGroupChatInstruction(teacher, parentRole, studentId, studentName);

        //Teacher clear filter by student name
        await teacherSearchConversationByStudentName(teacher, '');
    }
);

async function teacherJoinGroupChatInstruction(
    teacher: TeacherInterface,
    role: AccountRoles,
    studentId: string,
    studentCode: string
) {
    const isParent = isParentRole(role);
    let isSelectedGroupChat = false;

    await teacher.instruction('Teacher selected unjoined tab', async function () {
        await teacherSelectedUnJoinedTab(teacher);
    });

    await teacher.instruction(
        'teacher search group chat of student by student name',
        async function () {
            await teacherSearchConversationByStudentName(teacher, studentCode);
        }
    );

    await teacher.instruction(`Teacher selected ${role} group chat`, async function () {
        while (!isSelectedGroupChat) {
            try {
                isParent
                    ? await teacherSelectParentGroupChat(teacher, studentId)
                    : await teacherSelectStudentChatGroup(teacher, studentId);
                isSelectedGroupChat = true;
            } catch (error) {
                console.log(`Trying to select group chat`);
                await teacherSelectedJoinedTab(teacher);
                await teacherSelectedUnJoinedTab(teacher);
            }
        }
    });

    await teacher.instruction(`teacher join ${role} group chat`, async function () {
        await teacherTapJoinChatGroupButton(teacher);
    });

    await teacher.instruction(`Teacher sees ${role} chat group in joined tab`, async function () {
        isParent
            ? await teacherSeeParentGroupChat(teacher, studentId)
            : await teacherSeesStudentGroupChat(teacher, studentId);
    });
}
