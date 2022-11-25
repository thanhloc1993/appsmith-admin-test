import { goToLessonsList } from '@legacy-step-definitions/lesson-delete-lesson-of-lesson-management-definitions';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import {
    lessonListFuture,
    lessonListPast,
    tableLessonStatus,
    lessonStatusInLessonList,
    saveDraftGroupReportButton,
    submitGroupReportButton,
} from 'test-suites/squads/lesson/common/cms-selectors';
import {
    LessonReportActionType,
    LessonStatusType,
    LessonTimeValueType,
} from 'test-suites/squads/lesson/common/types';
import {
    filterLessonListByStudentName,
    getFirstStudentInfo,
} from 'test-suites/squads/lesson/step-definitions/school-admin-edits-lesson-date-of-weekly-recurring-individual-lesson-definitions';

export async function saveGroupLessonReport(
    cms: CMSInterface,
    reportAction: LessonReportActionType
) {
    const actionSave =
        reportAction === 'Submit All' ? submitGroupReportButton : saveDraftGroupReportButton;
    await cms.page!.locator(actionSave).click();

    if (reportAction === 'Submit All') {
        await cms.confirmDialogAction();
    }
}

export async function assertLessonStatus(cms: CMSInterface, lessonStatusType: LessonStatusType) {
    const lessonStatus = await cms.page!.locator(tableLessonStatus).innerText();

    weExpect(lessonStatus, `Lesson status to equal ${lessonStatusType}`).toEqual(lessonStatusType);
}

export async function assertLessonStatusOrderBy(props: {
    cms: CMSInterface;
    lessonStatus: LessonStatusType;
    lessonTime: LessonTimeValueType;
    startIndex: number;
    endIndex: number;
    scenarioContext: ScenarioContext;
}) {
    const { lessonTime, lessonStatus, cms, startIndex, endIndex, scenarioContext } = props;

    const lessonList = lessonTime === 'future' ? lessonListFuture : lessonListPast;

    await cms.instruction(
        `Go to lesson management and change to tab ${lessonStatus} lessons list`,
        async function () {
            await goToLessonsList(cms, lessonTime);
        }
    );

    await cms.instruction('Filter lesson list by student name', async function () {
        const studentInfo = await getFirstStudentInfo(scenarioContext);
        await filterLessonListByStudentName(cms, studentInfo.name, lessonTime);
    });

    for (let i = startIndex; i <= endIndex; i++) {
        await cms.instruction(
            `Assert lesson status with ${lessonStatus} on tab ${lessonTime} of index ${i}`,
            async function () {
                const lessonStatusTable = await cms
                    .page!.locator(lessonList)
                    .locator(lessonStatusInLessonList)
                    .nth(i)
                    .innerText();

                weExpect(
                    lessonStatusTable,
                    `Lesson status in table ${lessonStatusTable} to equal ${lessonStatus} at index ${i}`
                ).toEqual(lessonStatus);
            }
        );
    }
}
