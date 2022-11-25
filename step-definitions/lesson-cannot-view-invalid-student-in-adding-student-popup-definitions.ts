import { StatusTypes } from '@legacy-step-definitions/types/common';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { AccountRoles, CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import StudentSubscriptionsService from '@supports/services/bob-lesson-student-subscriptions/bob-lesson-student-subscriptions-service';
import { CreateStudentResponseEntity } from '@supports/services/usermgmt-student-service/entities/create-student-response';

import * as CMSKeys from './cms-selectors/cms-keys';
import * as LessonManagementKeys from 'step-definitions/cms-selectors/lesson-management';
import { createARandomStudentGRPC } from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';

export async function createStudentWithStatusLessonManagement(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    status: StatusTypes,
    studentRole: AccountRoles,
    studentPackageProfileLength: number
) {
    const enrollmentStatus = parseEnrollmentStatusFromStatusType(status);
    const response: CreateStudentResponseEntity = await createARandomStudentGRPC(cms, {
        studentPackageProfileLength: studentPackageProfileLength,
        defaultEnrollmentStatus: enrollmentStatus,
    });

    const student = response.student;

    scenarioContext.set(learnerProfileAliasWithAccountRoleSuffix(studentRole), student);
}

function parseEnrollmentStatusFromStatusType(status: StatusTypes) {
    switch (status) {
        case StatusTypes.POTENTIAL:
            return 'STUDENT_ENROLLMENT_STATUS_POTENTIAL';
        case StatusTypes.ENROLLED:
            return 'STUDENT_ENROLLMENT_STATUS_ENROLLED';
        case StatusTypes.WITHDRAWN:
            return 'STUDENT_ENROLLMENT_STATUS_WITHDRAWN';
        case StatusTypes.GRADUATED:
            return 'STUDENT_ENROLLMENT_STATUS_GRADUATED';
        case StatusTypes.LOA:
            break;
        default:
            return 'STUDENT_ENROLLMENT_STATUS_NONE';
    }
}

export async function studentInvisibleInDialogAddStudentSubscription(cms: CMSInterface) {
    const page = cms.page!;

    await page.waitForSelector(LessonManagementKeys.lessonNoDataMessage);
}

export async function searchStudentNameOnStudentPopUp(cms: CMSInterface, name: string) {
    const page = cms.page!;

    await cms.instruction(`Searching student ${name}`, async function () {
        await page.fill(CMSKeys.formFilterAdvancedTextFieldSearchInput, name);
        await Promise.all([
            cms.waitForGRPCResponse(
                `${StudentSubscriptionsService.serviceName}/${StudentSubscriptionsService.retrieveStudentSubscriptionMethodName}`
            ),
            page.keyboard.press('Enter'),
        ]);
    });
}
