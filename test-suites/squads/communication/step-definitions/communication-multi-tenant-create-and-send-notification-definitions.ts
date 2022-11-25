import { getRandomNumber } from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { CMSInterface, LearnerRolesWithTenant } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { ScenarioContext } from '@supports/scenario-context';

import { learnerProfileAliasWithTenant } from './alias-keys/communication';
import * as CommunicationSelectors from './cms-selectors/communication';
import {
    openComposeMessageDialog,
    selectUserTypesRadioOnDialog,
    fillTitleAndContentOnDialog,
    fillIndividualRecipientOnDialog,
    RecipientsSelectType,
    fillCoursesOnDialogWithOptions,
    fillGradesOnDialogWithOptions,
} from './communication-common-definitions';

interface RecipientsSelectTypeWithTenant extends RecipientsSelectType {
    learnerRoles?: LearnerRolesWithTenant;
}

async function selectRecipientsOnDialogWithTenant(
    cms: CMSInterface,
    context: ScenarioContext,
    recipientsSelectType: RecipientsSelectTypeWithTenant
) {
    const { course, grade, individual, studentRoles, learnerRoles } = recipientsSelectType;
    const { gradeMaster } = context.get<UserProfileEntity>(
        learnerProfileAliasWithAccountRoleSuffix(studentRoles || 'student')
    );
    if (course) {
        await fillCoursesOnDialogWithOptions(cms, context, course);
    }

    if (grade && gradeMaster) {
        await fillGradesOnDialogWithOptions(cms, { grade, gradeMasterStudent: gradeMaster?.name });
    }

    if (!individual) {
        await cms.attach('Do not select individual because value is undefined!');
        return;
    }

    await cms.instruction(`Selecting individual with type: "${individual}"`, async function () {
        await cms.waitingAutocompleteLoading(CommunicationSelectors.studentsAutocompleteInput);
        await selectIndividualRecipientOnDialogWithTenant(cms, context, learnerRoles);
    });
}

async function selectIndividualRecipientOnDialogWithTenant(
    cms: CMSInterface,
    context: ScenarioContext,
    learnerRoles?: LearnerRolesWithTenant
) {
    const { email: createdStudentEmail } = context.get<UserProfileEntity>(
        learnerProfileAliasWithTenant(learnerRoles || 'student Tenant S1')
    );

    await cms.instruction(`Select ${createdStudentEmail} on compose dialog`, async function () {
        await fillIndividualRecipientOnDialog(cms, createdStudentEmail);
        await cms.chooseOptionInAutoCompleteBoxByText(createdStudentEmail);
    });
}

export async function openAndInputNotificationDataToComposeFormWithTenant(
    cms: CMSInterface,
    context: ScenarioContext,
    learnerRoles?: LearnerRolesWithTenant
) {
    await cms.instruction('Opens compose dialog', async () => {
        await openComposeMessageDialog(cms);
    });

    await cms.instruction(
        `Selects individual, All Course and All Grade at individual recipients on the compose dialog`,
        async () => {
            if (learnerRoles) {
                await selectRecipientsOnDialogWithTenant(cms, context, {
                    course: 'All',
                    grade: 'All',
                    individual: 'Specific',
                    learnerRoles,
                });
            } else {
                await selectRecipientsOnDialogWithTenant(cms, context, {
                    course: 'All',
                    grade: 'All',
                });
            }
        }
    );

    await cms.instruction('Selects the "All" user type on the compose dialog', async () => {
        await selectUserTypesRadioOnDialog(cms, 'All');
    });

    const titleE2E = `Title's notification multi-tenant ${getRandomNumber()}`;
    const contentE2E = `Content's notification multi-tenant ${getRandomNumber()}`;

    await cms.instruction(
        `Fills the title ${titleE2E} and content ${contentE2E} of the compose dialog`,
        async () => {
            await fillTitleAndContentOnDialog(cms, context, {
                title: titleE2E,
                content: contentE2E,
            });
        }
    );
}
