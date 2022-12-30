import { getAppInterface, getUserProfileFromContext } from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithTenantAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Then, When } from '@cucumber/cucumber';

import { IMasterWorld, TeacherInterface, Tenant } from '@supports/app-types';

import {
    teacherNotSeeParentGroupChat,
    teacherNotSeeStudentGroupChat,
    teacherSeeParentGroupChat,
    teacherSeeStudentGroupChat,
    VisibleAction,
} from './communication-common-definitions';
import { teacherSearchConversationByStudentName } from './communication-search-chat-group-definitions';

When(
    'Teacher of tenant {string} search student name of tenant {string} on Teacher App',
    async function (this: IMasterWorld, tenant: Tenant, anotherTenant: Tenant) {
        const teacher = getAppInterface(this, 'teacher', tenant) as TeacherInterface;
        const scenarioContext = this.scenario;
        const learnerProfile = getUserProfileFromContext(
            scenarioContext,
            learnerProfileAliasWithTenantAccountRoleSuffix(`school admin ${anotherTenant}`)
        );

        await teacher.instruction(
            `teacher of ${tenant} search group chat by student name of ${anotherTenant}`,
            async () => {
                await teacherSearchConversationByStudentName(teacher, learnerProfile?.name ?? '');
            }
        );
    }
);

Then(
    'Teacher of tenant {string} {string} student & parent chat group of tenant {string} on Teacher App',
    async function (
        this: IMasterWorld,
        tenant: Tenant,
        action: VisibleAction,
        anotherTenant: Tenant
    ) {
        const teacher = getAppInterface(this, 'teacher', tenant) as TeacherInterface;
        const scenarioContext = this.scenario;
        const learnerProfile = getUserProfileFromContext(
            scenarioContext,
            learnerProfileAliasWithTenantAccountRoleSuffix(`school admin ${anotherTenant}`)
        );

        await teacher.instruction(
            `teacher of ${tenant} ${action} student & parent group chat of tenant ${anotherTenant}`,
            async () => {
                if (action == 'sees') {
                    await teacherSeeStudentGroupChat(teacher, learnerProfile.id);
                    await teacherSeeParentGroupChat(teacher, learnerProfile.id);
                } else {
                    await teacherNotSeeStudentGroupChat(teacher, learnerProfile.id);
                    await teacherNotSeeParentGroupChat(teacher, learnerProfile.id);
                }
            }
        );
    }
);
