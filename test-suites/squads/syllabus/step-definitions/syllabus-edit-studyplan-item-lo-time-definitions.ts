import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { CMSInterface, LearnerInterface, TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { QuizTypeTitle } from '@supports/types/cms-types';
import { formatDate } from '@supports/utils/time/time';

import {
    aliasContentBookLOQuestionQuantity,
    aliasContentBookLOQuestionType,
    aliasCSVStudyPlanItemEndDate,
    aliasCSVStudyPlanItemStartDate,
    aliasLOName,
    aliasStudyPlanItemEndDate,
    aliasStudyPlanItemStartDate,
} from './alias-keys/syllabus';
import {
    convertStudyPlanItemTimeToTeacherUI,
    convertStudyPlanItemTimeToUI,
    schoolAdminSeeValueInTheStudyPlanItemCellByName,
} from './edit-study-plan-item-by-past-and-tab-definitions';
import { studentDoesLOQuestionsInContentBook } from './syllabus-create-question-definitions';
import {
    studentSeesLOAchievement,
    studentSeesLOQuestionsResult,
} from './syllabus-do-lo-quiz-definitions';
import { TeacherEditedDate } from './syllabus-edit-individual-study-plan-item-time-in-teacher-app-steps';
import { Timeline } from './syllabus-edit-studyplan-item-lo-time-steps';
import { studentTapButtonOnScreen } from './syllabus-utils';
import { ByText, ByTooltipMessage, ByValueKey } from 'flutter-driver-x';

export async function studentDoesQuizAndCompletesLO(
    learner: LearnerInterface,
    context: ScenarioContext
): Promise<void> {
    const questionQuantity = context.get<number>(aliasContentBookLOQuestionQuantity);

    // TODO: Could we replace aliasContentBookLOQuestionType by another way?
    // Because just only have this place using it
    const questionType = context.get<QuizTypeTitle>(aliasContentBookLOQuestionType);
    const loName = context.get<string>(aliasLOName);

    await learner.instruction(
        `Student does questions of this LO ${loName} on Learner App`,
        async function (learner) {
            await studentDoesLOQuestionsInContentBook(learner, questionType, questionQuantity);
        }
    );

    await learner.instruction(`Student sees LO questions result`, async function (learner) {
        await studentSeesLOQuestionsResult(learner, context, loName);
    });

    await learner.instruction(
        `Student goes next to quiz achievement screen`,
        async function (learner) {
            const learningQuizFinishedScreen = SyllabusLearnerKeys.quiz_finished_screen(loName);
            const nextButton = SyllabusLearnerKeys.next_button;
            await studentTapButtonOnScreen(learner, learningQuizFinishedScreen, nextButton);
        }
    );

    await learner.instruction(
        `Student sees crown equivalent to quiz achievement`,
        async function (learner) {
            await studentSeesLOAchievement(learner, context, loName);
        }
    );

    await learner.instruction(
        `Student goes next to topic progress screen`,
        async function (learner) {
            const learningFinishedAchievementScreen =
                SyllabusLearnerKeys.quiz_finished_achievement_screen(loName);
            const nextButton = SyllabusLearnerKeys.next_button;
            await studentTapButtonOnScreen(learner, learningFinishedAchievementScreen, nextButton);
        }
    );
}

export async function teacherSelectsTheStudyPlanItem(
    teacher: TeacherInterface,
    studyPlanItemName: string
): Promise<void> {
    const driver = teacher.flutterDriver!;

    const studyPlanListKey = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanScrollView);
    const studyPlanItemCheckboxKey = new ByValueKey(
        SyllabusTeacherKeys.studentStudyPlanItemCheckBox(studyPlanItemName)
    );

    await driver.waitFor(studyPlanItemCheckboxKey);

    try {
        await driver.waitFor(studyPlanListKey);
        await driver.scrollUntilTap(studyPlanListKey, studyPlanItemCheckboxKey, 0.0, -300, 10000);
    } catch (error) {
        throw Error(`Can not select the checkbox`);
    }
}

export async function teacherEditsStudyPlanItemTime(
    teacher: TeacherInterface,
    context: ScenarioContext,
    timeline: Timeline,
    teacherEditedDate?: TeacherEditedDate
): Promise<void> {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setHours(23, 59);

    const driver = teacher.flutterDriver!;

    if (teacherEditedDate != undefined) {
        switch (teacherEditedDate) {
            case 'start date': {
                await teacherEditsStudyPlanItemStartDate(teacher, context, timeline);
                break;
            }
            case 'due date': {
                await teacherEditsStudyPlanItemEndDate(teacher, context, timeline);
                break;
            }
        }
    } else {
        const studyPlanItemStartDateClearButton = new ByValueKey(
            SyllabusTeacherKeys.studyPlanItemStartDateClearIconButton
        );
        await driver.tap(studyPlanItemStartDateClearButton);

        const studyPlanItemEndDateClearButton = new ByValueKey(
            SyllabusTeacherKeys.studyPlanItemEndDateClearIconButton
        );
        await driver.tap(studyPlanItemEndDateClearButton);
        switch (timeline) {
            case 'past': {
                await teacherEditsStudyPlanItemToThePast(teacher, context, startDate, endDate);
                break;
            }
            case 'future': {
                await teacherEditsStudyPlanItemToTheFuture(teacher, context, startDate, endDate);
                break;
            }
        }
    }
}

