import {
    loginLearnerAccountFailed,
    fillEmailAndPassword,
    aLearnerAlreadyLoginSuccessInLearnerWeb,
} from '@legacy-step-definitions/learner-email-login-definitions';
import { getRandomNumber } from '@legacy-step-definitions/utils';
import {
    currentTypeErrorAlias,
    learnerProfileAlias,
    newStudentEmailAlias,
} from '@user-common/alias-keys/user';
import { formInputEmail, textFieldEmailRoot } from '@user-common/cms-selectors/students-page';

import { Given, Then, When } from '@cucumber/cucumber';

import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import { schoolAdminGoesToStudentDetailAndEdit } from './user-definition-utils';
import {
    createStudentAndFillStudentEmail,
    createNewParentAndFillStudentEmail,
    schoolAdminFillsEmailWithValidData,
} from './user-edit-student-email-definitions';

enum EmailValues {
    BLANK = 'blank',
    INVALID_EMAIL = 'invalid email format',
    EXISTING_STUDENT_EMAIL = 'existing student email',
    EXISTING_PARENT_EMAIL_IN_SYSTEM = 'existing parent email in system',
}

export enum ErrorsEmailMessage {
    REQUIRED = 'This field is required',
    INVALID = 'Email address is not valid',
    INSERTED_IN_LIST = 'Email address has already been inserted for a parent in the list',
    EXISTS_ON_SYSTEM = 'Email address already exists',
}

// Scenario: School admin edits student email with invalid data
When(
    'school admin edits student email to {string}',
    async function (this, emailValues: EmailValues) {
        const cms = this.cms;

        const scenarioContext = this.scenario;

        const learnerProfile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);

        await schoolAdminGoesToStudentDetailAndEdit(cms, learnerProfile);

        await cms.instruction(
            `School admin fills "${emailValues}" value on input email student`,
            async function () {
                scenarioContext.set(currentTypeErrorAlias, emailValues);

                switch (emailValues) {
                    case EmailValues.BLANK:
                        await cms.page?.fill(formInputEmail, '');
                        break;
                    case EmailValues.INVALID_EMAIL:
                        await cms.page?.fill(formInputEmail, 'email');
                        break;
                    case EmailValues.EXISTING_STUDENT_EMAIL:
                        await createStudentAndFillStudentEmail(cms);
                        break;

                    case EmailValues.EXISTING_PARENT_EMAIL_IN_SYSTEM:
                        await createNewParentAndFillStudentEmail(cms);
                        break;
                }
            }
        );
    }
);

Then('school admin sees an error message', async function (this) {
    const cms = this.cms;

    const scenarioContext = this.scenario;

    const emailValue = scenarioContext.get(currentTypeErrorAlias);

    await cms.selectAButtonByAriaLabel('Save');

    await cms.instruction(
        `School admin sees an error for ${emailValue} message email`,
        async function (cms) {
            const rootEmail = await cms.page?.waitForSelector(textFieldEmailRoot);
            const elementError = await rootEmail?.waitForSelector('p');
            const textContentError = await elementError?.textContent();
            switch (emailValue) {
                case EmailValues.BLANK:
                    weExpect(textContentError).toBe(ErrorsEmailMessage.REQUIRED);
                    break;
                case EmailValues.INVALID_EMAIL:
                    weExpect(textContentError).toBe(ErrorsEmailMessage.INVALID);
                    break;
                case EmailValues.EXISTING_STUDENT_EMAIL:
                    weExpect(textContentError).toBe(ErrorsEmailMessage.EXISTS_ON_SYSTEM);
                    break;

                case EmailValues.EXISTING_PARENT_EMAIL_IN_SYSTEM:
                    weExpect(textContentError).toBe(ErrorsEmailMessage.EXISTS_ON_SYSTEM);
                    break;
            }
        }
    );
});

//Scenario: School admin cancels edit student email
Given('school admin is on Edit student screen', async function (this) {
    const cms = this.cms;

    const scenarioContext = this.scenario;

    const learnerProfile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);

    await schoolAdminGoesToStudentDetailAndEdit(cms, learnerProfile, true);
});

Given('school admin changes student email', async function (this) {
    const cms = this.cms;

    await cms.instruction(
        'School admin changes student email with valid data',
        async function (cms) {
            const studentEmail = `e2e-student.${getRandomNumber()}@manabie.com`;

            await cms.page?.fill(formInputEmail, studentEmail);
        }
    );
});

When('school admin cancels to edit student', async function (this) {
    const cms = this.cms;

    await cms.selectAButtonByAriaLabel('Cancel');

    await cms.selectAButtonByAriaLabel('Leave');
});

Then('school admin sees nothing changed', async function (this) {
    const cms = this.cms;

    const scenarioContext = this.scenario;

    const learner = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);
    await cms.instruction('School admin sees nothing changed', async function (cms) {
        await cms.page?.waitForSelector(`text="${learner.email}"`);
    });
});

// Scenario: School admin edits student email with valid data
When('school admin edits student email with valid data', async function (this) {
    const cms = this.cms;

    const scenarioContext = this.scenario;

    const learnerProfile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);

    await schoolAdminGoesToStudentDetailAndEdit(cms, learnerProfile);

    await schoolAdminFillsEmailWithValidData(cms, scenarioContext);

    await cms.selectAButtonByAriaLabel('Save');
});

Then('school admin sees student email is updated', async function (this) {
    const cms = this.cms;
    const scenarioContext = this.scenario;

    await cms.instruction('School admin sees student email is updated', async function (cms) {
        const studentEmail = scenarioContext.get(newStudentEmailAlias);

        await cms.page?.waitForSelector(`text="${studentEmail}"`);
    });
});

Then('student cannot log in Learner App with old email', async function (this) {
    const learner = this.parent!;
    const learnerProfile = this.scenario.get<UserProfileEntity>(learnerProfileAlias);

    const { email, password } = learnerProfile;

    await learner.instruction('Student logins in Learner App with old email', async function () {
        await loginLearnerAccountFailed({ learner, email, password });
    });
});
Then('student logins Learner App with new email successfully', async function (this) {
    const learner = this.parent!;

    const scenarioContext = this.scenario;

    const learnerProfile = this.scenario.get<UserProfileEntity>(learnerProfileAlias);

    const { password, name } = learnerProfile;

    const newStudentEmail = scenarioContext.get(newStudentEmailAlias);

    await learner.instruction('Student logins in Learner App with new email', async function () {
        await fillEmailAndPassword(learner, newStudentEmail, password);
    });

    await learner.instruction(`Verify name: ${name} on Learner App`, async function () {
        await aLearnerAlreadyLoginSuccessInLearnerWeb(learner);
    });
});

// Scenario: School admin edits student email and associates with new parent
When('school admin edits student email with new parent', async function (this) {
    const cms = this.cms;

    const scenarioContext = this.scenario;

    const learnerProfile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);

    await schoolAdminGoesToStudentDetailAndEdit(cms, learnerProfile);

    await schoolAdminFillsEmailWithValidData(cms, scenarioContext);

    await cms.selectAButtonByAriaLabel('Save');
});
