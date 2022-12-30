import { aliasFirstGrantedLocation } from '@legacy-step-definitions/alias-keys/architecture';
import { learnerProfileAlias, studentPhoneNumberAlias } from '@user-common/alias-keys/user';

import { When, Then, Given } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { Menu } from '@supports/enum';
import { LocationObjectGRPC } from '@supports/types/cms-types';

import { createAStudentPromise } from './user-create-student-definitions';
import {
    assertStudentWithPhoneNumberOnCMS,
    createRandomStudentPhoneNumberData,
    InvalidPhoneNumber,
    ValidPhoneNumber,
} from './user-create-student-with-phone-number-definitions';
import { schoolAdminEditStudentPhoneNumber } from './user-edit-student-with-phone-number-definitions';
import { StudentContactPreference } from 'manabuf/usermgmt/v2/users_pb';

Given(
    'school admin creates a new student with student phone number',
    async function (this: IMasterWorld) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        // create student_phone_number and home_phone_number and prefered to student phone number
        const studentPhoneNumber = createRandomStudentPhoneNumberData({});

        const firstGrantedLocation =
            scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);

        const studentProfile = await createAStudentPromise(cms, {
            studentPhoneNumber: {
                phoneNumber: studentPhoneNumber.studentPhoneNumber || '',
                homePhoneNumber: studentPhoneNumber.homePhoneNumber || '',
                contactPreference: StudentContactPreference['STUDENT_PHONE_NUMBER'],
            },
            locations: [firstGrantedLocation],
        });
        scenarioContext.set(learnerProfileAlias, studentProfile);
        scenarioContext.set(studentPhoneNumberAlias, studentPhoneNumber);
    }
);

When(
    'school admin edits phone number to {string}',
    async function (this: IMasterWorld, phoneNumberValue: ValidPhoneNumber | InvalidPhoneNumber) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        await cms.instruction(`school admin edit student phone number`, async function () {
            await schoolAdminEditStudentPhoneNumber({
                cms,
                scenarioContext,
                phoneNumberValue,
                isSuccess: phoneNumberValue === 'blank' || phoneNumberValue === 'existing in db',
            });
        });
    }
);

Then(
    'school admin sees the edited student phone number data on CMS',
    async function (this: IMasterWorld) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        await cms.instruction(`school admin goes to student management page`, async function () {
            await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
        });

        await assertStudentWithPhoneNumberOnCMS(cms, scenarioContext);
    }
);
