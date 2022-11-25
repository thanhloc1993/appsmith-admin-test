import {
    aLearnerAlreadyLoginSuccessInLearnerWeb,
    aLearnerAtAuthMultiScreenLearnerWeb,
    aLearnerAtHomeScreenLearnerWeb,
    fillUserNameAndPasswordLearnerWeb,
} from '@legacy-step-definitions/learner-email-login-definitions';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { AccountRoles, CMSInterface } from '@supports/app-types';
import { MasterWorld } from '@supports/master-world';

import { getLearnerInterfaceFromRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import {
    doubleDashValue,
    groupLessonReportDetailPageContainer,
    GroupLessonReportTabs,
} from 'test-suites/squads/lesson/common/cms-selectors';
import { GroupLessonReportField } from 'test-suites/squads/lesson/common/types';
import { createSampleStudentWithPackage } from 'test-suites/squads/lesson/services/student-service/student-service';
import {
    fillGroupLessonReportField,
    fillLessonReportIconSelects,
    fillLessonReportNumberFields,
    fillLessonReportTextAreas,
    fillLessonReportTextFields,
    getDivElementByLabel,
} from 'test-suites/squads/lesson/utils/lesson-report';
import {
    userAuthenticationLearnerRememberedAccount,
    userAuthenticationMultiTenant,
} from 'test-suites/squads/user-management/step-definitions/user-definition-utils';

export async function studentWithPackageLoginLearnerApp(
    masterWorld: MasterWorld,
    role: AccountRoles
) {
    const { cms, scenario } = masterWorld;
    const learner = getLearnerInterfaceFromRole(masterWorld, role);

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

    await learner.instruction('Fill username, password in login page', async function () {
        const { student } = await createSampleStudentWithPackage({
            cms,
            scenarioContext: scenario,
            studentRole: role,
        });

        await fillUserNameAndPasswordLearnerWeb({
            learner,
            username: student.name,
            password: student.password,
            isMultiTenantLogin: isEnabledMultiTenantLogin,
        });
    });

    await learner.instruction(
        'Logged in, see welcome screen and press start button',
        async function () {
            await aLearnerAlreadyLoginSuccessInLearnerWeb(learner);
        }
    );

    await learner.instruction('See home page', async function () {
        await aLearnerAtHomeScreenLearnerWeb(learner);
    });
}

export async function fulfillGroupLessonReport(cms: CMSInterface) {
    const page = cms.page!;

    await fillLessonReportTextAreas({ cms, value: 'Sample Text' });

    await page.locator(GroupLessonReportTabs.PERFORMANCE).click();
    await fillLessonReportNumberFields({ cms, value: 99 });
    await fillLessonReportIconSelects({ cms, value: 'INCOMPLETE', reportType: 'Group' });

    await page.locator(GroupLessonReportTabs.REMARK).click();
    await fillLessonReportTextFields({ cms, value: 'Sample Text' });
}

export async function userIsOnGroupLessonReportDetail(cms: CMSInterface) {
    await cms.page!.waitForSelector(groupLessonReportDetailPageContainer);
}

export async function assertGroupLessonReportFulfilled(cms: CMSInterface) {
    const page = cms.page!;

    const emptyValues = await page.locator(doubleDashValue).count();
    weExpect(emptyValues, 'Expect does not see `--` value').toEqual(0);

    await page.locator(GroupLessonReportTabs.PERFORMANCE).click();
    await cms.attach('Performance Tab');
    await page.locator(GroupLessonReportTabs.REMARK).click();
    await cms.attach('Remark Tab');
}

export async function fillGroupLessonReport(params: {
    cms: CMSInterface;
    missingFields: GroupLessonReportField[];
}) {
    const { cms, missingFields } = params;

    const groupLessonReportFields: GroupLessonReportField[] = [
        'Content',
        'Remark (Internal Only)',
        'Homework',
        'Announcement',
        'Homework Completion',
        'In-lesson Quiz',
        'Remark',
    ];

    for (const field of groupLessonReportFields) {
        if (!missingFields.includes(field)) {
            await fillGroupLessonReportField({ cms, field });
        }
    }
}

export async function assertAlertMessageBelowGroupReportField(params: {
    cms: CMSInterface;
    groupReportField: GroupLessonReportField;
}) {
    const { cms, groupReportField } = params;
    const page = cms.page!;

    const fieldLocator = getDivElementByLabel({ page, label: groupReportField });
    await fieldLocator.getByText('This field is required').waitFor();
    await cms.attach(`See alert message below ${groupReportField}`);
}
