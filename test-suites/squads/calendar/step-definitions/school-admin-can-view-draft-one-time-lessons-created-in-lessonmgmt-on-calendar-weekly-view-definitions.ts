import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { CreateLessonRequestData } from '@services/lessonmgmt/lesson-management-service';

import { LessonStatus } from 'manabuf/lessonmgmt/v1/enums_pb';
import {
    aliasLessonId,
    aliasLessonInfo,
    aliasLocationName,
} from 'test-suites/squads/calendar/common/alias-keys';
import {
    btnCalendarToday,
    btnShowMoreSelector,
    dateHeaderDayLabel,
    groupSlotTime,
    locationAutocomplete,
    locationAutocompleteInput,
    locationType,
    selectCalendarViewInput,
} from 'test-suites/squads/calendar/common/cms-selectors';
import { CalendarViewType } from 'test-suites/squads/calendar/common/types';

export async function userSelectCenterInLocationType(cms: CMSInterface) {
    const page = cms.page!;

    const selectLocationType = await page.waitForSelector(locationType);
    await selectLocationType.click();
    await cms.chooseOptionInAutoCompleteBoxByText('center');
    await cms.waitingAutocompleteLoading();
}

export async function userSelectLocationByName(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    const page = cms.page!;
    const locationName = scenarioContext.get(aliasLocationName);

    await cms.instruction(`Fil location with ${locationName}`, async function () {
        await page.click(locationAutocomplete);
        await page.fill(locationAutocompleteInput, locationName);
    });

    await cms.instruction(`Choose location with ${locationName}`, async function () {
        await cms.waitingAutocompleteLoading();
        await cms.chooseOptionInAutoCompleteBoxByText(locationName);
    });
}

export async function checkCalendarViewSelected(cms: CMSInterface, calendarView: CalendarViewType) {
    const page = cms.page!;

    const inputCalendarView = await page.waitForSelector(selectCalendarViewInput);
    const inputValue = await inputCalendarView.inputValue();
    const countDayLabel = await page.locator(dateHeaderDayLabel).count();

    switch (calendarView) {
        case 'Monthly':
            weExpect(inputValue, 'the user sees Month is selected').toEqual('month');
            break;
        case 'Weekly':
            weExpect(inputValue, 'the user sees Week is selected').toEqual('week');
            weExpect(countDayLabel, 'the user sees day label is 7').toEqual(7);
            break;
        case 'Daily':
            weExpect(inputValue, 'the user sees Day is selected').toEqual('day');
            break;
    }
}

export async function calendarGoToDay(cms: CMSInterface) {
    const page = cms.page!;
    const today = new Date().getDate().toString();

    await page.locator(btnCalendarToday).click();
    await cms.waitingForLoadingIcon();
    const dateTodayLabel = page.locator(`${dateHeaderDayLabel}:text-is("${today}")`);

    weExpect(await dateTodayLabel.count(), 'the user see today in weekly view').toEqual(1);
}

export async function userSeesStyleDateLabelToday(cms: CMSInterface) {
    const page = cms.page!;
    const today = new Date().getDate().toString();
    const dateTodayLabel = page.locator(`${dateHeaderDayLabel}:text-is("${today}")`);
    const { border, borderRadius } = await dateTodayLabel.evaluate((el) => getComputedStyle(el));

    weExpect(border, 'the user sees today has a border grey outline').toEqual(
        '1px solid rgba(0, 0, 0, 0.23)'
    );
    weExpect(borderRadius, 'the user sees today has a border circle').toEqual('100%');
}

export async function userSeesFullDayTime(cms: CMSInterface) {
    const page = cms.page!;
    const rows = page.locator(groupSlotTime);
    const count = await rows.count();
    const timeList = [];

    for (let i = 0; i < count; ++i) {
        const time = await rows.nth(i).textContent();
        timeList.push(time);
    }

    weExpect(timeList.length, 'the user sees 24 slot time').toEqual(24);
    weExpect(timeList, 'the user sees 00:00 in slot time').toContain('00:00');
    weExpect(timeList, 'the user sees 23:00 in slot time').toContain('23:00');
}

export async function checkAndShowMoreLessonItemInCellByDate(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    date?: Date
) {
    const page = cms.page!;
    const lessonInfo: CreateLessonRequestData = scenarioContext.get(aliasLessonInfo);

    const today = date || new Date();
    const dateToday = today.getDate();
    const lessonHoursStart = (
        lessonInfo.startTime ? new Date(lessonInfo.startTime) : new Date()
    ).getHours();
    const btnShowMore = await page.$(btnShowMoreSelector(lessonHoursStart, dateToday));

    if (btnShowMore) {
        await page.click(btnShowMoreSelector(lessonHoursStart, dateToday));
    }
}

export async function userSeesLessonInTodayCell(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    schedulingStatus: LessonStatus
) {
    const page = cms.page!;
    const lessonId = scenarioContext.get(aliasLessonId);
    await checkAndShowMoreLessonItemInCellByDate(cms, scenarioContext);

    const lessonItem = await page.waitForSelector(`[data-lesson-id="${lessonId}"]`);
    const { border, backgroundColor, color } = await lessonItem.evaluate((el) =>
        getComputedStyle(el)
    );

    if (schedulingStatus === LessonStatus.LESSON_SCHEDULING_STATUS_DRAFT) {
        weExpect(lessonItem, 'the user sees lesson item in weekly').toBeTruthy();
        weExpect(border, 'the user sees light blue border of lesson item').toEqual(
            '1px solid rgb(3, 169, 244)'
        );
        weExpect(backgroundColor, 'the user sees background white of lesson item').toEqual(
            'rgb(255, 255, 255)'
        );
        weExpect(color, 'the user sees text color blue of lesson item').toEqual('rgb(3, 169, 244)');
    } else if (schedulingStatus === LessonStatus.LESSON_SCHEDULING_STATUS_PUBLISHED) {
        weExpect(lessonItem, 'the user sees lesson item in weekly').toBeTruthy();
        weExpect(backgroundColor, 'the user sees background light blue of lesson item').toEqual(
            'rgb(3, 169, 244)'
        );
        weExpect(color, 'the user sees background white of lesson item').toEqual(
            'rgb(255, 255, 255)'
        );
    } else {
        throw new Error('Cannot find lesson item');
    }
}
