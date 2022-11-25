import {
    getLearnerInterfaceFromRole,
    randomInteger,
    splitAndCombinationIntoArray,
} from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld, LearnerInterface } from '@supports/app-types';
import { MasterWorld } from '@supports/master-world';
import notificationMgmtNotificationService from '@supports/services/notificationmgmt-notification';
import { UserRoles } from '@supports/services/notificationmgmt-notification/const';

import {
    aliasCreatedNotificationContentLink,
    aliasCreatedNotificationName,
    aliasCreatedNotificationID,
    aliasCreatedNotificationContent,
    aliasNotificationGradeName,
    aliasNotificationCreatedCourseName,
} from './alias-keys/communication';
import { notificationDetailContent } from './cms-selectors/communication';
import {
    addHyperlinkNotificationEditor,
    assertNotificationRecipientTable,
    assertNotificationRecipientTableByReaderId,
    assertNotificationSentDetail,
    clickSendNotification,
    getAccountRoles,
    getCMSSections,
    getUserNamesByAccountRoles,
    learnerSeesNotificationDetail,
    openAndInputNotificationDataToComposeForm,
    passValuesInAssertNotificationRowOnTableById,
    ReadNotificationAccountType,
    SectionType,
    clickCreatedNotificationByIdOnTable,
    selectNotificationCategoryFilter,
} from './communication-common-definitions';
import { createANotificationGrpc } from './communication-create-notification-definitions';
import { getNotificationIdByTitleWithHasura } from './communication-notification-hasura';
import { verifyNotificationDescriptionHaveHyperlink } from './communication-read-notification-definitions';
import { learnerReadNotification } from './communication-resend-notification-definitions';

Given('school admin has created notification that content includes hyperlink', async function () {
    const link = 'https://manabie.com/';
    const scenario = this.scenario;
    const cms = this.cms;

    await cms.instruction('Open compose dialog and input required fields', async () => {
        await openAndInputNotificationDataToComposeForm(cms, scenario);
    });

    await cms.instruction('Select all content of editor to click button link ', async () => {
        // on Windows and Linux
        await cms.page!.keyboard.press('Control+A');
        // on macOS
        await cms.page!.keyboard.press('Meta+A');
    });

    await cms.instruction(`Add hyperlink in editor ${link}`, async () => {
        await addHyperlinkNotificationEditor(cms, scenario, link);
    });
});

Given('school admin has sent the notification for student and parent', async function () {
    const cms = this.cms;
    const learnId = await this.learner.getUserId();
    const context = this.scenario;
    const token = await cms.getToken();

    const createdNotificationData = createANotificationGrpc({
        courseIds: [],
        gradeIds: [],
        mediaIds: [],
        isAllCourses: false,
        isAllGrades: false,
        targetGroup: [UserRoles.USER_GROUP_STUDENT, UserRoles.USER_GROUP_PARENT],
        receiverIdsList: [learnId],
    });

    const { response: responseDraftNotification } =
        await notificationMgmtNotificationService.upsertNotification(
            token,
            createdNotificationData
        );

    if (!responseDraftNotification) throw Error('cannot create notification draft');

    await cms.attach(`Create gRPC draft notification 
        Id: ${responseDraftNotification?.notificationId}
        Title: ${createdNotificationData.title}
        Content ${createdNotificationData.content.contentHTML}`);

    context.set(aliasCreatedNotificationID, responseDraftNotification.notificationId);
    context.set(aliasCreatedNotificationName, createdNotificationData.title);
    context.set(aliasCreatedNotificationContent, createdNotificationData.content.contentHTML);
    context.set(aliasNotificationCreatedCourseName, 'None');
    context.set(aliasNotificationGradeName, 'None');

    await cms.attach(`Send Notification by gRPC ${createdNotificationData.title}`);

    await notificationMgmtNotificationService.sendNotification(
        token,
        responseDraftNotification.notificationId
    );
});

When(
    '{string} reads the notification',
    async function (this: MasterWorld, receivers: ReadNotificationAccountType) {
        const learner = this.learner;

        const randIndex = randomInteger(0, 1);
        const accountRole: ReadNotificationAccountType = receivers.includes('1 of')
            ? getAccountRoles(receivers, randIndex)
            : receivers;

        const roles = splitAndCombinationIntoArray(accountRole);

        for (const role of roles) {
            const reader = getLearnerInterfaceFromRole(this, role as AccountRoles);

            await learner.instruction(
                `Click on notification button with role ${role}`,
                async function () {
                    await learnerReadNotification(reader);
                }
            );
        }
    }
);

