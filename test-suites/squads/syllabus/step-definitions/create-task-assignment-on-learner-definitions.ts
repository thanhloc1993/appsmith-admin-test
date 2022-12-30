import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { LearnerInterface } from '@supports/app-types';
import { formatDate } from '@supports/utils/time/time';

import { TaskAssignmentSettingInfo } from './syllabus-create-task-assignment-definitions';
import { DateType } from './syllabus-update-study-plan-item-time-definitions';
import { getLearnerToDoKeys } from './syllabus-utils';
import { ByText, ByTooltipMessage, ByValueKey, delay } from 'flutter-driver-x';

export async function studentSeesSaveButtonIsDisabled(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;

    const disabledSaveButton = new ByValueKey(SyllabusLearnerKeys.taskAssignmentSaveButton(false));
    await driver.waitFor(disabledSaveButton);
}

const createTaskAssignmentSuccessMessage = 'You have created task successfully';

export async function studentSeesCreateSuccessMessage(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;

    const messageKey = new ByText(createTaskAssignmentSuccessMessage);
    await driver.runUnsynchronized(async () => {
        await driver.waitFor(messageKey);
    });
}

export async function studentWaitForTodoTabReloaded(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;

    const { pageKey } = getLearnerToDoKeys('active');

    await driver.waitFor(new ByValueKey(pageKey));
}

export async function studentSeesFilledTaskName(learner: LearnerInterface, taskName: string) {
    const driver = learner.flutterDriver!;

    const taskNameKey = new ByValueKey(SyllabusLearnerKeys.taskAssignmentTaskName);
    const filledTaskName = await driver.getText(taskNameKey);
    weExpect(filledTaskName).toEqual(taskName);
}

export async function studentSeesSelectedCourse(learner: LearnerInterface, courseName: string) {
    const driver = learner.flutterDriver!;

    const courseKey = new ByValueKey(SyllabusLearnerKeys.taskAssignmentCourse);
    const course = await driver.getText(courseKey);
    weExpect(course).toEqual(courseName);
}

export async function studentSeesSelectedDate(
    learner: LearnerInterface,
    dateType: DateType,
    date?: Date
) {
    const driver = learner.flutterDriver!;
    let datePickerKey: string;
    switch (dateType) {
        case 'start date':
            datePickerKey = SyllabusLearnerKeys.taskAssignmentStartDate;
            break;
        case 'end date':
            datePickerKey = SyllabusLearnerKeys.taskAssignmentDueDate;
            break;
        case 'school date':
            return;
    }
    const formattedDate = await driver.getText(new ByValueKey(datePickerKey));
    weExpect(formattedDate).toEqual(date == undefined ? '' : formatDate(date, 'YYYY/MM/DD'));
}

export async function studentSeesFilledNote(learner: LearnerInterface, note: string) {
    const driver = learner.flutterDriver!;

    const dueDate = await driver.getText(new ByValueKey(SyllabusLearnerKeys.taskAssignmentNote));
    weExpect(dueDate).toEqual(note);
}

export async function studentSeesRequireCheckBoxValue(
    learner: LearnerInterface,
    settings: TaskAssignmentSettingInfo,
    value: boolean
) {
    const driver = learner.flutterDriver!;

    let checkBoxKeyName;

    switch (settings) {
        case 'Text note':
            checkBoxKeyName = SyllabusLearnerKeys.taskAssignmentRequireNoteCheckBox(value);
            break;
        case 'Duration':
            checkBoxKeyName = SyllabusLearnerKeys.taskAssignmentRequireDurationCheckBox(value);
            break;
        case 'Correctness':
            checkBoxKeyName = SyllabusLearnerKeys.taskAssignmentRequireCorrectnessCheckBox(value);
            break;
        case 'File attachment':
            checkBoxKeyName = SyllabusLearnerKeys.taskAssignmentRequireAttachmentCheckBox(value);
            break;
        case 'Understanding level':
            checkBoxKeyName =
                SyllabusLearnerKeys.taskAssignmentRequireUnderstandingLevelCheckBox(value);
            break;
    }
    const checkBoxKey = new ByValueKey(checkBoxKeyName);

    await driver.scrollIntoView(checkBoxKey, 0.0);
}

export async function studentGoesToCreateTaskAssignmentScreen(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;

    const addButtonKey = new ByValueKey(SyllabusLearnerKeys.addTaskButton);

    await driver.runUnsynchronized(async () => {
        await driver.tap(addButtonKey);
    });
}

export async function studentFillsTaskName(learner: LearnerInterface, taskName: string) {
    const driver = learner.flutterDriver!;

    const taskNameKey = new ByValueKey(SyllabusLearnerKeys.taskAssignmentTaskName);
    await driver.scrollIntoView(taskNameKey, 0.0);
    await driver.tap(taskNameKey);
    await driver.enterText(taskName);
}

