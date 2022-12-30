import { uploadInput } from '@legacy-step-definitions/cms-selectors/course';
import { FindStatusStudentTypes } from '@legacy-step-definitions/types/content';
import {
    convertCSVStringToBase64,
    convertToCSVString,
    getRandomDate,
    getRandomElement,
    getRandomNumber,
    parseCSVToJSON,
    randomInteger,
    randomString,
    readDownloadFileSync,
    withDownloadPath,
    writeDownloadFileSync,
    getRandomUserPhoneNumber,
    checkValidNumberPhone,
} from '@legacy-step-definitions/utils';
import {
    importedParentAlias,
    learnerProfileAlias,
    learnerProfileAliasWithTenantAccountRoleSuffix,
    parentProfilesAlias,
    parentProfilesAliasWithTenantAccountRoleSuffix,
} from '@user-common/alias-keys/user';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';
import {
    buttonGroupDropdown,
    buttonGroupDropdownPopover,
    buttonGroupDropdownValueItem,
    footerDialogConfirmButtonSave,
    ImportUserDialog,
} from '@user-common/cms-selectors/students-page';
import { isEnabledFeatureFlag } from '@user-common/helper/feature-flag';
import { ConditionStatusTypes } from '@user-common/types/bdd';
import { StudentCSV, ParentCSV } from '@user-common/types/student';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { CMSInterface } from '@supports/app-types';
import { Menu } from '@supports/enum';
import { ScenarioContext } from '@supports/scenario-context';
import { CreateStudentResponseEntity } from '@supports/services/usermgmt-student-service/entities/create-student-response';
import { ActionOptions, FileTypes, UserType } from '@supports/types/cms-types';

import {
    createARandomStudentGRPC,
    searchAndSelectExistedParent,
    cannotSearchExistingParent,
} from './user-create-student-definitions';
import {
    randomPartnerInternalLocationIdsByContext,
    schoolAdminSeesNewStudentBySearch,
    FileCSV,
    userAuthenticationMultiTenant,
    goToDetailedStudentInfoPage,
} from './user-definition-utils';
import {
    reIssuePasswordParent,
    schoolAdminReIssuePassword,
} from './user-reissue-password-definitions';
import { strictEqual } from 'assert';
import moment from 'moment-timezone';
import { splitAndCombinationIntoArray } from 'step-definitions/utils';
import {
    getStudentTagForImport,
    getParentTagForImport,
} from 'test-suites/squads/user-management/step-definitions/student-info/user-tag/user-create-student-with-student-tag-definitions';
import {
    getRandomGradeMasterByContext,
    getRandomLocationByContext,
    getRandomValidAndNotExistPhoneNumber,
} from 'test-suites/squads/user-management/step-definitions/user-common-definitions';

export type FirstConditionCreateCSVImportStudent =
    | 'only mandatory input'
    | 'all valid input'
    | 'invalid email format'
    | 'existing student email'
    | 'existing parent email'
    | 'invalid phone format'
    | 'existing student phone'
    | 'existing parent phone'
    | 'invalid field'
    | '> 1000 rows'
    | 'duplicated'
    | 'missing field'
    | 'multiple error rows'
    | 'student email does not existed'
    | 'duplicated student phone number'
    | 'invalid student phone number';
export type SecondConditionCreateCSVImportStudent = '<=1000 rows' | 'invalid on row';

export type ImportedInvalidField =
    | 'Enrollment Status'
    | 'Grade'
    | 'Gender'
    | 'Birthday'
    | 'Student Email'
    | 'Relationship'
    | 'Student Email & Relationship'
    | 'Prefecture'
    | 'Student Phone Number'
    | 'Home Phone Number'
    | 'Contact Preference'
    | 'Student Tag'
    | 'Parent Tag'
    | undefined;
