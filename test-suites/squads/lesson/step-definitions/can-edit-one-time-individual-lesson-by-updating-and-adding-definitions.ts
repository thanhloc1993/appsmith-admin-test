import { getUserProfileAliasByRole } from '@legacy-step-definitions/lesson-edit-lesson-by-updating-and-adding-definitions';
import { getUserProfileFromContext } from '@legacy-step-definitions/utils';

import { AccountRoles, CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { LessonManagementLessonTime } from '../types/lesson-management';
import moment from 'moment-timezone';
import {
    aliasCourseIdByStudent,
    aliasEditedLesson,
} from 'test-suites/squads/lesson/common/alias-keys';
import { lessonDateV3 } from 'test-suites/squads/lesson/common/cms-selectors';
import { endTimeUpdate, startTimeUpdate } from 'test-suites/squads/lesson/common/constants';
import { selectStudentSubscriptionV2 } from 'test-suites/squads/lesson/step-definitions/lesson-create-an-individual-lesson-definitions';
import { changeTimeLesson } from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-cannot-edit-weekly-recurring-individual-lesson-definitions';
import { changeDatePickerByDateRange } from 'test-suites/squads/lesson/utils/date-picker';
import { getLessonDataOnLessonDetailPage } from 'test-suites/squads/lesson/utils/lesson-detail';
import {
    searchTeacherV3,
    selectTeacher,
    waitForLessonUpsertDialogClosed,
} from 'test-suites/squads/lesson/utils/lesson-upsert';

interface EditedDateAndTimeLessonType {
    lessonDate: string;
    startTime: string;
    endTime: string;
}

export async function changeLessonDateAndTime(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    lessonTime: LessonManagementLessonTime,
    dateRange = 1
) {
    const dateRangeChange = (lessonTime === 'future' ? 1 : -1) * dateRange;
    const currentDate = await cms.page!.inputValue(lessonDateV3);

    await cms.instruction(`Select lesson date to ${lessonTime}`, async function () {
        await changeDatePickerByDateRange({
            cms,
            currentDate,
            datePickerSelector: lessonDateV3,
            dateRange: dateRangeChange,
        });
        await changeTimeLesson(cms, startTimeUpdate, endTimeUpdate);
    });
    const editedLessonDate = moment(new Date(currentDate))
        .add(dateRangeChange, 'day')
        .endOf('day')
        .format('YYYY/MM/DD');

    const editedLessonInfo: EditedDateAndTimeLessonType = {
        startTime: startTimeUpdate,
        endTime: endTimeUpdate,
        lessonDate: editedLessonDate,
    };
    scenarioContext.set(aliasEditedLesson, editedLessonInfo);
}

export async function assertUpdatedLessonDateAndTime(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    await waitForLessonUpsertDialogClosed(cms);
    const { lessonDate, startTime, endTime } = await getLessonDataOnLessonDetailPage(cms);

    if (!lessonDate || !startTime || !endTime) {
        throw Error('Cannot find lesson date and time of lesson');
    }

    const editedLessonInfo = scenarioContext.get<EditedDateAndTimeLessonType>(aliasEditedLesson);

    weExpect(lessonDate, 'Should see lesson date is updated').toEqual(editedLessonInfo.lessonDate);
    weExpect(startTime, 'Should see start time is updated').toEqual(editedLessonInfo.startTime);
    weExpect(endTime, 'Should see end time is updated').toEqual(editedLessonInfo.endTime);
}

export async function addNewTeacherOrStudentToLesson(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    role: AccountRoles
) {
    const { isTeacher, profileAlias } = getUserProfileAliasByRole(role);

    const { name: userName, id: userId } = getUserProfileFromContext(scenarioContext, profileAlias);

    await cms.instruction(`Adds ${role} into the lesson`, async function () {
        if (isTeacher) {
            await searchTeacherV3(cms, userName);
            await selectTeacher(cms, userName);
            return;
        }

        const courseId = scenarioContext.get(aliasCourseIdByStudent(userId));

        await selectStudentSubscriptionV2({
            cms,
            studentName: userName,
            studentSubscriptionId: `${userId}_${courseId}`,
        });
    });
}

export async function assertSeeTeacherOrStudentInLesson(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    role: AccountRoles
) {
    await waitForLessonUpsertDialogClosed(cms);

    const { isTeacher, profileAlias } = getUserProfileAliasByRole(role);

    const { name: userName } = getUserProfileFromContext(scenarioContext, profileAlias);
    const { teacherNames, studentNames } = await getLessonDataOnLessonDetailPage(cms);
    const desireNameNotContainUsername = isTeacher ? teacherNames : studentNames;

    await cms.instruction(
        `Sees added ${role} in detailed lesson info page on CMS`,
        async function () {
            weExpect(
                desireNameNotContainUsername,
                `List ${role} should contain ${userName}`
            ).toContain(userName);
        }
    );
}

export async function assertSeeLocationAndStudentUpdated(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    role: AccountRoles
) {
    await waitForLessonUpsertDialogClosed(cms);

    const { isTeacher, profileAlias } = getUserProfileAliasByRole(role);

    const { name: userName } = getUserProfileFromContext(scenarioContext, profileAlias);
    const { teacherNames, studentNames } = await getLessonDataOnLessonDetailPage(cms);
    const desireNames = isTeacher ? teacherNames : studentNames;

    await cms.instruction(
        `Sees added ${role} in detailed lesson info page on CMS`,
        async function () {
            weExpect(desireNames, `List ${role} should contain ${userName}`).toContain(userName);
        }
    );
}
