import { staffProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { AccountRoles, CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { parseAfterThatLessonTime } from '../utils/lesson-report';
import { LessonTeachingMethod } from 'manabuf/common/v1/enums_pb';
import { CreateLessonSavingMethod } from 'manabuf/lessonmgmt/v1/enums_pb';
import { LessonTimeValueType, MethodSavingType } from 'test-suites/squads/lesson/common/types';
import { createSampleStudentWithPackage } from 'test-suites/squads/lesson/services/student-service/student-service';
import { createLessonWithGRPC } from 'test-suites/squads/lesson/utils/lesson-upsert';
import { createARandomStaffFromGRPC } from 'test-suites/squads/user-management/step-definitions/user-create-staff-definitions';

export async function createGroupLessonWithTeacherAndStudent(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    lessonTime: LessonTimeValueType,
    methodSaving: MethodSavingType,
    teacherRoles: AccountRoles[],
    studentRoles: AccountRoles[]
) {
    for (const role of teacherRoles) {
        const teacher = await createARandomStaffFromGRPC(cms);
        const teacherProfileAliasKey = staffProfileAliasWithAccountRoleSuffix(role);
        scenarioContext.set(teacherProfileAliasKey, teacher);
    }

    for (const role of studentRoles) {
        await createSampleStudentWithPackage({
            cms,
            scenarioContext,
            studentRole: role,
        });
    }

    const createLessonTime = parseAfterThatLessonTime({
        lessonTime,
        methodSaving,
    });

    await createLessonWithGRPC({
        cms,
        scenarioContext,
        createLessonTime,
        teachingMethod: LessonTeachingMethod.LESSON_TEACHING_METHOD_GROUP,
        teachingMedium: 'Online',
        methodSavingOption: CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_RECURRENCE,
    });
}
