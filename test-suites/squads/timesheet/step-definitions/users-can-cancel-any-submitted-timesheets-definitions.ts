import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { confirmDialogButtonSave } from 'test-suites/squads/timesheet/common/cms-selectors/common';
import * as LessonDetailSelectors from 'test-suites/squads/timesheet/common/cms-selectors/lesson-detail';
import { LessonStatus } from 'test-suites/squads/timesheet/common/types';
import { goToLessonDetail } from 'test-suites/squads/timesheet/step-definitions/auto-remove-lesson-hours-in-timesheet-definitions';
import {
    createPublishedLesson,
    completeLesson,
    clickLessonActionPanel,
} from 'test-suites/squads/timesheet/step-definitions/switch-state-without-reverse-definitions';
import { getLessonContextKey } from 'test-suites/squads/timesheet/step-definitions/switch-state-without-reverse-definitions';

type LessonData = {
    date: Date;
    startTime: string;
    endTime: string;
    location?: string;
};

type CreateLessonProps = {
    cms: CMSInterface;
    context: ScenarioContext;
    lessonKey: string;
    lessonData: LessonData;
};

type CreateLessonByStatusProps = {
    cms: CMSInterface;
    context: ScenarioContext;
    lessonKey: string;
    lessonStatus: LessonStatus;
    lessonData: LessonData;
};

export const createCompletedLesson = async ({
    cms,
    context,
    lessonKey,
    lessonData,
}: CreateLessonProps) => {
    await createPublishedLesson({
        cms,
        context,
        lessonKey,
        lessonData,
    });

    const lessonId = context.get<string>(getLessonContextKey(lessonKey));
    await goToLessonDetail(cms, lessonId);

    await completeLesson(cms);
};

export const createCancelledLesson = async ({
    cms,
    context,
    lessonKey,
    lessonData,
}: CreateLessonProps) => {
    await createPublishedLesson({
        cms,
        context,
        lessonKey,
        lessonData,
    });

    const lessonId = context.get<string>(getLessonContextKey(lessonKey));
    await goToLessonDetail(cms, lessonId);

    await cancelLesson(cms);
};

export const cancelLesson = async (cms: CMSInterface) => {
    const page = cms.page!;
    await clickLessonActionPanel(cms);
    await page.waitForTimeout(500);
    await cms.instruction('click Cancel lesson button', async () => {
        const cancelLessonButton = page.locator(LessonDetailSelectors.cancelLessonButton);
        await cancelLessonButton.click();
        await page.waitForSelector(confirmDialogButtonSave);
        await page.click(confirmDialogButtonSave);
        await cms.waitForSelectorHasText(LessonDetailSelectors.lessonStatusChip, 'Cancelled');
    });
};

export const createLessonByStatus = async ({
    cms,
    context,
    lessonKey,
    lessonStatus,
    lessonData,
}: CreateLessonByStatusProps) => {
    switch (lessonStatus) {
        case 'Published':
            await createPublishedLesson({ cms, context, lessonKey, lessonData });
            break;
        case 'Completed':
            await createCompletedLesson({ cms, context, lessonKey, lessonData });
            break;
        case 'Cancelled':
            await createCancelledLesson({ cms, context, lessonKey, lessonData });
            break;
        default:
            break;
    }
};