async function teacherEditsStudyPlanItemStartDate(
    teacher: TeacherInterface,
    context: ScenarioContext,
    timeline: Timeline
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    await teacher.instruction(
        `Teacher sets study plan item start date to the ${timeline}`,
        async function (this: TeacherInterface) {
            const studyPlanItemStartDate = new ByValueKey(
                SyllabusTeacherKeys.studyPlanItemStartDatePicker
            );
            await driver.tap(studyPlanItemStartDate);

            if (timeline == 'past') {
                startDate.setDate(1);

                startDate.setMonth(startDate.getMonth() - 1);

                await teacherGoesToPreviousMonth(teacher, startDate);

                await driver.tap(new ByText('1'));
            } else {
                startDate.setDate(1);

                startDate.setMonth(startDate.getMonth() + 1);

                await teacherGoesToNextMonth(teacher, startDate);

                await driver.tap(new ByText('1'));
            }
            await teacherConfirmsSettingDatePicker(teacher);
        }
    );

    await teacherConfirmsSettingStudyPlanItemTime(teacher, context, startDate, undefined);
}

async function teacherEditsStudyPlanItemEndDate(
    teacher: TeacherInterface,
    context: ScenarioContext,
    timeline: Timeline
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const endDate = new Date();
    endDate.setHours(23, 59);

    await teacher.instruction(
        `Teacher sets study plan item start date to the ${timeline}`,
        async function (this: TeacherInterface) {
            const studyPlanItemEndDate = new ByValueKey(
                SyllabusTeacherKeys.studyPlanItemEndDatePicker
            );
            await driver.tap(studyPlanItemEndDate);

            if (timeline == 'past') {
                endDate.setDate(1);

                endDate.setMonth(endDate.getMonth() - 1);

                await teacherGoesToPreviousMonth(teacher, endDate);

                await driver.tap(new ByText('1'));
            } else {
                endDate.setDate(1);

                endDate.setMonth(endDate.getMonth() + 1);

                await teacherGoesToNextMonth(teacher, endDate);

                await driver.tap(new ByText('1'));
            }
            await teacherConfirmsSettingDatePicker(teacher);
        }
    );

    await teacherConfirmsSettingStudyPlanItemTime(teacher, context, undefined, endDate);
}

async function teacherEditsStudyPlanItemToThePast(
    teacher: TeacherInterface,
    context: ScenarioContext,
    startDate: Date,
    endDate: Date
): Promise<void> {
    const driver = teacher.flutterDriver!;

    await teacher.instruction(
        `Teacher sets study plan item time to the past`,
        async function (this: TeacherInterface) {
            const studyPlanItemStartDate = new ByValueKey(
                SyllabusTeacherKeys.studyPlanItemStartDatePicker
            );
            await driver.tap(studyPlanItemStartDate);

            startDate.setDate(1);
            startDate.setMonth(startDate.getMonth() - 1);

            await teacherGoesToPreviousMonth(teacher, startDate);
            await driver.tap(new ByText('1'));

            await teacherConfirmsSettingDatePicker(teacher);

            const dayOfEndDate = startDate.getDate() + 7;
            endDate.setDate(dayOfEndDate);
            endDate.setMonth(endDate.getMonth() - 1);

            const studyPlanItemEndDate = new ByValueKey(
                SyllabusTeacherKeys.studyPlanItemEndDatePicker
            );
            await driver.tap(studyPlanItemEndDate);

            await teacherGoesToPreviousMonth(teacher, endDate);

            await driver.tap(new ByText(`${dayOfEndDate}`));

            await teacherConfirmsSettingDatePicker(teacher);
        }
    );

    await teacherConfirmsSettingStudyPlanItemTime(teacher, context, startDate, endDate);
}

