import { FindStatusStudentTypes } from '@legacy-step-definitions/types/content';
import { MessageTypes } from '@user-common/types/bdd';
import { ConditionStatusTypes } from '@user-common/types/bdd';
import { schoolAdminScreenShotMultipleSnackbar } from '@user-common/utils/check-messages';

import { Given, Then, When } from '@cucumber/cucumber';

import { applyOrgForLocationSetting } from './user-definition-utils';
import {
    UserImportTemplate,
    FirstConditionCreateCSVImportStudent,
    schoolAdminGoesToImportStudents,
    schoolAdminGoesToImportParents,
    SecondConditionCreateCSVImportStudent,
    schoolAdminCreateCSVImportStudent,
    schoolAdminCreateCSVImportParent,
    schoolAdminSeesOrNotNewStudent,
    schoolAdminReissuesPasswordWithoutStudentId,
    ImportedInvalidField,
    ImportedValidField,
    MissingField,
    InValidRowType,
    ActionHeaderImportTypes,
    schoolAdminAddImportedParentIntoNewStudent,
    schoolAdminSeesNewImportedParentDataCorrectly,
    schoolAdminReissuesImportParentPassword,
    schoolAdminCanNotAddImportedParentIntoNewStudent,
    schoolAdminCheckImportedParentIntoNewStudent,
} from './user-import-students-successfully-definitions';

Given(
    'school admin has created a {string} file with {string} and {string}',
    async function (
        this,
        userImportTemplate: UserImportTemplate,
        firstCondition: FirstConditionCreateCSVImportStudent,
        secondCondition: SecondConditionCreateCSVImportStudent
    ) {
        let inValidRow: InValidRowType = 0;
        let inValidField: ImportedInvalidField;
        let validFields: ImportedValidField;
        let missingField: MissingField;
        let actionHeader: ActionHeaderImportTypes;

        if (secondCondition.includes('invalid on row')) {
            const lastItem = secondCondition.split(' ').pop() || '0';
            inValidRow = parseInt(lastItem);
            const checkNaN = isNaN(inValidRow);
            if (checkNaN) inValidRow = JSON.parse(lastItem);
        }

        if (firstCondition.includes('invalid field')) {
            inValidField = firstCondition.split(' ').slice(2).join(' ') as ImportedInvalidField;
        }

        if (firstCondition.includes('valid fields')) {
            validFields = firstCondition.split(' ').slice(2).join(' ') as ImportedValidField;
        }

        if (firstCondition.includes('missing field')) {
            missingField = firstCondition.split(' ').slice(2).join(' ') as MissingField;
        }

        if (firstCondition.includes('header')) {
            actionHeader = firstCondition
                .split(' ')
                .slice(0, 1)
                .join(' ') as ActionHeaderImportTypes;
        }

        switch (userImportTemplate) {
            case 'student template csv':
                await schoolAdminCreateCSVImportStudent(
                    this.cms,
                    this.scenario,
                    firstCondition,
                    inValidRow,
                    inValidField,
                    validFields,
                    missingField,
                    actionHeader
                );
                break;
            case 'parent template csv':
                await schoolAdminCreateCSVImportParent(
                    this.cms,
                    this.scenario,
                    firstCondition,
                    inValidRow,
                    inValidField,
                    validFields,
                    missingField,
                    actionHeader
                );
                break;
            default:
                break;
        }
    }
);

When(
    'school admin imports the {string} file',
    async function (this, userImportTemplate: UserImportTemplate) {
        switch (userImportTemplate) {
            case 'student template csv':
                await schoolAdminGoesToImportStudents(this.cms);
                break;
            case 'parent template csv':
                await schoolAdminGoesToImportParents(this.cms);
                break;
            default:
                break;
        }
    }
);

Then(
    'school admin sees a {string} message contained {string} on the snackbar',
    async function (typeMessage: MessageTypes, content: string) {
        await schoolAdminScreenShotMultipleSnackbar(this.cms, typeMessage, content);
    }
);

Then(
    'school admin {string} new imported students on the Student Management',
    async function (statusStudent: FindStatusStudentTypes) {
        //TODO: Temporarily apply org for location setting to see all st
        await applyOrgForLocationSetting(this.cms);
        await schoolAdminSeesOrNotNewStudent(this.cms, statusStudent);
    }
);

Then('school admin reissues a random imported student password', async function () {
    await schoolAdminReissuesPasswordWithoutStudentId(this.cms, this.scenario);
});

Then('school admin adds a new random imported parent into a new student', async function () {
    await schoolAdminAddImportedParentIntoNewStudent(this.cms, this.scenario);
});

Then('school admin sees the new imported parent with correct data', async function () {
    await schoolAdminSeesNewImportedParentDataCorrectly(this.cms, this.scenario);
});

Then('school admin reissues the random imported parent password', async function () {
    await schoolAdminReissuesImportParentPassword(this.cms);
});

Then('school admin cannot add a new random imported parent into a new student', async function () {
    await schoolAdminCanNotAddImportedParentIntoNewStudent(this.cms);
});

Then(
    'school admin {string} new imported parents into a new student',
    async function (status: ConditionStatusTypes) {
        await schoolAdminCheckImportedParentIntoNewStudent(this.cms, status);
    }
);
