import { staffProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Response } from 'playwright';

import { CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import createGrpcMessageDecoder from '@supports/packages/grpc-message-decoder';
import { ScenarioContext } from '@supports/scenario-context';

import { CreateLessonResponse } from 'manabuf/bob/v1/lessons_pb';
import moment from 'moment-timezone';
import {
    aliasLessonEndDate,
    aliasLessonId,
    aliasLessonInfo,
    aliasLocationId,
    aliasLocationName,
} from 'test-suites/squads/calendar/common/alias-keys';
import {
    btnCalendarNext,
    dateHeaderDayLabel,
    radioWeeklyRecurringLesson,
} from 'test-suites/squads/calendar/common/cms-selectors';
import {
    courseAutoCompleteInputV3,
    lessonEndDateV3,
    lessonIconPenEditDate,
    lessonInputLessonEndDateV3,
    timePickerOKButtonV2,
} from 'test-suites/squads/lesson/common/cms-selectors';
import {
    triggerSubmitLesson,
    waitCreateLesson,
} from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';

export async function selectCourseUpsertByName(cms: CMSInterface, courseName?: string) {
    const page = cms.page!;
    const courseInput = await page.waitForSelector(courseAutoCompleteInputV3);
    await courseInput.click();

    if (courseName) {
        await cms.instruction(`Select course ${courseName}`, async function () {
            await courseInput.fill(courseName);
            await cms.waitingAutocompleteLoading();
            await cms.chooseOptionInAutoCompleteBoxByText(courseName);
        });
    } else {
        const randomOrder = Math.floor(Math.random() * 3 + 1);
        await cms.instruction(
            `Select course at position ${randomOrder} on list`,
            async function () {
                await cms.chooseOptionInAutoCompleteBoxByOrder(randomOrder);
            }
        );
    }
}

export async function applyTimePickerV3(page: CMSInterface['page']) {
    await page!.click(timePickerOKButtonV2);
}
export async function selectUpsertEndDate(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    dateRange = 1
) {
    const page = cms.page!;
    const inputEndDate = moment().subtract(dateRange, 'days').format('YYYY/MM/DD');
    scenarioContext.set(aliasLessonEndDate, inputEndDate);

    await cms.instruction('Open date picker', async function () {
        await page.click(radioWeeklyRecurringLesson);
        await page.click(lessonEndDateV3);
        await page.click(lessonIconPenEditDate);
        await page.locator(lessonInputLessonEndDateV3).fill(inputEndDate);

        await applyTimePickerV3(page);
    });
}

export const parseCreateLessonResponse = async (response: Response) => {
    const decoder = createGrpcMessageDecoder(CreateLessonResponse);
    const encodedResponseText = await response.text();
    const decodedResponse = decoder.decodeMessage(encodedResponseText);

    const { id: lessonId } = decodedResponse?.toObject() || { id: '' };
    return lessonId;
};

export const userPublishAndWaitingResponseLesson = async (
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) => {
    const locationName = scenarioContext.get(aliasLocationName);
    const locationId = scenarioContext.get(aliasLocationId);
    const endDate = scenarioContext.get(aliasLessonEndDate);
    const today = new Date();

    const [createLessonResponse] = await Promise.all([
        waitCreateLesson(cms),
        triggerSubmitLesson(cms),
    ]);

    const lessonId = await parseCreateLessonResponse(createLessonResponse);
    scenarioContext.set(aliasLessonId, lessonId);
    scenarioContext.set(aliasLessonInfo, {
        id: lessonId,
        locationId: locationId,
        locationName: locationName,
        startTime: new Date().setHours(16),
        endTime: new Date(endDate || today).setHours(17),
    });
};

export async function calendarGoNextByNextButton(cms: CMSInterface, range = 7) {
    const page = cms.page!;
    const newToday = moment().add(range, 'days').get('dates').toString();

    await page.locator(btnCalendarNext).click();
    await cms.waitingForLoadingIcon();
    const dateTodayLabel = page.locator(`${dateHeaderDayLabel}:text-is("${newToday}")`);

    weExpect(
        await dateTodayLabel.count(),
        'the user see today of next week in weekly view'
    ).toEqual(1);
}

export async function assertSeeOtherLessonInChain(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    expectSeeLesson: boolean
) {
    const page = cms.page!;
    const teacherProfileAliasKey = staffProfileAliasWithAccountRoleSuffix('teacher');
    const teacher: UserProfileEntity = scenarioContext.get(teacherProfileAliasKey);
    const isShowLessonInChain = await page.isVisible(
        `[data-testid="LessonItem__wrap"] >> text='${teacher.name}'`
    );
    weExpect(isShowLessonInChain).toEqual(expectSeeLesson);
}
