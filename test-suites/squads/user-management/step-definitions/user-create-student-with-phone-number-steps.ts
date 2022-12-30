import { aliasFirstGrantedLocation } from '@legacy-step-definitions/alias-keys/architecture';
import { studentPhoneNumberAlias } from '@user-common/alias-keys/user';
import {
    formInputHomePhoneNumber,
    formInputStudentPhoneNumber,
    studentFormPhoneNumber,
} from '@user-common/cms-selectors/students-page';

import { When, Then } from '@cucumber/cucumber';

import { ContactPreference, IMasterWorld, PhoneNumberField } from '@supports/app-types';
import { UserPhoneNumber } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';
import { LocationObjectGRPC } from '@supports/types/cms-types';

import {
    assertStudentWithPhoneNumberOnCMS,
    createRandomStudentPhoneNumberData,
    InvalidPhoneNumber,
    schoolAdminCreateStudentWithPhoneNumberData,
    schoolAdminSeeErrorMessageWhenCreateStudentWithInvalidPhoneNumber,
} from './user-create-student-with-phone-number-definitions';
import { createRandomStudentData, getInvalidPhoneNumber } from './user-definition-utils';

When(
    'school admin creates a new student with {string} and preferred to {string}',
    async function (
        this: IMasterWorld,
        phoneNumberField: PhoneNumberField,
        contactPreference: ContactPreference
    ) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        const firstGrantedLocation =
            scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);
        const studentGeneralInfo = await createRandomStudentData(cms, {
            locations: [firstGrantedLocation],
        });
        const studentPhoneNumber = createRandomStudentPhoneNumberData({
            phoneNumberField,
            contactPreference,
        });

        await cms.instruction(
            'school admin create a new student with phone number',
            async function () {
                await schoolAdminCreateStudentWithPhoneNumberData({
                    cms,
                    context: scenarioContext,
                    studentGeneralInfo,
                    studentPhoneNumber,
                    isSuccess: true,
                });
            }
        );
    }
);

Then(
    'school admin sees newly created student with phone number on CMS',
    async function (this: IMasterWorld) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        await cms.instruction(`school admin goes to student management page`, async function () {
            await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
        });

        await assertStudentWithPhoneNumberOnCMS(cms, scenarioContext);
    }
);

When(
    'school admin creates a new student with {string} phone number',
    async function (this: IMasterWorld, invalidPhoneNumber: InvalidPhoneNumber) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        const firstGrantedLocation =
            scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);
        const studentGeneralInfo = await createRandomStudentData(cms, {
            locations: [firstGrantedLocation],
        });

        const studentPhoneNumber: UserPhoneNumber = getInvalidPhoneNumber(invalidPhoneNumber);

        await cms.instruction(
            'school admin create a new student with invalid phone number',
            async function () {
                await schoolAdminCreateStudentWithPhoneNumberData({
                    cms,
                    context: scenarioContext,
                    studentGeneralInfo,
                    studentPhoneNumber,
                });
            }
        );
    }
);

Then(
    'school admin can not {string} a student with {string} phone number',
    async function (
        this: IMasterWorld,
        action: 'create' | 'edit',
        invalidPhoneNumber: InvalidPhoneNumber
    ) {
        const cms = this.cms;
        const page = cms.page!;
        const context = this.scenario;

        if (['duplicate', 'incorrect length'].includes(invalidPhoneNumber)) {
            await schoolAdminSeeErrorMessageWhenCreateStudentWithInvalidPhoneNumber(
                cms,
                invalidPhoneNumber
            );
        } else {
            await cms.instruction(`school admin sees input fields have old value`, async () => {
                const phoneNumberForm = page.locator(studentFormPhoneNumber);
                const studentPhoneNumberInput = phoneNumberForm.locator(
                    formInputStudentPhoneNumber
                );
                const homePhoneNumberInput = phoneNumberForm.locator(formInputHomePhoneNumber);

                const studentPhoneNumberValue = await studentPhoneNumberInput.inputValue();
                const homePhoneNumberValue = await homePhoneNumberInput.inputValue();

                const userPhoneNumber = context.get<UserPhoneNumber>(studentPhoneNumberAlias);

                weExpect(studentPhoneNumberValue).toBe(
                    action === 'edit' ? userPhoneNumber.studentPhoneNumber : ''
                );
                weExpect(homePhoneNumberValue).toBe(
                    action === 'edit' ? userPhoneNumber.homePhoneNumber : ''
                );
            });
        }
    }
);
