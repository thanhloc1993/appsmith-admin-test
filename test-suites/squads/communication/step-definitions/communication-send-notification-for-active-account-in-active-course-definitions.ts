import { CMSInterface, LearnerInterface } from '@supports/app-types';
import { CourseDuration } from '@supports/entities/course-duration';
import { ScenarioContext } from '@supports/scenario-context';
import notificationMgmtNotificationService from '@supports/services/notificationmgmt-notification';
import { UserRoles } from '@supports/services/notificationmgmt-notification/const';

import {
    aliasCreatedNotificationContent,
    aliasCreatedNotificationID,
    aliasCreatedNotificationName,
} from './alias-keys/communication';
import {
    clickSendNotification,
    firstIndex,
    learnerClickOnNotificationItem,
    learnerSeesNotificationDetail,
    ReadNotificationAccountType,
    clickCreatedNotificationByIdOnTable,
} from './communication-common-definitions';
import {
    createANotificationGrpc,
    UpsertNotificationDataProps,
} from './communication-create-notification-definitions';
import { notificationItem } from './learner-keys/communication-key';
import { ByValueKey } from 'flutter-driver-x';

export type CourseDateNotification = {
    startTime: Date;
    endTime: Date;
};

export function setStartDateAndEndDateByConditionCoursesOfNotification(
    condition: CourseDuration
): CourseDateNotification {
    const currentDate = new Date();

    const result: CourseDateNotification = {
        startTime: currentDate,
        endTime: currentDate,
    };

    switch (condition) {
        case 'end date < current date':
            return {
                startTime: new Date(new Date(currentDate).setDate(currentDate.getDate() - 3)),
                endTime: new Date(new Date(currentDate).setDate(currentDate.getDate() - 1)),
            };

        case 'start date > current date': {
            const startDate = new Date(new Date(currentDate).setDate(currentDate.getDate() + 1));

            return {
                startTime: startDate,
                endTime: new Date(new Date(startDate).setDate(startDate.getDate() + 2)),
            };
        }

        case 'start date <= current date <= end date': {
            const startDate = new Date(new Date(currentDate).setDate(currentDate.getDate() - 2));
            const endDate = new Date(new Date(currentDate).setDate(currentDate.getDate() + 2));

            return {
                startTime: startDate,
                endTime: endDate,
            };
        }

        default:
            break;
    }

    return result;
}

function getTargetGroup(accountRole: ReadNotificationAccountType): string[] {
    if (accountRole === 'parent P1') return [UserRoles.USER_GROUP_PARENT];
    if (accountRole === 'student') return [UserRoles.USER_GROUP_STUDENT];

    return [UserRoles.USER_GROUP_STUDENT, UserRoles.USER_GROUP_PARENT];
}

export async function createSendNotificationByOfUserAccount(
    cms: CMSInterface,
    context: ScenarioContext,
    accountRole: ReadNotificationAccountType,
    learner: LearnerInterface,
    notificationType: string
) {
    const token = await cms.getToken();
    const learnerCourses = await learner.getCourseList();
    const learnerProfile = await learner.getProfile();

    const createNotificationParams: UpsertNotificationDataProps = {
        courseIds: [learnerCourses.courses[0].id],
        gradeIds: learnerProfile.gradeValue ? [learnerProfile.gradeValue] : [],
        targetGroup: getTargetGroup(accountRole),
        mediaIds: [],
        isAllCourses: false,
        isAllGrades: false,
        receiverIdsList: [],
    };

    const createdNotificationData = createANotificationGrpc(createNotificationParams);

    let createdNotificationID = '';

    await cms.instruction(
        `Create Notification with CourseName ${learnerCourses.courses[0].name}, Grade ${
            learnerProfile.gradeValue
        } and role ${getTargetGroup(accountRole).toString()}`,
        async () => {
            const { response: responseDraftNotification } =
                await notificationMgmtNotificationService.upsertNotification(
                    token,
                    createdNotificationData
                );

            if (!responseDraftNotification)
                await cms.attach(
                    `Cannot create notification by gRPC ${createdNotificationData.title}`
                );

            createdNotificationID = responseDraftNotification?.notificationId || '';

            context.set(aliasCreatedNotificationID, createdNotificationID);
            context.set(aliasCreatedNotificationName, createdNotificationData.title);
            context.set(
                aliasCreatedNotificationContent,
                createdNotificationData.content.contentHTML
            );
        }
    );

    if (notificationType === 'notification' && createdNotificationID) {
        await cms.attach(`Send Notification by gRPC ${createNotificationParams.title}`);
        await notificationMgmtNotificationService.sendNotification(token, createdNotificationID);
    } else {
        await cms.instruction('Reload page', async () => {
            await cms.page?.reload();
            await cms.waitingForLoadingIcon();
        });

        await cms.waitForSkeletonLoading();

        await clickCreatedNotificationByIdOnTable(cms, context);

        await cms.instruction(
            `Click send button of notificationId ${createdNotificationData.title}`,
            async function () {
                await clickSendNotification(cms);
            }
        );
    }
}

export async function verifyReceivedNotification(learner: LearnerInterface, isReceived: boolean) {
    const driver = learner.flutterDriver!;

    if (isReceived) {
        await learner.instruction(`Learner user click unread notification item`, async function () {
            await learnerClickOnNotificationItem(learner, true);
        });

        await learner.instruction(
            `Learner user see notification detail with title and content`,
            async function () {
                await learnerSeesNotificationDetail(learner);
            }
        );
    } else {
        const notificationItemFinder = new ByValueKey(notificationItem(firstIndex));
        await driver.waitForAbsent(notificationItemFinder);
    }
}
