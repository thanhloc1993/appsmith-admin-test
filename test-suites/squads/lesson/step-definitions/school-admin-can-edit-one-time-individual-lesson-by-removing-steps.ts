import { aliasLessonId } from '@legacy-step-definitions/alias-keys/lesson';
import {
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
    getUsersFromContextByRegexKeys,
} from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { CreateLessonRequestData } from '@supports/services/lessonmgmt/lesson-management-service';
import NsMasterCourseService from '@supports/services/master-course-service/request-types';

import {
    aliasCourse,
    aliasLessonName,
    aliasLessonInfo,
} from 'test-suites/squads/lesson/common/alias-keys';
import { ActionCanSee, LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import { assertNewLessonOnTeacherApp } from 'test-suites/squads/lesson/utils/lesson-upsert';
import { assertLessonVisibleOnLearnerApp } from 'test-suites/squads/virtual-classroom/utils/lesson';
import { learnerGoToLesson } from 'test-suites/squads/virtual-classroom/utils/navigation';

Then(
    '{string} can {string} new {string} lesson on Teacher App',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        action: ActionCanSee,
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
            `${role} can {string} new ${lessonTime} lesson on Teacher App`,
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
    '{string} can {string} new lesson on Learner App',
    async function (this: IMasterWorld, role: AccountRoles, action: ActionCanSee) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const lessonInfo = this.scenario.get<CreateLessonRequestData>(aliasLessonInfo);
        const lessonId = this.scenario.get(aliasLessonId);
        const lessonName = this.scenario.get<string>(aliasLessonName);

        const startTime = lessonInfo.startTime ? new Date(lessonInfo.startTime) : undefined;

        await learner.instruction(
            `${role} can ${action} new lesson on Learner App`,
            async function () {
                const shouldDisplay = action === 'see';
                await learnerGoToLesson(learner);
                await assertLessonVisibleOnLearnerApp(
                    learner,
                    lessonId,
                    lessonName,
                    startTime,
                    shouldDisplay
                );
            }
        );
    }
);
