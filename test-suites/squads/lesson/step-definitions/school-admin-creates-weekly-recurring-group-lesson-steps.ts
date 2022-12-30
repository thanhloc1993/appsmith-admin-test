import {
    learnerProfileAliasWithAccountRoleSuffix,
    staffProfileAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { Given, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { LessonActionSaveType } from '../types/lesson-management';
import { getUserProfileFromContext } from 'test-suites/common/step-definitions/user-common-definitions';
import { getCMSInterfaceByRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import { aliasClassName, aliasCourseName } from 'test-suites/squads/lesson/common/alias-keys';
import {
    LessonUpsertFields,
    TeachingMethodValueType,
} from 'test-suites/squads/lesson/common/types';
import {
    selectDateAndTimeOfFuture,
    selectTeachingMethod,
} from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { selectRecurring } from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-creates-weekly-recurring-individual-lesson-definitions';
import {
    fillUpsertFormLessonV3WithMissingFields,
    saveLessonWithStatus,
    selectTeachingMedium,
} from 'test-suites/squads/lesson/utils/lesson-upsert';

Given(
    '{string} has filled remain fields and missing {string} field',
    { timeout: 200000 },
    async function (role: AccountRoles, field: LessonUpsertFields | 'none') {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const { name: teacherName } = getUserProfileFromContext(
            scenarioContext,
            staffProfileAliasWithAccountRoleSuffix('teacher')
        );

        const studentInfo = getUserProfileFromContext(
            scenarioContext,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        const courseName = scenarioContext.get(aliasCourseName);
        const className = scenarioContext.get(aliasClassName);

        await cms.instruction(
            `${role} fills all remain fields and missing ${field} field`,
            async function () {
                const missingFields: LessonUpsertFields[] = [
                    'start time',
                    'teaching medium',
                    'teaching method',
                    'end time',
                ];
                if (field !== 'none') missingFields.push(field);
                await fillUpsertFormLessonV3WithMissingFields({
                    cms,
                    teacherName,
                    className,
                    missingFields,
                    courseName,
                    centerName: studentInfo.locations![0].name,
                });
            }
        );
    }
);

Given(
    '{string} has selected {string} teaching method',
    async function (role: AccountRoles, teachingMethod: TeachingMethodValueType) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} has selected ${teachingMethod} teaching method`,
            async function () {
                const teachingMethodKey =
                    teachingMethod === 'Group'
                        ? 'LESSON_TEACHING_METHOD_GROUP'
                        : 'LESSON_TEACHING_METHOD_INDIVIDUAL';
                await selectTeachingMethod(cms, teachingMethodKey);
            }
        );
    }
);

When(
    '{string} creates weekly recurring group lesson with missing End date field',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const { name: teacherName } = getUserProfileFromContext(
            scenarioContext,
            staffProfileAliasWithAccountRoleSuffix('teacher')
        );

        const studentInfo = getUserProfileFromContext(
            scenarioContext,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        const courseName = scenarioContext.get(aliasCourseName);
        const className = scenarioContext.get(aliasClassName);
        const missingFields: LessonUpsertFields[] = ['start time', 'end time'];
        await cms.instruction(
            `${role} creates weekly recurring group lesson with missing End date field`,
            async function () {
                await selectDateAndTimeOfFuture(cms);
                await selectTeachingMedium(cms, 'LESSON_TEACHING_MEDIUM_ONLINE');
                await selectRecurring(cms);
                await fillUpsertFormLessonV3WithMissingFields({
                    cms,
                    teacherName,
                    className,
                    missingFields,
                    courseName,
                    centerName: studentInfo.locations![0].name,
                });
            }
        );
    }
);

When(
    '{string} clicks save {string} the lesson page',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonActionSave: LessonActionSaveType
    ) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} clicks save ${lessonActionSave} the lesson page`,
            async function () {
                await saveLessonWithStatus(cms, lessonActionSave);
            }
        );
    }
);
