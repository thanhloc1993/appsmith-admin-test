import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { CreateLessonRequestData } from '@supports/services/bob-lesson-management/bob-lesson-management-service';

import moment from 'moment-timezone';
import { aliasLessonInfo, aliasStartDate } from 'test-suites/squads/lesson/common/alias-keys';
import {
    lessonLink,
    lessonLinkOnLessonListByOrder,
} from 'test-suites/squads/lesson/common/cms-selectors';
import { LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import {
    filterLessonListByStudentName,
    getFirstStudentInfo,
    goToLessonInRecurringChainByOrder,
    OrderLessonInRecurringChain,
} from 'test-suites/squads/lesson/step-definitions/school-admin-edits-lesson-date-of-weekly-recurring-individual-lesson-definitions';
import { getLessonDataOnLessonDetailPage } from 'test-suites/squads/lesson/utils/lesson-detail';
import { goToLessonsList } from 'test-suites/squads/lesson/utils/lesson-list';

export async function assertFirstLessonsInRecurringChainRemainingLessonEndDate(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    lessonTime: LessonTimeValueType
) {
    await goToLessonInRecurringChainByOrder(
        cms,
        scenarioContext,
        OrderLessonInRecurringChain.FIRST,
        lessonTime
    );

    const lessonInfo = scenarioContext.get<CreateLessonRequestData>(aliasLessonInfo);

    const lessonDate = moment(lessonInfo.endTime).format('HH:mm');

    const lessonInfoFromPage = await getLessonDataOnLessonDetailPage(cms);

    weExpect(lessonInfoFromPage.endTime!).toEqual(lessonDate);
}

export async function assertLessonIsRemovedInRecurringChain(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    lessonTime: LessonTimeValueType,
    order: number
) {
    await cms.instruction(
        `Go to lesson management and change to tab ${lessonTime} lessons list`,
        async function () {
            await goToLessonsList({ cms, lessonTime });
        }
    );

    await cms.instruction(
        `Assert lesson has order ${order} is removed in recurring chain`,
        async function () {
            const studentInfo = await getFirstStudentInfo(scenarioContext);
            await filterLessonListByStudentName(cms, studentInfo.name, lessonTime);
            await cms.page!.waitForSelector(lessonLinkOnLessonListByOrder(order, lessonTime), {
                state: 'detached',
            });
        }
    );
}

export async function assertOtherLessonInChainNoUpdate(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    lessonTime: LessonTimeValueType
) {
    const page = cms.page!;
    await cms.instruction(
        `Go to lesson management and change to tab ${lessonTime} lessons list`,
        async function () {
            await goToLessonsList({ cms, lessonTime });
        }
    );

    const startDate = scenarioContext.get<Date>(aliasStartDate);
    const studentInfo = await getFirstStudentInfo(scenarioContext);

    await cms.instruction(`Filter Lesson By Student Name`, async function () {
        await filterLessonListByStudentName(cms, studentInfo.name, lessonTime);
    });

    const firstLessonDate = moment(startDate).format('YYYY/MM/DD');
    const lastLessonDate = moment(startDate).add(28, 'day').endOf('day').format('YYYY/MM/DD');

    const allContents = await page.locator(lessonLink).allTextContents();
    weExpect(
        allContents.includes(firstLessonDate) && allContents.includes(lastLessonDate),
        "First lesson and Last lesson aren't updated"
    ).toEqual(true);
}
