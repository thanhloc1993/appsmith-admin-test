import { dialogFullScreen } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { StudentInformation } from '@legacy-step-definitions/types/content';
import { getRandomUserPhoneNumber } from '@legacy-step-definitions/utils';
import { learnerProfileAlias, studentPhoneNumberAlias } from '@user-common/alias-keys/user';
import {
    formContactPreferenceAutocomplete,
    formInputHomePhoneNumber,
    formInputStudentPhoneNumber,
    homePhoneNumberValue,
    parentPrimaryPhoneNumberValue,
    parentSecondaryPhoneNumberValue,
    preferredContactNumberValue,
    studentDetailPhoneNumber,
    studentFormPhoneNumber,
    studentPhoneNumberValue,
    tableStudentContactPreferenceCell,
    tableStudentContactPreferenceLoading,
    tableStudentName,
} from '@user-common/cms-selectors/students-page';
import { isEnabledFeatureFlag } from '@user-common/helper/feature-flag';

import { CMSInterface, ContactPreference, PhoneNumberField } from '@supports/app-types';
import { emptyValue } from '@supports/constants';
import { UserPhoneNumber, UserProfileEntity } from '@supports/entities/user-profile-entity';
import { ScenarioContext } from '@supports/scenario-context';

import { getLearnerInformationAfterCreateStudentSuccessfully } from './user-create-student-definitions';
import {
    clickOnSaveButtonInStudent,
    fillInStudentInformation,
    findNewlyCreatedStudent,
    goToAddStudentPage,
    searchStudentOnCMS,
} from './user-definition-utils';
import { strictEqual } from 'assert';
import startCase from 'lodash/startCase';

export type InvalidPhoneNumber =
    | 'incorrect length'
    | 'letters'
    | 'special characters'
    | 'duplicate';
export type ValidPhoneNumber = 'existing in db' | 'blank';

export const createRandomStudentPhoneNumberData = ({
    phoneNumberField = 'all student phone number',
    contactPreference = 'student phone number',
}: {
    phoneNumberField?: PhoneNumberField;
    contactPreference?: ContactPreference;
}): UserPhoneNumber => {
    switch (phoneNumberField) {
        case 'student phone number':
            return {
                studentPhoneNumber: getRandomUserPhoneNumber(),
                contactPreference,
            };
        case 'home phone number':
            return {
                homePhoneNumber: getRandomUserPhoneNumber(),
                contactPreference,
            };
        case 'all student phone number': {
            const studentPhoneNumber = getRandomUserPhoneNumber();
            const homePhoneNumber = getRandomUserPhoneNumber(studentPhoneNumber);

            return {
                studentPhoneNumber,
                homePhoneNumber,
                contactPreference,
            };
        }
        default:
            return { contactPreference };
    }
};

export const fillInStudentPhoneNumber = async (
    cms: CMSInterface,
    userPhoneNumber?: UserPhoneNumber
) => {
    const page = cms.page!;
    const phoneNumberForm = page.locator(studentFormPhoneNumber);

    if (!userPhoneNumber) return;

    const { studentPhoneNumber, homePhoneNumber, contactPreference } = userPhoneNumber;

    await phoneNumberForm.scrollIntoViewIfNeeded();

    await cms.instruction(
        `school admin fills student phone number: ${studentPhoneNumber}`,
        async function () {
            const studentPhoneNumberInput = phoneNumberForm.locator(formInputStudentPhoneNumber);
            const isNumber = !isNaN(Number(studentPhoneNumber));

            if (isNumber) {
                await studentPhoneNumberInput.fill(studentPhoneNumber || '');
            } else {
                await studentPhoneNumberInput.type(studentPhoneNumber || '');
            }
        }
    );

    await cms.instruction(
        `school admin fills home phone number: ${homePhoneNumber}`,
        async function () {
            const homePhoneNumberInput = phoneNumberForm.locator(formInputHomePhoneNumber);
            const isNumber = !isNaN(Number(homePhoneNumber));

            if (isNumber) {
                await homePhoneNumberInput.fill(homePhoneNumber || '');
            } else {
                await homePhoneNumberInput.type(homePhoneNumber || '');
            }
        }
    );

    await cms.instruction(
        `school admin choose contact preference: ${contactPreference}`,
        async function () {
            const contactPreferenceSelect = phoneNumberForm.locator(
                formContactPreferenceAutocomplete
            );
            await contactPreferenceSelect.click();
            await cms.chooseOptionInAutoCompleteBoxByText(contactPreference || '');
        }
    );
};

