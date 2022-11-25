import {
    generateText,
    getRandomDate,
    getRandomGradeMaster,
    getRandomNumber,
    getRandomPhoneNumber,
    randomEnumKey,
    randomGrade,
    randomString,
} from '@legacy-step-definitions/utils';
import { isEnabledFeatureFlag } from '@user-common/helper/feature-flag';

import { DataTable } from '@cucumber/cucumber';

import { CMSInterface } from '@supports/app-types';
import { LocationInfoGRPC } from '@supports/types/cms-types';

import {
    EnrollmentStatus,
    StudentFieldNotRequired,
    StudentFieldRequired,
    StudentInformation,
} from '../types/student';
import { Gender, StudentEnrollmentStatus } from 'manabuf/usermgmt/v2/enums_pb';

interface CreateRandomStudentDataProps {
    unusedFields?: DataTable;
    missingField?: keyof StudentFieldRequired;
    locations?: LocationInfoGRPC[];
}

export async function createRandomStudentData(
    cms: CMSInterface,
    { unusedFields, missingField, locations = [] }: CreateRandomStudentDataProps = {}
): Promise<StudentInformation> {
    const isShowGradeMaster = await isEnabledFeatureFlag('STUDENT_MANAGEMENT_GRADE_MASTER');
    const firstName = `${randomString(8)}@manabie.com`;
    const lastName = `e2e-student.${getRandomNumber()}`;
    const name = `${lastName} ${firstName}`;
    const email = `${lastName}.${firstName}`;
    const firstNamePhonetic = `first-${randomString(8)}`;
    const lastNamePhonetic = `last-${randomString(8)}`;
    const fullNamePhonetic = `${lastNamePhonetic} ${firstNamePhonetic}`;

    const gradeMaster = await getRandomGradeMaster(cms);
    const grade = isShowGradeMaster ? gradeMaster?.name : randomGrade();
    const phoneNumber = getRandomPhoneNumber();

    const randomEnumKeyStatus = randomEnumKey(StudentEnrollmentStatus, [
        'STUDENT_ENROLLMENT_STATUS_NONE',
    ]);

    const enrollmentStatus = randomEnumKeyStatus
        .replace('STUDENT_ENROLLMENT_STATUS_', '')
        .toLowerCase() as EnrollmentStatus;
    const studentExternalId = `External Student ID ${getRandomNumber()}`;
    const studentNote = `Student note ${generateText(1000)}`;
    const birthday = getRandomDate();

    const gender = randomEnumKey(Gender, ['NONE']);

    // Random school history

    const studentInfo: StudentInformation = {
        email,
        name,
        firstName,
        lastName,
        firstNamePhonetic,
        lastNamePhonetic,
        fullNamePhonetic,
        grade,
        gradeMaster,
        enrollmentStatus,
        phoneNumber,
        studentExternalId,
        studentNote,
        birthday,
        gender,
        locations,
    };

    if (unusedFields) {
        let listFields: string[] = [];
        listFields = listFields.concat.apply([], unusedFields.raw());

        listFields.forEach((fieldName) => {
            const unusedField = fieldName as keyof StudentFieldNotRequired;
            if (studentInfo[unusedField]) {
                if (
                    unusedField === 'birthday' ||
                    unusedField === 'gender' ||
                    unusedField === 'locations'
                ) {
                    delete studentInfo[unusedField];
                } else {
                    studentInfo[unusedField] = '';
                }
            }
        });
    }

    if (missingField) delete studentInfo[missingField];

    if (studentInfo.firstNamePhonetic === '' && studentInfo.lastNamePhonetic === '')
        studentInfo.fullNamePhonetic = '';

    return studentInfo;
}
