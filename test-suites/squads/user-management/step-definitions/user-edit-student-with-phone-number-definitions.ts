import { aliasFirstGrantedLocation } from '@legacy-step-definitions/alias-keys/architecture';
import { learnerProfileAlias, studentPhoneNumberAlias } from '@user-common/alias-keys/user';

import { CMSInterface, PhoneNumberField } from '@supports/app-types';
import { UserPhoneNumber, UserProfileEntity } from '@supports/entities/user-profile-entity';
import { ScenarioContext } from '@supports/scenario-context';
import { LocationObjectGRPC } from '@supports/types/cms-types';

import { createAStudentPromise } from './user-create-student-definitions';
import {
    createRandomStudentPhoneNumberData,
    fillInStudentPhoneNumber,
    InvalidPhoneNumber,
    ValidPhoneNumber,
} from './user-create-student-with-phone-number-definitions';
import {
    clickOnSaveButtonInStudent,
    getInvalidPhoneNumber,
    schoolAdminGoesToStudentDetailAndEdit,
} from './user-definition-utils';
import { StudentContactPreference } from 'manabuf/usermgmt/v2/users_pb';

export async function createStudentWithPhoneNumber(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    phoneNumberField: PhoneNumberField
) {
    const studentPhoneNumber = createRandomStudentPhoneNumberData({
        phoneNumberField,
    });

    const firstGrantedLocation = scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);

    await cms.instruction(
        `school admin create a student with student phone number: ${JSON.stringify(
            studentPhoneNumber
        )}, `,
        async function () {
            await createAStudentPromise(cms, {
                studentPhoneNumber: {
                    phoneNumber: studentPhoneNumber.studentPhoneNumber || '',
                    homePhoneNumber: studentPhoneNumber.homePhoneNumber || '',
                    contactPreference: StudentContactPreference['STUDENT_PHONE_NUMBER'],
                },
                locations: [firstGrantedLocation],
            });
        }
    );

    return studentPhoneNumber;
}

export async function schoolAdminEditStudentPhoneNumber({
    cms,
    scenarioContext,
    phoneNumberValue,
    defaultPhoneNumberValue,
    isSuccess,
}: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    phoneNumberValue: ValidPhoneNumber | InvalidPhoneNumber;
    defaultPhoneNumberValue?: UserPhoneNumber;
    isSuccess?: boolean;
}) {
    const studentProfile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);
    let studentPhoneNumber =
        defaultPhoneNumberValue || scenarioContext.get<UserPhoneNumber>(studentPhoneNumberAlias);

    switch (phoneNumberValue) {
        case 'existing in db': {
            const createdStudentData = await createStudentWithPhoneNumber(
                cms,
                scenarioContext,
                'student phone number'
            );
            studentPhoneNumber = {
                ...studentPhoneNumber,
                studentPhoneNumber: createdStudentData.studentPhoneNumber,
            };
            break;
        }
        case 'blank':
            studentPhoneNumber = {
                ...studentPhoneNumber,
                studentPhoneNumber: '',
            };
            break;

        default:
            studentPhoneNumber = getInvalidPhoneNumber(phoneNumberValue);
            break;
    }

    await schoolAdminGoesToStudentDetailAndEdit(cms, studentProfile);

    await cms.instruction(`school admin fills in student phone number`, async function () {
        await fillInStudentPhoneNumber(cms, studentPhoneNumber);
    });

    if (isSuccess) {
        await clickOnSaveButtonInStudent(cms);
        scenarioContext.set(studentPhoneNumberAlias, studentPhoneNumber);
    }
}