export async function studentFillsNote(learner: LearnerInterface, note: string) {
    const driver = learner.flutterDriver!;

    const noteKey = new ByValueKey(SyllabusLearnerKeys.taskAssignmentNote);
    await driver.scrollIntoView(noteKey, 0.0);
    await driver.tap(noteKey);
    await driver.enterText(note);
}

export async function studentSelectCourse(learner: LearnerInterface, courseName: string) {
    const driver = learner.flutterDriver!;

    const courseTextFieldKey = new ByValueKey(SyllabusLearnerKeys.taskAssignmentCourse);

    await driver.scrollIntoView(courseTextFieldKey, 0.0);

    await driver.tap(courseTextFieldKey);

    const courseKey = new ByText(courseName);
    await driver.tap(courseKey);
}

export async function studentDoesNotSeeSelectedDate(
    learner: LearnerInterface,
    dateType: DateType,
    selectedDate: Date
) {
    const driver = learner.flutterDriver!;
    let datePickerKey: string;
    switch (dateType) {
        case 'start date':
            datePickerKey = SyllabusLearnerKeys.taskAssignmentStartDate;
            break;
        case 'end date':
            datePickerKey = SyllabusLearnerKeys.taskAssignmentDueDate;
            break;
        case 'school date':
            return;
    }
    const date = await driver.getText(new ByValueKey(datePickerKey));
    weExpect(date == formatDate(selectedDate, 'YYYY/MM/DD')).toEqual(false);
}

export async function studentSelectDate(learner: LearnerInterface, dateType: DateType, date: Date) {
    const driver = learner.flutterDriver!;
    let datePickerKey: string;
    switch (dateType) {
        case 'start date':
            datePickerKey = SyllabusLearnerKeys.taskAssignmentStartDate;
            break;
        case 'end date':
            datePickerKey = SyllabusLearnerKeys.taskAssignmentDueDate;
            break;
        case 'school date':
            return;
    }
    await driver.tap(new ByValueKey(datePickerKey));
    await studentSelectDateOnDatePicker(learner, date);
}

export async function studentSelectDateOnDatePicker(teacher: LearnerInterface, date: Date) {
    const driver = teacher.flutterDriver!;
    const currentDate = new Date();

    while (
        currentDate.getMonth() < date.getMonth() ||
        currentDate.getFullYear() < date.getFullYear()
    ) {
        currentDate.setMonth(currentDate.getMonth() + 1);
        await studentGoesToNextMonth(teacher, currentDate);
    }
    while (
        currentDate.getMonth() > date.getMonth() ||
        currentDate.getFullYear() > date.getFullYear()
    ) {
        currentDate.setMonth(currentDate.getMonth() - 1);
        await studentGoesToPreviousMonth(teacher, currentDate);
    }

    await driver.tap(new ByText(`${date.getDate()}`));

    await driver.tap(new ByText('OK'));
}

export async function studentGoesToNextMonth(
    learner: LearnerInterface,
    nextMonthDate: Date
): Promise<void> {
    const driver = learner.flutterDriver!;

    await learner.instruction(
        `Student go to next month ${nextMonthDate}`,
        async function (this: LearnerInterface) {
            const currentMonthTooltip = new ByTooltipMessage('Next month');
            await driver.tap(currentMonthTooltip);
        }
    );
}

export async function studentGoesToPreviousMonth(
    learner: LearnerInterface,
    previousMonthDate: Date
): Promise<void> {
    const driver = learner.flutterDriver!;

    await learner.instruction(
        `Student go to previous month ${previousMonthDate}`,
        async function (this: LearnerInterface) {
            const previousMonthTooltip = new ByTooltipMessage('Previous month');
            await driver.tap(previousMonthTooltip);
        }
    );
}

export async function studentAttachesFiles(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;

    const attachButtonKey = new ByValueKey(SyllabusLearnerKeys.taskAssignmentAttachmentButton);

    await driver.scrollIntoView(attachButtonKey, 0.0);

    await driver.tap(attachButtonKey);
}

export async function studentCancelsUploadingAttachment(
    learner: LearnerInterface,
    attachments: string[]
): Promise<string[]> {
    const driver = learner.flutterDriver!;
    const cancelledAttachments: string[] = [];
    await driver.scrollIntoView(
        new ByValueKey(SyllabusLearnerKeys.taskAssignmentAttachmentButton),
        0.0
    );
    for (const fileName of attachments) {
        const attachCancelButtonKey = new ByValueKey(
            SyllabusLearnerKeys.attachmentCancelButtonKey(fileName)
        );
        try {
            await driver.tap(attachCancelButtonKey, 1000);
            cancelledAttachments.push(fileName);
        } catch (err) {
            console.log('Attachment is uploaded');
        }
    }
    return cancelledAttachments;
}