export type ImportedValidField =
    | 'First Name Phonetic'
    | 'Last Name Phonetic'
    | 'Gender'
    | 'Birthday'
    | 'Student Phone Number'
    | 'Home Phone Number'
    | 'Contact Preference'
    | 'City'
    | 'Prefecture'
    | 'Postal Code'
    | 'First Street'
    | 'Second Street'
    | 'First Name Phonetic & Last Name Phonetic & Gender & Birthday'
    | 'Student Phone Number & Home Phone Number & Contact Preference'
    | 'City & Prefecture & Postal Code & First Street & Second Street'
    | 'Student Tag'
    | 'Parent Tag'
    | 'Parent Phone Number'
    | 'Student Email'
    | 'Relationship'
    | 'Student Email & Relationship'
    | undefined;
export type MissingField =
    | 'Name'
    | 'First Name'
    | 'Last Name'
    | 'First Name Phonetic'
    | 'Last Name Phonetic'
    | 'Email'
    | 'Enrollment Status'
    | 'Grade'
    | 'Location'
    | undefined;
export type InValidRowType = number | number[] | undefined;
export type ActionHeaderImportTypes =
    | 'swap'
    | 'deleteRequire'
    | 'deleteOptional'
    | 'add'
    | 'edit'
    | undefined;
export type UserImportTemplate = 'student template csv' | 'parent template csv';

interface OptionCreateStudentCSV {
    inValidRow?: InValidRowType;
    duplicatedRow?: boolean;
    inValidField?: ImportedInvalidField;
    validFields?: ImportedValidField;
    missingField?: MissingField;
    actionHeader?: ActionHeaderImportTypes;
    firstCondition?: FirstConditionCreateCSVImportStudent;
    students?: CreateStudentResponseEntity[];
}

let uniqueKey = '';
let parentCSVFileKey = '';
export async function schoolAdminCreateCSVImportParent(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    firstCondition: FirstConditionCreateCSVImportStudent,
    inValidRow?: InValidRowType,
    inValidField?: ImportedInvalidField,
    validFields?: ImportedValidField,
    missingField?: MissingField,
    actionHeader?: ActionHeaderImportTypes
) {
    const isGreaterOneThousand = firstCondition === '> 1000 rows';
    const duplicatedRow = firstCondition === 'duplicated';
    const csv = await createCSVListParent(
        cms,
        scenarioContext,
        isGreaterOneThousand ? FileCSV.NUMBER_INVALID_STUDENT : FileCSV.NUMBER_VALID_STUDENT,
        {
            inValidRow,
            missingField,
            actionHeader,
            inValidField,
            validFields,
            firstCondition,
            duplicatedRow,
        }
    );

    parentCSVFileKey = new Date().getTime().toString();
    const nameCSV = FileCSV.PARENT + parentCSVFileKey + FileCSV.EXT;

    writeDownloadFileSync(nameCSV, csv);

    await cms.attach(convertCSVStringToBase64(csv), FileTypes.CSV);
}

export async function schoolAdminCreateCSVImportStudent(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    firstCondition: FirstConditionCreateCSVImportStudent,
    inValidRow?: InValidRowType,
    inValidField?: ImportedInvalidField,
    validFields?: ImportedValidField,
    missingField?: MissingField,
    actionHeader?: ActionHeaderImportTypes
) {
    let csv = '';
    const isGreaterOneThousand = firstCondition === '> 1000 rows';
    const duplicatedRow = firstCondition === 'duplicated';
    csv = await createCSVListStudent(
        cms,
        scenarioContext,
        isGreaterOneThousand ? FileCSV.NUMBER_INVALID_STUDENT : FileCSV.NUMBER_VALID_STUDENT,
        {
            inValidRow,
            missingField,
            actionHeader,
            inValidField,
            validFields,
            firstCondition,
            duplicatedRow,
        }
    );

    uniqueKey = new Date().getTime().toString();
    const nameCSV = FileCSV.STUDENT + uniqueKey + FileCSV.EXT;

    writeDownloadFileSync(nameCSV, csv);

    await cms.attach(convertCSVStringToBase64(csv), FileTypes.CSV);
}

