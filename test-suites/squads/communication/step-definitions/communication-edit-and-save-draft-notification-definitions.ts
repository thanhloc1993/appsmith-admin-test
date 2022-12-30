import { aliasAttachmentFileNames } from '@legacy-step-definitions/alias-keys/file';

import { CMSInterface, LearnerInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import {
    aliasCreatedNotificationContent,
    aliasCreatedNotificationID,
    aliasCreatedNotificationName,
} from './alias-keys/communication';
import {
    chipAutocompleteText,
    coursesAutocompleteHF,
    gradesMasterAutocompleteHF,
    notificationDetailContent,
    notificationTitleInput,
    studentsAutocompleteHF,
} from './cms-selectors/communication';
import {
    assertNotificationAttachment,
    fillTitleAndContentOnDialog,
    NotificationFields,
    selectCoursesOnDialog,
    clickCreatedNotificationByIdOnTable,
    selectGradesOnDialog,
    selectIndividualRecipientOnDialog,
    selectRecipientsOnDialog,
    uploadNotificationAttachmentOnDialog,
} from './communication-common-definitions';

export async function uploadAttachPDFFile(
    cms: CMSInterface,
    context: ScenarioContext
): Promise<void> {
    await cms.instruction('Upload pdf attachment', async function () {
        await uploadNotificationAttachmentOnDialog(cms, context);

        await cms.instruction('Assert the attachment is on the notification', async function () {
            await assertNotificationAttachment(cms, context, {
                shouldAttachmentALink: false,
            });
        });
    });
}

export async function editAllFieldsDraftNotification(
    cms: CMSInterface,
    context: ScenarioContext,
    createdNotificationId: string
): Promise<void> {
    //Upload PDF File
    await uploadAttachPDFFile(cms, context);

    await cms.instruction('Fills the title and content', async function () {
        await fillTitleAndContentOnDialog(cms, context, {
            title: `Edited E2E ${createdNotificationId}`,
            content: `Edited Content ${createdNotificationId}`,
        });
    });

    await cms.instruction(
        'Selects courses, grades and individual recipients on the compose dialog',
        async function (this: CMSInterface) {
            await selectRecipientsOnDialog(this, context, {
                course: 'All',
                grade: 'All',
                individual: 'Specific',
                studentRoles: 'student S2',
            });
        }
    );
}

export async function editDraftNotificationFields(
    fieldKey: NotificationFields,
    cms: CMSInterface,
    context: ScenarioContext
): Promise<void> {
    const createdNotificationId: string = context.get<string>(aliasCreatedNotificationID);

    switch (fieldKey) {
        case 'Title':
            await fillTitleAndContentOnDialog(cms, context, {
                title: `Edited E2E ${createdNotificationId}`,
            });
            break;

        case 'Content':
            await fillTitleAndContentOnDialog(cms, context, {
                content: `Edited Content ${createdNotificationId}`,
            });
            break;

        case 'Course':
            // All Course
            await selectCoursesOnDialog(cms, context, true);
            break;

        case 'Grade':
            await selectGradesOnDialog(cms, { isGradeAll: true });
            break;

        case 'Individual Recipient':
            await selectIndividualRecipientOnDialog(cms, context, 'student S2');
            break;

        case 'Attach File':
            await uploadAttachPDFFile(cms, context);
            break;

        default:
            await editAllFieldsDraftNotification(cms, context, createdNotificationId);
            break;
    }
}

export async function assertEditedDraftNotification(
    fieldKey: string,
    cms: CMSInterface,
    learner2: LearnerInterface,
    context: ScenarioContext
): Promise<void> {
    const notificationId: string = context.get<string>(aliasCreatedNotificationID);
    const notificationName: string = context.get<string>(aliasCreatedNotificationName);
    const notificationContent: string = context.get<string>(aliasCreatedNotificationContent);
    const notificationAttachmentName = context.get<string>(aliasAttachmentFileNames);

    const student2 = await learner2.getProfile();

    await cms.instruction(
        `Select edited draft notification:
        - Id: "${notificationId}"
        - Title: "${notificationName}"`,

        async () => {
            await clickCreatedNotificationByIdOnTable(cms, context);
        }
    );

    await cms.waitingForLoadingIcon();

    const notificationTitleInputValue = await cms.page?.inputValue(notificationTitleInput);
    weExpect(notificationTitleInputValue).toEqual(notificationName);

    await cms.waitForSelectorWithText(
        `${notificationDetailContent} span[data-text="true"]`,
        notificationContent
    );

    if (fieldKey === 'All') {
        await cms.instruction(
            `Select edited draft notification:
            - Id: "${notificationId}"
            - Title: "${notificationName}"
            - Content: "${notificationContent}"
            - Course: All Courses
            - Grade: All Grades
            - Individual Recipient: ${student2.name}
            - AttachFiles: "${notificationAttachmentName}"`,

            async () => {
                await assertEditedDraftNotificationWithAllFields(cms, context, student2.name);
            }
        );
    }

    if (fieldKey === 'Course')
        // All Courses
        await cms.waitForSelectorWithText(
            `${coursesAutocompleteHF} ${chipAutocompleteText}`,
            'All Courses'
        );

    if (fieldKey === 'Grade')
        // All Grades
        await cms.waitForSelectorWithText(
            `${gradesMasterAutocompleteHF} ${chipAutocompleteText}`,
            'All Grades'
        );

    if (fieldKey === 'Individual Recipient')
        await cms.waitForSelectorHasText(
            `${studentsAutocompleteHF} ${chipAutocompleteText}`,
            student2.name
        );

    if (fieldKey === 'Attach File')
        await assertNotificationAttachment(cms, context, {
            shouldAttachmentALink: false,
        });
}

export async function assertEditedDraftNotificationWithAllFields(
    cms: CMSInterface,
    context: ScenarioContext,
    student2Name: string
): Promise<void> {
    await cms.waitForSelectorWithText(
        `${coursesAutocompleteHF} ${chipAutocompleteText}`,
        'All Courses'
    );
    await cms.waitForSelectorWithText(
        `${gradesMasterAutocompleteHF} ${chipAutocompleteText}`,
        'All Grades'
    );
    await cms.waitForSelectorHasText(
        `${studentsAutocompleteHF} ${chipAutocompleteText}`,
        student2Name
    );
    await assertNotificationAttachment(cms, context, {
        shouldAttachmentALink: false,
    });
}