export async function studentDeletesUploadingAttachment(
    learner: LearnerInterface,
    attachments: string[]
) {
    const driver = learner.flutterDriver!;

    await driver.scrollIntoView(
        new ByValueKey(SyllabusLearnerKeys.taskAssignmentAttachmentButton),
        0.0
    );
    for (const fileName of attachments) {
        const attachDeleteButtonKey = new ByValueKey(
            SyllabusLearnerKeys.attachmentDeleteButtonKey(fileName)
        );
        await driver.tap(attachDeleteButtonKey);
    }
}

export async function studentDoesNotSeeAttachments(
    learner: LearnerInterface,
    attachments: string[]
) {
    const driver = learner.flutterDriver!;

    for (const fileName of attachments) {
        const attachmentKey = new ByValueKey(
            SyllabusLearnerKeys.attachmentKey(fileName, 'success')
        );

        await driver.waitForAbsent(attachmentKey);
    }
}

export async function studentDoesNotSeeAttachmentsInTaskAssignmentDetail(
    learner: LearnerInterface,
    attachments: string[]
) {
    const driver = learner.flutterDriver!;

    for (const fileName of attachments) {
        const attachment = new ByText(fileName);

        await driver.waitForAbsent(attachment);
    }
}

export async function studentSeesAttachmentsInTaskAssignmentDetail(
    learner: LearnerInterface,
    attachments: string[]
) {
    const driver = learner.flutterDriver!;

    for (const fileName of attachments) {
        const attachment = new ByText(fileName);

        await driver.waitFor(attachment);
    }
}

export const studentSeesTaskAssignmentInstruction = async (
    learner: LearnerInterface,
    instruction: string
) => {
    const driver = learner.flutterDriver!;
    await driver.waitFor(
        new ByValueKey(SyllabusLearnerKeys.assignment_instruction_field_text(instruction))
    );
};

export async function studentWaitForAttachmentUploadSuccessfully(
    learner: LearnerInterface,
    uploadingAttachments: string[]
) {
    const driver = learner.flutterDriver!;
    await driver.scrollIntoView(
        new ByValueKey(SyllabusLearnerKeys.taskAssignmentAttachmentButton),
        0.0
    );
    for (const fileName of uploadingAttachments) {
        const attachmentKey = new ByValueKey(
            SyllabusLearnerKeys.attachmentKey(fileName, 'success')
        );
        await driver.waitFor(attachmentKey, 60000);
    }
}

export async function studentTapOnBackButton(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;

    const backButton = new ByValueKey(SyllabusLearnerKeys.back_button);

    await driver.tap(backButton);
}

export async function studentTapOnSaveButton(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;

    const saveButton = new ByValueKey(SyllabusLearnerKeys.taskAssignmentSaveButton(true));

    await driver.tap(saveButton);
}

export async function studentTapOnConfirmButton(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;

    const confirmButton = new ByValueKey(SyllabusLearnerKeys.yesDialogButton);

    await driver.tap(confirmButton);
}

export async function studentCheckOnRequireCheckBox(
    learner: LearnerInterface,
    settings: TaskAssignmentSettingInfo
) {
    const driver = learner.flutterDriver!;

    let checkBoxKeyName;

    switch (settings) {
        case 'Text note':
            checkBoxKeyName = SyllabusLearnerKeys.taskAssignmentRequireNoteCheckBox(false);
            break;
        case 'Duration':
            checkBoxKeyName = SyllabusLearnerKeys.taskAssignmentRequireDurationCheckBox(false);
            break;
        case 'Correctness':
            checkBoxKeyName = SyllabusLearnerKeys.taskAssignmentRequireCorrectnessCheckBox(false);
            break;
        case 'File attachment':
            checkBoxKeyName = SyllabusLearnerKeys.taskAssignmentRequireAttachmentCheckBox(false);
            break;
        case 'Understanding level':
            checkBoxKeyName =
                SyllabusLearnerKeys.taskAssignmentRequireUnderstandingLevelCheckBox(false);
            break;
    }

    const checkBoxKey = new ByValueKey(checkBoxKeyName);

    await driver.scrollIntoView(checkBoxKey, 0.0);

    await driver.tap(checkBoxKey);
}

export async function studentSubmitTaskAssignment(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;
    const buttonKey = new ByValueKey(SyllabusLearnerKeys.taskAssignmentSaveButton(true));

    await driver.scrollIntoView(buttonKey, 0.0);

    await driver.runUnsynchronized(async () => {
        await driver.tap(buttonKey);
    });
}

export async function studentWaitToSubmitTaskAssignment() {
    await delay(1000);
}
