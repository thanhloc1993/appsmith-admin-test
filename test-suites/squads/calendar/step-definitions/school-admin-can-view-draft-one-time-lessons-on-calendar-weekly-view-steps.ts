import { aliasFirstGrantedLocation } from '@legacy-step-definitions/alias-keys/architecture';
import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Given } from '@cucumber/cucumber';

import { AccountRoles, Locations } from '@supports/app-types';
import { LocationObjectGRPC } from '@supports/types/cms-types';

import { openCreateLessonPage } from './school-admin-can-view-draft-one-time-lessons-on-calendar-weekly-view-definitions';
import {
    aliasLessonId,
    aliasLessonInfo,
    aliasLocationId,
    aliasLocationName,
} from 'test-suites/squads/calendar/common/alias-keys';
import { LessonType } from 'test-suites/squads/calendar/common/types';
import { checkTeachingMethod } from 'test-suites/squads/lesson/step-definitions/lesson-create-an-individual-lesson-definitions';
import {
    selectTeachingMethod,
    waitCreateLesson,
} from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { changeTimeLesson } from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-cannot-edit-weekly-recurring-individual-lesson-definitions';
import { selectCenterByNameV3 } from 'test-suites/squads/lesson/utils/lesson-upsert';
import {
    parseCreateLessonResponse,
    triggerSaveDraftLesson,
} from 'test-suites/squads/timesheet/step-definitions/auto-create-not-created-by-draft-lessons-definition';

Given(
    '{string} has saved draft an one time {string} lesson with lesson date of today and {string} by Add button',
    async function (role: AccountRoles, lessonType: LessonType, location: Locations) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        const firstGrantedLocation = context.get<LocationObjectGRPC>(aliasFirstGrantedLocation);
        const locationId = firstGrantedLocation.locationId;
        const locationName = firstGrantedLocation.name;

        context.set(aliasLocationId, locationId);
        context.set(aliasLocationName, locationName);

        await cms.instruction(
            `${role} click add lesson button on calendar page`,
            async function () {
                await openCreateLessonPage(cms);
            }
        );

        await cms.instruction(`${role} fill lesson time`, async function () {
            await changeTimeLesson(cms, '16:00', '17:00');
        });

        await cms.instruction(`${role} fill location ${location}`, async function () {
            await selectCenterByNameV3(cms, locationName);
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

        await cms.instruction(`${role} admin saves lesson as draft`, async function () {
            const [createLessonResponse] = await Promise.all([
                waitCreateLesson(cms),
                triggerSaveDraftLesson(cms),
            ]);

            const lessonId = await parseCreateLessonResponse(createLessonResponse);
            context.set(aliasLessonId, lessonId);
            context.set(aliasLessonInfo, {
                id: lessonId,
                location: locationName,
                startTime: new Date().setHours(16),
                endTime: new Date().setHours(17),
            });
        });
    }
);
