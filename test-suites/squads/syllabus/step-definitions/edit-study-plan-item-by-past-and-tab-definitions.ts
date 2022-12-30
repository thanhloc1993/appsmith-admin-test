import { CMSInterface } from '@supports/app-types';
import { DateCommon } from '@supports/utils/time/constants/types';
import { formatDate } from '@supports/utils/time/time';

import { formInput, tableBaseRow } from './cms-selectors/cms-keys';
import {
    studyPlanItemAvailableFromCell,
    studyPlanItemAvailableUtilCell,
    studyPlanItemDateDisplay,
    studyPlanItemEndDateCell,
    studyPlanItemStartDateCell,
} from './cms-selectors/study-plan';
import { generateStudyplanTime, StudyPlanTestCase } from './syllabus-book-csv';
import { StudyPlanItemStructureTime } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

const formatStudyPlanTimeToInput = (date: DateCommon['date']) => {
    return formatDate(date, 'YYYY/MM/DD, HH:mm');
};

export const convertStudyPlanItemTimeToUI = (time: string | Date) => {
    const userDate = new Date();
    const dateInUserTimezone = new Date(time);

    if (userDate.getFullYear() === dateInUserTimezone.getFullYear()) {
        return formatDate(dateInUserTimezone, 'MM/DD, HH:mm');
    }
    return time ? formatStudyPlanTimeToInput(dateInUserTimezone) : '--';
};

export const convertStudyPlanItemTimeToTeacherUI = (time: string | Date) => {
    const userDate = new Date();
    const dateInUserTimezone = new Date(time);

    if (userDate.getFullYear() === dateInUserTimezone.getFullYear()) {
        return formatDate(dateInUserTimezone, 'MM/DD');
    }
    return time ? formatDate(dateInUserTimezone, 'YYYY/MM/DD') : 'N/A';
};

export const schoolAdminFakeCopyValueInputStudyPlanTime = async (
    cms: CMSInterface,
    value: string
) => {
    await cms?.page?.keyboard.type(value);
    await cms.page?.keyboard.press('Control+a');
    await cms.page?.keyboard.press('Control+c');
    await cms.page?.keyboard.press('Delete');
};

export const schoolAdminFocusToTheFirstInputOfStudyPlanItem = async (
    cms: CMSInterface,
    index: number
) => {
    const theFirstInputOfTableRow = `${tableBaseRow}:nth-child(${index + 1}) ${formInput}`;
    await cms?.page?.focus(theFirstInputOfTableRow);
};

export const generateStudyplanTimeAndConvertToStringInput = (testCase: StudyPlanTestCase) => {
    const { availableFrom, availableTo, endDate, startDate } = generateStudyplanTime(testCase);

    const times: Required<StudyPlanItemStructureTime> = {
        availableFrom: formatStudyPlanTimeToInput(availableFrom),
        availableTo: formatStudyPlanTimeToInput(availableTo),
        startDate: formatStudyPlanTimeToInput(startDate),
        endDate: formatStudyPlanTimeToInput(endDate),
    };
    return times;
};

const mapperKeyStudyPlanTimeToCellSelector: {
    [key in keyof Required<StudyPlanItemStructureTime>]: string;
} = {
    availableFrom: studyPlanItemAvailableFromCell,
    availableTo: studyPlanItemAvailableUtilCell,
    startDate: studyPlanItemStartDateCell,
    endDate: studyPlanItemEndDateCell,
};

export const schoolAdminSeeValueInTheStudyPlanItemCell = async (
    cms: CMSInterface,
    field: keyof StudyPlanItemStructureTime,
    tableRowIndex: number,
    value: string
) => {
    const selector = `${tableBaseRow}:nth-child(${tableRowIndex + 1}) ${
        mapperKeyStudyPlanTimeToCellSelector[field]
    } [data-testid='StudyPlanItem__dateDisplay']`;

    await cms.waitForSelectorHasText(selector, value);
};

export const schoolAdminSeeValueInTheStudyPlanItemCellByName = async (
    cms: CMSInterface,
    field: keyof StudyPlanItemStructureTime,
    studyPlanItemName: string,
    value: string
) => {
    const tableRowOfStudyPlanItemElement = await cms.waitForSelectorHasText(
        tableBaseRow,
        studyPlanItemName
    );

    tableRowOfStudyPlanItemElement!.waitForSelector(
        `${mapperKeyStudyPlanTimeToCellSelector[field]} ${studyPlanItemDateDisplay}:has-text("${value}")`
    );
};
