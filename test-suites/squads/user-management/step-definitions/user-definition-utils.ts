import { TeacherKeys } from '@common/teacher-keys';
import { profileButtonSelector } from '@legacy-step-definitions/cms-selectors/appbar';
import * as CMSKeys from '@legacy-step-definitions/cms-selectors/cms-keys';
import { LearnerKeys } from '@legacy-step-definitions/learner-keys/learner-key';
import { schoolAdminOpensLocationSettingsInNavBar } from '@legacy-step-definitions/lesson-select-and-view-location-in-location-setting-popup-navbar-definitions';
import {
    FindStatusStudentTypes,
    StudentFieldNotRequired,
    StudentFieldRequired,
    StudentInformation,
} from '@legacy-step-definitions/types/content';
import {
    randomInteger,
    convertOneOfStringTypeToArray,
    convertEnumKeys,
    getRandomNumber,
    getRandomPhoneNumber,
    randomEnumKey,
    generateText,
    getRandomDate,
    capitalizeFirstLetter,
    retrieveLowestLocations,
    splitAndCombinationIntoArray,
    genId,
    arrayHasItem,
    getRandomGradeMaster,
    getRandomUserPhoneNumber,
    randomGrade,
    randomString,
} from '@legacy-step-definitions/utils';
import { partnerInternalLocationAlias } from '@user-common/alias-keys/student';
import {
    learnerProfileAlias,
    locationAddMoreAlias,
    newStudentPackageAlias,
    studentCoursePackagesAlias,
    studentLocationsAlias,
    studentLocationWithTypeAlias,
    locationAliasWithSuffix,
    courseAliasWithSuffix,
    parentProfilesAliasWithTenantAccountRoleSuffix,
    learnerProfileAliasWithTenantAccountRoleSuffix,
} from '@user-common/alias-keys/user';
import { staffListStaffName } from '@user-common/cms-selectors/staff';
import {
    applyButton,
    buttonEdit,
    checkboxLabelHF_isNotLogged,
    courseChipAutoComplete,
    filterButton,
    gradeChipAutoComplete,
    inputCheckbox,
    neverLoggedInSelector,
    rowOption,
    rowsPerPage,
} from '@user-common/cms-selectors/student';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';
import { tableBaseRow } from '@user-common/cms-selectors/students-page';
import { isEnabledFeatureFlag } from '@user-common/helper/feature-flag';
import { StaffInfo } from '@user-common/types/staff';
import { chooseAutocompleteOptionByExactText } from '@user-common/utils/autocomplete-actions';
import { openPopupLocation } from '@user-common/utils/locations';

import { DataTable } from '@cucumber/cucumber';

import { ElementHandle, Locator } from 'playwright';

import axios, { Method } from 'axios';

import {
    CMSInterface,
    LearnerInterface,
    TeacherInterface,
    Locations,
    Courses,
    Tenant,
} from '@supports/app-types';
import { CourseDuration } from '@supports/entities/course-duration';
import { CourseEntityWithLocation } from '@supports/entities/course-entity';
import { CourseStatus } from '@supports/entities/course-status';
import { StudentCoursePackageEntity } from '@supports/entities/student-course-package-entity';
import {
    UserProfileEntity,
    MappedLearnerProfile,
    UserPhoneNumber,
} from '@supports/entities/user-profile-entity';
import { EndpointKeyCloakAndJPREP, MasterCategory, Menu } from '@supports/enum';
import { User_Eibanam_GetPartnerInternalIdByLocationIdsQuery } from '@supports/graphql/bob/bob-types';
import { ScenarioContext } from '@supports/scenario-context';
import bobImportService from '@supports/services/bob-import-service';
import { ImportLocationData } from '@supports/services/bob-import-service/types';
import NsMasterCourseService from '@supports/services/master-course-service/request-types';
import { usermgmtStaffModifierService } from '@supports/services/usermgmt-staff-service';
import NsUsermgmtStaffModifierService from '@supports/services/usermgmt-staff-service/request-types';
import {
    LocationInfoGRPC,
    SelectDatePickerParams,
    StudentDetailTab,
} from '@supports/types/cms-types';
import { formatDate } from '@supports/utils/time/time';

import masterCourseService from '@services/master-course-service';

import { StaffFormData } from './user-create-staff-with-user-group-definitions';
import {
    checkKidChartStatistic,
    clickOnSaveButtonInParentElement,
    findLearnerOnSwitchKidComponent,
    EnrollmentStatus as EnrollmentStatusType,
    schoolAdminChooseTabInStudentDetail,
} from './user-create-student-definitions';
import { AmountLocation, LocationType } from './user-create-student-location-definitions';
import { InvalidPhoneNumber } from './user-create-student-with-phone-number-definitions';
import { getPartnerInternalLocationIds } from './user-hasura';
import { addCourseWhenEditStudent } from './user-modify-course-of-student-definitions';
import {
    StudentListPositionOnCMS,
    verifyNeverLoggedInTagOnCMS,
} from './user-never-logged-in-tag-definitions';
import {
    NeverLoggedInTagCondition,
    tapOnSwitchButtonAndSelectKid,
} from './user-view-student-details-definitions';
import {
    CourseReturnType,
    CourseTypes,
    CourseAndStudentTypes,
    PackageByStudentTypes,
} from './user-view-student-list-definitions';
import { strictEqual } from 'assert';
import CryptoJS from 'crypto-js';
import { ByValueKey } from 'flutter-driver-x';
import { Gender, StudentEnrollmentStatus } from 'manabuf/usermgmt/v2/enums_pb';
import moment from 'moment';
import {
    createLocationType,
    createParentLocation,
} from 'step-definitions/payment-common-definitions';
import { getLocationByName } from 'step-definitions/payment-hasura';
import { createLocationData } from 'step-definitions/payment-utils';
import {
    getRandomElement,
    getRandomElementsWithLength,
    clickOnOkButtonOnDatePickerFooter,
} from 'step-definitions/utils';
import { CourseType } from 'test-suites/squads/architecture/step-definitions/view-course-list-definitions';
import { retry } from 'ts-retry-promise';

export const userTeacherManagementBackOfficeTeacherDetailsNewUI =
    'User_TeacherManagement_BackOffice_TeacherDetailsNewUI';
export const userAuthenticationLearnerRememberedAccount =
    'User_Authentication_Learner_RemoveRememberedAccount';
export const userAuthenticationMultiTenant = 'User_Authentication_MultiTenantAuthentication';
export const userStaffManagementBackOfficeValidationLoginForNewUserGroup =
    'User_StaffManagement_BackOffice_ValidationLoginForNewUserGroup';
export const userAuthenticationApplyNewGetBasicProfileAPI =
    'User_Authentication_BackOffice_ApplyNewGetBasicProfileAPI';
// Examples:
// | profile |
// | name    |
// | avatar  |

export enum StatusDialog {
    OPENS = 'opens',
    CLOSE = 'close',
}

export enum OptionCancel {
    X = 'X button',
    Cancel = 'cancel button',
    ESC = 'ESC key',
}

export const enum FileCSV {
    STUDENT = 'import-student',
    PARENT = 'import-parent',
    CLASS = 'import-class',
    EXT = '.csv',
    NUMBER_VALID_STUDENT = 2,
    NUMBER_INVALID_STUDENT = 1001,
}

export type UploadContentType = 'name' | 'avatar';

export type EditCourseButtonPosition = 'Course Settings page' | 'Course details';

export interface OptionsLearnerInformation<T, K extends keyof T> {
    [key: string]: T[K];
}

export interface GetParamsFromCourseDurationReturnType {
    startDatePickerParams: SelectDatePickerParams;
    endDatePickerParams: SelectDatePickerParams;
}

export interface SelectCourseDurationReturnType {
    startDate: Date;
    endDate: Date;
}

export interface StudentLocationWithType {
    parent: LocationInfoGRPC;
    children: LocationInfoGRPC[];
}

export async function selectCourseDuration(
    cms: CMSInterface,
    courseDuration: CourseDuration
): Promise<SelectCourseDurationReturnType> {
    const { startDatePickerParams, endDatePickerParams } = await getParamsFromCourseDuration(
        courseDuration,
        await selectorEndRowStudentCourseUpsertTable(cms)
    );

    const startDate = await cms.selectDatePickerMonthAndDay(startDatePickerParams);
    const endDate = await cms.selectDatePickerMonthAndDay(endDatePickerParams);

    return {
        startDate: startDate!,
        endDate: endDate!,
    };
}

export async function changeStartDateAndEndDateOfStudentCourse(cms: CMSInterface) {
    const courseStatus = randomCourseStatus();
    const courseDurationValue =
        courseStatus === 'available'
            ? randomAvailableCourseDuration()
            : randomUnavailableCourseDuration();
    await selectCourseDuration(cms, courseDurationValue);
}

