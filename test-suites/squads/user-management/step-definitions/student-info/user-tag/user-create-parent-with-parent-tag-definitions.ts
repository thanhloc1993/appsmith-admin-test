import { userTagAliasWithSuffix } from '@user-common/alias-keys/user';
import { parentProfilesAlias } from '@user-common/alias-keys/user';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { ParentTagAction, UserTag } from './type';
import { schoolAdminAddTags } from 'test-suites/squads/user-management/step-definitions/student-info/user-tag/user-create-student-with-student-tag-definitions';
import {
    schoolAdminCreateStudent,
    schoolAdminCreatingParent,
} from 'test-suites/squads/user-management/step-definitions/user-common-definitions';
import { clickOnSaveButtonInParentElement } from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';

export async function schoolAdminCreateStudentAndParentWithTags(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    parentTagAction: ParentTagAction
) {
    const page = cms.page!;
    await schoolAdminCreateStudent(cms, scenarioContext);

    const parentInfo = await schoolAdminCreatingParent(cms);

    const parentTags = await schoolAdminAddParentTags(cms, scenarioContext, parentTagAction);

    scenarioContext.set(parentProfilesAlias, {
        ...parentInfo,
        parentTags,
    });

    await cms.instruction(`Click on save button`, async function () {
        const addParentDialog = await page.$(studentPageSelectors.dialogWithHeaderFooterWrapper);

        await clickOnSaveButtonInParentElement(cms, addParentDialog);
        await cms.waitingForLoadingIcon();
    });

    await cms.instruction('school admins closes parent info dialog', async function () {
        const dialogStudentAccountInfo = await page.locator(
            studentPageSelectors.dialogWithHeaderFooterWrapper
        );
        const closeButton = dialogStudentAccountInfo.locator(
            studentPageSelectors.dialogStudentAccountInfoFooterButtonClose
        );
        await closeButton.click();
    });

    await Promise.all([
        cms.waitForHasuraResponse('User_GetUsersTagsByIds'),
        cms.waitForSkeletonLoading(),
    ]);
}

export async function schoolAdminAddParentTags(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    parentTagAction: ParentTagAction
) {
    const parentTags = scenarioContext.get<UserTag[]>(userTagAliasWithSuffix('parent tag'));
    const parentDiscountTags = scenarioContext.get<UserTag[]>(
        userTagAliasWithSuffix('parent discount tag')
    );

    switch (parentTagAction) {
        case 'single parent tag':
            return await schoolAdminAddTags(cms, [parentTags[0]]);
        case 'single parent discount tag':
            return await schoolAdminAddTags(cms, [parentDiscountTags[0]]);
        case 'both parent tag and parent discount tag':
            return await schoolAdminAddTags(cms, [
                ...parentTags.slice(0, 2),
                ...parentDiscountTags.slice(0, 2),
            ]);
    }
}
