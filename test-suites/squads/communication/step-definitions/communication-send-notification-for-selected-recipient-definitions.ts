import {
    fillUserNameAndPasswordLearnerWeb,
    aLearnerAtAuthMultiScreenLearnerWeb,
    aLearnerAlreadyLoginSuccessInLearnerWeb,
    aLearnerAtHomeScreenLearnerWeb,
} from '@legacy-step-definitions/learner-email-login-definitions';
import {
    getUserProfilesFromContext,
    getUserProfileFromContext,
    isCombinationWithAnd,
    splitAndCombinationIntoArray,
} from '@legacy-step-definitions/utils';
import {
    learnerProfileAliasWithAccountRoleSuffix,
    parentProfilesAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { AccountRoles, CMSInterface, LearnerInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { ScenarioContext } from '@supports/scenario-context';
import notificationMgmtNotificationService from '@supports/services/notificationmgmt-notification';
import { UserRoles } from '@supports/services/notificationmgmt-notification/const';

import {
    aliasCreatedNotificationID,
    aliasCreatedNotificationName,
} from './alias-keys/communication';
import {
    learnerClickOnNotificationIcon,
    learnerClickOnNotificationItem,
    learnerCloseNotificationDetail,
    learnerSeesNotificationDetail,
    passValuesInAssertNotificationRowOnTableById,
    UserGroupType,
} from './communication-common-definitions';
import { createANotificationGrpc } from './communication-create-notification-definitions';
import {
    userAuthenticationLearnerRememberedAccount,
    userAuthenticationMultiTenant,
} from 'test-suites/squads/user-management/step-definitions/user-definition-utils';

export async function fillAccountInformationToLoginLearnerApp(
    scenarioContext: ScenarioContext,
    learner: LearnerInterface,
    account: AccountRoles
) {
    let user = getUserProfileFromContext(
        scenarioContext,
        learnerProfileAliasWithAccountRoleSuffix(account)
    );

    switch (account) {
        case 'parent P1': {
            // Get profile of account parent P1 from student S1
            user = getUserProfilesFromContext(
                scenarioContext,
                parentProfilesAliasWithAccountRoleSuffix('student S1')
            )[0];
            break;
        }
        case 'parent P2': {
            // Get profile of account parent P2 from student S1
            user = getUserProfilesFromContext(
                scenarioContext,
                parentProfilesAliasWithAccountRoleSuffix('student S1')
            )[1];
            break;
        }
        case 'parent P3': {
            // Get profile of account parent P3 from student S2
            user = getUserProfilesFromContext(
                scenarioContext,
                parentProfilesAliasWithAccountRoleSuffix('student S2')
            )[0];
            break;
        }
    }

    await fillUserNameAndPasswordLearnerWeb({
        learner,
        username: user.email,
        password: user.password,
    });
}

export async function logInLearnerAppWithAccount(
    learner: LearnerInterface,
    scenario: ScenarioContext,
    account: AccountRoles
) {
    const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
        userAuthenticationMultiTenant
    );
    const isEnabledRemoveRememberedAccount = await featureFlagsHelper.isEnabled(
        userAuthenticationLearnerRememberedAccount
    );

    if (!isEnabledMultiTenantLogin && !isEnabledRemoveRememberedAccount) {
        await learner.instruction('User not login yet, show auth multi screen', async function () {
            await aLearnerAtAuthMultiScreenLearnerWeb(learner);
        });
    }

    await learner.instruction(
        `Fill ${account} account information to login Learner app`,
        async function () {
            await fillAccountInformationToLoginLearnerApp(scenario, learner, account);
        }
    );

    await learner.instruction(
        `Verify ${account} is at HomeScreen after login successfully`,
        async function () {
            await aLearnerAlreadyLoginSuccessInLearnerWeb(learner);
        }
    );

    await learner.instruction(`${account} sees home page`, async function () {
        await aLearnerAtHomeScreenLearnerWeb(learner);
    });
}

export async function clickUnreadNotification(learner: LearnerInterface) {
    await learner.instruction(`Learner user click notification bell icon`, async function () {
        await learnerClickOnNotificationIcon(learner);
    });

    await learner.instruction(`Learner user click unread notification item`, async function () {
        await learnerClickOnNotificationItem(learner, true);
    });

    await learner.instruction(
        `Learner user see notification detail with title and content`,
        async function () {
            await learnerSeesNotificationDetail(learner);
        }
    );

    await learner.instruction(`Learner user close notification detail`, async function () {
        await learnerCloseNotificationDetail(learner);
    });
}

export async function logOutLearnerAndReloadCMS(cms: CMSInterface, learner: LearnerInterface) {
    await learner.instruction('Log out of learner app and refresh cms', async function () {
        await learner.logout();
    });

    await cms.instruction('Reload CMS and wait for data loaded', async function () {
        await cms.page?.reload();
        await cms.waitingForLoadingIcon();
        await cms.waitForSkeletonLoading();
    });
}

export async function readNotificationAndLogoutByAccount(
    cms: CMSInterface,
    learner: LearnerInterface,
    scenario: ScenarioContext,
    account: AccountRoles
) {
    await learner.instruction(`${account} starts to login`, async function () {
        await logInLearnerAppWithAccount(learner, scenario, account);
    });

    await learner.instruction(`${account} read notification`, async function () {
        await clickUnreadNotification(learner);
    });

    await learner.instruction(`Log out of account ${account}`, async function () {
        await logOutLearnerAndReloadCMS(cms, learner);
    });
}

export async function recipientReadNotification(
    cms: CMSInterface,
    learner: LearnerInterface,
    scenario: ScenarioContext,
    accountRole: AccountRoles | AccountRoles[]
) {
    if (typeof accountRole === 'string') {
        // AccountRoles type
        await readNotificationAndLogoutByAccount(cms, learner, scenario, accountRole);
    }

    if (typeof accountRole === 'object') {
        // AccountRoles[] type
        for (const singleAccount of accountRole) {
            await readNotificationAndLogoutByAccount(cms, learner, scenario, singleAccount);
        }
    }
}

export async function checkStudentShouldReadNotification(
    cms: CMSInterface,
    student: LearnerInterface,
    scenario: ScenarioContext,
    studentAccount: AccountRoles,
    type: UserGroupType
) {
    if (['All', 'Student'].includes(type)) {
        await recipientReadNotification(cms, student, scenario, studentAccount);
    }
}

export async function checkParentShouldReadNotification(
    cms: CMSInterface,
    parent: LearnerInterface,
    scenario: ScenarioContext,
    studentAccount: AccountRoles,
    type: UserGroupType
) {
    if (['All', 'Parent'].includes(type)) {
        let parentSuffix: AccountRoles | AccountRoles[] = 'parent P3';

        if (studentAccount === 'student S1') parentSuffix = ['parent P1', 'parent P2'];

        await recipientReadNotification(cms, parent, scenario, parentSuffix);
    }
}

export async function sendNotificationToRecipientUsingGRPC(
    cms: CMSInterface,
    scenario: ScenarioContext,
    receiverIdsList: string[] = [],
    targetGroup: string[] = []
) {
    const token = await cms.getToken();

    const createdNotificationData = createANotificationGrpc({
        courseIds: [],
        gradeIds: [],
        mediaIds: [],
        isAllCourses: false,
        isAllGrades: false,
        targetGroup,
        receiverIdsList,
    });

    const { response } = await notificationMgmtNotificationService.upsertNotification(
        token,
        createdNotificationData
    );

    if (response) {
        await notificationMgmtNotificationService.sendNotification(token, response.notificationId);
        scenario.set(aliasCreatedNotificationID, response.notificationId);
        scenario.set(aliasCreatedNotificationName, createdNotificationData.title);
    }
}

export function getParentLengthOfStudentByType(type: UserGroupType, account: AccountRoles) {
    if (['Parent', 'All'].includes(type)) {
        if (account === 'student S1') return 2; // 2 parents
        if (account === 'student S2') return 1; // 1 parent
    }

    return 0;
}

export async function checkRecipientRoleShouldReadNotification(
    cms: CMSInterface,
    student: LearnerInterface,
    parent: LearnerInterface,
    scenario: ScenarioContext,
    account: AccountRoles,
    type: UserGroupType
) {
    await student.instruction(
        `Check if student ${account} should read notification by type ${type}`,
        async function () {
            await checkStudentShouldReadNotification(cms, student, scenario, account, type);
        }
    );

    await student.instruction(
        `Check if parent of student account ${account} should read notification by type ${type}`,
        async function () {
            await checkParentShouldReadNotification(cms, parent, scenario, account, type);
        }
    );
}

export function getTargetGroupFromType(type: UserGroupType) {
    switch (type) {
        case 'Student':
            return [UserRoles.USER_GROUP_STUDENT];

        case 'Parent':
            return [UserRoles.USER_GROUP_PARENT];

        default:
            return [UserRoles.USER_GROUP_STUDENT, UserRoles.USER_GROUP_PARENT];
    }
}

export async function sendAndReceiveNotification(
    cms: CMSInterface,
    student: LearnerInterface,
    parent: LearnerInterface,
    scenario: ScenarioContext,
    type: UserGroupType,
    studentAccount: string
) {
    let receiverIdsList: string[] = [];
    const targetGroup = getTargetGroupFromType(type);

    if (isCombinationWithAnd(studentAccount)) {
        const accounts = splitAndCombinationIntoArray(studentAccount);

        receiverIdsList = accounts.map((account) => {
            const studentProfile = scenario.get<UserProfileEntity>(
                learnerProfileAliasWithAccountRoleSuffix(account as AccountRoles)
            );

            return studentProfile.id;
        });

        await cms.instruction(`Create and Send Notification by gRPC`, async function () {
            await sendNotificationToRecipientUsingGRPC(cms, scenario, receiverIdsList, targetGroup);
            await cms.page?.reload();
            await cms.waitingForLoadingIcon();
            await cms.waitForSkeletonLoading();
        });

        for (const account of accounts) {
            weExpect(['student S1', 'student S2']).toContain(account);

            await checkRecipientRoleShouldReadNotification(
                cms,
                student,
                parent,
                scenario,
                account as AccountRoles,
                type
            );
        }
    } else {
        const studentProfile = scenario.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix(studentAccount as AccountRoles)
        );
        receiverIdsList = [studentProfile.id];

        await cms.instruction(`Create and Send Notification by gRPC`, async () => {
            await sendNotificationToRecipientUsingGRPC(cms, scenario, receiverIdsList, targetGroup);
            await cms.page?.reload();
            await cms.waitingForLoadingIcon();
            await cms.waitForSkeletonLoading();
        });

        await checkRecipientRoleShouldReadNotification(
            cms,
            student,
            parent,
            scenario,
            studentAccount as AccountRoles,
            type
        );
    }

    await passValuesInAssertNotificationRowOnTableById(cms, scenario);
}