async function getParamsFromCourseDuration(
    courseDuration: CourseDuration,
    elementSelector?: Locator
): Promise<GetParamsFromCourseDurationReturnType> {
    const hardcodeDate = 15;
    const currentDate = new Date().getDate();

    const datePickerStartSelector = studentPageSelectors.upsertCourseInfoDatePickerStart;

    const datePickerEndSelector = studentPageSelectors.upsertCourseInfoDatePickerEnd;

    const selectorElementDatePickerStart = elementSelector?.locator(datePickerStartSelector);

    const selectorElementDatePickerEnd = elementSelector?.locator(datePickerEndSelector);

    switch (courseDuration) {
        // start date in the previous 1 month and end date in the next 1 month
        case 'start date <= current date <= end date':
            return {
                startDatePickerParams: {
                    day: hardcodeDate,
                    monthDiff: -1,
                    datePickerSelector: datePickerStartSelector,
                    elementSelector: selectorElementDatePickerStart,
                },
                endDatePickerParams: {
                    day: hardcodeDate,
                    monthDiff: 1,
                    datePickerSelector: datePickerEndSelector,
                    elementSelector: selectorElementDatePickerEnd,
                },
            };
        // start date in the next 1 months and end date in the next day of start date
        case 'start date > current date':
            return {
                startDatePickerParams: {
                    day: hardcodeDate,
                    monthDiff: 1,
                    datePickerSelector: datePickerStartSelector,
                    elementSelector: selectorElementDatePickerStart,
                },
                endDatePickerParams: {
                    day: hardcodeDate + 1,
                    monthDiff: 1,
                    datePickerSelector: datePickerEndSelector,
                    elementSelector: selectorElementDatePickerEnd,
                },
            };
        // start date in the previous 2 months and end date in the previous 1 month
        case 'end date < current date':
            return {
                startDatePickerParams: {
                    day: hardcodeDate,
                    monthDiff: -2,
                    datePickerSelector: datePickerStartSelector,
                    elementSelector: selectorElementDatePickerStart,
                },
                endDatePickerParams: {
                    day: hardcodeDate,
                    monthDiff: -1,
                    datePickerSelector: datePickerEndSelector,
                    elementSelector: selectorElementDatePickerEnd,
                },
            };
        // start date = end date = current date
        case 'start date = end date = current date':
            return {
                startDatePickerParams: {
                    day: currentDate,
                    monthDiff: 0,
                    datePickerSelector: datePickerStartSelector,
                    elementSelector: selectorElementDatePickerStart,
                },
                endDatePickerParams: {
                    day: currentDate,
                    monthDiff: 0,
                    datePickerSelector: datePickerEndSelector,
                    elementSelector: selectorElementDatePickerEnd,
                },
            };
        // start date = end date in the next 1 months
        case 'start date = end date > current date':
            return {
                startDatePickerParams: {
                    day: hardcodeDate,
                    monthDiff: 1,
                    datePickerSelector: datePickerStartSelector,
                    elementSelector: selectorElementDatePickerStart,
                },
                endDatePickerParams: {
                    day: hardcodeDate,
                    monthDiff: 1,
                    datePickerSelector: datePickerEndSelector,
                    elementSelector: selectorElementDatePickerEnd,
                },
            };
        // start date = end date in the previous 1 months
        case 'start date = end date < current date':
            return {
                startDatePickerParams: {
                    day: hardcodeDate,
                    monthDiff: -1,
                    datePickerSelector: datePickerStartSelector,
                    elementSelector: selectorElementDatePickerStart,
                },
                endDatePickerParams: {
                    day: hardcodeDate,
                    monthDiff: -1,
                    datePickerSelector: datePickerEndSelector,
                    elementSelector: selectorElementDatePickerEnd,
                },
            };
        // start date in the previous 1 month and end date in the next 1 month
        default:
            return {
                startDatePickerParams: {
                    day: hardcodeDate,
                    monthDiff: -1,
                    datePickerSelector: datePickerStartSelector,
                    elementSelector: selectorElementDatePickerStart,
                },
                endDatePickerParams: {
                    day: hardcodeDate,
                    monthDiff: 1,
                    datePickerSelector: datePickerEndSelector,
                    elementSelector: selectorElementDatePickerEnd,
                },
            };
    }
}

export async function clickAddCourseDurationButton(cms: CMSInterface) {
    await cms.instruction(`Click Add course button`, async function () {
        const page = cms.page!;
        const tableCoursesAction = await page.waitForSelector(
            studentPageSelectors.tableCoursesAction
        );
        const addCourseDurationButton = await tableCoursesAction!.waitForSelector(
            studentPageSelectors.tableActionButtonAdd
        );
        await addCourseDurationButton.click();
    });
}

export function randomUnavailableCourseDuration(): CourseDuration {
    const unavailableCourse = [
        'start date > current date',
        'end date < current date',
        'start date = end date > current date',
        'start date = end date < current date',
    ] as CourseDuration[];
    const randomIndex = randomInteger(0, unavailableCourse.length - 1);
    return unavailableCourse[randomIndex];
}

export function randomAvailableCourseDuration(): CourseDuration {
    const availableCourse = [
        'start date <= current date <= end date',
        'start date = end date = current date',
    ] as CourseDuration[];
    const randomIndex = randomInteger(0, availableCourse.length - 1);
    return availableCourse[randomIndex];
}

export function randomCourseStatus(): CourseStatus {
    const courseStatuses: CourseStatus[] = ['available', 'unavailable'];
    const randomIndex = randomInteger(0, courseStatuses.length - 1);
    return courseStatuses[randomIndex];
}

export function setEmptyTime(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const _date = date.getDate();
    return new Date(year, month, _date, 0, 0, 0);
}

export function isCourseAvailable(startDate: Date, endDate: Date) {
    const today = setEmptyTime(new Date());
    const _startDate = setEmptyTime(startDate);
    const _endDate = setEmptyTime(endDate);
    return _startDate <= today && today <= _endDate;
}

export async function updateLocation(cms: CMSInterface, location: ImportLocationData) {
    const token = await cms.getToken();
    await cms.attach(`update Location ${location.name}`);

    return await bobImportService.importBobData(token, MasterCategory.Location, location);
}

export async function createNewLocation(cms: CMSInterface): Promise<ImportLocationData> {
    const token = await cms.getToken();

    const { locationTypeName, parentLocationTypeName } = await createLocationType(cms);
    // Import the parent location of E2E to keep E2E centers consistent in every runs
    await createParentLocation(cms, parentLocationTypeName!);

    const importLocationData = createLocationData(locationTypeName, parentLocationTypeName!);

    await bobImportService.importBobData(token, MasterCategory.Location, importLocationData);

    return importLocationData;
}

export async function createRandomLocations(
    cms: CMSInterface,
    length = 1
): Promise<{
    importLocations: ImportLocationData[];
    locationGRPC: LocationInfoGRPC[];
}> {
    const importLocations = [];
    const locationGRPC = [];

    for (let i = 0; i < length; i++) {
        const location = await createNewLocation(cms);
        const { locationId } = await getLocationByName(cms, location.name);

        importLocations.push(location);
        locationGRPC.push({
            locationId,
            name: location.name,
        });
    }
    return { importLocations, locationGRPC };
}

export function getLocationAliasWithSuffix(scenarioContext: ScenarioContext, locations: Locations) {
    const locationKeys = splitAndCombinationIntoArray(locations) as Locations[];

    const locationData = locationKeys.map((key) =>
        scenarioContext.get<LocationInfoGRPC>(locationAliasWithSuffix(key))
    );
    return locationData;
}

export function getCourseAliasWithSuffix(scenarioContext: ScenarioContext, courses: Courses) {
    const courseKeys = splitAndCombinationIntoArray(courses) as Courses[];

    const courseData = courseKeys.map((key) =>
        scenarioContext.get<CourseEntityWithLocation>(courseAliasWithSuffix(key))
    );
    return courseData;
}

export async function openMenuPopupOnWeb(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;

    await learner.instruction(`Open pop up menu on web`, async function (this: LearnerInterface) {
        const appBarProfileFinder = new ByValueKey(LearnerKeys.app_bar_profile);
        await driver.tap(appBarProfileFinder);
    });
}

export async function searchStudentOnCMS(cms: CMSInterface, name: string) {
    const page = cms.page!;

    await cms.instruction(`Search student ${name} on CMS`, async function (this: LearnerInterface) {
        await page.fill(CMSKeys.formFilterAdvancedTextFieldSearchInput, name);
        await page.keyboard.press('Enter');
    });
    await cms.waitForSkeletonLoading();
}

export async function clearSearchStudentOnCMS(cms: CMSInterface) {
    const page = cms.page!;

    await cms.instruction(`Clear search student on CMS`, async function (this: LearnerInterface) {
        await page.fill(CMSKeys.formFilterAdvancedTextFieldSearchInput, '');
        await page.keyboard.press('Enter');
    });
}

export async function findAndSwitchToKidOnLearnerApp(
    learner: LearnerInterface,
    currentKid: UserProfileEntity,
    newKid: UserProfileEntity
) {
    await learner.instruction(
        `Find student ${currentKid.name} on Switch kid UI`,
        async function (this: LearnerInterface) {
            await findLearnerOnSwitchKidComponent(learner, currentKid);
        }
    );

    await tapOnSwitchButtonAndSelectKid(learner, newKid);

    await learner.instruction(
        `Find student ${newKid.name} on Switch kid UI after select`,
        async function (this: LearnerInterface) {
            await findLearnerOnSwitchKidComponent(learner, newKid);
        }
    );

    // TODO: Need to check details chart later
    await learner.instruction(`Check student chart statistic: ${newKid.name}`, async function () {
        await checkKidChartStatistic(learner);
    });
}

