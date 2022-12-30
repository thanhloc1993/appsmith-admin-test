import { getRandomNumber } from '@legacy-step-definitions/utils';
import { newStudentEmailAlias } from '@user-common/alias-keys/user';
import { formInputEmail } from '@user-common/cms-selectors/students-page';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { CreateStudentResponseEntity } from '@supports/services/usermgmt-student-service/entities/create-student-response';

import { createARandomStudentGRPC } from './user-create-student-definitions';

export async function createStudentAndFillStudentEmail(cms: CMSInterface) {
    const response: CreateStudentResponseEntity = await createARandomStudentGRPC(cms, {});

    if (!response?.student) throw new Error('Not found student');

    await Promise.all([
        // Wait for response which check email exited on system
        cms.waitForHasuraResponse('UserByEmail'),

        cms.page?.fill(formInputEmail, response.student.email),
    ]);
}

export async function createNewParentAndFillStudentEmail(cms: CMSInterface) {
    const response: CreateStudentResponseEntity = await createARandomStudentGRPC(cms, {});

    if (!response?.parents.length) throw new Error('Not found list parents');

    await Promise.all([
        // Wait for response which check email exited on system
        cms.waitForHasuraResponse('UserByEmail'),

        cms.page?.fill(formInputEmail, response.parents[0].email),
    ]);
}

export async function schoolAdminFillsEmailWithValidData(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    await cms.instruction('School admin fills email with valid data', async function (cms) {
        const studentEmail = `e2e-student.${getRandomNumber()}@manabie.com`;

        scenarioContext.set(newStudentEmailAlias, studentEmail);
        await cms.page?.fill(formInputEmail, studentEmail);
    });
}
