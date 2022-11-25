import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import {
    aliasLessonIdList,
    checkBoxStudentInfoTable,
    endTimeInputV3,
    lessonDateV3,
    lessonLink,
    lessonTableRow,
    locationsLowestLevelAutocompleteInputV3,
    RadioButtonLessonTeachingMediumOnline,
    RadioButtonLessonTeachingMethodGroup,
    startTimeInputV3,
    upsertLessonDialog,
} from '../common/cms-selectors';
import { GroupLessonInfo, IndividualLessonInfo } from '../types/lesson-management';
import { getTeacherNamesFromTeacherAutoCompleteV3 } from '../utils/lesson-upsert';
import moment from 'moment-timezone';
import { getUserProfileFromContext } from 'test-suites/common/step-definitions/user-common-definitions';
import {
    aliasEndDate,
    aliasLessonId,
    aliasStartDate,
} from 'test-suites/squads/lesson/common/alias-keys';
import { LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import { assertSeeLessonOnCMS } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { filterLessonList } from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-creates-weekly-recurring-individual-lesson-definitions';
import { chooseLessonTabOnLessonList } from 'test-suites/squads/lesson/utils/lesson-list';

export async function assertAllInformationAreCopiedFromPreviousLesson(
    cms: CMSInterface,
    lessonInfo: IndividualLessonInfo | GroupLessonInfo
) {
    const dialog = cms.page!.locator(upsertLessonDialog)!;

    const lessonDate = await dialog.locator(lessonDateV3).inputValue();
    const startTime = await dialog.locator(startTimeInputV3).inputValue();
    const endTime = await dialog.locator(endTimeInputV3).inputValue();
    const teachingMedium = (await dialog.locator(RadioButtonLessonTeachingMediumOnline).isChecked())
        ? 'Online'
        : 'Offline';
    const teachingMethodGroup = (await dialog
        .locator(RadioButtonLessonTeachingMethodGroup)
        .isChecked())
        ? 'Group'
        : 'Individual';
    const location = await dialog.locator(locationsLowestLevelAutocompleteInputV3).inputValue();
    const teacherNames = await getTeacherNamesFromTeacherAutoCompleteV3(cms);
    const studentNames = await dialog.locator(checkBoxStudentInfoTable).allTextContents();

    weExpect(lessonInfo.lessonDate, `Lesson Date is ${lessonInfo.lessonDate}`).toEqual(lessonDate);
    weExpect(lessonInfo.startTime, `Start time is ${lessonInfo.startTime}`).toEqual(startTime);
    weExpect(lessonInfo.endTime, `End time is ${lessonInfo.endTime}`).toEqual(endTime);
    weExpect(lessonInfo.teachingMedium, `Teaching medium is ${lessonInfo.teachingMedium}`).toEqual(
        teachingMedium
    );
    weExpect(lessonInfo.teachingMethod, `Teaching method is ${lessonInfo.teachingMethod}`).toEqual(
        teachingMethodGroup
    );
    weExpect(lessonInfo.location, `Locations are ${lessonInfo.location}`).toEqual(location);
    weExpect(lessonInfo.teacherNames, `Teacher Names are ${lessonInfo.teacherNames}`).toEqual(
        teacherNames.join(',')
    );
    weExpect(lessonInfo.studentNames, `Student names are ${lessonInfo.studentNames}`).toEqual(
        studentNames
    );
}

export async function seeLessonRecurringAndDuplicatedLessonOnLessonList(
    cms: CMSInterface,
    scenario: ScenarioContext,
    lessonTime: LessonTimeValueType
) {
    await cms.instruction(`go to ${lessonTime} list page`, async function () {
        await chooseLessonTabOnLessonList({ cms, lessonTime });
    });
    await filterLessonList(cms, scenario);
    await lessonRecurringAndDuplicatedLessonOnLessonList(cms, scenario, lessonTime);
}

export async function lessonRecurringAndDuplicatedLessonOnLessonList(
    cms: CMSInterface,
    scenario: ScenarioContext,
    lessonTime: LessonTimeValueType
) {
    switch (lessonTime) {
        case 'past': {
            const lessonId = scenario.get(aliasLessonId);
            const { name: studentName } = getUserProfileFromContext(
                scenario,
                learnerProfileAliasWithAccountRoleSuffix('student')
            );

            await assertSeeLessonOnCMS({
                cms,
                lessonId,
                studentName,
                shouldSeeLesson: true,
                lessonTime,
            });

            break;
        }
        case 'future': {
            const startDate = new Date(scenario.get(aliasStartDate));
            const endDate = new Date(scenario.get(aliasEndDate));
            const startMoment = moment(startDate);
            const endMoment = moment(endDate);

            const page = cms.page!;
            await page.waitForSelector(lessonLink);

            const allLesson = await page.locator(lessonTableRow).elementHandles();
            const lessonId = scenario.get(aliasLessonId);
            const lessonIdList = await Promise.all(
                allLesson.map((lesson) => lesson.getAttribute('data-value'))
            );

            scenario.set(aliasLessonIdList, lessonIdList);

            const numberFutureLesson =
                endMoment.diff(startMoment, 'weeks') + (lessonIdList.includes(lessonId) ? 1 : 0);

            weExpect(allLesson).toHaveLength(numberFutureLesson + 1);
            break;
        }
    }
}
