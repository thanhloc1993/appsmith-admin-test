import { CMSInterface } from '@supports/app-types';

import * as CommunicationSelectors from './cms-selectors/communication';

export async function assertNotificationSentDetailPage(
    cms: CMSInterface,
    {
        notificationName,
        notificationContent,
        courseName,
        gradeName,
        studentName,
    }: {
        notificationName: string;
        notificationContent: string;
        courseName?: string;
        gradeName?: string;
        studentName?: string;
    }
) {
    const notificationStatus = 'Sent';

    await cms.waitingForLoadingIcon();

    await cms.instruction(`Assert sent notification detail`, async function () {
        await cms.instruction(
            `Assert correct sent notification data with:
             - Title: "${notificationName}"
             - Content: "${notificationContent}"
             - Status: "${notificationStatus}"`,
            async function () {
                const notificationTitle = await cms.page!.$(
                    CommunicationSelectors.notificationDetailTitle
                );
                const notificationTitleText = await notificationTitle?.textContent();

                weExpect(notificationTitleText).toEqual(notificationName);

                await cms.waitForSelectorHasText(
                    CommunicationSelectors.notificationDetailStatus,
                    notificationStatus
                );
                await cms.waitForSelectorHasText(
                    CommunicationSelectors.notificationDetailContent,
                    notificationContent
                );
            }
        );

        await cms.instruction(
            `Assert correct sent notification recipient dropdown data with:
             - Course name: ${courseName ?? ''}
             - Student name: ${studentName ?? ''}
             - Grade name: ${gradeName ?? ''}`,
            async function () {
                await cms.page?.click(
                    CommunicationSelectors.notificationDetailRecipientDropdownButton
                );

                if (courseName) {
                    await cms.waitForSelectorHasText(
                        CommunicationSelectors.notificationDetailRecipientDropdown,
                        courseName
                    );
                }

                if (gradeName) {
                    await cms.waitForSelectorHasText(
                        CommunicationSelectors.notificationDetailRecipientDropdown,
                        gradeName
                    );
                }

                if (studentName) {
                    await cms.waitForSelectorHasText(
                        CommunicationSelectors.notificationDetailRecipientDropdown,
                        studentName
                    );
                }

                await cms.waitForSelectorHasText(
                    CommunicationSelectors.notificationDetailRecipientDropdown,
                    'Student' || 'Parent'
                );
            }
        );
    });
}