export async function goBack(learner: LearnerInterface) {
    await learner.instruction(`Tap Back button`, async function () {
        const driver = learner.flutterDriver!;

        const backButtonFinder = new ByValueKey(LearnerKeys.back_button);
        await driver.tap(backButtonFinder);
    });
}

export async function seeEmptyResultListOnCMS(cms: CMSInterface) {
    const page = cms.page!;

    await cms.instruction(`See empty result icon`, async function () {
        await page.waitForSelector(CMSKeys.lookingForIcon);
    });
}

export async function gotoEditPageOnCMS(cms: CMSInterface, role: string) {
    const page = cms.page!;

    await cms.instruction('Click options button', async () => {
        await page.click(CMSKeys.optionsButton);
    });

    await cms.instruction(`Click Edit ${role} button`, async () => {
        await page.click(buttonEdit, { delay: 1000 });
        await cms.waitForSkeletonLoading();
    });
}

export async function verifyAvatarOnScreen(
    learner: LearnerInterface,
    avatarUrl: string,
    screenName: string
) {
    const driver = learner.flutterDriver!;

    await learner.instruction(
        `Verify new avatar on ${screenName}`,
        async function (this: LearnerInterface) {
            const newAvatarFinder = new ByValueKey(LearnerKeys.avatarWidget(avatarUrl));
            await driver.waitFor(newAvatarFinder);
        }
    );
}

export async function clickOnSaveButtonInStudent(cms: CMSInterface) {
    await cms.instruction(`Click on save button after fill in student`, async function () {
        await clickOnSaveButtonInParentElement(cms);
        await cms.waitingForLoadingIcon();
    });
}

export async function fillBirthdayAndGender(
    cms: CMSInterface,
    { birthday, gender }: Partial<StudentFieldNotRequired>
) {
    await selectDate(cms, studentPageSelectors.formInputBirthday, birthday);

    if (gender) {
        await cms.instruction(`select gender ${gender}`, async () => {
            const studentGender = await cms.page!.waitForSelector(
                studentPageSelectors.radioGenderButton(String(gender))
            );
            await studentGender.click();
        });
    }
}

export async function fillStudentNotRequiredField(
    cms: CMSInterface,
    instruction: string,
    {
        studentExternalId,
        studentNote,
        birthday,
        gender,
        firstNamePhonetic,
        lastNamePhonetic,
    }: Partial<StudentFieldNotRequired>
) {
    const cmsPage = cms.page!;

    const studentInformationContainer = await cmsPage.waitForSelector(
        studentPageSelectors.studentForm
    );

    await cms.instruction(instruction, async function () {
        const externalStudentIDTextField = await studentInformationContainer!.waitForSelector(
            studentPageSelectors.textInputExternalStudentID
        );
        await externalStudentIDTextField.fill(studentExternalId || '');

        const studentNoteTextarea = await studentInformationContainer!.waitForSelector(
            studentPageSelectors.textareaStudentNote
        );
        await studentNoteTextarea.fill(studentNote || '');

        if (studentNote && studentNote.length >= 600) {
            await cms.instruction(
                'Verify Textarea student note can scroll with long text',
                async () => {
                    await studentNoteTextarea.scrollIntoViewIfNeeded();
                }
            );
        }

        await fillBirthdayAndGender(cms, { birthday, gender });

        if (firstNamePhonetic || firstNamePhonetic === '') {
            const firstNamePhoneticTextField = await studentInformationContainer!.waitForSelector(
                studentPageSelectors.formInputFirstNamePhonetic
            );
            await firstNamePhoneticTextField.fill(firstNamePhonetic);
        }

        if (lastNamePhonetic || lastNamePhonetic === '') {
            const lastNamePhoneticTextField = await studentInformationContainer!.waitForSelector(
                studentPageSelectors.formInputLastNamePhonetic
            );
            await lastNamePhoneticTextField.fill(lastNamePhonetic);
        }
    });
}

export async function goToStaffDetailsPage(cms: CMSInterface, name: string) {
    await cms.instruction('Go to Staff detail page', async function (this: CMSInterface) {
        const staffItem = await cms.waitForSelectorWithText(staffListStaffName, name);

        await staffItem?.click();
        await cms.waitForSkeletonLoading();
    });
}

export function getStudentProfileFromUserProfile(user: UserProfileEntity) {
    return {
        id: user.id,
        name: user.name,
        grade: user.gradeValue,
        email: user.email,
    };
}

export async function pressBackButtonTeacherApp(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;

    await teacher.instruction(
        'Press back button on Teacher App',
        async function (this: CMSInterface) {
            const backButtonFinder = new ByValueKey(TeacherKeys.backButton);

            await driver.tap(backButtonFinder);
        }
    );
}

export async function findStudentItemInTableStudentRoot(
    cms: CMSInterface,
    studentId: string
): Promise<ElementHandle<SVGElement | HTMLElement>> {
    const cmsPage = cms.page!;

    const tableStudent = await cmsPage.waitForSelector(studentPageSelectors.tableStudentRoot);

    const studentItem = await tableStudent.waitForSelector(
        studentPageSelectors.tableBaseRowWithId(studentId)
    );

    return studentItem;
}

export async function filterStudent(
    cms: CMSInterface,
    filterNeverLoggedInStudent?: boolean,
    courseName?: string,
    grade?: string,
    studentListPositionOnCMS?: StudentListPositionOnCMS
) {
    const cmsPage = cms.page!;
    const parentSelector =
        studentListPositionOnCMS === 'Lesson Management'
            ? `${CMSKeys.dialogWithHeaderFooter} `
            : ``;

    await cms.instruction('Click Filter button', async function () {
        await cmsPage.waitForSelector(`${parentSelector}${filterButton}`);
        await cmsPage.click(`${parentSelector}${filterButton}`, { timeout: 5000 });
    });

    await cms.instruction(
        `Click Never logged in tag checkbox with value ${filterNeverLoggedInStudent}`,
        async function () {
            const neverLoggedInTagCheckBox = await cmsPage.waitForSelector(
                `${checkboxLabelHF_isNotLogged}`
            );

            if (filterNeverLoggedInStudent !== undefined || filterNeverLoggedInStudent !== null) {
                const checkBox = await neverLoggedInTagCheckBox.waitForSelector(`${inputCheckbox}`);
                const hasChecked = await checkBox.isChecked();

                if (hasChecked && !filterNeverLoggedInStudent) {
                    await checkBox.click();
                } else if (!hasChecked && filterNeverLoggedInStudent) {
                    await checkBox.click();
                }
            }
        }
    );

    if (courseName) {
        await findAndChooseCourse(cms, courseName);
    }

    if (grade) {
        await findAndChooseGrade(cms, grade);
    }

    await cms.instruction('Click Apply button', async function () {
        await cmsPage.click(applyButton);
        await cmsPage.keyboard.press('Escape');
    });
}

export async function findAndChooseCourse(cms: CMSInterface, courseName: string) {
    const cmsPage = cms.page!;

    await cms.instruction(`Find and select course name: ${courseName}`, async function () {
        await cmsPage.fill(`${studentPageSelectors.courseAutoCompleteHF}`, courseName);

        const courseItems = cmsPage.getByText(courseName);
        await courseItems.nth(0).click();
    });

    await cmsPage.keyboard.press('Escape');
}

export async function findAndChooseLastCourse(cms: CMSInterface, courseName: string) {
    const cmsPage = cms.page!;

    await cms.instruction(`Find and select course name: ${courseName}`, async function () {
        const tableBaseRow = await cmsPage.$$(studentPageSelectors.tableBaseRow);
        const lastCourseRow = tableBaseRow[tableBaseRow.length - 1];
        const courseField = await lastCourseRow.waitForSelector(
            studentPageSelectors.courseAutoCompleteHF
        );

        const autocompleteLoading = await cmsPage.$(studentPageSelectors.autocompleteLoading);

        if (autocompleteLoading) {
            await cmsPage.waitForSelector(studentPageSelectors.autocompleteLoading);
        }
        // Waiting for get default list
        await cms.waitingAutocompleteLoading(studentPageSelectors.formCourseInfoAutoCompleteCourse);

        await courseField.type(courseName, {
            delay: 100,
        });

        await cms.page?.waitForTimeout(1000);
        // Waiting for get new list
        await cms.waitingAutocompleteLoading(studentPageSelectors.formCourseInfoAutoCompleteCourse);

        await cms.chooseOptionInAutoCompleteBoxByOrder(1);
    });
}

export async function findAndChooseGrade(cms: CMSInterface, grade: string) {
    const cmsPage = cms.page!;

    await cms.instruction(`Find and select grade: ${grade}`, async function () {
        await cmsPage.fill(`${studentPageSelectors.gradeMasterAutoCompleteHF}`, grade);

        await chooseAutocompleteOptionByExactText(cms, grade);
    });

    await cmsPage.keyboard.press('Escape');
}