async function createCSVListParent(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    rows: number,
    option?: OptionCreateStudentCSV
): Promise<string> {
    const { inValidRow, duplicatedRow } = option || {};
    const parents: ParentCSV[] = [];
    const indexOfInvalidRow = inValidRow && !Array.isArray(inValidRow) ? inValidRow : 0;
    const length = indexOfInvalidRow > rows ? indexOfInvalidRow : rows;

    const locations = await getRandomLocationByContext(cms, scenarioContext);
    const grade = await getRandomGradeMasterByContext(cms, scenarioContext);

    const firstStudent = await createARandomStudentGRPC(cms, { locations, grade });
    const secondStudent = await createARandomStudentGRPC(cms, { locations, grade });
    const students = [firstStudent, secondStudent];

    for (let i = 0; i < length; i++) {
        const parent = await createRandomParentImport(cms, scenarioContext, i, {
            ...option,
            students,
        });
        // Skip when we have so many parents
        if (length <= FileCSV.NUMBER_VALID_STUDENT) {
            await cms.attach(`Parent ${i + 2} in file csv:${JSON.stringify(parent)}`);
        }
        parents.push(parent);

        // Add a duplicated parent
        if (duplicatedRow && !Array.isArray(indexOfInvalidRow) && indexOfInvalidRow - 2 === i + 1) {
            await cms.attach(`Parent is duplicated in file csv:${JSON.stringify(parent)}`);
            parents.push(parent);
        }
    }

    if (length > FileCSV.NUMBER_VALID_STUDENT) {
        await cms.attach(`Parents in file csv:${JSON.stringify(parents)}`);
    }

    const _parents = convertToCSVString(parents);
    await cms.attach(_parents);
    return _parents;
}

async function createCSVListStudent(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    rows: number,
    option?: OptionCreateStudentCSV
): Promise<string> {
    const students: StudentCSV[] = [];
    const inValidRow =
        option?.inValidRow && !Array.isArray(option?.inValidRow) ? option?.inValidRow : 0;

    const length = inValidRow > rows ? inValidRow : rows;

    for (let i = 0; i < length; i++) {
        const student = await createRandomStudentImport(cms, scenarioContext, i, option);
        // Skip when we have so many students
        if (length <= FileCSV.NUMBER_VALID_STUDENT) {
            await cms.attach(`Student ${i + 2} in file csv:${JSON.stringify(student)}`);
        }
        students.push(student);

        // Add a duplicated student
        if (option?.duplicatedRow && !Array.isArray(inValidRow) && inValidRow - 2 === i + 1) {
            await cms.attach(`Student is duplicated in file csv:${JSON.stringify(student)}`);
            students.push(student);
        }
    }
    if (length > FileCSV.NUMBER_VALID_STUDENT) {
        await cms.attach(`Students in file csv:${JSON.stringify(students)}`);
    }

    const _student = convertToCSVString(students);
    await cms.attach(_student);
    return _student;
}