async function teacherEditsStudyPlanItemToTheFuture(
    teacher: TeacherInterface,
    context: ScenarioContext,
    startDate: Date,
    endDate: Date
): Promise<void> {
    const driver = teacher.flutterDriver!;

    await teacher.instruction(
        `Teacher sets study plan item time to the future`,
        async function (this: TeacherInterface) {
            const studyPlanItemStartDate = new ByValueKey(
                SyllabusTeacherKeys.studyPlanItemStartDatePicker
            );
            await driver.tap(studyPlanItemStartDate);
            await teacherConfirmsSettingDatePicker(teacher);

            const studyPlanItemEndDate = new ByValueKey(
                SyllabusTeacherKeys.studyPlanItemEndDatePicker
            );
            await driver.tap(studyPlanItemEndDate);

            endDate.setDate(1);
            endDate.setMonth(endDate.getMonth() + 1);

            await teacherGoesToNextMonth(teacher, endDate);
            await driver.tap(new ByText('1'));

            await teacherConfirmsSettingDatePicker(teacher);
        }
    );

    await teacherConfirmsSettingStudyPlanItemTime(teacher, context, startDate, endDate);
}

export async function teacherGoesToNextMonth(
    teacher: TeacherInterface,
    nextMonthDate: Date
): Promise<void> {
    const driver = teacher.flutterDriver!;

    await teacher.instruction(
        `Teacher go to next month ${nextMonthDate}`,
        async function (this: TeacherInterface) {
            const currentMonthTooltip = new ByTooltipMessage('Next month');
            await driver.tap(currentMonthTooltip);
        }
    );
}

export async function teacherGoesToPreviousMonth(
    teacher: TeacherInterface,
    previousMonthDate: Date
): Promise<void> {
    const driver = teacher.flutterDriver!;

    await teacher.instruction(
        `Teacher go to previous month ${previousMonthDate}`,
        async function (this: TeacherInterface) {
            const previousMonthTooltip = new ByTooltipMessage('Previous month');
            await driver.tap(previousMonthTooltip);
        }
    );
}
export async function teacherConfirmsSettingDatePicker(teacher: TeacherInterface): Promise<void> {
    const driver = teacher.flutterDriver!;

    await teacher.instruction(
        `Teacher confirms setting date picker`,
        async function (this: TeacherInterface) {
            const okStartDateText = new ByText('OK');
            await driver.tap(okStartDateText);

            const okStartTimeKey = new ByText('OK');
            await driver.tap(okStartTimeKey);
        }
    );
}

async function teacherConfirmsSettingStudyPlanItemTime(
    teacher: TeacherInterface,
    context: ScenarioContext,
    startDate?: Date,
    endDate?: Date
): Promise<void> {
    const driver = teacher.flutterDriver!;

    await teacher.instruction(
        `Teacher confirms setting study plan items date time`,
        async function (this: TeacherInterface) {
            const editStudyPlanItemOkButtonKey = new ByValueKey(
                SyllabusTeacherKeys.okEditStudyPlanItemTimeButton
            );
            await driver.tap(editStudyPlanItemOkButtonKey);

            if (startDate != undefined) {
                context.set(
                    aliasCSVStudyPlanItemStartDate,
                    formatDate(startDate!, 'YYYY/MM/DD, HH:mm')
                );
                context.set(aliasStudyPlanItemStartDate, startDate);
            }

            if (endDate != undefined) {
                context.set(
                    aliasCSVStudyPlanItemEndDate,
                    formatDate(endDate!, 'YYYY/MM/DD, HH:mm')
                );
                context.set(aliasStudyPlanItemEndDate, endDate);
            }
        }
    );
}

export async function teacherSeesStudyPlanItemWithEditedTime(
    teacher: TeacherInterface,
    context: ScenarioContext,
    studyPlanItemName: string
): Promise<void> {
    const driver = teacher.flutterDriver!;

    await teacher.instruction(
        `Teacher sees study plan item ${studyPlanItemName}  with edited start and end date`,
        async function (this: TeacherInterface) {
            const editedStartDate = convertStudyPlanItemTimeToTeacherUI(
                context.get<Date>(aliasStudyPlanItemStartDate)
            );
            const editedEndDate = convertStudyPlanItemTimeToTeacherUI(
                context.get<Date>(aliasStudyPlanItemEndDate)
            );

            const studyPlanItemStartEndDateKey = new ByValueKey(
                SyllabusTeacherKeys.studyPlanItemV2StartEndDate(
                    studyPlanItemName,
                    editedStartDate,
                    editedEndDate
                )
            );
            await driver.waitFor(studyPlanItemStartEndDateKey, 20000);
        }
    );
}

export async function schoolAdminsSeesStudyPlanItemWithEditedEndDateOnCMS(
    cms: CMSInterface,
    studyPlanItemName: string,
    startDate: Date,
    endDate: Date
) {
    const formattedStartDate = convertStudyPlanItemTimeToUI(startDate);
    const formattedEndDate = convertStudyPlanItemTimeToUI(endDate);
    await schoolAdminSeeValueInTheStudyPlanItemCellByName(
        cms,
        'startDate',
        studyPlanItemName,
        formattedStartDate
    );
    await schoolAdminSeeValueInTheStudyPlanItemCellByName(
        cms,
        'endDate',
        studyPlanItemName,
        formattedEndDate
    );
}