export async function verifyFilterResultInStudentList(
    cms: CMSInterface,
    hasLoggedInTag = false,
    courseName?: string,
    grade?: string,
    studentListPositionOnCMS?: StudentListPositionOnCMS
) {
    const cmsPage = cms.page!;
    const loggedInTagDescription = hasLoggedInTag ? '' : 'has "Never logged in" tag';
    const courseDescription = courseName ? '' : `course name : ${courseName}`;
    const gradeDescription = grade ? '' : `grade name: ${grade}`;

    /// Don't know why Lesson and Student Management use difference data test Id
    const _parentSelector =
        studentListPositionOnCMS === 'Lesson Management'
            ? `${CMSKeys.dialogWithHeaderFooter} `
            : ``;

    /// Don't know why Lesson and Student Management use difference data test Id
    const tableSelector =
        studentListPositionOnCMS === 'Student Management'
            ? studentPageSelectors.tableStudent
            : studentPageSelectors.tableStudentRoot;

    if (hasLoggedInTag) {
        await cms.instruction(
            `Verify filter Never logged in tag below filter bar`,
            async function () {
                await cmsPage.waitForSelector(neverLoggedInSelector, { timeout: 10000 });
            }
        );
    }

    if (courseName) {
        await cms.instruction(`Verify filter Course tag below filter bar`, async function () {
            await cmsPage.waitForSelector(courseChipAutoComplete, { timeout: 10000 });
        });
    }

    if (grade) {
        await cms.instruction(`Verify filter Grade tag below filter bar`, async function () {
            await cmsPage.waitForSelector(gradeChipAutoComplete, { timeout: 10000 });
        });
    }

    try {
        await cms.waitForHasuraResponse('User_GetStudentListWithFilter');
    } catch (error) {
        console.log(`Expected student list loading success`);
    }

    await cms.page!.waitForSelector(studentPageSelectors.tableColumnGradeLoading, {
        state: 'hidden',
    });
    await cms.page!.waitForSelector(studentPageSelectors.tableStudentsGradeLoading, {
        state: 'hidden',
    });

    const tableStudent = await cmsPage.waitForSelector(`${_parentSelector}${tableSelector}`);
    const items = await tableStudent.$$(CMSKeys.tableBaseRow);

    for (let i = 0; i < items.length; i++) {
        const studentItem = items[i];

        let studentName = '';
        /// Student List on LessonManagement doesn't has data test id for Student column
        if (studentListPositionOnCMS === 'Student Management') {
            studentName = await (
                await studentItem.waitForSelector(studentPageSelectors.tableStudentName)
            ).innerText();
        } else {
            studentName = await (
                await studentItem.waitForSelector(
                    studentPageSelectors.tableStudentNameOnLessonManagement
                )
            ).innerText();
        }

        await cms.instruction(
            `Verify student item: ${studentName} with filtering: ${loggedInTagDescription} ${courseDescription} ${gradeDescription}`,
            async function () {
                await verifyNeverLoggedInTagOnCMS(
                    cms,
                    studentName,
                    'Student List',
                    hasLoggedInTag!,
                    studentItem
                );

                if (courseName) {
                    let courseNameOnUI;

                    /// Don't know why Lesson and Student Management use difference data test Id
                    if (studentListPositionOnCMS === 'Student Management') {
                        courseNameOnUI = await (
                            await studentItem.waitForSelector(
                                studentPageSelectors.tableStudentCourse
                            )
                        ).textContent();
                    } else if (studentListPositionOnCMS === 'Lesson Management') {
                        courseNameOnUI = await (
                            await studentItem.waitForSelector(
                                studentPageSelectors.tableStudentCourseOnLessonManagement
                            )
                        ).getAttribute('title');
                    }

                    if (!courseNameOnUI?.includes(courseName)) {
                        throw `Student should have course name: ${courseName} after filtering`;
                    }
                }

                if (grade) {
                    let gradeOnUI;
                    if (studentListPositionOnCMS === 'Student Management') {
                        gradeOnUI = await (
                            await studentItem.waitForSelector(
                                studentPageSelectors.tableStudentGrade
                            )
                        ).innerText();
                    } else if (studentListPositionOnCMS === 'Lesson Management') {
                        const columns = await studentItem.$$(`td`);
                        gradeOnUI = await columns[columns.length - 1].innerText();
                    }

                    strictEqual(
                        grade,
                        gradeOnUI,
                        `Student should have grade value: ${grade} after filtering`
                    );
                }
            }
        );
    }
}

export function getRandomOneOfArray(strArray: string) {
    const arrayLength = (strArray.match(/,/g) || []).length;
    const randomIndex = randomInteger(0, arrayLength);
    const newArray = convertOneOfStringTypeToArray(strArray);
    const item = newArray[randomIndex];
    return item;
}

export function getCommentContentByType(comment: string, getShortLink: boolean) {
    const scheme = getShortLink ? '' : 'https://';
    const authority = comment.replace(/\s+/g, '');

    const commentContent = comment.includes('included https')
        ? `${scheme}${authority}.com`
        : comment;
    return commentContent;
}

type HttpClientUserKeyCloakProps = {
    method: Method;
    data?: any;
    token: string;
    userId?: string;
};

interface HttpClientSyncDataFromJPREPPartnerProps
    extends Omit<HttpClientUserKeyCloakProps, 'token' | 'userId'> {
    pathname?: string;
}

export const httpClientUserKeyCloak = ({
    method,
    data,
    token,
    userId = '',
}: HttpClientUserKeyCloakProps) => {
    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    return axios({ method, data, headers, url: EndpointKeyCloakAndJPREP.URL_USER + userId });
};

export const httpClientSyncDataFromJPREPPartner = ({
    method,
    data,
    pathname = '',
}: HttpClientSyncDataFromJPREPPartnerProps) => {
    const keySecret = '91bFbOT0BKfAatp7m';
    const hmacDigest = CryptoJS.enc.Hex.stringify(
        CryptoJS.HmacSHA256(JSON.stringify(data), keySecret)
    );

    const headers = {
        'Content-Type': 'application/json',
        'JPREP-Signature': hmacDigest,
    };
    return axios({
        headers: headers,
        url: EndpointKeyCloakAndJPREP.URL_BASH_JPREP + pathname,
        method,
        data,
    });
};
export type WithoutType = 'blank' | 'space';

export function getStringRandomByWithoutType(withoutType: string) {
    const randIndex = randomInteger(0, 1);
    const types = convertOneOfStringTypeToArray(withoutType);
    const type = types[randIndex];
    return type === 'blank' ? '' : ' ';
}

export async function schoolAdminGoesToStudentDetailPage(
    cms: CMSInterface,
    student: UserProfileEntity,
    isSearch = false
) {
    await cms.instruction('School admin sees students list', async function () {
        await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
    });

    await cms.instruction(`School admin sees detail of ${student.name}`, async function () {
        // await cms.page?.click(`a:has-text("${student.name}")`);
        const elementStudent = await findNewlyCreatedLearnerOnCMSStudentsPage(
            cms,
            student,
            {
                shouldVerifyNeverLoggedInTag: false,
                hasLoggedInTag: false,
            },
            isSearch
        );
        await elementStudent.click();
    });

    await cms.assertThePageTitle(student.name);
}

export async function schoolAdminGoesToStudentDetailAndEdit(
    cms: CMSInterface,
    student: UserProfileEntity,
    isSearch = false
) {
    await schoolAdminGoesToStudentDetailPage(cms, student, isSearch);
    await cms.selectAButtonByAriaLabel('Edit');
}

export async function findNewlyCreatedStudent(
    cms: CMSInterface,
    learnerProfile: UserProfileEntity | MappedLearnerProfile
) {
    const tableStudent = await cms.waitForDataTestId('TableStudent__table');

    const newlyCreatedStudentItem =
        learnerProfile.id && learnerProfile.id !== ''
            ? await tableStudent?.waitForSelector(`tr[data-value="${learnerProfile.id}"]`, {
                  timeout: 10000,
              })
            : await cms.waitForSelectorHasText(
                  studentPageSelectors.tableBaseRow,
                  learnerProfile.name
              );

    await newlyCreatedStudentItem?.scrollIntoViewIfNeeded();

    const newlyCreatedStudentNameItem = await newlyCreatedStudentItem!.waitForSelector(
        studentPageSelectors.tableStudentName,
        { timeout: 10000 }
    );

    const newlyCreatedStudentName = await newlyCreatedStudentNameItem.innerText();
    strictEqual(
        newlyCreatedStudentName,
        learnerProfile.name,
        'The new student name should match with the UI'
    );

    return newlyCreatedStudentItem;
}

/**
 *
 *
 * @export
 * @param {CMSInterface} cms
 * @param {UserProfileEntity} learnerProfile
 * @param {NeverLoggedInTagCondition} [neverLoggedInTagCondition={
 *         shouldVerifyNeverLoggedInTag: false,
 *         hasLoggedInTag: false,
 *     }]
 * @return {*}  {(Promise<ElementHandle<SVGElement | HTMLElement>>)}
 */
