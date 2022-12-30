import { staffProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { AccountRoles, CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { createSampleStudentWithCourseAndEnrolledStatus } from 'step-definitions/lesson-management-utils';
import {
    getStaffNameFromContext,
    getStudentNameFromContext,
} from 'test-suites/common/step-definitions/user-common-definitions';
import { aliasLessonTime } from 'test-suites/squads/lesson/common/alias-keys';
import { LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import { addNewTeacherOrStudentToLesson } from 'test-suites/squads/lesson/step-definitions/can-edit-one-time-individual-lesson-by-updating-and-adding-definitions';
import {
    assertStudentNameExistInLessonDetailPageOnCMS,
    assertTeacherNameExistInLessonDetailPageOnCMS,
} from 'test-suites/squads/lesson/step-definitions/lesson-can-edit-one-time-group-lesson-by-removing-definitions';
import { searchLessonByStudentName } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import {
    getFirstStudentInfo,
    OrderLessonInRecurringChain,
    selectLessonLinkByLessonOrder,
} from 'test-suites/squads/lesson/step-definitions/school-admin-edits-lesson-date-of-weekly-recurring-individual-lesson-definitions';
import { goToLessonsList } from 'test-suites/squads/lesson/utils/lesson-list';
import { CreateLessonWithGRPCProps } from 'test-suites/squads/lesson/utils/lesson-upsert';
import { createLessonWithGRPC } from 'test-suites/squads/lesson/utils/lesson-upsert';
import { userIsOnLessonDetailPage } from 'test-suites/squads/lesson/utils/navigation';
import { createARandomStaffFromGRPC } from 'test-suites/squads/user-management/step-definitions/user-create-staff-definitions';

export const createNewTeacher = async (params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    teacherRole: AccountRoles;
}) => {
    const { cms, scenarioContext, teacherRole } = params;
    const teacher = await createARandomStaffFromGRPC(cms);

    const teacherProfileAliasKey = staffProfileAliasWithAccountRoleSuffix(teacherRole);
    scenarioContext.set(teacherProfileAliasKey, teacher);
};

export const createNewListTeachers = async (params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    teacherRoles: AccountRoles[];
}) => {
    const { cms, scenarioContext, teacherRoles } = params;
    for (const teacherRole of teacherRoles) {
        await createNewTeacher({
            cms,
            scenarioContext,
            teacherRole,
        });
    }
};

export const createNewListStudents = async (params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    studentRoles: AccountRoles[];
}) => {
    const { cms, scenarioContext, studentRoles } = params;
    for (const studentRole of studentRoles) {
        await createSampleStudentWithCourseAndEnrolledStatus({
            cms,
            scenarioContext,
            studentRole,
        });
    }
};

export interface CreateLessonWithTeachersAndStudentsByGRPCProps extends CreateLessonWithGRPCProps {
    teacherRoles: AccountRoles[];
    studentRoles: AccountRoles[];
}

export const createLessonWithTeachersAndStudentsByGRPC = async (
    params: CreateLessonWithTeachersAndStudentsByGRPCProps
) => {
    const { cms, scenarioContext, teacherRoles, studentRoles, ...rest } = params;
    await createNewListTeachers({
        cms,
        scenarioContext,
        teacherRoles,
    });
    await createNewListStudents({
        cms,
        scenarioContext,
        studentRoles,
    });
    await createLessonWithGRPC({
        cms,
        scenarioContext,
        ...rest,
    });
};

export const assertSeeTeacherAndStudentOfRecurringLesson = async (params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    order: OrderLessonInRecurringChain;
    teacherRole: AccountRoles;
    studentRole: AccountRoles;
    shouldBeExisted: boolean;
}) => {
    const { cms, scenarioContext, order, teacherRole, studentRole, shouldBeExisted } = params;

    const teacherName = getStaffNameFromContext(scenarioContext, teacherRole);
    const studentName = getStudentNameFromContext(scenarioContext, studentRole);
    const filterStudent = await getFirstStudentInfo(scenarioContext);
    const lessonTime = scenarioContext.get<LessonTimeValueType>(aliasLessonTime);

    await cms.instruction(
        `Go to lesson management and change to tab ${lessonTime} lessons list`,
        async function () {
            await goToLessonsList({ cms, lessonTime });
        }
    );

    await cms.instruction(
        `Go to lesson that has order ${order} in recurring chain`,
        async function () {
            await searchLessonByStudentName(cms, filterStudent.name, lessonTime);

            await selectLessonLinkByLessonOrder(cms, order, lessonTime);
        }
    );

    await cms.instruction('User is on lesson detail page', async function () {
        await userIsOnLessonDetailPage(cms);
    });

    await assertTeacherNameExistInLessonDetailPageOnCMS(cms, teacherName, shouldBeExisted);

    await assertStudentNameExistInLessonDetailPageOnCMS(cms, studentName, shouldBeExisted);
};

export const setupAndAddNewTeacherAndStudentToLesson = async (params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    teacherRole: AccountRoles;
    studentRole: AccountRoles;
}) => {
    const { cms, scenarioContext, teacherRole, studentRole } = params;
    await createNewListTeachers({
        cms,
        scenarioContext,
        teacherRoles: [teacherRole],
    });
    await createNewListStudents({
        cms,
        scenarioContext,
        studentRoles: [studentRole],
    });
    await addNewTeacherOrStudentToLesson(cms, scenarioContext, teacherRole);
    await addNewTeacherOrStudentToLesson(cms, scenarioContext, studentRole);
};
