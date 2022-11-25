import { LearnerKeys } from '@common/learner-key';
import { optionsButton } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { EditedParentInformation } from '@legacy-step-definitions/types/content';
import { getRandomNumber } from '@legacy-step-definitions/utils';
import { editedParentProfilesAlias } from '@user-common/alias-keys/user';
import { buttonEdit, buttonRemove } from '@user-common/cms-selectors/student';
import {
    dialogWithHeaderFooterWrapper,
    studentTableParent,
    tableBaseRowWithId,
    upsertParentRelationship,
    upsertParentEmail,
    studentParentItem,
} from '@user-common/cms-selectors/students-page';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { CMSInterface, LearnerInterface, ScenarioContextInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { CreateStudentResponseEntity } from '@supports/services/usermgmt-student-service/entities/create-student-response';

import {
    clickOnSaveButtonInParentElement,
    createARandomStudentGRPC,
} from './user-create-student-definitions';
import { userAuthenticationLearnerRememberedAccount } from './user-definition-utils';
import { fail, ok } from 'assert';
import { ByValueKey } from 'flutter-driver-x';

export type EmailType =
    | 'blank'
    | 'invalid format'
    | 'current student email'
    | 'existed student email on system'
    | 'existed parent out of the parent list'
    | 'existed parent in the parent list'
    | 'default';

export async function seesUpdatedParentListInDetailStudentPage(
    cms: CMSInterface,
    parent: UserProfileEntity
) {
    const table = await cms.page?.waitForSelector(studentTableParent);
    const parentRow = await table!.$(tableBaseRowWithId(parent.email));

    if (!parentRow) {
        ok(parent.name, 'This parent is deleted');
    } else {
        fail('This parent is not deleted');
    }
}

export async function checkStudentDoesNotExistedInStatsPage(
    learner: LearnerInterface,
    student: UserProfileEntity
) {
    const driver = learner.flutterDriver!;

    await learner.instruction('Click switch button', async function () {
        const appBarProfileFinder = new ByValueKey(LearnerKeys.app_bar_profile);
        await driver.tap(appBarProfileFinder);

        const switchChildrenButton = new ByValueKey(LearnerKeys.switchStudentsButton);
        await driver.tap(switchChildrenButton);
    });

    await learner.instruction(
        `Verify student ${student.name} is not on the list`,
        async function () {
            const user = new ByValueKey(LearnerKeys.user(student.email));

            await driver.waitForAbsent(user);
        }
    );
}

export async function updateParentInfo(
    cms: CMSInterface,
    scenario: ScenarioContextInterface,
    parentProfile: UserProfileEntity
) {
    const page = cms.page!;
    const relationshipList = [
        'Mother',
        'Father',
        'Grandfather',
        'Grandmother',
        'Uncle',
        'Aunt',
        'Other',
    ];

    const newParentEmail = parentProfile.email.replace('@manabie.com', '_edit@manabie.com');

    const relationshipSelector = await page!.$(upsertParentRelationship);
    const parentRelationship = await relationshipSelector!.textContent();

    const newRelationshipList = relationshipList.filter((item) => item !== parentRelationship)[0];

    await cms.instruction('Select another relationship', async function () {
        const relationshipField = await page.waitForSelector(upsertParentRelationship);
        await relationshipField.click();

        await cms.chooseOptionInAutoCompleteBoxByText(newRelationshipList);
    });

    await cms.instruction(`Fill new parent email: ${newParentEmail}`, async function () {
        const parentFormEmail = await page.waitForSelector(upsertParentEmail);

        await parentFormEmail.fill(newParentEmail);
    });

    const newParentInfo: EditedParentInformation = {
        id: parentProfile.id,
        relationship: newRelationshipList,
        email: newParentEmail,
    };

    scenario.context.set(editedParentProfilesAlias, newParentInfo);
}

export async function assertEditedParentInformationInDetailPage(
    cms: CMSInterface,
    parentInfo: EditedParentInformation
) {
    await cms.instruction('Assert the parent info has on UI ', async function () {
        await cms.waitForSelectorWithText('p', parentInfo.relationship);
        await cms.assertTypographyWithTooltip('p', parentInfo.email);
    });
}

export async function refreshLearnerPage(learner: LearnerInterface) {
    const origin = await learner.flutterDriver?.webDriver?.getUrlOrigin();
    await learner.flutterDriver?.webDriver?.page.goto(origin!);

    const isEnabledRemoveRememberedAccount = await featureFlagsHelper.isEnabled(
        userAuthenticationLearnerRememberedAccount
    );

    let key: string;

    if (isEnabledRemoveRememberedAccount) {
        key = LearnerKeys.authSignInScreen;
    } else {
        key = LearnerKeys.authMultiUsersScreen;
    }

    await learner.flutterDriver!.waitFor(new ByValueKey(key), 10000);
}

export async function editParentEmail(
    cms: CMSInterface,
    emailType: EmailType,
    studentProfiles: UserProfileEntity,
    parentProfiles: UserProfileEntity[],
    parentEmailExisted: string
) {
    await openDialogEditParentOnCMS(cms, parentProfiles[0]);

    await fillParentEmailWithType(cms, {
        studentEmailExisted: studentProfiles.email,
        parentEmailExisted: parentEmailExisted || '',
        selectorInputParentEmail: upsertParentEmail,
        emailType,
    });

    await cms.instruction(`Click on save button`, async function () {
        const addParentDialog = await cms.page?.$(dialogWithHeaderFooterWrapper);

        await clickOnSaveButtonInParentElement(cms, addParentDialog);
        await cms.waitingForLoadingIcon();
    });
}

async function fillParentEmailWithType(
    cms: CMSInterface,
    options: {
        studentEmailExisted: UserProfileEntity['email'];
        parentEmailExisted: UserProfileEntity['email'];
        emailType: EmailType;
        selectorInputParentEmail: string;
    }
) {
    const { studentEmailExisted, parentEmailExisted, emailType, selectorInputParentEmail } =
        options;

    const page = cms.page!;

    await cms.instruction(`Fill new email (${emailType}) of parent`, async () => {
        const parentFormEmail = await page.waitForSelector(selectorInputParentEmail);

        let newStudentAndParent: CreateStudentResponseEntity;

        let newParentEmail = '';
        switch (emailType) {
            case 'blank':
                break;
            case 'invalid format':
                newParentEmail = getRandomNumber().toString();
                break;
            case 'current student email':
                newParentEmail = studentEmailExisted;
                break;
            case 'existed student email on system':
                newStudentAndParent = await createARandomStudentGRPC(cms, {
                    parentLength: 0,
                    studentPackageProfileLength: 0,
                });
                newParentEmail = newStudentAndParent.student.email;
                break;
            case 'existed parent out of the parent list':
                newStudentAndParent = await createARandomStudentGRPC(cms, {});
                newParentEmail = newStudentAndParent.parents[0].email;
                break;
            case 'existed parent in the parent list':
                newParentEmail = parentEmailExisted;
                break;
            default:
                break;
        }

        await parentFormEmail.fill(newParentEmail);
    });
}

export async function assertErrorMessageInEditPage(cms: CMSInterface, emailType: EmailType) {
    switch (emailType) {
        case 'blank':
            await cms.assertTypographyWithTooltip('p', 'This field is required');
            break;
        case 'invalid format':
            await cms.assertTypographyWithTooltip('p', 'Email address is not valid');
            break;
        case 'current student email':
            await cms.assertTypographyWithTooltip('p', 'Email address already exists');
            break;
        case 'existed student email on system':
            await cms.assertTypographyWithTooltip('p', 'Email address already exists');
            break;
        case 'existed parent out of the parent list':
            await cms.assertTypographyWithTooltip('p', 'Email address already exists');
            break;
        case 'existed parent in the parent list':
            await cms.assertTypographyWithTooltip(
                'p',
                'Email address has already been inserted for a parent in the list'
            );
            break;
        default:
            break;
    }
}

export async function checkStudentExistedInStatsPage(
    learner: LearnerInterface,
    student: UserProfileEntity
) {
    const driver = learner.flutterDriver!;

    await learner.instruction('Click switch button', async function () {
        const switchChildrenButton = new ByValueKey(LearnerKeys.switchChildrenButton);
        await driver.tap(switchChildrenButton);
    });

    await learner.instruction(`Verify student ${student.name} is on the list`, async function () {
        const user = new ByValueKey(LearnerKeys.user(student.email));

        await driver.waitFor(user);
    });
}

export async function openDialogEditParentOnCMS(
    cms: CMSInterface,
    parentProfile: UserProfileEntity
) {
    const page = cms.page!;

    await cms.instruction('Click Parent options button', async () => {
        const parentItem = await page.waitForSelector(
            `${studentParentItem}:has-text("${parentProfile.email}")`
        );
        const optionsBtn = await parentItem.waitForSelector(optionsButton);
        await optionsBtn.click();
    });

    await cms.instruction(`Click Edit Parent button`, async () => {
        await page.click(buttonEdit, { delay: 1000 });
        await cms.waitForSkeletonLoading();
    });
}

export async function removeParentFromStudent(cms: CMSInterface, parentProfile: UserProfileEntity) {
    const page = cms.page!;

    await cms.instruction('Click Parent options button', async () => {
        const parentItem = await page.waitForSelector(
            `${studentParentItem}:has-text("${parentProfile.email}")`
        );
        const optionsBtn = await parentItem.waitForSelector(optionsButton);
        await optionsBtn.click();
    });

    await cms.instruction('Click delete parent', async function () {
        await page.click(buttonRemove, { delay: 1000 });
        await cms.waitForSkeletonLoading();
    });

    await cms.instruction('Click Confirm button', async function () {
        await cms.confirmDialogAction();
    });
}
