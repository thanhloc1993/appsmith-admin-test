import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';
import { staffProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, When } from '@cucumber/cucumber';

import { AccountRoles, Locations } from '@supports/app-types';
import { LocationObjectGRPC } from '@supports/types/cms-types';

import { deleteLesson } from './school-admin-can-delete-one-time-individual-group-published-lesson-on-calendar-weekly-view.definition';
import {
    assertSeeOtherLessonInChain,
    calendarGoNextByNextButton,
    selectCourseUpsertByName,
    selectUpsertEndDate,
    userPublishAndWaitingResponseLesson,
} from './school-admin-can-delete-recurring-individual-group-lesson-on-calendar-weekly-view-definitions';
import { checkAndShowMoreLessonItemInCellByDate } from './school-admin-can-view-draft-one-time-lessons-created-in-lessonmgmt-on-calendar-weekly-view-definitions';
import { openCreateLessonPage } from './school-admin-can-view-draft-one-time-lessons-on-calendar-weekly-view-definitions';
import moment from 'moment-timezone';
import {
    aliasFirstGrantedLocation,
    aliasLocationId,
    aliasLocationName,
} from 'test-suites/squads/calendar/common/alias-keys';
import { DeleteLessonType, LessonType } from 'test-suites/squads/calendar/common/types';
import { checkTeachingMethod } from 'test-suites/squads/lesson/step-definitions/lesson-create-an-individual-lesson-definitions';
import {
    selectTeacher,
    selectTeachingMethod,
} from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { changeTimeLesson } from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-cannot-edit-weekly-recurring-individual-lesson-definitions';
import { selectCenterByNameV3 } from 'test-suites/squads/lesson/utils/lesson-upsert';
import { createARandomStaffFromGRPC } from 'test-suites/squads/user-management/step-definitions/user-create-staff-definitions';

Given(
    '{string} has created recurring {string} lesson with lesson date in the future and {string} by Add button',
    async function (role: AccountRoles, lessonType: LessonType, location: Locations) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const firstGrantedLocation =
            scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);
        const locationId = firstGrantedLocation.locationId;
        const locationName = firstGrantedLocation.name;

        scenarioContext.set(aliasLocationId, locationId);
        scenarioContext.set(aliasLocationName, locationName);

        const teacher = await createARandomStaffFromGRPC(cms);
        const teacherProfileAliasKey = staffProfileAliasWithAccountRoleSuffix('teacher');
        scenarioContext.set(teacherProfileAliasKey, teacher);

        await cms.instruction(
            `${role} click add lesson button on calendar page`,
            async function () {
                await openCreateLessonPage(cms);
            }
        );

        await cms.instruction(`${role} fill lesson time`, async function () {
            await changeTimeLesson(cms, '16:00', '17:00');
        });

        await cms.instruction(
            `${role} has filled ${lessonType} teaching method`,
            async function () {
                await checkTeachingMethod(cms);
                const teachingMethodKey =
                    lessonType === 'group'
                        ? 'LESSON_TEACHING_METHOD_GROUP'
                        : 'LESSON_TEACHING_METHOD_INDIVIDUAL';
                await selectTeachingMethod(cms, teachingMethodKey);
            }
        );

        await cms.instruction(`${role} filled location ${location}`, async function () {
            await selectCenterByNameV3(cms, locationName);
        });
        await cms.instruction(`${role} has filled teacher`, async function () {
            await selectTeacher(cms, teacher.name);
        });

        if (lessonType === 'group') {
            await cms.instruction(`${role} has filled course`, async function () {
                await selectCourseUpsertByName(cms);
            });
        }
        await cms.instruction(`${role} has filled end date`, async function () {
            await selectUpsertEndDate(cms, scenarioContext, -30);
        });

        await cms.instruction(`${role} submit lesson`, async function () {
            await userPublishAndWaitingResponseLesson(cms, scenarioContext);
            await cms.waitingForLoadingIcon();
        });
    }
);

When(
    '{string} deletes lesson with option {string}',
    async function (role: AccountRoles, deleteOption: DeleteLessonType) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} deletes lesson with option ${deleteOption}`,
            async function () {
                await deleteLesson(cms, deleteOption);
            }
        );
    }
);

When(
    '{string} still sees other lessons in the chain with blue filled in calendar',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const todayNextWeek = moment().add(7, 'days').toDate();

        await cms.instruction(`${role} go to next week in calendar`, async function () {
            await calendarGoNextByNextButton(cms);
            await checkAndShowMoreLessonItemInCellByDate(cms, scenarioContext, todayNextWeek);
        });
        await cms.instruction(
            `${role} still sees other lessons in the chain with blue filled in calendar`,
            async function () {
                await cms.waitingForLoadingIcon();
                await assertSeeOtherLessonInChain(cms, scenarioContext, true);
            }
        );
    }
);

When(
    `{string} does not see other lessons in the chain with blue filled in calendar`,
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const todayNextWeek = moment().add(7, 'days').toDate();

        await cms.instruction(`${role} go to next week in calendar`, async function () {
            await calendarGoNextByNextButton(cms);
            await checkAndShowMoreLessonItemInCellByDate(cms, scenarioContext, todayNextWeek);
        });
        await cms.instruction(
            `${role} still sees other lessons in the chain with blue filled in calendar`,
            async function () {
                await cms.waitingForLoadingIcon();
                await assertSeeOtherLessonInChain(cms, scenarioContext, false);
            }
        );
    }
);