async function createRandomParentImport(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    index: number,
    option?: OptionCreateStudentCSV
): Promise<ParentCSV> {
    const randomKey = `${getRandomNumber()}.${randomString(10)}`;
    const name = `csv-e2e-parent.${randomKey}`;
    const email = `${name}@manabie.com`;

    // Student email & Relationship - start
    const randomStudentLength = randomInteger(1, 2);
    const studentEmails: string[] = [];
    const relationships: number[] = [];
    for (let index = 0; index < randomStudentLength; index++) {
        const studentEmail = (option?.students || [])[index].student.email || '';
        studentEmails.push(studentEmail);

        const randomRelationship = randomInteger(1, 2);
        relationships.push(randomRelationship);
    }
    // Student email & Relationship - end

    //optional field default is ''
    const parent: ParentCSV = {
        name,
        email,
        phone_number: '',
        student_email: '',
        relationship: '',
        parent_tag: '',
    };

    if (option) {
        const {
            inValidRow,
            firstCondition,
            missingField,
            inValidField,
            validFields,
            actionHeader,
        } = option;
        const _validFields = splitAndCombinationIntoArray(
            validFields || ''
        ) as ImportedValidField[];

        switch (firstCondition) {
            case 'all valid input':
                {
                    const parentTag = await getParentTagForImport(cms, scenarioContext, true);
                    const phoneNumber = await getRandomValidAndNotExistPhoneNumber(cms);

                    parent.phone_number = phoneNumber;
                    parent.student_email = studentEmails.join(';');
                    parent.relationship = relationships.join(';');
                    parent.parent_tag = parentTag;
                }
                break;
            case 'only mandatory input':
                break;
        }

        switch (actionHeader) {
            case 'add':
                Object.assign(parent, { invalid_header: 'invalid_header' });
                break;
            case 'deleteRequire':
                delete parent.name;
                break;
            case 'deleteOptional':
                delete parent.phone_number;
                break;
            case 'edit':
                Object.assign(parent, { firstName: parent.name });
                delete parent.name;
                break;
            case 'swap':
                {
                    const phoneNumberTemp = parent.phone_number;
                    delete parent.phone_number;
                    Object.assign(parent, { phone_number: phoneNumberTemp });
                }
                break;
        }

        for (const validField of _validFields) {
            switch (validField) {
                case 'Parent Phone Number':
                    {
                        const phoneNumber = await getRandomValidAndNotExistPhoneNumber(cms);
                        parent.phone_number = phoneNumber;
                    }
                    break;
                case 'Student Email':
                    parent.student_email = studentEmails.join(';');
                    break;
                case 'Relationship':
                    parent.relationship = relationships.join(';');
                    break;
                case 'Parent Tag':
                    {
                        const parentTag = await getParentTagForImport(cms, scenarioContext, true);
                        parent.parent_tag = parentTag;
                    }
                    break;
            }
        }

        if (
            (inValidRow && inValidRow === index + 2) ||
            (Array.isArray(inValidRow) && inValidRow.includes(index + 2))
        ) {
            switch (firstCondition) {
                case 'existing parent email':
                    {
                        const resp = await createARandomStudentGRPC(cms, { parentLength: 1 });
                        parent.email = resp.parents[0].email;
                        parent.student_email = resp.student.email;
                        parent.relationship = '1';
                    }
                    break;
                case 'existing parent phone':
                    {
                        const resp = await createARandomStudentGRPC(cms, {
                            parentLength: 1,
                        });
                        let phoneNumber = resp.parents[0].phoneNumber;
                        let isValidPhone = checkValidNumberPhone(phoneNumber, 'JP');
                        while (!isValidPhone) {
                            const { parents } = await createARandomStudentGRPC(cms, {
                                parentLength: 1,
                            });
                            isValidPhone = checkValidNumberPhone(parents[0].phoneNumber, 'JP');
                            phoneNumber = parents[0].phoneNumber;
                        }
                        parent.phone_number = phoneNumber;
                        parent.student_email = resp.student.email;
                        parent.relationship = '1';
                    }
                    break;
                case 'student email does not existed':
                    {
                        const randomKeywords = randomString(16);
                        const timestamp = Date.now();
                        parent.student_email = `${randomKeywords}-${timestamp}@manabie.com`;
                        parent.relationship = '1';
                    }
                    break;
                case 'invalid phone format':
                    parent.phone_number = '000000000a';
                    break;
                case 'invalid email format':
                    parent.email = 'invalid-email-format';
                    break;
                case 'multiple error rows':
                    parent.name = '';
                    parent.student_email = '';
                    break;
            }

            switch (inValidField) {
                case 'Student Email':
                    parent.student_email = 'invalid-format-email';
                    parent.relationship = '1';
                    break;
                case 'Relationship':
                    {
                        parent.relationship = '99';
                        const resp = await createARandomStudentGRPC(cms);
                        parent.student_email = resp.student.email;
                    }

                    break;
                case 'Student Email & Relationship':
                    {
                        const resp = await createARandomStudentGRPC(cms);
                        parent.student_email = resp.student.email;
                        parent.relationship = '1;2';
                    }
                    break;
                case 'Parent Tag': {
                    const invalidParentTag = await getParentTagForImport(
                        cms,
                        scenarioContext,
                        false
                    );
                    parent.parent_tag = invalidParentTag;
                }
            }

            //require field
            switch (missingField) {
                case 'Name':
                    parent.name = '';
                    break;
                case 'Email':
                    parent.email = '';
                    break;
            }
        }
    }

    return parent;
}

