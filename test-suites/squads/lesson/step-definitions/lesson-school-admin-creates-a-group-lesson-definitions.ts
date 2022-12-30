import { delay } from '@legacy-step-definitions/utils';
import { learnerProfileAlias, staffProfileAlias } from '@user-common/alias-keys/user';

import { CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { ScenarioContext } from '@supports/scenario-context';

import { getUsersFromContextByRegexKeys } from 'test-suites/common/step-definitions/user-common-definitions';
import {
    aliasClassId,
    aliasClassName,
    aliasCourseName,
    aliasFilledLessonFields,
    aliasLocationName,
    aliasStudentByClassId,
} from 'test-suites/squads/lesson/common/alias-keys';
import { studentNameOnLessonUpsertTable } from 'test-suites/squads/lesson/common/cms-selectors';
import { LessonUpsertFields } from 'test-suites/squads/lesson/common/types';
import {
    changeStartTimeLesson,
    selectStudentSubscriptionV2,
} from 'test-suites/squads/lesson/step-definitions/lesson-create-an-individual-lesson-definitions';
import { selectTeachingMethod } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { changeEndTimeLesson } from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-cannot-edit-weekly-recurring-individual-lesson-definitions';
import {
    lessonUpsertFields,
    saveFilledLessonUpsertFields,
    searchTeacherV3,
    selectCenterByNameV3,
    selectClassByNameV3,
    selectCourseByNameV3,
    selectLessonDateByLessonTime,
    selectTeacher,
} from 'test-suites/squads/lesson/utils/lesson-upsert';

async function fillLessonUpsertField(params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    lessonField: LessonUpsertFields;
}) {
    const { cms, scenarioContext, lessonField } = params;

    switch (lessonField) {
        case 'lesson date':
            await selectLessonDateByLessonTime({ cms, scenarioContext, lessonTime: 'future' });
            break;

        case 'start time':
            await changeStartTimeLesson(cms, '07:00');
            break;

        case 'end time':
            await changeEndTimeLesson(cms, '09:00');
            break;

        case 'location': {
            const locationName = scenarioContext.get(aliasLocationName);
            await selectCenterByNameV3(cms, locationName);
            break;
        }

        case 'teacher': {
            const teachers = getUsersFromContextByRegexKeys(scenarioContext, staffProfileAlias);

            for (const { name: teacherName } of teachers) {
                await searchTeacherV3(cms, teacherName);
                await selectTeacher(cms, teacherName);
            }
            break;
        }

        case 'teaching method':
            await selectTeachingMethod(cms, 'LESSON_TEACHING_METHOD_GROUP');
            break;

        case 'course': {
            const courseName = scenarioContext.get(aliasCourseName);
            await selectCourseByNameV3(cms, courseName);
            break;
        }

        case 'class': {
            const className = scenarioContext.get(aliasClassName);
            const classId = scenarioContext.get(aliasClassId);

            await selectClassByNameV3(cms, className);

            const student = scenarioContext.get<UserProfileEntity>(aliasStudentByClassId(classId));
            if (!student) break;

            await delay(3000); // Wait if need auto allocate student

            await cms.page!.waitForSelector(studentNameOnLessonUpsertTable(student.name));
            saveFilledLessonUpsertFields({ scenarioContext, lessonField: 'student' });
            break;
        }

        case 'student': {
            await delay(2000); // Wait for sync student subscription
            const students = getUsersFromContextByRegexKeys(scenarioContext, learnerProfileAlias);

            for (const { name: studentName } of students) {
                await selectStudentSubscriptionV2({ cms, studentName });
            }
            break;
        }

        // Currently, we have no scenario for this case
        case 'end date':
            break;
    }

    saveFilledLessonUpsertFields({ scenarioContext, lessonField });
}

export async function fillRemainingLessonFields(params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    missingFields?: LessonUpsertFields[];
}) {
    const { cms, scenarioContext, missingFields = [] } = params;

    for (const lessonField of lessonUpsertFields) {
        if (missingFields.includes(lessonField)) continue;

        const currentFields = scenarioContext.get<LessonUpsertFields[]>(aliasFilledLessonFields);
        if (currentFields.includes(lessonField)) continue;

        await fillLessonUpsertField({ cms, scenarioContext, lessonField });
    }
}