export async function findNewlyCreatedLearnerOnCMSStudentsPage(
    cms: CMSInterface,
    learnerProfile: UserProfileEntity,
    neverLoggedInTagCondition: NeverLoggedInTagCondition = {
        shouldVerifyNeverLoggedInTag: false,
        hasLoggedInTag: false,
    },
    isSearch = false
): Promise<ElementHandle<SVGElement | HTMLElement>> {
    const cmsPage = cms.page!;

    try {
        if (isSearch) {
            await cmsPage.fill(
                studentPageSelectors.formFilterAdvancedTextFieldInput,
                learnerProfile.name
            );
            await cmsPage.keyboard.press('Enter');
        } else {
            await cmsPage.click(rowsPerPage);
            await cmsPage.click(rowOption('100'));
        }
    } catch (error) {
        await cms.attach(`User_Error findNewlyCreatedLearnerOnCMSStudentsPage ${error}`);

        await cmsPage.fill(
            studentPageSelectors.formFilterAdvancedTextFieldInput,
            learnerProfile.name
        );
        await cmsPage.keyboard.press('Enter');
    }

    const newlyCreatedStudentItem = await findNewlyCreatedStudent(cms, learnerProfile);

    if (neverLoggedInTagCondition.shouldVerifyNeverLoggedInTag) {
        const newlyCreatedStudentStatusItem = await newlyCreatedStudentItem!.waitForSelector(
            studentPageSelectors.tableStudentStatus
        );

        const newlyCreatedStudentStatus = await newlyCreatedStudentStatusItem.innerText();
        strictEqual(
            newlyCreatedStudentStatus.toLowerCase(),
            learnerProfile.enrollmentStatus,
            'The new student status should match with the UI'
        );
    }

    const newlyCreatedStudentEmailItem = await newlyCreatedStudentItem!.waitForSelector(
        studentPageSelectors.tabletStudentEmail
    );
    const newlyCreatedStudentEmail = await newlyCreatedStudentEmailItem.innerText();
    strictEqual(
        newlyCreatedStudentEmail,
        learnerProfile.email,
        'The new student email should match with the UI'
    );

    if (neverLoggedInTagCondition.shouldVerifyNeverLoggedInTag) {
        await verifyNeverLoggedInTagOnCMS(
            cms,
            learnerProfile.name,
            'Student Details',
            neverLoggedInTagCondition.hasLoggedInTag,
            newlyCreatedStudentItem!
        );
    }

    /// https://playwright.dev/docs/api/class-elementhandle/
    const hrefElement = await newlyCreatedStudentItem!.$('a');

    return hrefElement!;
}

export async function schoolAdminSeesDetailStudentCorrectly(
    cms: CMSInterface,
    student: UserProfileEntity
) {
    const textGeneralEmailValue = await cms.getTextContentElement(
        studentPageSelectors.generalEmailValue
    );
    const textGeneralNoteValue = await cms.getTextContentElement(
        studentPageSelectors.generalNoteValue
    );
    const textGeneralEnrollmentStatusValue = await cms.getTextContentElement(
        studentPageSelectors.generalEnrollmentStatusValue
    );
    const textGeneralGradeValue = await cms.getTextContentElement(
        studentPageSelectors.generalGradeValue
    );
    const textGeneralExternalStudentIDValue = await cms.getTextContentElement(
        studentPageSelectors.generalExternalStudentIDValue
    );
    const textGeneralBirthdayValue = await cms.getTextContentElement(
        studentPageSelectors.generalBirthdayValue
    );
    const textGeneralGenderValue = await cms.getTextContentElement(
        studentPageSelectors.generalGenderValue
    );
    const textGeneralLocationValue = await cms.getTextContentElement(
        studentPageSelectors.generalLocationValue
    );

    const textGeneralFullNamePhoneticValue = await cms.getTextContentElement(
        studentPageSelectors.generalPhoneticNameValue
    );
    weExpect(textGeneralFullNamePhoneticValue, 'UI should contain data full name value').toContain(
        student.fullNamePhonetic
    );

    const textGeneralNameValue = await cms.getTextContentElement(
        studentPageSelectors.generalNameValue
    );
    weExpect(textGeneralNameValue, 'UI should contain data name value').toContain(student.name);

    weExpect(
        textGeneralEnrollmentStatusValue?.toLocaleLowerCase(),
        'UI should contain data enrollment status value'
    ).toContain(student.enrollmentStatus);

    weExpect(textGeneralEmailValue, 'UI should contain data email value ').toContain(student.email);

    weExpect(textGeneralGradeValue, 'UI should contain data grade value').toContain(
        student.gradeMaster?.name?.toString()
    );

    if (student.studentExternalId) {
        weExpect(
            textGeneralExternalStudentIDValue,
            'UI should contain data external student ID value'
        ).toContain(student.studentExternalId);
    }

    if (student.studentNote) {
        weExpect(textGeneralNoteValue, 'UI should contain data note value').toContain(
            student.studentNote
        );
    }

    if (student.birthday) {
        weExpect(textGeneralBirthdayValue, 'UI should contain data birthday value').toContain(
            formatDate(student.birthday, 'YYYY/MM/DD')
        );
    }

    if (student.gender) {
        weExpect(
            textGeneralGenderValue?.toUpperCase(),
            'UI should contain data gender value'
        ).toContain(student.gender);
    }

    if (student.locations && student.locations.length) {
        const { locations } = student;
        const studentLocationsSplit = textGeneralLocationValue?.split(', ');
        strictEqual(
            locations.length,
            studentLocationsSplit?.length,
            `The selected locations length should be equal ${studentLocationsSplit?.length}`
        );

        for (let index = 0; index < locations.length; index++) {
            const locationName = locations[index].name;
            const hasLocation = studentLocationsSplit?.includes(locationName);
            strictEqual(
                hasLocation,
                true,
                `The location ${locationName} should be included in the location list`
            );
        }
    }
}

export function selectorAllRowStudentCourseUpsertTable(cms: CMSInterface): Locator {
    const dialogAddCourse = cms.page!.locator(CMSKeys.dialogWithHeaderFooterWrapper);
    return dialogAddCourse?.locator(tableBaseRow);
}

export async function selectorEndRowStudentCourseUpsertTable(
    cms: CMSInterface
): Promise<Locator | undefined> {
    const rows = selectorAllRowStudentCourseUpsertTable(cms);
    const count = await rows.count();
    if (rows) return rows.nth(count - 1);
}

export const courseRespMapKey = (coursesResp: CourseType[]): Map<string, CourseType> => {
    const map = new Map<string, CourseType>();

    (coursesResp || []).forEach((course: CourseType) => {
        map.set(course.course_id, course);
    });
    return map;
};

export async function selectYear(cms: CMSInterface, datePicker: string, year: number) {
    await cms.instruction(`select year ${year}`, async () => {
        const page = cms.page!;

        await page.click(datePicker);
        await page.click(CMSKeys.pickYearButton);
        const pickersYearSelection = await page.waitForSelector(CMSKeys.muiPickersYearSelection);
        const yearSelected = await pickersYearSelection?.waitForSelector(`text=${year}`);
        await yearSelected.click();

        await clickOnOkButtonOnDatePickerFooter(cms);
    });
}

export async function selectDate(cms: CMSInterface, datePicker: string, date: Date | undefined) {
    if (date) {
        await cms.instruction(`select date ${date}`, async () => {
            const _datePicker = await cms.page!.waitForSelector(datePicker);
            const curMonth = new Date().getMonth();
            const month = date.getMonth();

            await cms.selectDatePickerMonthAndDay({
                day: date.getDate(),
                monthDiff: month - curMonth,
                datePickerSelector: datePicker,
                elementSelector: _datePicker,
            });

            await selectYear(cms, datePicker, date.getFullYear());
        });
    }
}

// Func from cms project
export const mapCoursesEachUniqStudent = (
    studentPackages: PackageByStudentTypes[],
    mapCourses: Map<string, CourseTypes>
) => {
    const mapData = new Map<string, CourseAndStudentTypes>();

    studentPackages.forEach((studentPackage) => {
        const result = mapData.get(studentPackage.student_id!)!;

        const courses: CourseReturnType[] = [];
        // eslint-disable-next-line @typescript-eslint/naming-convention
        (studentPackage.properties.can_do_quiz || []).forEach((course_id: string) => {
            courses.push({
                name: mapCourses.get(course_id)?.name || '',
                student_package_id: studentPackage.student_package_id,
                course_id: course_id,
                end_date: studentPackage.end_at,
                start_date: studentPackage.start_at,
                location_ids: studentPackage.location_ids || [],
            });
        });

        mapData.set(studentPackage.student_id!, {
            ...result,
            studentId: studentPackage.student_id!,
            courses: result ? [...result?.courses, ...courses] : [...courses],
        });
    });

    return [...mapData.values()];
};

export const mapCourses = (courses: CourseTypes[]) => {
    const map = new Map<string, CourseTypes>();

    (courses || []).forEach((course: CourseTypes) => {
        map.set(course.course_id, course);
    });

    return map;
};

export const convertStudentGrade = (grade?: number | null | string) => {
    if (!grade || typeof grade === 'string') {
        return 'Others';
    }
    if (grade >= 1 && grade <= 12) {
        return `Grade ${grade}`;
    }
    if (grade > 12) {
        return `University ${grade - 12}`;
    }
};

