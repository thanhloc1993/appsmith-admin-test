import { getUserProfileFromContext } from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    StatusTypes,
    createStudentWithStatus,
} from './entry-exit-add-entry-exit-record-definitions';
import {
    openStudentQrPdfInNewTab,
    PdfTypes,
} from './entry-exit-school-admin-sees-student-qrs-in-pdf-format-definitions';
import { recordStudentTableRowCheckbox } from 'test-suites/squads/adobo/common/cms-selectors/entry-exit';
import { findNewlyCreatedLearnerOnCMSStudentsPage } from 'test-suites/squads/user-management/step-definitions/user-definition-utils';

Given(
    'school admin creates a student with {string} status',
    async function (this: IMasterWorld, role: AccountRoles, status: StatusTypes) {
        const cms = this.cms;
        const scenarioContext = this.scenario;
        await cms.instruction(
            `${role} creates student with ${status} status and parent info`,
            async function () {
                await createStudentWithStatus(cms, scenarioContext, status);
            }
        );
    }
);

Given(
    'school admin selects print {string} for created student',
    async function (this: IMasterWorld, pdfType: PdfTypes): Promise<void> {
        const cms = this.cms;
        const scenario = this.scenario;

        const learnerProfile = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        await cms.instruction(
            `Find student ${learnerProfile.name} on student list`,
            async function () {
                await findNewlyCreatedLearnerOnCMSStudentsPage(cms, learnerProfile);
            }
        );

        await cms.instruction(
            `Select student ${learnerProfile.name} on student list to print ${pdfType}`,
            async function () {
                await cms.page!.click(recordStudentTableRowCheckbox(learnerProfile.id));
            }
        );
    }
);

Then(
    'school admin sees {string} display in PDF format',
    async function (this: IMasterWorld, pdfType: PdfTypes) {
        const cms = this.cms;
        await cms.instruction('open PDF', async function () {
            await openStudentQrPdfInNewTab(cms, pdfType);
        });
    }
);