async function createRandomStudentImport(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    index: number,
    option?: OptionCreateStudentCSV
): Promise<StudentCSV> {
    const partnerInternalLocationId = await randomPartnerInternalLocationIdsByContext(
        cms,
        scenarioContext
    );
    const isShowGradeMaster = await isEnabledFeatureFlag('STUDENT_MANAGEMENT_GRADE_MASTER');
    const gradeMaster = await getRandomGradeMasterByContext(cms, scenarioContext);
    const grade = isShowGradeMaster
        ? gradeMaster?.partner_internal_id
        : randomInteger(0, 16).toString();
    const firstName = `${randomString(8)}@manabie.com`;
    const lastName = `csv-e2e-user.${getRandomNumber()}`;
    const email = `${lastName}.${firstName}`;
    const enrollmentStatus = randomInteger(1, 5).toString();
    const firstNamePhonetic = `first-${randomString(8)}`;
    const lastNamePhonetic = `last-${randomString(8)}`;
    const birthday = moment(getRandomDate()).format('YYYY/MM/DD');
    const gender = randomInteger(1, 2).toString();
    const studentPhoneNumber = getRandomUserPhoneNumber();
    const homePhoneNumber = getRandomUserPhoneNumber(studentPhoneNumber);
    const contactPreference = `${randomInteger(1, 2)}`;
    const postalCode = getRandomNumber().toString().slice(7);
    const prefecture = getRandomElement(['01', '02', '03', '04', '05']);
    const city = getRandomElement(['千葉市中央区', '福井市', '長崎市', '千代田区', '福島市']);
    const firstStreet = getRandomElement(['荒町', '旭町', '赤坂町', '青柳町', '青山']);
    const secondStreet = getRandomElement(['1-1', '3-2', '1-2', '3-3', '2-3']);

    //optional field default is ''
    const student: StudentCSV = {
        last_name: lastName,
        first_name: firstName,
        last_name_phonetic: '',
        first_name_phonetic: '',
        email,
        enrollment_status: enrollmentStatus,
        grade,
        birthday: '',
        gender: '',
        location: partnerInternalLocationId,
        postal_code: '',
        prefecture: '',
        city: '',
        first_street: '',
        second_street: '',
        student_phone_number: '',
        home_phone_number: '',
        contact_preference: '',
        student_tag: '',
    };

    if (option) {
        const {
            inValidRow,
            firstCondition,
            missingField,
            inValidField,
            validFields,
            actionHeader,
        } = option;
        const _validFields = splitAndCombinationIntoArray(
            validFields || ''
        ) as ImportedValidField[];
        switch (firstCondition) {
            case 'all valid input':
                {
                    const studentTag = await getStudentTagForImport(cms, scenarioContext, true);

                    student.birthday = birthday;
                    student.gender = gender;
                    student.first_name_phonetic = firstNamePhonetic;
                    student.last_name_phonetic = lastNamePhonetic;
                    student.student_phone_number = studentPhoneNumber;
                    student.home_phone_number = homePhoneNumber;
                    student.contact_preference = contactPreference;
                    student.postal_code = postalCode;
                    student.prefecture = prefecture;
                    student.city = city;
                    student.first_street = firstStreet;
                    student.second_street = secondStreet;
                    student.student_tag = studentTag;
                }
                break;
            case 'only mandatory input':
                break;
        }

        switch (actionHeader) {
            case 'add':
                Object.assign(student, { invalid_name: 'invalid_name' });
                break;
            case 'deleteRequire':
                delete student.first_name;
                break;
            case 'deleteOptional':
                delete student.student_phone_number;
                break;
            case 'edit':
                Object.assign(student, { firstName: student.first_name });
                delete student.first_name;
                break;
            case 'swap':
                {
                    const phoneNumberTemp = student.student_phone_number;
                    delete student.student_phone_number;
                    Object.assign(student, { student_phone_number: phoneNumberTemp });
                }
                break;
        }

        for (const validField of _validFields) {
            switch (validField) {
                case 'First Name Phonetic':
                    student.first_name_phonetic = firstNamePhonetic;
                    break;
                case 'Last Name Phonetic':
                    student.last_name_phonetic = lastNamePhonetic;
                    break;
                case 'Gender':
                    student.gender = gender;
                    break;
                case 'Birthday':
                    student.birthday = birthday;
                    break;
                case 'Student Phone Number':
                    student.student_phone_number = studentPhoneNumber;
                    break;
                case 'Home Phone Number':
                    student.home_phone_number = homePhoneNumber;
                    break;
                case 'Contact Preference':
                    student.contact_preference = contactPreference;
                    break;
                case 'City':
                    student.city = city;
                    break;
                case 'Prefecture':
                    student.prefecture = prefecture;
                    break;
                case 'First Street':
                    student.first_street = firstStreet;
                    break;
                case 'Second Street':
                    student.second_street = secondStreet;
                    break;
                case 'Student Tag':
                    {
                        const studentTag = await getStudentTagForImport(cms, scenarioContext, true);
                        student.student_tag = studentTag;
                    }
                    break;
            }
        }

        if (
            (inValidRow && inValidRow === index + 2) ||
            (Array.isArray(inValidRow) && inValidRow.includes(index + 2))
        ) {
            switch (firstCondition) {
                case 'existing student email':
                    {
                        const resp = await createARandomStudentGRPC(cms);
                        student.email = resp.student.email;
                    }
                    break;
                case 'invalid email format':
                    student.email = 'invalid-format-email';
                    break;
                case 'multiple error rows':
                    student.email = '';
                    student.enrollment_status = '';
                    break;
                case 'duplicated student phone number': {
                    const studentPhoneNumber = getRandomUserPhoneNumber();

                    student.student_phone_number = studentPhoneNumber;
                    student.home_phone_number = studentPhoneNumber;
                    break;
                }
                case 'invalid student phone number': {
                    student.student_phone_number = 'abc xyz <>';
                    break;
                }
            }

            switch (inValidField) {
                case 'Birthday':
                    student.birthday = '11/11/2000';
                    break;
                case 'Enrollment Status':
                    student.enrollment_status = '6';
                    break;
                case 'Gender':
                    student.gender = '3';
                    break;
                case 'Grade':
                    student.grade = '17';
                    break;
                case 'Student Phone Number':
                    student.student_phone_number = '25';
                    break;
                case 'Home Phone Number':
                    student.home_phone_number = '25';
                    break;
                case 'Contact Preference':
                    student.contact_preference = '10';
                    break;
                case 'Prefecture':
                    student.prefecture = '100';
                    break;
                case 'Student Tag':
                    {
                        const studentTag = await getStudentTagForImport(
                            cms,
                            scenarioContext,
                            false
                        );
                        student.student_tag = studentTag;
                    }
                    break;
            }

            //require field
            switch (missingField) {
                case 'Name':
                    student.name = '';
                    break;
                case 'First Name':
                    student.first_name = '';
                    break;
                case 'Last Name':
                    student.last_name = '';
                    break;
                case 'Email':
                    student.email = '';
                    break;
                case 'Enrollment Status':
                    student.enrollment_status = '';
                    break;
                case 'Grade':
                    student.grade = '';
                    break;
                case 'Location':
                    student.location = '';
                    break;
            }
        }
    }
    return student;
}

