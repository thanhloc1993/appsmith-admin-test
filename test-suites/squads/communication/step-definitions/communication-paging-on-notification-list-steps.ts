import {
    getCMSInterfaceByRole,
    changeRowsPerPage,
    seesEqualRowsPerPageOnCMS,
    checkFooterRowsRange,
    isInPagePositionOnCMS,
} from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { PagePosition } from '@supports/types/cms-types';

import { aliasNotificationCategory } from './alias-keys/communication';
import { selectNotificationCategoryFilter } from './communication-common-definitions';
import { NotificationCategory, ComposeType } from './communication-common-definitions';
import {
    getNotificationCategoryTotal,
    upsertNotifications,
    clickNextButton,
    checkRecordsWithNumerical,
    assertPreviousPageEnableState,
    getRandomSelectedTab,
} from './communication-paging-on-notification-list-definitions';

Given(
    '{string} has created more than {int} notifications in tab {string}',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        notificationNumber: number,
        tab: NotificationCategory
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const { context } = this.scenario;
        let selectedTab: NotificationCategory;

        if (tab.includes('1 of')) {
            selectedTab = getRandomSelectedTab(tab);
        } else {
            selectedTab = tab;
        }
        context.set(aliasNotificationCategory, selectedTab);

        const recordLimitation = notificationNumber + 1;
        const currentRecordNumber = await getNotificationCategoryTotal(cms, selectedTab);
        if (currentRecordNumber < recordLimitation) {
            const token = await cms.getToken();
            const additionalRecordNumber: number = recordLimitation - currentRecordNumber;

            await cms.instruction(
                `Create ${additionalRecordNumber} notification(s)`,
                async function () {
                    await upsertNotifications(token, additionalRecordNumber, selectedTab, cms);
                }
            );
        }
    }
);

When(
    '{string} choose {int} rows per page at {string}',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        rowsPerPage: number,
        tab: NotificationCategory
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const { context } = this.scenario;

        let selectedTab = context.get(aliasNotificationCategory);

        if (!selectedTab) {
            selectedTab = getRandomSelectedTab(tab);
        }

        await cms.instruction(`Select notification ${selectedTab} category`, async function (cms) {
            await selectNotificationCategoryFilter(cms, selectedTab);
        });

        await cms.instruction(
            `${role} has chosen ${rowsPerPage} rows per page in ${selectedTab} tab`,
            async function () {
                await changeRowsPerPage(cms, rowsPerPage);
            }
        );
    }
);

Then(
    '{string} sees {int} rows per page',
    async function (this: IMasterWorld, role: AccountRoles, rowsPerPage: number) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} sees rows per page is ${rowsPerPage}`, async function () {
            await seesEqualRowsPerPageOnCMS(cms, rowsPerPage);
        });
    }
);

Then(
    '{string} sees row {int}-{int} of total row of tab',
    async function (this: IMasterWorld, role: AccountRoles, recordFrom: number, recordTo: number) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees row ${recordFrom} - ${recordTo} of total row of tab`,
            async function () {
                await checkFooterRowsRange(cms, { recordFrom, recordTo });
            }
        );
    }
);

Given(
    '{string} has created more than {int} {string} notifications',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        notificationNumber: number,
        type: ComposeType
    ) {
        const cms = getCMSInterfaceByRole(this, role);

        const recordLimitation = notificationNumber + 1;
        const currentRecordNumber = await getNotificationCategoryTotal(cms, type);
        if (currentRecordNumber < recordLimitation) {
            const token = await cms.getToken();
            const additionalRecordNumber: number = recordLimitation - currentRecordNumber;

            await cms.instruction(
                `Create ${additionalRecordNumber} ${type} notification(s)`,
                async function () {
                    await upsertNotifications(token, additionalRecordNumber, type, cms);
                }
            );
        }
    }
);

Given(
    '{string} choose {int} rows per page at tab {string}',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        rowsPerPage: number,
        tab: NotificationCategory
    ) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`Select notification ${tab} category`, async function (cms) {
            await selectNotificationCategoryFilter(cms, tab);
        });

        await cms.instruction(
            `${role} has chosen ${rowsPerPage} rows per page in ${tab} tab`,
            async function () {
                await changeRowsPerPage(cms, rowsPerPage);
            }
        );
    }
);

Given('{string} go to next page', async function (this: IMasterWorld, role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} click next button`, async function () {
        await clickNextButton(cms.page!);
    });
});

When(
    '{string} switch to tab {string}',
    async function (this: IMasterWorld, role: AccountRoles, tab: NotificationCategory) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`Select notification ${tab} category`, async function (cms) {
            await selectNotificationCategoryFilter(cms, tab);
        });
    }
);

Then(
    '{string} sees tab {string} refresh to first page',
    async function (this: IMasterWorld, role: AccountRoles, tab: NotificationCategory) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} is redirected to the first result page in tab ${tab}`,
            async function () {
                await isInPagePositionOnCMS(cms, PagePosition.First);
            }
        );
    }
);

Then(
    '{string} sees {int} row per page with numerical {int} to {int} at tab {string}',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        rowsPerPage: number,
        recordFrom: number,
        recordTo: number,
        tab: NotificationCategory
    ) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees ${rowsPerPage} rows with index from ${recordFrom} to ${recordTo} at tab ${tab}`,
            async function () {
                await checkRecordsWithNumerical(cms.page!, { recordFrom, recordTo });
            }
        );
    }
);

Then(
    '{string} sees previous page button enable',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} sees previous page button enable`, async () => {
            await assertPreviousPageEnableState(cms.page!, true);
        });
    }
);

Then(
    '{string} sees previous page button disable on the first page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees previous page button disable on the first page`,
            async () => {
                await assertPreviousPageEnableState(cms.page!, false);
            }
        );
    }
);
