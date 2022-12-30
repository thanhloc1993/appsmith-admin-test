import { capitalizeFirstLetter } from '@legacy-step-definitions/utils';
import { studentDetailDataAlias } from '@user-common/alias-keys/student';
import {
    enrollmentStatusAutoComplete,
    formInputBirthday,
    formInputEmail,
    formInputFirstName,
    formInputFirstNamePhonetic,
    formInputLastName,
    formInputLastNamePhonetic,
    gradeAutoComplete,
    radioGenderButton,
    studentForm,
    textareaStudentNote,
    textInputExternalStudentID,
} from '@user-common/cms-selectors/students-page';
import { StudentFieldNotRequired, StudentInformation } from '@user-common/types/student';
import { selectLocations } from '@user-common/utils/locations';
import { selectFullDate } from '@user-common/utils/pick-date-time';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

export async function fillFormStudentInformation(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    randomStudentData: Partial<StudentInformation>
) {
    const {
        firstName,
        lastName,
        firstNamePhonetic,
        lastNamePhonetic,
        email,
        grade,
        enrollmentStatus,
        studentExternalId,
        studentNote,
        birthday,
        gender,
        locations,
    } = randomStudentData;

    const cmsPage = cms.page!;

    const studentInformationContainer = await cmsPage.waitForSelector(studentForm);

    if (firstName) {
        const firstNameTextField = await studentInformationContainer!.waitForSelector(
            formInputFirstName
        );
        await firstNameTextField.fill(firstName);
    }

    if (lastName) {
        const lastNameTextField = await studentInformationContainer!.waitForSelector(
            formInputLastName
        );
        await lastNameTextField.fill(lastName);
    }

    if (firstNamePhonetic) {
        const firstNamePhoneticTextField = await studentInformationContainer!.waitForSelector(
            formInputFirstNamePhonetic
        );
        await firstNamePhoneticTextField.fill(firstNamePhonetic);
    }

    if (lastNamePhonetic) {
        const lastNamePhoneticTextField = await studentInformationContainer!.waitForSelector(
            formInputLastNamePhonetic
        );
        await lastNamePhoneticTextField.fill(lastNamePhonetic);
    }

    if (email) {
        const emailTextField = await studentInformationContainer!.waitForSelector(formInputEmail);
        await emailTextField.fill(email);
    }

    if (grade) {
        const gradeField = await studentInformationContainer!.waitForSelector(gradeAutoComplete);
        await gradeField.click();
        await cms.chooseOptionInAutoCompleteBoxByText(grade);
    }

    if (enrollmentStatus) {
        const enrollmentStatusField = await studentInformationContainer!.waitForSelector(
            enrollmentStatusAutoComplete
        );

        await enrollmentStatusField.click();
        await cms.chooseOptionInAutoCompleteBoxByText(capitalizeFirstLetter(enrollmentStatus));
    }

    if (studentExternalId) {
        const externalStudentIDTextField = await studentInformationContainer!.waitForSelector(
            textInputExternalStudentID
        );
        await externalStudentIDTextField.fill(studentExternalId);
    }

    if (studentNote) {
        const studentNoteTextarea = await studentInformationContainer!.waitForSelector(
            textareaStudentNote
        );
        await studentNoteTextarea.fill(studentNote);

        if (studentNote.length >= 600) {
            await cms.instruction(
                'Verify Textarea student note can scroll with long text',
                async () => {
                    await studentNoteTextarea.scrollIntoViewIfNeeded();
                }
            );
        }
    }

    await fillBirthdayAndGender(cms, { birthday, gender });

    await selectLocations(cms, scenarioContext, locations);

    scenarioContext.set(studentDetailDataAlias, randomStudentData);
}

export async function fillBirthdayAndGender(
    cms: CMSInterface,
    { birthday, gender }: Partial<StudentFieldNotRequired>
) {
    await selectFullDate(cms, birthday, formInputBirthday);

    if (gender) {
        await cms.instruction(`select gender ${gender}`, async () => {
            const studentGender = await cms.page!.waitForSelector(
                radioGenderButton(String(gender))
            );
            await studentGender.click();
        });
    }
}