export async function schoolAdminGoesToImportStudents(cms: CMSInterface) {
    const page = cms.page!;
    await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);

    await cms.instruction('School admin goes to import students', async function () {
        await page?.locator(buttonGroupDropdown).click();
        const popoverAddButton = page?.locator(buttonGroupDropdownPopover);
        await popoverAddButton?.locator(buttonGroupDropdownValueItem('IMPORT_STUDENT_CSV')).click();
    });

    await cms.instruction('School admin selects file csv students import', async function () {
        const pathCSV = withDownloadPath(FileCSV.STUDENT + uniqueKey + FileCSV.EXT);

        await page.setInputFiles(uploadInput, pathCSV);
    });

    await cms.instruction('School admin clicks import students', async function () {
        const dialogUserImport = page.locator(ImportUserDialog);
        await dialogUserImport.locator(footerDialogConfirmButtonSave).click();
    });
}

export async function schoolAdminGoesToImportParents(cms: CMSInterface) {
    const page = cms.page!;
    await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);

    await cms.instruction(`School admin clicks Import Parents button`, async function () {
        await cms.selectActionButton(ActionOptions.IMPORT_PARENTS, {
            target: 'actionPanelTrigger',
        });
    });

    await cms.instruction('School admin selects file csv parents import', async function () {
        const pathCSV = withDownloadPath(FileCSV.PARENT + parentCSVFileKey + FileCSV.EXT);

        await page.setInputFiles(uploadInput, pathCSV);
    });

    await cms.instruction('School admin clicks import parents', async function () {
        const dialogUserImport = page.locator(ImportUserDialog);
        await dialogUserImport.locator(footerDialogConfirmButtonSave).click();
    });
}

