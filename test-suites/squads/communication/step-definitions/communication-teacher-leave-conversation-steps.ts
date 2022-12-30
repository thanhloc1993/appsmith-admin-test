import {
    getStudentIdFromContextWithAccountRole,
    getTeacherInterfaceFromRole,
    isParentRole,
} from '@legacy-step-definitions/utils';

import { When, Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { aliasStudentId } from './alias-keys/communication';
import {
    teacherNotSeeParentGroupChat,
    teacherNotSeeStudentGroupChat,
} from './communication-common-definitions';
import { teacherLeaveGroupChat } from './communication-teacher-leave-conversation-definitions';

When(
    '{string} leaves {string} chat group',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        learnerRole: AccountRoles
    ): Promise<void> {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const isParent = isParentRole(learnerRole);
        const studentId = getStudentIdFromContextWithAccountRole(this.scenario, learnerRole);

        this.scenario.set(aliasStudentId, studentId);

        await teacher.instruction(`teacher leave ${role} group chat`, async function () {
            await teacherLeaveGroupChat(teacher, isParent, studentId);
        });
    }
);

Then(
    'teacher sees teacher leave {string} chat group successfully',
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const teacher = this.teacher;
        const isParent = isParentRole(role);
        const studentId = this.scenario.get(aliasStudentId);

        await teacher.instruction(
            `teacher sees teacher leave chat group successfully`,
            async function () {
                isParent
                    ? await teacherNotSeeParentGroupChat(teacher, studentId)
                    : await teacherNotSeeStudentGroupChat(teacher, studentId);
            }
        );
    }
);
