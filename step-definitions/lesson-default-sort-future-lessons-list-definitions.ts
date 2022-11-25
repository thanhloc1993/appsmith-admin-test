import { CMSInterface } from '@supports/app-types';
import createGrpcMessageDecoder from '@supports/packages/grpc-message-decoder/grpc-message-decoder';
import { ScenarioContext } from '@supports/scenario-context';

import { aliasLessonNameLessonId } from './alias-keys/lesson';
import * as CMSKeys from './cms-selectors/cms-keys';
import { changeDatePickerByDateRange, changeTimePicker } from './lesson-management-utils';
import { CreateLessonResponse } from 'manabuf/bob/v1/lessons_pb';
import {
    lessonLink,
    lessonUpsertStudentInformationCenter,
    endTimeInput,
    startTimeInput,
} from 'test-suites/squads/lesson/common/cms-selectors';
import {
    selectStudentSubscription,
    selectTeacher,
    triggerSubmitLesson,
    waitCreateLesson,
} from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { selectCenterByName } from 'test-suites/squads/lesson/step-definitions/lesson-remove-chip-filter-result-for-future-lesson-definitions';

export type LessonManagementLessonDate = 'today' | 'yesterday';
export type LessonManagementLessonName = 'lesson L1' | 'lesson L2';

export async function selectDateAndTime(
    cms: CMSInterface,
    lessonDate: LessonManagementLessonDate,
    lessonTimeStart: string,
    lessonTimeEnd: string,
    dateRange = 0
) {
    if (lessonDate === 'yesterday') {
        dateRange = -1;
    }

    const currentDate = await cms.page!.inputValue(lessonDate);
    const [startTimeHour, startTimeMin] = lessonTimeStart.split(':');
    const [endTimeHour, endTimeMin] = lessonTimeEnd.split(':');

    await changeDatePickerByDateRange({
        cms,
        currentDate,
        datePickerSelector: lessonDate,
        dateRange,
    });
    await changeTimePicker({
        cms,
        timePickerSelector: startTimeInput,
        hour: startTimeHour,
        minute: startTimeMin,
    });
    await changeTimePicker({
        cms,
        timePickerSelector: endTimeInput,
        hour: endTimeHour,
        minute: endTimeMin,
    });
}

export async function fillUpsertFormLessonOfLessonManagement(params: {
    cms: CMSInterface;
    teacherName: string;
    studentName: string;
}) {
    const { cms, teacherName, studentName } = params;

    await selectTeacher(cms, teacherName);
    await selectStudentSubscription({ cms, studentName });

    const centerName = await getCenterName(cms);

    await selectCenterByName(cms, centerName);
}

export async function getCenterName(cms: CMSInterface) {
    const centerName = await cms.getTextContentElement(lessonUpsertStudentInformationCenter);

    if (!centerName) {
        throw new Error('Cannot get center name');
    }

    return centerName;
}

export async function submitUpsertLessonForm(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    lessonName: LessonManagementLessonName
) {
    const [createLessonResponse] = await Promise.all([
        waitCreateLesson(cms),
        triggerSubmitLesson(cms),
    ]);

    const decoder = createGrpcMessageDecoder(CreateLessonResponse);
    const encodedResponseText = await createLessonResponse.text();
    const decodedResponse = decoder.decodeMessage(encodedResponseText);

    const lessonId = decodedResponse?.toObject().id;

    if (!lessonId) {
        throw new Error(`lessonId: ${lessonId} is not valid`);
    }

    scenarioContext.set(aliasLessonNameLessonId(lessonName), lessonId);
}

export async function lessonL1AboveLessonL2(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    lessonL1: LessonManagementLessonName,
    lessonL2: LessonManagementLessonName
) {
    const page = cms.page!;
    await page.waitForSelector(lessonLink);
    const allLesson = await page.$$(CMSKeys.tableBaseRow);
    const lessonL1Id = scenarioContext.get(aliasLessonNameLessonId(lessonL1));
    const lessonL2Id = scenarioContext.get(aliasLessonNameLessonId(lessonL2));

    weExpect(allLesson).toHaveLength(2);

    const [lessonFirst, lessonSecond] = allLesson;

    weExpect(await lessonFirst.getAttribute('data-value')).toEqual(lessonL1Id);
    weExpect(await lessonSecond.getAttribute('data-value')).toEqual(lessonL2Id);
}