export async function schoolAdminSeesOrNotNewStudent(
    cms: CMSInterface,
    statusStudent: FindStatusStudentTypes
) {
    const csv = readDownloadFileSync(FileCSV.STUDENT + uniqueKey + FileCSV.EXT);

    const students = parseCSVToJSON<StudentCSV>(csv.toString());

    await cms.instruction('School admin reload page on Student Management', async function () {
        await cms.page?.reload();
        await cms.assertThePageTitle('Student Management');
    });

    const studentsLength = students.length;

    const randomNumber = randomInteger(0, studentsLength - FileCSV.NUMBER_VALID_STUDENT);

    const randomStudents =
        studentsLength > FileCSV.NUMBER_VALID_STUDENT
            ? students.slice(randomNumber, randomNumber + FileCSV.NUMBER_VALID_STUDENT)
            : students;

    for (const student of randomStudents) {
        const keyWord = student.name || `${student.last_name} ${student.first_name}`;
        await cms.instruction(
            `School admin sees new imported student ${keyWord} on the Student Management`,
            async function () {
                await schoolAdminSeesNewStudentBySearch(cms, keyWord, statusStudent);
            }
        );
    }
}

export async function schoolAdminReissuesPasswordWithoutStudentId(
    cms: CMSInterface,
    context: ScenarioContext
) {
    const csv = readDownloadFileSync(FileCSV.STUDENT + uniqueKey + FileCSV.EXT);

    const students = parseCSVToJSON<StudentCSV>(csv.toString());

    await cms.instruction('School admin sees students list', async function () {
        await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
    });

    const selectedStudent = students[randomInteger(0, students.length - 1)];
    const keyWord =
        selectedStudent.name || `${selectedStudent.last_name} ${selectedStudent.first_name}`;

    const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
        userAuthenticationMultiTenant
    );

    if (isEnabledMultiTenantLogin) {
        context.set(learnerProfileAliasWithTenantAccountRoleSuffix(`school admin Tenant S1`), {
            ...selectedStudent,
            name: keyWord,
        });
    } else {
        context.set(learnerProfileAlias, { ...selectedStudent, name: keyWord });
    }
    // Go to detail page without student id
    await cms.instruction(`School admin goes to ${keyWord} detail`, async function () {
        const elementStudent = await schoolAdminSeesNewStudentBySearch(cms, keyWord, 'sees');
        await elementStudent?.click();
        await cms.assertThePageTitle(keyWord);
    });

    await schoolAdminReIssuePassword(cms, UserType.STUDENT);

    await cms.selectAButtonByAriaLabel('Confirm');
}

export async function schoolAdminAddImportedParentIntoNewStudent(
    cms: CMSInterface,
    context: ScenarioContext
) {
    const csv = readDownloadFileSync(FileCSV.PARENT + parentCSVFileKey + FileCSV.EXT);

    const parents = parseCSVToJSON<ParentCSV>(csv.toString());

    await cms.instruction('School admin reload page on Student Management', async function () {
        await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
        await cms.page?.reload();
        await cms.assertThePageTitle('Student Management');
    });

    const randomParent = getRandomElement(parents);

    const newStudent = await createARandomStudentGRPC(cms, { parentLength: 0 });

    await goToDetailedStudentInfoPage(cms, newStudent.student);

    const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
        userAuthenticationMultiTenant
    );

    if (isEnabledMultiTenantLogin) {
        context.set(parentProfilesAliasWithTenantAccountRoleSuffix(`school admin Tenant S1`), [
            randomParent,
        ]);
    } else {
        context.set(parentProfilesAlias, [randomParent]);
    }

    await cms.instruction(
        `Add random imported parent: ${randomParent.email} into student: ${newStudent.student.email}`,
        async function () {
            context.set(importedParentAlias, randomParent);
            await searchAndSelectExistedParent(cms, randomParent.email);
        }
    );
}