const keyStudentEnrollmentStatus = convertEnumKeys(StudentEnrollmentStatus);
enum EnrollmentStatus {
    ENROLLED = 'Enrolled',
    POTENTIAL = 'Potential',
    WITHDRAWN = 'Withdrawn',
    GRADUATED = 'Graduated',
    LOA = 'LOA',
}
export const convertStudentEnrollmentStatus = (status?: string) => {
    switch (status) {
        case keyStudentEnrollmentStatus.STUDENT_ENROLLMENT_STATUS_ENROLLED:
            return EnrollmentStatus.ENROLLED;
        case keyStudentEnrollmentStatus.STUDENT_ENROLLMENT_STATUS_POTENTIAL:
            return EnrollmentStatus.POTENTIAL;
        case keyStudentEnrollmentStatus.STUDENT_ENROLLMENT_STATUS_WITHDRAWN:
            return EnrollmentStatus.WITHDRAWN;
        case keyStudentEnrollmentStatus.STUDENT_ENROLLMENT_STATUS_GRADUATED:
            return EnrollmentStatus.GRADUATED;
        case keyStudentEnrollmentStatus.STUDENT_ENROLLMENT_STATUS_LOA:
            return EnrollmentStatus.LOA;
        default:
            return EnrollmentStatus.ENROLLED;
    }
};

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
    // const randomEnrollmentStatusValue = randomInteger(1, 3);
    /// Temporary hardcode first

    const randomEnumKeyStatus = randomEnumKey(StudentEnrollmentStatus, [
        'STUDENT_ENROLLMENT_STATUS_NONE',
    ]);

    const enrollmentStatus = randomEnumKeyStatus
        .replace('STUDENT_ENROLLMENT_STATUS_', '')
        .toLowerCase() as EnrollmentStatusType;
    const studentExternalId = `External Student ID ${getRandomNumber()}`;
    const studentNote = `Student note ${generateText(1000)}`;
    const birthday = getRandomDate();

    const gender = randomEnumKey(Gender, ['NONE']);

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

export async function goToAddStudentPageAndFillInStudentInformation(
    cms: CMSInterface,
    context: ScenarioContext,
    studentInfo: StudentInformation
) {
    await goToAddStudentPage(cms);

    await cms.instruction(`Fill in student information`, async function () {
        await fillInStudentInformation(cms, context, studentInfo);
    });
}

export async function goToAddStudentPage(cms: CMSInterface) {
    await cms.instruction('Find and click Students tab', async function () {
        await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
    });

    await cms.instruction('Click on Add Button', async function () {
        await cms.page?.locator(studentPageSelectors.buttonGroupDropdown).click();
        const popoverAddButton = cms.page?.locator(studentPageSelectors.buttonGroupDropdownPopover);

        await popoverAddButton
            ?.locator(studentPageSelectors.buttonGroupDropdownValueItem('NORMAL_ADD'))
            .click();
    });
}

export async function fillInStudentInformation(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    {
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
    }: Partial<StudentInformation>
) {
    const cmsPage = cms.page!;

    const studentInformationContainer = await cmsPage.waitForSelector(
        studentPageSelectors.studentForm
    );

    if (firstName) {
        const firstNameTextField = await studentInformationContainer!.waitForSelector(
            studentPageSelectors.formInputFirstName
        );
        await firstNameTextField.fill(firstName);
    }

    if (lastName) {
        const lastNameTextField = await studentInformationContainer!.waitForSelector(
            studentPageSelectors.formInputLastName
        );
        await lastNameTextField.fill(lastName);
    }

    if (firstNamePhonetic) {
        const firstNamePhoneticTextField = await studentInformationContainer!.waitForSelector(
            studentPageSelectors.formInputFirstNamePhonetic
        );
        await firstNamePhoneticTextField.fill(firstNamePhonetic);
    }

    if (lastNamePhonetic) {
        const lastNamePhoneticTextField = await studentInformationContainer!.waitForSelector(
            studentPageSelectors.formInputLastNamePhonetic
        );
        await lastNamePhoneticTextField.fill(lastNamePhonetic);
    }

    if (email) {
        const emailTextField = await studentInformationContainer!.waitForSelector(
            studentPageSelectors.formInputEmail
        );
        await emailTextField.fill(email);
    }

    if (grade) {
        const gradeField = await studentInformationContainer!.waitForSelector(
            studentPageSelectors.gradeAutoComplete
        );
        await gradeField.click();
        await cms.chooseOptionInAutoCompleteBoxByText(grade);
    }

    if (enrollmentStatus) {
        const enrollmentStatusField = await studentInformationContainer!.waitForSelector(
            studentPageSelectors.enrollmentStatusAutoComplete
        );

        await enrollmentStatusField.click();
        await cms.chooseOptionInAutoCompleteBoxByText(capitalizeFirstLetter(enrollmentStatus));
    }

    if (studentExternalId) {
        const externalStudentIDTextField = await studentInformationContainer!.waitForSelector(
            studentPageSelectors.textInputExternalStudentID
        );
        await externalStudentIDTextField.fill(studentExternalId);
    }

    if (studentNote) {
        const studentNoteTextarea = await studentInformationContainer!.waitForSelector(
            studentPageSelectors.textareaStudentNote
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
}

export async function getValueOfLocationItem(
    element: ElementHandle<SVGElement | HTMLElement>
): Promise<string[]> {
    const locationId = (await element.getAttribute('data-value')) || '';
    const locationName = await element.innerText();

    return [locationId, locationName];
}

export async function selectLocationsWithType(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    amount: AmountLocation,
    locationType: LocationType
): Promise<LocationInfoGRPC[]> {
    const page = cms.page!;

    await openPopupLocation(cms);
    await cms.waitingForLoadingIcon();

    const parentLocationItems = await page.$$(
        studentPageSelectors.locationItemByTypeInTreeLocationsDialog('parent')
    );

    if (!arrayHasItem(parentLocationItems)) {
        throw new Error('We do not have any Parent location');
    }

    const randomParentLocationItem =
        getRandomElement<ElementHandle<SVGElement | HTMLElement>>(parentLocationItems);

    const [parentLocationId, parentLocationName] = await getValueOfLocationItem(
        randomParentLocationItem
    );

    const container = await page.waitForSelector(
        studentPageSelectors.parentLocationContainer(parentLocationId)
    );
    const childrenOfParent = await container.$$(studentPageSelectors.childLocationInParentLocation);

    const parentLocation: LocationInfoGRPC = {
        locationId: parentLocationId,
        name: parentLocationName,
    };
    const childLocations: LocationInfoGRPC[] = [];

    if (locationType === LocationType.PARENT) {
        await cms.instruction(
            `school admin selects parent location: ${parentLocationName}`,
            async function () {
                await randomParentLocationItem.scrollIntoViewIfNeeded();
                await randomParentLocationItem.click();

                for (const childLocation of childrenOfParent) {
                    const [childLocationId, childLocationName] = await getValueOfLocationItem(
                        childLocation
                    );

                    childLocations.push({ locationId: childLocationId, name: childLocationName });
                }
            }
        );
    }

    if (locationType === LocationType.CHILD) {
        if (amount === AmountLocation.ONE) {
            const randomLocationItem =
                getRandomElement<ElementHandle<SVGElement | HTMLElement>>(childrenOfParent);
            const [childLocationId, childLocationName] = await getValueOfLocationItem(
                randomLocationItem
            );
            await cms.instruction(
                `school admin selects ONE child location: ${childLocationName}`,
                async function () {
                    await randomLocationItem.scrollIntoViewIfNeeded();
                    await randomLocationItem.click();

                    childLocations.push({ locationId: childLocationId, name: childLocationName });
                }
            );
        }

        if (amount === AmountLocation.ALL) {
            await cms.instruction(
                `school admin selects ALL child locations of parent location: ${parentLocationName}`,
                async function () {
                    for (const childLocation of childrenOfParent) {
                        await childLocation.scrollIntoViewIfNeeded();
                        await childLocation.click();

                        const [childLocationId, childLocationName] = await getValueOfLocationItem(
                            childLocation
                        );

                        childLocations.push({
                            locationId: childLocationId,
                            name: childLocationName,
                        });
                    }
                }
            );
        }
    }

    scenarioContext?.set(studentLocationWithTypeAlias, {
        parent: parentLocation,
        children: childLocations,
    });

    return childLocations;
}

export async function clickOnSaveStudent(cms: CMSInterface) {
    await cms.instruction(
        'School admin click Save button in the Student Upsert page',
        async function () {
            const saveButton = await cms.page!.waitForSelector(
                studentPageSelectors.footerDialogConfirmButtonSave
            );
            await saveButton.click();
        }
    );
}

export async function clickOnSaveInDialog(cms: CMSInterface) {
    await cms.instruction(
        'School admin click Save button in the dialog is active',
        async function () {
            const wrapper = await cms.page!.waitForSelector(
                studentPageSelectors.dialogWithHeaderFooterWrapper
            );
            const saveButton = await wrapper.waitForSelector(
                studentPageSelectors.footerDialogConfirmButtonSave
            );
            await saveButton.click();
        }
    );
}

export async function clickOnCancelInDialog(cms: CMSInterface) {
    await cms.instruction(
        'School admin click Cancel button in the dialog is active',
        async function () {
            const wrapper = await cms.page!.waitForSelector(
                studentPageSelectors.dialogWithHeaderFooterWrapper
            );
            const cancelButton = await wrapper.waitForSelector(
                studentPageSelectors.dialogWithHeaderFooterButtonExit
            );
            await cancelButton.click();
        }
    );
}

export async function chooseLocations(cms: CMSInterface, locations: LocationInfoGRPC[]) {
    await cms.instruction(
        'School admin choose locations in the dialog is active',
        async function () {
            for (let index = 0; index < locations.length; index++) {
                const location = locations[index];

                const locationItem = await cms.page!.waitForSelector(
                    studentPageSelectors.locationItemInTreeLocationsDialog(location.locationId)
                );

                await locationItem.scrollIntoViewIfNeeded();
                await locationItem.click();
            }
        }
    );
}

export async function selectLocations(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    locations?: LocationInfoGRPC[]
) {
    if (!locations || !locations.length) return;

    await openPopupLocation(cms);

    await chooseLocations(cms, locations);

    scenarioContext?.set(studentLocationsAlias, locations);

    await clickOnSaveInDialog(cms);
}

export async function addMoreLocations(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    locationLength: number
) {
    await cms.instruction(
        `School admin adding more ${locationLength} location in the popup`,
        async function () {
            const { locations = [] } = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);
            const locationIds = locations.map((location) => location.locationId);

            const lowestLocations = await retrieveLowestLocations(cms);
            const extantLocations = lowestLocations.filter(
                (location) => !locationIds.includes(location.locationId)
            );

            const isEnough = extantLocations.length >= locationLength;
            strictEqual(true, isEnough, `location is still enough`);

            const newLocations = extantLocations.slice(0, locationLength);
            await chooseLocations(cms, newLocations);

            scenarioContext?.set(locationAddMoreAlias, newLocations);
        }
    );
}

export async function countLocationBySelectedText(cms: CMSInterface) {
    const wrapper = await cms.page!.waitForSelector(
        studentPageSelectors.dialogWithHeaderFooterWrapper
    );
    const subNote = await wrapper?.waitForSelector(
        studentPageSelectors.dialogWithHeaderFooterSubNote
    );
    //Selected: Center 1, Center 2, +8
    const subNoteTextContent = await subNote.textContent();
    const subNoteContent = subNoteTextContent?.slice(10, subNoteTextContent.length);
    const _subNoteSplit = subNoteContent?.split(', ');
    const subNoteSplit = _subNoteSplit ? _subNoteSplit : [];
    const lastSubNote = subNoteSplit[subNoteSplit.length - 1];
    const isPlus = lastSubNote.includes('+');
    if (isPlus) {
        const numberPlus = Number(lastSubNote.slice(1, lastSubNote.length));
        return subNoteSplit.length - 1 + numberPlus;
    } else {
        return subNoteSplit.length;
    }
}

//check Location chip with learnerProfileAlias and checkbox inner Dialog
export async function checkLocationInUpsertPage(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    await cms.instruction('check location field in edit page', async function () {
        const page = cms.page!;
        const { locations = [] } = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);

        const locationInput = await page.waitForSelector(studentPageSelectors.locationInput);
        const locationChips = await locationInput.$$(studentPageSelectors.locationChips);

        if (locations.length > 10) {
            const remainingChip = await page.locator(studentPageSelectors.locationChipLimitTags);
            const remainingText = await remainingChip.textContent();
            const remaining = locations.length - 10;

            strictEqual(
                remainingText,
                `+ ${remaining}`,
                `The remaining text should be + ${remaining}`
            );
        } else {
            strictEqual(
                locations.length,
                locationChips.length,
                `location length with location chips`
            );
        }

        await openPopupLocation(cms);

        await checkLocationItem(cms, locations);

        await clickOnCancelInDialog(cms);
    });
}

