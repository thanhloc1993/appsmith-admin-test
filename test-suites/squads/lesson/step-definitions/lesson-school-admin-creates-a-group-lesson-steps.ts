import { aliasLessonId } from '@legacy-step-definitions/alias-keys/lesson';
import { schoolAdminEditsTeachingMedium } from '@legacy-step-definitions/lesson-edit-teaching-medium-of-past-lesson-definitions';
import {
    getCMSInterfaceByRole,
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
    getUserProfileFromContext,
    getUsersFromContextByRegexKeys,
} from '@legacy-step-definitions/utils';
import {
    learnerProfileAliasWithAccountRoleSuffix,
    staffProfileAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { CreateLessonRequestData } from '@supports/services/lessonmgmt/lesson-management-service';
import NsMasterCourseService from '@supports/services/master-course-service/request-types';

import {
    aliasImportedClass,
    aliasCourse,
    aliasLessonName,
    aliasLessonInfo,
    aliasStartDate,
} from 'test-suites/squads/lesson/common/alias-keys';
import {
    ClassCSV,
    LessonTimeValueType,
    LessonUpsertFields,
    TeachingMediumValueType,
    TeachingMethodValueType,
} from 'test-suites/squads/lesson/common/types';
import {
    assertSeeLessonOnCMS,
    selectTeachingMethod,
} from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import {
    changeLessonDateWithFromUpsertV3,
    changeTimeLesson,
} from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-cannot-edit-weekly-recurring-individual-lesson-definitions';
import {
    addCourseAndClassToStudent,
    importClassToCourse,
} from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-creates-a-group-lesson-definitions';
import {
    assertNewLessonOnTeacherApp,
    fillUpsertFormLessonV3WithMissingFields,
} from 'test-suites/squads/lesson/utils/lesson-upsert';
import { assertLessonVisibleOnLearnerApp } from 'test-suites/squads/virtual-classroom/utils/lesson';
import { learnerGoToLesson } from 'test-suites/squads/virtual-classroom/utils/navigation';

Given(
    '{string} has imported class for the course',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        await cms.instruction(`${role}  has imported class for the course`, async function () {
            await importClassToCourse(cms, context);
        });
    }
);

Given(
    '{string} has added course and class to the student',
    async function name(this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const studentInfo = scenarioContext.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix('student')
        );
        const classInfo = scenarioContext.get<ClassCSV[]>(aliasImportedClass);
        const courseInfo =
            scenarioContext.get<NsMasterCourseService.UpsertCoursesRequest>(aliasCourse);

        await cms.instruction(
            `${role} has added course and class to the student`,
            async function () {
                await addCourseAndClassToStudent(
                    cms,
                    studentInfo.id,
                    studentInfo.name,
                    courseInfo.id,
                    classInfo[0].class_name
                );
                await cms.waitingForLoadingIcon();
            }
        );
    }
);

When(
    '{string} fills date&time in the {string}',
    async function (this: IMasterWorld, role: AccountRoles, lessonTime: LessonTimeValueType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(`${role} fills date&time in the future`, async function () {
            const dateRange = lessonTime === 'future' ? 0 : 1;
            await changeLessonDateWithFromUpsertV3(cms, scenarioContext, dateRange);
            await changeTimeLesson(cms, '23:00', '23:45');
        });
    }
);

When(
    '{string} selects teaching medium is {string}',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        teachingMedium: TeachingMediumValueType
    ) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} selects teaching medium is ${teachingMedium}`,
            async function () {
                await schoolAdminEditsTeachingMedium(cms, teachingMedium);
            }
        );
    }
);

When(
    '{string} selects teaching method is {string}',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        teachingMethod: TeachingMethodValueType
    ) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} selects teaching medium is ${teachingMethod}`,
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
    '{string} fills remain fields and missing {string} field',
    async function (this: IMasterWorld, role: AccountRoles, field: LessonUpsertFields | 'none') {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const { name: teacherName } = getUserProfileFromContext(
            scenarioContext,
            staffProfileAliasWithAccountRoleSuffix('teacher')
        );

        const studentInfo = scenarioContext.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        const courseInfo =
            scenarioContext.get<NsMasterCourseService.UpsertCoursesRequest>(aliasCourse);
        const classInfo = scenarioContext.get<ClassCSV[]>(aliasImportedClass);

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
                    centerName: studentInfo.locations![0].name,
                    courseName: courseInfo.name,
                    className: classInfo[0].class_name,
                    missingFields: missingFields,
                });
            }
        );
    }
);

Then(
    '{string} sees newly created one time group lesson on CMS',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const studentInfo = scenarioContext.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix('student')
        );
        const lessonId = scenarioContext.get(aliasLessonId);
        await cms.instruction(
            `${role} sees newly created one time group lesson on CMS`,
            async function () {
                await assertSeeLessonOnCMS({
                    cms,
                    lessonId,
                    studentName: studentInfo.name,
                    shouldSeeLesson: true,
                    lessonTime: 'future',
                });
            }
        );
    }
);

Then(
    '{string} can {string} new {string} one time group lesson on Teacher App',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        action: 'see' | 'not see',
        lessonTime: LessonTimeValueType
    ) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenarioContext = this.scenario;

        const studentInfo = getUsersFromContextByRegexKeys(
            scenarioContext,
            learnerProfileAliasWithAccountRoleSuffix('student')
        )[0];
        const courseInfo =
            scenarioContext.get<NsMasterCourseService.UpsertCoursesRequest>(aliasCourse);
        const lessonId = scenarioContext.get(aliasLessonId);

        await teacher.instruction(
            `${role} can ${action} new ${lessonTime} one time group lesson on Teacher App`,
            async function () {
                const shouldDisplay = action === 'see' ? true : false;
                await assertNewLessonOnTeacherApp({
                    teacher,
                    lessonId,
                    courseId: courseInfo.id,
                    locationId: studentInfo.locations![0].locationId,
                    lessonTime,
                    shouldDisplay,
                });
            }
        );
    }
);

Then(
    '{string} can {string} new one time group lesson on Learner App',
    async function (this: IMasterWorld, role: AccountRoles, action: 'see' | 'not see') {
        const learner = getLearnerInterfaceFromRole(this, role);
        const lessonInfo = this.scenario.get<CreateLessonRequestData>(aliasLessonInfo);

        const getStartDateAlias = this.scenario.get(aliasStartDate);
        const startDate = getStartDateAlias || lessonInfo.startTime;
        const lessonStartTime = startDate ? new Date(startDate) : undefined;

        const lessonId = this.scenario.get(aliasLessonId);
        const lessonName = this.scenario.get<string>(aliasLessonName);
        await learner.instruction(
            `${role} can ${action} new lesson on Teacher App`,
            async function () {
                const shouldDisplay = action === 'see' ? true : false;
                await learnerGoToLesson(learner);
                await assertLessonVisibleOnLearnerApp(
                    learner,
                    lessonId,
                    lessonName,
                    lessonStartTime,
                    shouldDisplay
                );
            }
        );
    }
);
