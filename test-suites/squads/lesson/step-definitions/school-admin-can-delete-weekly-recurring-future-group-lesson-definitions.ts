import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import {
    aliasLessonTime,
    aliasDeletedLessonDate,
} from 'test-suites/squads/lesson/common/alias-keys';
import { lessonLinkOnLessonListByOrder } from 'test-suites/squads/lesson/common/cms-selectors';
import { LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import {
    filterLessonListByStudentName,
    getFirstStudentInfo,
    OrderLessonInRecurringChain,
} from 'test-suites/squads/lesson/step-definitions/school-admin-edits-lesson-date-of-weekly-recurring-individual-lesson-definitions';
import { goToLessonsList } from 'test-suites/squads/lesson/utils/lesson-list';

export async function assertSeeLessonStillRemainInRecurringChain(params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    order: OrderLessonInRecurringChain;
    shouldSeeLesson: boolean;
}) {
    const { cms, scenarioContext, order, shouldSeeLesson } = params;
    const lessonTime = scenarioContext.get<LessonTimeValueType>(aliasLessonTime);
    await cms.instruction(
        `Go to lesson management and change to tab ${lessonTime} lessons list`,
        async function () {
            await goToLessonsList({
                cms,
                lessonTime,
            });
        }
    );
    const textMsg = shouldSeeLesson ? 'Should see' : 'Should not see';
    const expectLessonCount = shouldSeeLesson ? 1 : 0;
    const studentInfo = await getFirstStudentInfo(scenarioContext);

    await cms.instruction(
        `${textMsg} lesson that has order ${order} in recurring chain`,
        async function () {
            await filterLessonListByStudentName(cms, studentInfo.name, lessonTime);

            weExpect(
                await cms.page!.locator(lessonLinkOnLessonListByOrder(order, lessonTime)).count(),
                `Amount lesson in table to equal ${expectLessonCount}`
            ).toEqual(expectLessonCount);
        }
    );
}

export async function assertNotSeeDeletedLessonOnCMS(params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    lessonTime: LessonTimeValueType;
}) {
    const { cms, scenarioContext, lessonTime } = params;
    await cms.instruction(
        `Go to lesson management and change to tab ${lessonTime} lessons list`,
        async function () {
            await goToLessonsList({
                cms,
                lessonTime,
            });
        }
    );
    const deletedLessonDate = scenarioContext.get(aliasDeletedLessonDate);
    const studentInfo = await getFirstStudentInfo(scenarioContext);

    await cms.instruction('Does not see deleted lesson on CMS', async function () {
        await filterLessonListByStudentName(cms, studentInfo.name, lessonTime);
        const isShowLessonInChain = await cms.page?.isVisible(`text='${deletedLessonDate}'`);

        weExpect(isShowLessonInChain, 'The deleted lesson date is not visible').toEqual(false);
    });
}
