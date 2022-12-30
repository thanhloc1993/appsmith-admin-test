import { getCMSInterfaceByRole, getRandomNumber } from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';
import { formatDate } from '@supports/utils/time/time';

import {
    aliasCreatedScheduleNotificationID,
    aliasCreatedScheduleNotificationName,
} from './alias-keys/communication';
import * as CommunicationSelectors from './cms-selectors/communication';
import {
    checkInvalidExpirationDay,
    checkInvalidExpirationTime,
    getScheduleAndExpirationDateTime,
} from './communication-check-expiration-date-time-in-questionnaire-definitions';
import {
    fillTitleAndContentOnDialog,
    getSelectDateOfDatePicker,
    InvalidDateTimeType,
    openComposeMessageDialog,
    clickCreatedNotificationByIdOnTable,
    selectNotificationTypesRadioOnDialog,
    selectRecipientsOnDialog,
    selectUserTypesRadioOnDialog,
} from './communication-common-definitions';
import {
    assertScheduleDateAndQuestionnaireDate,
    changeExpirationDate,
    changeExpirationTime,
    changeScheduleDate,
    changeScheduleTime,
    clickAddQuestionButton,
    fillQuestionTitleInQuestionnaire,
    selectQuestionTypeInQuestionnaire,
} from './communication-common-questionnaire-definitions';
import { getNotificationIdByTitleWithHasura } from './communication-notification-hasura';

When(
    `{string} create schedule questionnaire notification with expiration before schedule {string}`,
    async function (role: AccountRoles, invalidField: InvalidDateTimeType) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction('Open compose dialog', async function () {
            await openComposeMessageDialog(cms);
        });

        await cms.instruction(
            'Selects Schedule questionnaire notification type on the full-screen dialog',
            async function () {
                await selectNotificationTypesRadioOnDialog(cms, 'Schedule');
            }
        );

        //Pick Schedule/Expiration Date
        const { scheduleDate, scheduleTime, expirationDate, expirationTime } =
            getScheduleAndExpirationDateTime(invalidField);

        await cms.instruction(
            `Selects Schedule questionnaire notification date and time ${scheduleTime}, ${scheduleDate}`,
            async function () {
                await changeScheduleDate(cms, scheduleDate);

                await changeScheduleTime(cms, scheduleTime);
            }
        );

        await clickAddQuestionButton(cms);

        await cms.instruction(
            `Selects Expiration questionnaire notification date and time ${expirationTime}, ${expirationDate}`,
            async function () {
                await changeExpirationDate(cms, expirationDate);

                await changeExpirationTime(cms, expirationTime);
            }
        );
    }
);

Then(
    `{string} sees validation at expiration {string}`,
    async function (role: AccountRoles, invalidField: string) {
        const cms = getCMSInterfaceByRole(this, role);

        invalidField === 'Date'
            ? await checkInvalidExpirationDay(cms)
            : await checkInvalidExpirationTime(cms);
    }
);

When(`{string} creates schedule notification`, async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const context = this.scenario;

    await cms.instruction('Opens compose dialog', async function () {
        await openComposeMessageDialog(cms);
    });

    await cms.instruction(
        'Selects courses, grades and individual recipients on the full-screen dialog',
        async function () {
            await selectRecipientsOnDialog(cms, context, {
                course: 'Specific',
                grade: 'Specific',
                individual: 'Specific',
            });
        }
    );

    await cms.instruction(
        'Selects the "All" user type on the full-screen dialog',
        async function () {
            await selectUserTypesRadioOnDialog(cms, 'All');
        }
    );

    await cms.instruction(
        'Selects Schedule notification type on the full-screen dialog',
        async function () {
            await selectNotificationTypesRadioOnDialog(cms, 'Schedule');
        }
    );

    const currentDate = new Date();
    const selectedDate = getSelectDateOfDatePicker().selectedDate;
    const selectedTime = formatDate(currentDate, 'HH:mm');

    await cms.instruction(
        `Selects Schedule notification date and time ${selectedTime}, ${selectedDate}`,
        async function () {
            await changeScheduleDate(cms, selectedDate);

            await changeScheduleTime(cms, selectedTime);
        }
    );

    await cms.instruction(
        'Fills the title and content of the full-screen dialog',
        async function () {
            const scheduledName = `Title Schedule Notification E2E ${getRandomNumber()}`;

            await fillTitleAndContentOnDialog(cms, context, {
                title: scheduledName,
                content: `Content ${scheduledName}`,
            });

            context.set(aliasCreatedScheduleNotificationName, scheduledName);
        }
    );
});

When(
    `{string} creates questionnaire with expiration date time after scheduled date time`,
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        const addQuestionButton = await cms.page!.waitForSelector(
            CommunicationSelectors.addQuestionButton
        );

        weExpect(addQuestionButton).toBeDefined();

        await clickAddQuestionButton(cms);

        const questionSectionContainer = await cms.page!.waitForSelector(
            CommunicationSelectors.questionSectionContainer
        );

        weExpect(questionSectionContainer).toBeDefined();

        const questionSectionElement = await cms.page!.$(
            CommunicationSelectors.getQuestionSectionSelectorByQuestionIndex(0) // add only 1 question
        );

        if (!questionSectionElement) throw Error('Cannot find question section in questionnaire');

        await fillQuestionTitleInQuestionnaire(
            cms,
            questionSectionElement,
            `Question ${getRandomNumber()}`
        );

        await selectQuestionTypeInQuestionnaire(
            cms,
            questionSectionElement,
            'QUESTION_TYPE_FREE_TEXT'
        );

        await assertScheduleDateAndQuestionnaireDate(cms);
    }
);

Then(
    `{string} edits schedule notification with expiration date time before schedule date time`,
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;

        const title = context.get(aliasCreatedScheduleNotificationName);

        await cms.attach(`Call Hasura to get NotificationId by title ${title}`);

        const notificationId = await getNotificationIdByTitleWithHasura(this.cms, title);
        context.set(aliasCreatedScheduleNotificationID, notificationId);

        await cms.instruction(
            'Selects created notification in notification table',
            async function () {
                await clickCreatedNotificationByIdOnTable(cms, context);
            }
        );

        //Pick Schedule/Expiration Date
        const { scheduleDate, scheduleTime, expirationDate, expirationTime } =
            getScheduleAndExpirationDateTime('Date');

        await cms.instruction(
            `Selects Schedule questionnaire notification date and time ${scheduleTime}, ${scheduleDate}`,
            async function () {
                //make the autocomplete box empty before reassign the same value
                await cms.page!.fill(CommunicationSelectors.timePickerInput, '');

                await changeScheduleDate(cms, scheduleDate);

                await changeScheduleTime(cms, scheduleTime);
            }
        );

        await cms.instruction(
            `Selects Expiration questionnaire notification date and time ${expirationTime}, ${expirationDate}`,
            async function () {
                await changeExpirationDate(cms, expirationDate);

                await changeExpirationTime(cms, expirationTime);
            }
        );
    }
);

Then(`{string} sees validation at expiration date time`, async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await checkInvalidExpirationDay(cms);
});