export async function schoolAdminSeesNewImportedParentDataCorrectly(
    cms: CMSInterface,
    context: ScenarioContext
) {
    const page = cms.page!;
    const importedParent = context.get<ParentCSV>(importedParentAlias);
    const parentItem = page.locator(studentPageSelectors.studentParentItem).first();
    const parentName = await parentItem
        .locator(studentPageSelectors.parentItemNameValue)
        .textContent();
    const parentEmail = await parentItem
        .locator(studentPageSelectors.parentItemEmailValue)
        .textContent();
    const parentPhoneNumber = await parentItem
        .locator(studentPageSelectors.parentItemPhoneNumberValue)
        .textContent();

    await cms.instruction(
        `School admin sees parent name: ${importedParent.name} display correctly`,
        async function () {
            strictEqual(
                parentName,
                importedParent.name,
                'The random imported parent name display correctly'
            );
        }
    );

    await cms.instruction(
        `School admin sees parent email: ${importedParent.email} display correctly`,
        async function () {
            strictEqual(
                parentEmail,
                importedParent.email,
                'The random imported parent email display correctly'
            );
        }
    );

    const importedPhoneNumber = importedParent.phone_number
        ? `(+81) ${importedParent.phone_number}`
        : '';

    await cms.instruction(
        `School admin sees parent phone number: ${importedPhoneNumber} display correctly`,
        async function () {
            strictEqual(
                parentPhoneNumber || '',
                importedPhoneNumber,
                'The random imported parent phone number display correctly'
            );
        }
    );
}

export async function schoolAdminReissuesImportParentPassword(cms: CMSInterface) {
    await cms.instruction('school admin clicks re-issue parent password', async function () {
        await reIssuePasswordParent(cms, UserType.PARENT);
    });

    await cms.instruction(
        'school admin clicks confirm to re-issue parent password',
        async function () {
            await cms.selectAButtonByAriaLabel('Confirm');
        }
    );
}

export async function schoolAdminCanNotAddImportedParentIntoNewStudent(cms: CMSInterface) {
    const csv = readDownloadFileSync(FileCSV.PARENT + parentCSVFileKey + FileCSV.EXT);

    const parents = parseCSVToJSON<ParentCSV>(csv.toString());

    await cms.instruction('School admin reload page on Student Management', async function () {
        await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
        await cms.page?.reload();
        await cms.assertThePageTitle('Student Management');
    });

    const randomParent = getRandomElement(parents);

    const newStudent = await createARandomStudentGRPC(cms, { parentLength: 0 });

    await goToDetailedStudentInfoPage(cms, newStudent.student);

    await cms.instruction(
        `Cannot add random imported parent: ${randomParent.email} into student: ${newStudent.student.email}`,
        async function () {
            const isCannotSearch = await cannotSearchExistingParent(cms, randomParent.email);

            strictEqual(isCannotSearch, false, `Cannot find imported parent ${randomParent.name}`);
        }
    );
}

export async function schoolAdminCheckImportedParentIntoNewStudent(
    cms: CMSInterface,
    status: ConditionStatusTypes
) {
    const csv = readDownloadFileSync(FileCSV.PARENT + parentCSVFileKey + FileCSV.EXT);

    const parents = parseCSVToJSON<ParentCSV>(csv.toString());

    await cms.instruction('School admin reload page on Student Management', async function () {
        await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
        await cms.page?.reload();
        await cms.assertThePageTitle('Student Management');
    });

    const randomParent = getRandomElement(parents);

    const newStudent = await createARandomStudentGRPC(cms, { parentLength: 0 });

    await goToDetailedStudentInfoPage(cms, newStudent.student);

    await cms.instruction(
        `Cannot add random imported parent: ${randomParent.email} into student: ${newStudent.student.email}`,
        async function () {
            const findParent = await cannotSearchExistingParent(cms, randomParent.email);

            strictEqual(
                findParent,
                status === 'sees',
                `Cannot find imported parent ${randomParent.name}`
            );
        }
    );
}
