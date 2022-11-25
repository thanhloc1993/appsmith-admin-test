import { aliasAttachmentFileNames } from '@legacy-step-definitions/alias-keys/file';

import { CMSInterface, LearnerInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { formatDate } from '@supports/utils/time/time';

import {
    aliasCreatedNotificationContent,
    aliasCreatedNotificationID,
    aliasCreatedNotificationName,
    aliasCreatedScheduleNotificationName,
    cmsScheduleNotificationData,
} from './alias-keys/communication';
import {
    notificationTitleInput,
    notificationDetailContent,
    coursesAutocompleteHF,
    chipAutocompleteText,
    studentsAutocompleteHF,
    timePickerHF,
    notificationScheduleDatePicker,
    timePickerInput,
    gradesMasterAutocompleteHF,
} from './cms-selectors/communication';
import {
    NotificationFields,
    fillTitleAndContentOnDialog,
    selectCoursesOnDialog,
    selectGradesOnDialog,
    selectIndividualRecipientOnDialog,
    assertNotificationAttachment,
    selectRecipientsOnDialog,
    datePickerParams,
    getSelectDateOfDatePicker,
} from './communication-common-definitions';
import { selectNotificationTimePicker } from './communication-create-scheduled-notification.definitions';
import { uploadAttachPDFFile } from './communication-edit-and-save-draft-notification-definitions';

export async function editAllFieldsScheduleNotification(
    notificationEditTitle: string,
    notificationEditContent: string,
    selectedDate: string,
    selectedTime: string,
    cms: CMSInterface,
    context: ScenarioContext
) {
    await uploadAttachPDFFile(cms, context);

    await cms.instruction('Fills date and time of schedule time', async function () {
        await cms.selectDatePickerMonthAndDay(datePickerParams);
        await selectNotificationTimePicker(cms, selectedTime);
    });

    await cms.instruction('Fills the title and content', async function () {
        await fillTitleAndContentOnDialog(cms, context, {
            title: notificationEditTitle,
            content: notificationEditContent,
        });
    });

    await cms.instruction(
        'Selects courses, grades and individual recipients on the full-screen dialog',
        async function (this: CMSInterface) {
            await selectRecipientsOnDialog(this, context, {
                course: 'All',
                grade: 'All',
                individual: 'Specific',
                studentRoles: 'student S2',
            });
        }
    );

    context.set(aliasCreatedScheduleNotificationName, notificationEditTitle);
    context.set(cmsScheduleNotificationData('Content'), notificationEditContent);
    context.set(cmsScheduleNotificationData('Date'), selectedDate);
    context.set(cmsScheduleNotificationData('Time'), selectedTime);
}

export async function editScheduleNotificationFields(
    fieldKey: NotificationFields,
    cms: CMSInterface,
    context: ScenarioContext
): Promise<void> {
    const createdNotificationId: string = context.get<string>(aliasCreatedNotificationID);

    const selectedDate = formatDate(getSelectDateOfDatePicker().selectedDate, 'YYYY/MM/DD');
    const selectedTime = formatDate(
        new Date().setHours(getSelectDateOfDatePicker().selectedDate.getHours() + 2),
        'HH:mm'
    );

    const notificationEditTitle = `Edited Schedule E2E ${createdNotificationId}`;
    const notificationEditContent = `Edited Schedule Content ${createdNotificationId}`;

    switch (fieldKey) {
        case 'Title':
            await fillTitleAndContentOnDialog(cms, context, {
                title: notificationEditTitle,
            });

            context.set(aliasCreatedScheduleNotificationName, notificationEditTitle);
            break;

        case 'Content':
            await fillTitleAndContentOnDialog(cms, context, {
                content: notificationEditContent,
            });

            context.set(cmsScheduleNotificationData(fieldKey), notificationEditContent);
            break;

        case 'Course':
            // All Course
            await selectCoursesOnDialog(cms, context, true);
            break;

        case 'Grade':
            // All Grade
            await selectGradesOnDialog(cms, { isGradeAll: true });
            break;

        case 'Individual Recipient':
            await selectIndividualRecipientOnDialog(cms, context, 'student S2');
            break;

        case 'Date':
            await cms.attach(`Select datepicker ${selectedDate}`);
            await cms.selectDatePickerMonthAndDay(datePickerParams);
            context.set(cmsScheduleNotificationData(fieldKey), selectedDate);

            break;

        case 'Time':
            await cms.attach(`Select time autocomplete input ${selectedTime}`);
            await selectNotificationTimePicker(cms, selectedTime);
            context.set(cmsScheduleNotificationData(fieldKey), selectedTime);
            break;

        default:
            await editAllFieldsScheduleNotification(
                notificationEditTitle,
                notificationEditContent,
                selectedDate,
                selectedTime,
                cms,
                context
            );
            break;
    }
}

export async function assertEditedScheduleNotification(
    fieldKey: NotificationFields,
    cms: CMSInterface,
    learner2: LearnerInterface,
    context: ScenarioContext
): Promise<void> {
    const notificationId: string = context.get<string>(aliasCreatedNotificationID);
    const notificationName: string = context.get<string>(aliasCreatedNotificationName);
    const notificationContent: string = context.get<string>(aliasCreatedNotificationContent);
    const notificationDate: string = context.get<string>(cmsScheduleNotificationData('Date'));
    const notificationTime: string = context.get<string>(cmsScheduleNotificationData('Time'));

    const notificationAttachmentName = context.get<string>(aliasAttachmentFileNames);

    const student2 = await learner2.getProfile();

    const notificationTitleInputValue = await cms.page?.inputValue(notificationTitleInput);
    weExpect(notificationTitleInputValue).toEqual(notificationName);

    await cms.waitForSelectorWithText(
        `${notificationDetailContent} span[data-text="true"]`,
        notificationContent
    );

    if (fieldKey === 'All Fields') {
        await cms.instruction(
            `Select edited draft notification:
            - Id: "${notificationId}"
            - Title: "${notificationName}"
            - Content: "${notificationContent}"
            - Course: All Courses
            - Grade: All Grades
            - Date: "${notificationDate}"
            - Time: "${notificationTime}"
            - Individual Recipient: ${student2.name}
            - AttachFiles: "${notificationAttachmentName}"`,

            async () => {
                await assertEditedScheduleNotificationWithAllFields(cms, context, student2.name);
            }
        );
    }

    if (fieldKey === 'Course')
        // All Courses
        await cms.page?.waitForSelector(`${coursesAutocompleteHF} [aria-label='All Courses']`);

    if (fieldKey === 'Grade')
        // All Grades
        await cms.page?.waitForSelector(`${gradesMasterAutocompleteHF} [aria-label='All Grades']`);

    if (fieldKey === 'Individual Recipient')
        await cms.page?.waitForSelector(
            `${studentsAutocompleteHF} [aria-label="${student2.name}"]`
        );

    if (fieldKey === 'Date') {
        const notificationDatePickerInputValue = await cms.page?.inputValue(
            notificationScheduleDatePicker
        );
        weExpect(notificationDatePickerInputValue).toEqual(notificationDate);
    }

    if (fieldKey === 'Time') {
        const notificationTimePickerInputValue = await cms.page?.inputValue(timePickerInput);

        weExpect(notificationTimePickerInputValue).toEqual(notificationTime);
    }
}

export async function assertEditedScheduleNotificationWithAllFields(
    cms: CMSInterface,
    context: ScenarioContext,
    student2Name: string
): Promise<void> {
    const notificationDate: string = context.get<string>(cmsScheduleNotificationData('Date'));
    const notificationTime: string = context.get<string>(cmsScheduleNotificationData('Time'));

    await cms.page?.waitForSelector(`${coursesAutocompleteHF} [aria-label='All Courses']`);
    await cms.page?.waitForSelector(`${gradesMasterAutocompleteHF} [aria-label='All Grades']`);
    await cms.page?.waitForSelector(`${studentsAutocompleteHF} [aria-label="${student2Name}"]`);

    await cms.waitForSelectorWithText(`${timePickerHF} ${chipAutocompleteText}`, notificationTime);

    await assertNotificationAttachment(cms, context, {
        shouldAttachmentALink: false,
    });

    const notificationDatePickerInputValue = await cms.page?.inputValue(
        notificationScheduleDatePicker
    );

    weExpect(notificationDatePickerInputValue).toEqual(notificationDate);
}