export async function checkLocationItem(
    cms: CMSInterface,
    locations: LocationInfoGRPC[],
    isChecked = true
) {
    await cms.instruction(`School admin check location item in the popup`, async function () {
        for (let index = 0; index < locations.length; index++) {
            const location = locations[index];

            const locationItem = await cms.page!.waitForSelector(
                studentPageSelectors.locationItemInTreeLocationsDialog(location.locationId)
            );

            const locationCheckbox = await locationItem.waitForSelector('input[type="checkbox"]');
            const isCheck = await locationCheckbox.isChecked();
            strictEqual(
                isChecked,
                isCheck,
                `check box ${location.name} ${isChecked ? 'was' : `wasn't`} checked`
            );
        }
    });
}

export async function createRandomCoursesWithLocations(
    cms: CMSInterface,
    {
        quantity = 1,
        locationLength,
        locations = [],
    }: {
        quantity: number;
        locationLength?: number;
        locations?: LocationInfoGRPC[];
    } = { quantity: 1 }
) {
    if (quantity < 1) return { request: [] };

    const token = await cms.getToken();
    const { iconUrl, schoolId } = await cms.getContentBasic();
    let locationsList: LocationInfoGRPC[];
    if (arrayHasItem(locations)) {
        locationsList = locations;
    } else {
        const allLocations = await retrieveLowestLocations(cms);
        locationsList = getRandomElementsWithLength<LocationInfoGRPC>(
            allLocations,
            locationLength || allLocations.length
        );
    }

    const courses: NsMasterCourseService.UpsertCoursesRequest[] = [...Array(quantity)].map(() => {
        const id = genId();

        const locationIdsList = locationsList.map((_) => _.locationId);

        return {
            id,
            name: `Course Name ${id}`,
            displayOrder: 1,
            bookIdsList: [],
            icon: iconUrl,
            schoolId,
            locationIdsList,
            locations: locationsList,
            courseType: '',
        };
    });

    return await masterCourseService.upsertCourses(token, courses);
}

export async function createRandomCoursesWithSpecificLocations(
    cms: CMSInterface,
    {
        quantity = 1,
    }: {
        quantity: number;
    } = { quantity: 1 },
    locationIdsList: Array<string>
) {
    if (quantity < 1) return { request: [] };

    const token = await cms.getToken();
    const { iconUrl, schoolId } = await cms.getContentBasic();

    const courses: NsMasterCourseService.UpsertCoursesRequest[] = [...Array(quantity)].map(() => {
        const id = genId();

        return {
            id,
            name: `Course Name ${id}`,
            displayOrder: 1,
            bookIdsList: [],
            icon: iconUrl,
            schoolId,
            locationIdsList,
            courseType: '',
        };
    });

    return await masterCourseService.upsertCourses(token, courses);
}

export async function selectCourseLocation(cms: CMSInterface, location?: any) {
    if (!location || !location.locationId) return;

    const endRowTableCourse = await selectorEndRowStudentCourseUpsertTable(cms);

    await cms.instruction('Select location', async function () {
        const locationCell = endRowTableCourse?.locator(
            studentPageSelectors.studentCourseUpsertTableLocation
        );
        const inputLocation = locationCell?.getByPlaceholder('Location');

        await inputLocation?.type(location.name, { delay: 100 });

        await chooseAutocompleteOptionByExactText(cms, location.name);
    });
}

export async function updateAnUserGRPC(
    cms: CMSInterface,
    userProfile: NsUsermgmtStaffModifierService.updateStaffReq
) {
    const token = await cms.getToken();
    const response = await usermgmtStaffModifierService.updateStaff(token, userProfile);
    return response;
}

export async function gotoEditStudentCourse(cms: CMSInterface, student: UserProfileEntity) {
    await schoolAdminGoesToStudentDetailPage(cms, student);

    await cms.selectTabButtonByText(studentPageSelectors.tabLayoutStudent, 'Course');

    await cms.waitForSkeletonLoading();

    await cms.selectAButtonByAriaLabel('Edit');
}

export async function createStudentCourse(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    options: {
        courseStatus: CourseStatus;
        courseId: string;
        courseName: string;
        location?: LocationInfoGRPC;
    }
) {
    const { courseStatus, courseId, courseName, location } = options;
    const studentCoursePackages =
        scenarioContext.get<Array<StudentCoursePackageEntity>>(studentCoursePackagesAlias) || [];

    const courseCreatedData = await addCourseWhenEditStudent(
        cms,
        courseStatus,
        courseName,
        location,
        true
    );

    const newStudentCoursePackage = {
        courseId,
        courseName,
        /// No need studentPackageId when create with API
        studentPackageId: '',
        startDate: courseCreatedData.startDate!,
        endDate: courseCreatedData.endDate!,
        locationIds: courseCreatedData.locationIds,
    };

    studentCoursePackages.push(newStudentCoursePackage);
    scenarioContext.set(studentCoursePackagesAlias, studentCoursePackages);
    scenarioContext.set(newStudentPackageAlias, newStudentCoursePackage);
}

export function setUserProfileWithTennantToContext({
    context,
    accountType,
    data,
    tenant,
}: {
    context: ScenarioContext;
    accountType: 'parent' | 'student';
    data: UserProfileEntity | StudentInformation | UserProfileEntity[];
    tenant: Tenant;
}) {
    if (accountType === 'parent') {
        context.set(parentProfilesAliasWithTenantAccountRoleSuffix(`school admin ${tenant}`), data);
    } else {
        context.set(learnerProfileAliasWithTenantAccountRoleSuffix(`school admin ${tenant}`), data);
    }
}

export function getUserProfileWithTennantFromContext<T = string | string[]>({
    context,
    accountType,
    tenant,
}: {
    context: ScenarioContext;
    accountType: 'parent' | 'student';
    tenant: Tenant;
}): T {
    if (accountType === 'parent') {
        return context.get<T>(
            parentProfilesAliasWithTenantAccountRoleSuffix(`school admin ${tenant}`)
        );
    } else {
        return context.get<T>(
            learnerProfileAliasWithTenantAccountRoleSuffix(`school admin ${tenant}`)
        );
    }
}

