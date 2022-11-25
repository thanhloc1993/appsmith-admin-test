import { getRandomElement, getRandomElements } from '@legacy-step-definitions/utils';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { aliasRandomStudyPlanItems } from './alias-keys/syllabus';
import {
    teacherGoesToNextMonth,
    teacherGoesToPreviousMonth,
} from './syllabus-edit-studyplan-item-lo-time-definitions';
import { SelectMode } from './syllabus-update-study-plan-item-time-steps';
import { convertToStudyPlanItemNamesByTopicId } from './syllabus-utils';
import { ByText, ByValueKey } from 'flutter-driver-x';
import { StudyPlanItem } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

export type DateType = 'start date' | 'end date' | 'school date';

export async function teacherSelectsStudyPlanItems(
    teacher: TeacherInterface,
    studyPlanItemNames: string[]
): Promise<void> {
    const driver = teacher.flutterDriver!;

    for (const studyPlanItemName of studyPlanItemNames) {
        const studyPlanItemCheckboxKey = new ByValueKey(
            SyllabusTeacherKeys.studentStudyPlanItemCheckBox(studyPlanItemName)
        );
        await driver.tap(studyPlanItemCheckboxKey);
    }
}

export async function teacherScrollToMenuButton(teacher: TeacherInterface): Promise<void> {
    const driver = teacher.flutterDriver!;

    const studyPlanDetailMoreButton = new ByValueKey(SyllabusTeacherKeys.studyPlanDetailMoreButton);
    await driver.scrollIntoView(studyPlanDetailMoreButton, 0.0);
}
export async function teacherClearsExistingDates(teacher: TeacherInterface): Promise<void> {
    const driver = teacher.flutterDriver!;

    const studyPlanItemStartDateClearButton = new ByValueKey(
        SyllabusTeacherKeys.studyPlanItemStartDateClearIconButton
    );
    await driver.tap(studyPlanItemStartDateClearButton);

    const studyPlanItemEndDateClearButton = new ByValueKey(
        SyllabusTeacherKeys.studyPlanItemEndDateClearIconButton
    );
    await driver.tap(studyPlanItemEndDateClearButton);
}

export async function teacherPickDateTime(
    teacher: TeacherInterface,
    date: Date,
    type: DateType
): Promise<void> {
    const driver = teacher.flutterDriver!;
    let datePickerKey: string;
    switch (type) {
        case 'start date':
            datePickerKey = SyllabusTeacherKeys.studyPlanItemStartDatePicker;
            break;
        case 'end date':
            datePickerKey = SyllabusTeacherKeys.studyPlanItemEndDatePicker;
            break;
        case 'school date':
            datePickerKey = SyllabusTeacherKeys.studyPlanItemSchoolDatePicker;
            break;
    }
    await driver.tap(new ByValueKey(datePickerKey));

    await teacherSelectDateOnDatePicker(teacher, date);

    await driver.tap(new ByText('OK'));
    if (type != 'school date') {
        await driver.tap(new ByText('OK'));
    }
}

export async function teacherSelectDateOnDatePicker(teacher: TeacherInterface, date: Date) {
    const driver = teacher.flutterDriver!;
    const currentDate = new Date();

    while (
        currentDate.getMonth() < date.getMonth() ||
        currentDate.getFullYear() < date.getFullYear()
    ) {
        currentDate.setMonth(currentDate.getMonth() + 1);
        await teacherGoesToNextMonth(teacher, currentDate);
    }
    while (
        currentDate.getMonth() > date.getMonth() ||
        currentDate.getFullYear() > date.getFullYear()
    ) {
        currentDate.setMonth(currentDate.getMonth() - 1);
        await teacherGoesToPreviousMonth(teacher, currentDate);
    }

    await driver.tap(new ByText(`${date.getDate()}`));
}

export async function teacherSeesSaveChangesButtonIsDisabled(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    await driver.waitFor(new ByValueKey(SyllabusTeacherKeys.okEditStudyPlanItemTimeButtonDisabled));
}

export async function selectedStudyPlanItemNamesByTopicIdWithSelectMode(
    context: ScenarioContext,
    mode: SelectMode
): Promise<Map<string, string[]>> {
    let studyPlanItemList = context.get<StudyPlanItem[]>(aliasRandomStudyPlanItems);

    if (mode == 'one') {
        studyPlanItemList = [getRandomElement(studyPlanItemList)];
    }
    if (mode == 'some') {
        studyPlanItemList = getRandomElements(studyPlanItemList);
    }
    const convertedStudyPlanItems = convertToStudyPlanItemNamesByTopicId(studyPlanItemList);
    return convertedStudyPlanItems;
}

export function selectedStudyPlanItemsByTopicIdWithSelectMode(
    context: ScenarioContext,
    mode: SelectMode
): {
    studyPlanItemNames: string[];
    studyPlanItems: StudyPlanItem[];
} {
    let studyPlanItems = context.get<StudyPlanItem[]>(aliasRandomStudyPlanItems);
    const studyPlanItemNames: string[] = [];

    if (mode == 'one') {
        studyPlanItems = [getRandomElement(studyPlanItems)];
    }
    if (mode == 'some') {
        studyPlanItems = getRandomElements(studyPlanItems);
    }

    for (const studyPlanItem of studyPlanItems) {
        studyPlanItemNames.push(studyPlanItem.name);
    }

    return { studyPlanItemNames, studyPlanItems };
}