Then(
    'school admin sees {string} people display in {string} notification list on CMS',
    async function (this: MasterWorld, readNumber: string, section: SectionType) {
        const randIndex = randomInteger(0, 1);
        const sectionCMS = getCMSSections(section, randIndex);
        const context = this.scenario;
        const cms = this.cms;

        const createdNotificationId = context.get<string>(aliasCreatedNotificationID);
        const createdNotificationName: string = context.get<string>(aliasCreatedNotificationName);

        await cms.attach(`Section ${sectionCMS}`);

        if (sectionCMS === SectionType.All) {
            await cms.instruction(
                `Assert correct sent notification data with:
                        - Id: "${createdNotificationId}"
                        - Title: "${createdNotificationName}"
                        - Read: "${readNumber}"`,

                async () => {
                    await selectNotificationCategoryFilter(cms, 'All');
                    await cms.waitingForLoadingIcon();

                    await passValuesInAssertNotificationRowOnTableById(cms, context);
                }
            );
        }

        if (sectionCMS === SectionType.Sent) {
            await selectNotificationCategoryFilter(cms, 'Sent');
            await cms.waitingForLoadingIcon();

            await clickCreatedNotificationByIdOnTable(cms, context);

            await cms.waitingForProgressBar();

            await cms.instruction('Assert notification Recipient table detail', async () => {
                await assertNotificationRecipientTable(cms, readNumber);
            });

            await cms.instruction('Assert created notification', async () => {
                await assertNotificationSentDetail(cms, context);
            });
        }
    }
);

Given('school admin has sent notification to student and parent', async function () {
    const scenario = this.scenario;
    const cms = this.cms;

    await cms.instruction('Click send button on the compose dialog', async () => {
        await clickSendNotification(cms);
    });

    const title = scenario.get(aliasCreatedNotificationName);

    await cms.attach(`Call Hasura to get NotificationId by title ${title}`);

    const notificationId = await getNotificationIdByTitleWithHasura(cms, title);
    scenario.set(aliasCreatedNotificationID, notificationId);

    await cms.instruction('Assert content link', async () => {
        await clickCreatedNotificationByIdOnTable(cms, scenario);

        const createdNotificationContentLink = scenario.get<string>(
            aliasCreatedNotificationContentLink
        );

        await cms.page?.waitForSelector(
            `${notificationDetailContent} a[target="_blank"][href='${createdNotificationContentLink}']`
        );
    });

    await cms.instruction('Assert created notification', async () => {
        await assertNotificationSentDetail(cms, scenario);
    });
});

Then(
    `school admin sees the status of {string} already read the notification`,
    async function (this: IMasterWorld, accountRole: ReadNotificationAccountType) {
        const context = this.scenario;
        const cms = this.cms;

        const readerNames = await getUserNamesByAccountRoles(
            this.learner,
            this.parent,
            accountRole
        );

        await cms.instruction('Reload page', async () => {
            await cms.page?.reload();
        });

        await cms.waitingForProgressBar();
        await cms.waitForSkeletonLoading();

        await cms.instruction(`Select notification detail`, async () => {
            await clickCreatedNotificationByIdOnTable(cms, context);

            await cms.waitingForProgressBar();

            await cms.instruction(
                `Assert notification Recipient table detail with reader name ${readerNames.toString()}`,
                async () => {
                    const notificationAccountRead = [];

                    for (const readerName of readerNames) {
                        const readAccount = await assertNotificationRecipientTableByReaderId(
                            cms,
                            readerName
                        );

                        notificationAccountRead.push(readAccount);
                    }
                    weExpect(notificationAccountRead.length).toEqual(readerNames.length);
                }
            );
        });
    }
);

Then(
    '{string} sees notification have hyperlink',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const link = this.scenario.get(aliasCreatedNotificationContentLink);

        await learner.instruction(
            `${role} sees notification detail`,
            async function (this: LearnerInterface) {
                await learnerSeesNotificationDetail(this);
            }
        );

        await learner.instruction(
            `${role} sees notification have hyperlink`,
            async function (learner) {
                await verifyNotificationDescriptionHaveHyperlink(learner, link);
            }
        );
    }
);
