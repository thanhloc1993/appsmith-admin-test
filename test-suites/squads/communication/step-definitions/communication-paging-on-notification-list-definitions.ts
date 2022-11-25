import {
    buttonNextPageTable,
    buttonPreviousPageTable,
    tableCellIndex,
} from '@legacy-step-definitions/cms-selectors/cms-keys';
import { getTextInsideBrackets, randomInteger } from '@legacy-step-definitions/utils';

import { Page } from 'playwright';

import { CMSInterface } from '@supports/app-types';
import notificationMgmtNotificationService from '@supports/services/notificationmgmt-notification';
import { UserRoles } from '@supports/services/notificationmgmt-notification/const';
import { KeyNotificationStatus } from '@supports/services/notificationmgmt-notification/const';

import {
    menuItemAll,
    menuItemDraft,
    menuItemSent,
    menuItemSchedule,
} from './cms-selectors/communication';
import { NotificationCategory } from './communication-common-definitions';
import { getCMSSections } from './communication-common-definitions';
import {
    createANotificationGrpc,
    UpsertNotificationDataProps,
} from './communication-create-notification-definitions';

const notificationCategoriesSelector: Record<NotificationCategory, string> = {
    All: menuItemAll,
    Sent: menuItemSent,
    Draft: menuItemDraft,
    Scheduled: menuItemSchedule,
};

const notificationDefaultData: Pick<
    UpsertNotificationDataProps,
    | 'courseIds'
    | 'gradeIds'
    | 'mediaIds'
    | 'isAllCourses'
    | 'isAllGrades'
    | 'targetGroup'
    | 'receiverIdsList'
> = {
    courseIds: [],
    gradeIds: [],
    mediaIds: [],
    isAllCourses: false,
    isAllGrades: false,
    targetGroup: [UserRoles.USER_GROUP_STUDENT],
    receiverIdsList: [],
};

export async function getNotificationCategoryTotal(
    cms: CMSInterface,
    tab: NotificationCategory
): Promise<number> {
    const categorySelector: string =
        notificationCategoriesSelector[tab] || notificationCategoriesSelector.All;

    const content = await cms.getTextContentElement(categorySelector);

    if (!content) return 0;

    return Number(getTextInsideBrackets(content));
}

export async function upsertNotifications(
    token: string,
    limit: number,
    tab: NotificationCategory,
    cms: CMSInterface
) {
    switch (tab) {
        case 'Sent':
            await insertSentNotifications(token, limit, cms);
            break;
        case 'Scheduled':
            await insertScheduledNotification(token, limit, cms);
            break;
        default:
            await insertDraftNotifications(token, limit, cms);
    }
}

export async function insertDraftNotifications(token: string, limit: number, cms: CMSInterface) {
    for (let i = 0; i < limit; i++) {
        const title = `Draft notification E2E gRPC test ${new Date().toISOString()}`;
        const notification = createANotificationGrpc({
            title,
            ...notificationDefaultData,
        });

        const { response } = await notificationMgmtNotificationService.upsertNotification(
            token,
            notification
        );

        if (!response) {
            await cms.attach(`Notification has title "${title}" can't create`);
        }
    }
}

export async function insertSentNotifications(token: string, limit: number, cms: CMSInterface) {
    for (let i = 0; i < limit; i++) {
        const title = `Sent notification E2E gRPC test ${new Date().toISOString()}`;
        const notification = createANotificationGrpc({
            ...notificationDefaultData,
            title,
            status: KeyNotificationStatus.NOTIFICATION_STATUS_DRAFT,
        });

        const { response } = await notificationMgmtNotificationService.upsertNotification(
            token,
            notification
        );

        if (!response) {
            await cms.attach(`Notification has title "${title}" can't create`);
        } else {
            const notificationId = response?.notificationId || '';

            const sendResponse = await notificationMgmtNotificationService.sendNotification(
                token,
                notificationId
            );

            if (!sendResponse) {
                await cms.attach(
                    `Notification has title "${title}" & id "${notificationId}" can't send`
                );
            }
        }
    }
}

export async function insertScheduledNotification(token: string, limit: number, cms: CMSInterface) {
    const scheduledAt = getFutureDate(1);

    for (let i = 0; i < limit; i++) {
        const title = `Scheduled notification E2E gRPC test ${new Date().toISOString()}`;
        const notification = createANotificationGrpc({
            title,
            ...notificationDefaultData,
            receiverIdsList: [''],
            scheduledAt,
            status: KeyNotificationStatus.NOTIFICATION_STATUS_SCHEDULED,
        });

        const { response } = await notificationMgmtNotificationService.upsertNotification(
            token,
            notification
        );

        if (!response) {
            await cms.attach(`Notification has title "${title}" can't create`);
        }
    }
}

export async function assertPreviousPageEnableState(page: Page, state: boolean) {
    const buttonControlPaging = await page.waitForSelector(buttonPreviousPageTable);
    const isEnabled = await buttonControlPaging?.isEnabled();

    weExpect(isEnabled).toEqual(state);
}

export function getRandomSelectedTab(tab: NotificationCategory) {
    const randIndex = randomInteger(0, 3);
    const selectedTab = getCMSSections(tab, randIndex);
    return selectedTab;
}

export async function clickNextButton(page: Page) {
    const nextButton = await page.waitForSelector(buttonNextPageTable);
    const isEnabled = await nextButton.isEnabled();
    if (isEnabled) await nextButton.click();
}

export async function checkRecordsWithNumerical(
    page: Page,
    recordIndexRange: { recordFrom: number; recordTo: number } = { recordFrom: 1, recordTo: 10 }
) {
    const tableIndexCellElements = await page.$$(tableCellIndex);

    // remove the header element
    tableIndexCellElements.shift();

    const { recordFrom, recordTo } = recordIndexRange;
    for (const cell of tableIndexCellElements) {
        const index = await cell.innerText();
        const indexNumber = +index;

        weExpect(indexNumber >= recordFrom && indexNumber <= recordTo).toBe(true);
    }
}

function getFutureDate(addedDays: number): Date {
    const currentDate = new Date();
    const newDate = new Date(new Date(currentDate).setDate(currentDate.getDate() + addedDays));
    newDate.setHours(currentDate.getHours());
    return newDate;
}