export async function schoolAdminSeesNewStudentBySearch(
    cms: CMSInterface,
    keyWord: string,
    statusStudent: FindStatusStudentTypes
): Promise<ElementHandle<SVGElement | HTMLElement> | undefined> {
    const cmsPage = cms.page!;
    await cmsPage.fill(studentPageSelectors.formFilterAdvancedTextFieldInput, keyWord);
    await cmsPage.keyboard.press('Enter');

    switch (statusStudent) {
        case 'sees': {
            const tableStudent = await cms.waitForDataTestId('TableStudent__table');
            return await tableStudent?.waitForSelector(`text=${keyWord}`);
        }
        case 'does not see':
            return await cms.page?.waitForSelector(CMSKeys.lookingForIcon);
        default:
            throw new Error("Don't have type map to status student");
    }
}

export async function randomPartnerInternalLocationIds(cms: CMSInterface): Promise<string> {
    const locations = await retrieveLowestLocations(cms);
    const locationIds = locations.map((location) => location.locationId);

    const resp = await getPartnerInternalLocationIds(cms, { location_ids: locationIds });

    const partnerInternalIds = resp?.locations.map((location) => location.partner_internal_id);

    return partnerInternalIds?.[randomInteger(0, partnerInternalIds?.length || 1 - 1)] || '';
}

export async function randomPartnerInternalLocationIdsByContext(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    const locationsContext = scenarioContext.get<
        User_Eibanam_GetPartnerInternalIdByLocationIdsQuery['locations']
    >(partnerInternalLocationAlias);
    const locations = locationsContext ? locationsContext : await getPartnerInternalLocation(cms);
    !locationsContext && scenarioContext.set(partnerInternalLocationAlias, locations);

    const partnerInternalIds = locations?.map((location) => location.partner_internal_id);

    return partnerInternalIds?.[randomInteger(0, partnerInternalIds?.length || 1 - 1)] || '';
}

export async function getPartnerInternalLocation(cms: CMSInterface) {
    const locations = await retrieveLowestLocations(cms);
    const locationIds = locations.map((location) => location.locationId);

    const resp = await getPartnerInternalLocationIds(cms, { location_ids: locationIds });
    return resp?.locations;
}

export async function assertStudentCourseListIsEmpty(cms: CMSInterface) {
    const cmsPage = cms.page!;
    await cms.instruction(
        `Student package list in student details should be empty`,
        async function () {
            await schoolAdminChooseTabInStudentDetail(cms, StudentDetailTab.COURSE);

            const studentCourseTable = await cmsPage.waitForSelector(
                studentPageSelectors.studentCourseTable
            );
            const tableBaseNoDataMessage = await studentCourseTable.waitForSelector(
                studentPageSelectors.tableBaseNoDataMessage
            );
            await tableBaseNoDataMessage.scrollIntoViewIfNeeded();
        }
    );
}

export async function assertStudentCourseListToBeMatched(
    cms: CMSInterface,
    studentPackages: StudentCoursePackageEntity[]
) {
    const cmsPage = cms.page!;
    const studentCourseTable = await cmsPage.waitForSelector(
        studentPageSelectors.studentCourseTable
    );

    const studentPackageRows = await studentCourseTable.$$(studentPageSelectors.tableBaseRow);
    strictEqual(
        studentPackages.length,
        studentPackageRows.length,
        'Expect the course length from data should be matched with UI'
    );

    await cms.instruction(`Verify student package list in student details`, async function () {
        await cms.waitForSkeletonLoading();

        const courseNames = await cms.getTextContentMultipleElements(
            studentPageSelectors.studentCourseTableName
        );

        const courseStartDates = await cms.getTextContentMultipleElements(
            studentPageSelectors.studentCourseTableStartDate
        );

        const courseEndDates = await cms.getTextContentMultipleElements(
            studentPageSelectors.studentCourseTableEndDate
        );

        const courseLocationIds: string[] = [];
        const studentCourseCells = await cmsPage.$$(
            studentPageSelectors.studentCourseTableLocation
        );

        for (let index = 0; index < studentCourseCells.length; index++) {
            const element = studentCourseCells[index];
            const locationId = await element.getAttribute('data-value');
            courseLocationIds.push(locationId || '');
        }

        await cms.instruction(
            'School admin sees data course displayed correctly',
            async function () {
                studentPackages.forEach((data, index) => {
                    weExpect(
                        data.courseName,
                        'Content name UI should be display data correctly'
                    ).toBe(courseNames[index]);

                    weExpect(
                        moment(new Date(data.startDate)).format('YYYY/MM/DD'),
                        'Content start date UI should be display data correctly'
                    ).toBe(courseStartDates[index]);

                    weExpect(
                        moment(new Date(data.endDate)).format('YYYY/MM/DD'),
                        'Content end date UI should be display data correctly'
                    ).toBe(courseEndDates[index]);

                    weExpect(
                        data.locationIds ? data.locationIds[0] : '',
                        'Content location UI should be display data correctly'
                    ).toBe(courseLocationIds[index]);
                });
            }
        );
    });
}

export async function goToStudentDetailByLinkWithStudentId(cms: CMSInterface, studentId: string) {
    const newStudentLink = `user/students_erp/${studentId}/show`;

    await cms.instruction(`Go to student detail by link ${newStudentLink}`, async function () {
        await cms.page!.goto(newStudentLink);
        await cms.waitingForLoadingIcon();
    });
}

export async function userIsOnStudentDetailPage(cms: CMSInterface) {
    const page = cms.page!;

    await Promise.all([
        cms.waitForTabListItem(studentPageSelectors.StudentsPageDetailTabNames.DETAIL),
        page.waitForSelector(studentPageSelectors.studentDetailTabList),
        page.waitForSelector(studentPageSelectors.tabStudentDetailRoot),
        page.waitForSelector(studentPageSelectors.editStudentButton),
    ]);
}

export async function goToDetailedStudentInfoPage(cms: CMSInterface, student: UserProfileEntity) {
    await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);

    await retry(
        async function () {
            await goToStudentDetailByLinkWithStudentId(cms, student.id);
            await userIsOnStudentDetailPage(cms);
        },
        { retries: 1 }
    ).catch(async function () {
        throw new Error('404 page not found error');
    });
}

/**
 * @description Extract all digits from a string, then convert them to numbers
 * @param string A string to extract digits
 */
export function extractNumberFromString(string = ''): number {
    const digits = string.replace(/[^\d]/g, '');
    return parseInt(digits, 10);
}

export function createRandomStaff(numberOfUserGroups = 1, userGroupNames?: string[]) {
    const randomNumber = getRandomNumber();
    const name = `e2e-staff.${randomNumber}`;
    const email = `e2e-staff.${randomNumber}@manabie.com`;

    const staffFormData: StaffFormData = {
        name,
        email,
        numberOfUserGroups,
        userGroupNames,
    };
    return staffFormData;
}

export function createRandomStaffData(staffOverride?: Partial<StaffInfo>) {
    const randomName = `e2e-staff.${getRandomNumber()}.${randomString(10)}`;
    const staff: StaffInfo = {
        name: randomName,
        email: `${randomName}@manabie.com`,
        primaryPhoneNumber: getRandomUserPhoneNumber(),
        secondaryPhoneNumber: getRandomUserPhoneNumber() + 1,
        birthday: getRandomDate(),
        gender: 'MALE',
        location: [],
        userGroup: [],
        workingStatus: 'Available',
        startDate: new Date(),
        endDate: new Date(),
        remarks: 'remarks',
        ...staffOverride,
    };
    return staff;
}

export async function applyOrgForLocationSetting(cms: CMSInterface) {
    const page = cms.page!;
    await page.locator(profileButtonSelector).click();
    await page.locator(CMSKeys.userMenuSettingButton).click();
    const locationDialog = page.locator(CMSKeys.dialogWithHeaderFooter);
    const orgLocation = locationDialog.locator('input').first();
    await orgLocation.check();
    await page.locator(CMSKeys.saveButtonInDialog).click();
}

export async function applyOrgForStudentLocation({
    cms,
    isOpenPopup = true,
    isClickedSaveButton = true,
}: {
    cms: CMSInterface;
    isOpenPopup?: boolean;
    isClickedSaveButton?: boolean;
}) {
    const page = cms.page!;

    if (isOpenPopup) {
        await openPopupLocation(cms);
    }

    const locationDialog = page.locator(CMSKeys.dialogWithHeaderFooter);
    const orgLocation = locationDialog.locator('input').first();
    await orgLocation.click();

    if (isClickedSaveButton) {
        await page.locator(CMSKeys.saveButtonInDialog).click();
    }
}

export const getInvalidPhoneNumber = (invalidType: InvalidPhoneNumber): UserPhoneNumber => {
    switch (invalidType) {
        case 'incorrect length':
            return { studentPhoneNumber: '123' };
        case 'letters':
            return { studentPhoneNumber: 'abc xyz' };
        case 'special characters':
            return { studentPhoneNumber: '<>=()' };
        default: {
            const studentPhoneNumber = getRandomUserPhoneNumber();
            return {
                studentPhoneNumber,
                homePhoneNumber: studentPhoneNumber,
            };
        }
    }
};

export async function selectOneLocation(cms: CMSInterface, locationId: string) {
    await schoolAdminOpensLocationSettingsInNavBar(cms);

    const checkBox = await cms.page!.waitForSelector(CMSKeys.checkBoxLocation(locationId));
    const isChecked = await checkBox.isChecked();

    if (!isChecked) {
        await checkBox?.scrollIntoViewIfNeeded();

        await cms.selectElementByDataTestId(CMSKeys.checkBoxLocation(locationId));
    }

    await clickOnSaveInDialog(cms);
}