export const assertStudentWithPhoneNumberOnCMS = async (
    cms: CMSInterface,
    context: ScenarioContext
) => {
    const studentProfile = context.get<UserProfileEntity>(learnerProfileAlias);
    const userPhoneNumber = context.get<UserPhoneNumber>(studentPhoneNumberAlias);
    const isEnabledParentSecondaryPhoneNumberAndRemarks = await isEnabledFeatureFlag(
        'STUDENT_MANAGEMENT_PARENT_SECONDARY_PHONE_NUMBER'
    );

    await cms.instruction('school admin searches for new created student', async function () {
        await searchStudentOnCMS(cms, studentProfile.name);
    });

    const student = await findNewlyCreatedStudent(cms, studentProfile);

    const {
        studentPhoneNumber,
        homePhoneNumber,
        parentPrimaryPhoneNumber,
        parentSecondaryPhoneNumber,
        contactPreference,
    } = userPhoneNumber;

    // assert contact preference in student list
    const contactPreferenceColumn = await student?.waitForSelector(
        tableStudentContactPreferenceCell
    );
    await contactPreferenceColumn?.scrollIntoViewIfNeeded();
    await contactPreferenceColumn?.waitForSelector(tableStudentContactPreferenceLoading, {
        state: 'hidden',
    });

    const contactPreferenceContent = await contactPreferenceColumn?.textContent();

    if (
        (!studentPhoneNumber && !homePhoneNumber) ||
        (!studentPhoneNumber && contactPreference === 'student phone number') ||
        (!homePhoneNumber && contactPreference === 'home phone number')
    ) {
        await cms.instruction(
            `school admin sees contact preference column display double dash on student list table with 
                contact preference is: ${contactPreference}
                student phone number is: ${studentPhoneNumber}
                home phone number is: ${homePhoneNumber}
            `,
            async function () {
                strictEqual(
                    contactPreferenceContent,
                    emptyValue,
                    'Student contact preference should be match on UI'
                );
            }
        );
    } else {
        // TODO: update when implement parent phone number
        await cms.instruction(
            `school admin sees correct value of contact preference column on student list table with 
                contact preference is: ${contactPreference}
                student phone number is: ${studentPhoneNumber}
                home phone number is: ${homePhoneNumber}
            `,
            async function () {
                const expectedContactPreference = `${
                    contactPreference === 'student phone number'
                        ? studentPhoneNumber
                        : homePhoneNumber
                } (Student)`;

                strictEqual(
                    contactPreferenceContent,
                    expectedContactPreference,
                    'Student contact preference should be match on UI'
                );
            }
        );
    }

    // assert student phone number in student detail
    await cms.instruction('school admin goes to student detail page', async function () {
        await (await student?.waitForSelector(tableStudentName))?.click();
        await cms.waitingForLoadingIcon();
    });

    await cms.instruction(
        'school admin sees student phone number on student detail',
        async function () {
            const phoneNumberDetail = cms.page?.locator(studentDetailPhoneNumber);
            await phoneNumberDetail?.scrollIntoViewIfNeeded();

            const phoneNumberData = await Promise.all([
                phoneNumberDetail?.locator(studentPhoneNumberValue).textContent(),
                phoneNumberDetail?.locator(homePhoneNumberValue).textContent(),
                ...(isEnabledParentSecondaryPhoneNumberAndRemarks
                    ? [
                          phoneNumberDetail?.locator(parentPrimaryPhoneNumberValue).textContent(),
                          phoneNumberDetail?.locator(parentSecondaryPhoneNumberValue).textContent(),
                      ]
                    : []),
                phoneNumberDetail?.locator(preferredContactNumberValue).textContent(),
            ]);

            weExpect(phoneNumberData).toEqual([
                studentPhoneNumber || emptyValue,
                homePhoneNumber || emptyValue,
                parentPrimaryPhoneNumber || emptyValue,
                parentSecondaryPhoneNumber || emptyValue,
                contactPreference ? startCase(contactPreference) : emptyValue,
            ]);
        }
    );
};

export const schoolAdminCreateStudentWithPhoneNumberData = async ({
    cms,
    context,
    studentGeneralInfo,
    studentPhoneNumber,
    isSuccess,
}: {
    cms: CMSInterface;
    context: ScenarioContext;
    studentGeneralInfo: StudentInformation;
    studentPhoneNumber: UserPhoneNumber;
    isSuccess?: boolean;
}) => {
    await cms.instruction('school admin goes to student upsert page', async function () {
        await goToAddStudentPage(cms);
    });

    await cms.instruction(`school admin fills in student general info`, async function () {
        await fillInStudentInformation(cms, context, studentGeneralInfo);
    });

    await cms.instruction(`school admin fills in student phone number`, async function () {
        await fillInStudentPhoneNumber(cms, studentPhoneNumber);
        context.set(studentPhoneNumberAlias, studentPhoneNumber);
    });

    if (isSuccess) {
        await clickOnSaveButtonInStudent(cms);

        await cms.instruction(
            `school admin gets learner new credentials after create account successfully`,
            async function () {
                await getLearnerInformationAfterCreateStudentSuccessfully(
                    cms,
                    context,
                    studentGeneralInfo
                );
            }
        );
    }
};

export const schoolAdminSeeErrorMessageWhenCreateStudentWithInvalidPhoneNumber = async (
    cms: CMSInterface,
    invalidPhoneNumber: InvalidPhoneNumber
) => {
    await cms.instruction(`school admin sees ${invalidPhoneNumber} error message`, async () => {
        await cms.assertTypographyWithTooltip(
            'p',
            invalidPhoneNumber === 'duplicate'
                ? 'Duplicate phone number'
                : 'Phone number is not valid'
        );
    });

    await clickOnSaveButtonInStudent(cms);

    await cms.instruction(`school admin is still in adding student page`, async function () {
        await cms.page!.waitForSelector(dialogFullScreen);
    });
};
