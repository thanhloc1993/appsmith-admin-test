import { aliasFirstGrantedLocation } from '@legacy-step-definitions/alias-keys/architecture';
import * as CMSKeys from '@legacy-step-definitions/cms-selectors/cms-keys';
import { LearnerKeys } from '@legacy-step-definitions/learner-keys/learner-key';
import {
    teacherAppliesSelectedLocationOnTeacherApp,
    teacherOpenLocationFilterDialogOnTeacherApp,
    teacherSelectLocationsOnTeacherApp,
} from '@legacy-step-definitions/lesson-teacher-sees-respective-course-after-applying-location-in-location-settings-definitions';
import { StudentInformation, UserSimpleInformation } from '@legacy-step-definitions/types/content';
import {
    getRandomNumber,
    delay,
    convertTimestampToDate,
    randomEnumKey,
    getRandomPhoneNumber,
    getRandomDate,
    randomInteger,
    getRandomElementsWithLength,
    retrieveLowestLocations,
    randomString,
    genId,
    getRandomGradeMaster,
} from '@legacy-step-definitions/utils';
import {
    learnerProfileAlias,
    parentProfilesAlias,
    learnerProfileAliasWithAccountRoleSuffix,
    parentProfilesAliasWithAccountRoleSuffix,
    studentPackagesAlias,
    studentLocationsAlias,
} from '@user-common/alias-keys/user';
import { addParentOption } from '@user-common/cms-selectors/student';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';
import { isEnabledFeatureFlag } from '@user-common/helper/feature-flag';

import { ElementHandle } from 'playwright';

import { CMSInterface, LearnerInterface } from '@supports/app-types';
import { AccountRoles, TeacherInterface } from '@supports/app-types';
import { CourseDuration } from '@supports/entities/course-duration';
import { CourseEntityWithLocation } from '@supports/entities/course-entity';
import { CourseStatus } from '@supports/entities/course-status';
import { StudentCoursePackageEntity } from '@supports/entities/student-course-package-entity';
import { UserAddress, UserProfileEntity } from '@supports/entities/user-profile-entity';
import { User_Eibanam_GetListGradeQuery } from '@supports/graphql/bob/bob-types';
import { ScenarioContext } from '@supports/scenario-context';
import { toTimestampServerTimezone } from '@supports/services/common/request';
import masterCourseService from '@supports/services/master-course-service';
import NsMasterCourseService from '@supports/services/master-course-service/request-types';
import { usermgmtUserModifierService } from '@supports/services/usermgmt-student-service';
import NsUsermgmtUserModifierService from '@supports/services/usermgmt-student-service/request-types';
import NsYasuoCourseServiceRequest from '@supports/services/yasuo-course/request-types';
import {
    StudentDetailTab,
    AddParentOption,
    LocationInfoGRPC,
    LocationObjectGRPC,
} from '@supports/types/cms-types';
import { ArrayElement } from '@supports/types/cms-types';

import { getRandomLocation } from './user-common-definitions';
import {
    createRandomCoursesWithLocations,
    findNewlyCreatedLearnerOnCMSStudentsPage,
    selectCourseLocation,
    findAndChooseLastCourse,
    selectCourseDuration,
    goToAddStudentPageAndFillInStudentInformation,
    createRandomStudentData,
    applyOrgForLocationSetting,
} from './user-definition-utils';
import { clickAddCourseButton } from './user-student-course-common-definitions';
import { clickOnStudentOnStudentsTab } from './user-view-student-details-definitions';
import { ByValueKey } from 'flutter-driver-x';
import { RetrieveLowestLevelLocationsResponse } from 'manabuf/bob/v1/masterdata_pb';
import { Country } from 'manabuf/common/v1/enums_pb';
import { FamilyRelationship, Gender, StudentEnrollmentStatus } from 'manabuf/usermgmt/v2/enums_pb';
import { StudentContactPreference } from 'manabuf/usermgmt/v2/users_pb';
import { CreateStudentResponseEntity } from 'supports/services/usermgmt-student-service/entities/create-student-response';
import { createRandomCourses } from 'test-suites/common/step-definitions/course-definitions';
import { retry } from 'ts-retry-promise';

export type EnrollmentStatus = 'potential' | 'enrolled' | 'withdrawn' | 'graduated' | 'loa';

export type GenderType = 'MALE' | 'FEMALE' | 'NONE';
export type GradeMaster = ArrayElement<User_Eibanam_GetListGradeQuery['grade']>;
interface CreateAStudentPromiseOptionProps {
    hasPhoneNumber?: boolean;
    defaultEnrollmentStatus?: keyof typeof StudentEnrollmentStatus;
    locationLength?: number;
    countryCode?: Country;
    grade?: GradeMaster;
    locations?: LocationInfoGRPC[];
    userAddressList?: UserAddress[];
    studentPhoneNumber?: NsUsermgmtUserModifierService.CreateStudentProfile['studentPhoneNumber'];
}

export async function createAStudentPromise(
    cms: CMSInterface,
    {
        hasPhoneNumber = true,
        defaultEnrollmentStatus,
        locationLength,
        countryCode,
        locations,
        grade,
        userAddressList,
        studentPhoneNumber,
    }: CreateAStudentPromiseOptionProps
): Promise<CreateStudentResponseEntity['student']> {
    const token = await cms.getToken();
    const { schoolId } = await cms.getProfile();

    const firstName = `${randomString(8)}@manabie.com`;
    const lastName = `e2e-student.${getRandomNumber()}`;
    const name = `${lastName} ${firstName}`;
    const email = `${lastName}.${firstName}`;
    const firstNamePhonetic = `first-${randomString(8)}`;
    const lastNamePhonetic = `last-${randomString(8)}`;
    const fullNamePhonetic = `${lastNamePhonetic} ${firstNamePhonetic}`;

    const phoneNumber = hasPhoneNumber ? getRandomPhoneNumber() : '';
    const gradeNumber = randomInteger(1, 12);
    const gradeMaster = grade ? grade : await getRandomGradeMaster(cms);
    const password = '123456789';

    const enrollmentStatusRandomKey = defaultEnrollmentStatus
        ? defaultEnrollmentStatus
        : randomEnumKey(StudentEnrollmentStatus, ['STUDENT_ENROLLMENT_STATUS_NONE']);

    const _countryCode = countryCode ?? Country.COUNTRY_JP;

    const studentExternalId = `External Student ID ${getRandomNumber()}`;
    const studentNote = `Student note ${getRandomNumber()}`;

    const birthday = getRandomDate();
    const gender = Gender[randomEnumKey(Gender, ['NONE'])];

    const finalLocations = locations ? locations : await getRandomLocation(cms, locationLength);
    const locationIdsList = finalLocations.map((_) => _.locationId);

    const studentProfileReq: NsUsermgmtUserModifierService.CreateStudentProfile = {
        email,
        name,
        firstName,
        lastName,
        firstNamePhonetic,
        lastNamePhonetic,
        password,
        countryCode: _countryCode,
        phoneNumber,
        grade: gradeNumber,
        gradeId: gradeMaster?.grade_id,
        enrollmentStatus: StudentEnrollmentStatus[enrollmentStatusRandomKey],
        studentExternalId,
        studentNote,
        birthday,
        gender,
        locationIdsList,
        enrollmentStatusStr: enrollmentStatusRandomKey,
        studentPhoneNumber: studentPhoneNumber || {
            contactPreference: StudentContactPreference['STUDENT_PHONE_NUMBER'],
            phoneNumber: '',
            homePhoneNumber: '',
        },
        tagIdsList: [],
    };

    const { response } = await usermgmtUserModifierService.createStudent(token, {
        schoolId,
        studentProfile: studentProfileReq,
        schoolHistoriesList: [],
        userAddressesList: userAddressList || [],
    });

    const enrollmentStatus = enrollmentStatusRandomKey
        .replace('STUDENT_ENROLLMENT_STATUS_', '')
        .toLowerCase() as EnrollmentStatus;

    const studentProfile = response!.studentProfile!.student;
    const userProfile = studentProfile!.userProfile;

    return {
        id: userProfile!.userId,
        email: userProfile!.email,
        name: userProfile!.name,
        firstName,
        lastName,
        firstNamePhonetic,
        lastNamePhonetic,
        fullNamePhonetic,
        avatar: userProfile!.avatar,
        phoneNumber: userProfile!.phoneNumber,
        givenName: userProfile!.givenName,
        password: password,
        enrollmentStatus: enrollmentStatus,
        gradeValue: studentProfile?.grade,
        gradeMaster: gradeMaster,
        studentExternalId: studentExternalId,
        studentNote: studentNote,
        locations: finalLocations,
    };
}

export async function createParentsPromise(
    cms: CMSInterface,
    payload: {
        studentId: string;
        studentName: string;
        parentLength: number;
        hasPhoneNumber?: boolean;
    }
): Promise<CreateStudentResponseEntity['parents']> {
    const { studentId, studentName, parentLength, hasPhoneNumber = true } = payload;
    const token = await cms.getToken();
    const { schoolId } = await cms.getProfile();
    const password = '123456789';

    const parentProfilesList = Array.from<
        { length: number },
        NsUsermgmtUserModifierService.CreateParentProfile
    >({ length: parentLength }, (_, i) => {
        const parentUsername = studentName.replace('@manabie.com', `+parent${i}@manabie.com`);
        const phoneNumber = hasPhoneNumber ? getRandomPhoneNumber() : '';
        const familyRelationshipRandomKey = randomEnumKey(FamilyRelationship, [
            'FAMILY_RELATIONSHIP_NONE',
        ]);
        return {
            name: parentUsername,
            email: parentUsername,
            password,
            countryCode: Country.COUNTRY_JP,
            phoneNumber,
            relationship: FamilyRelationship[familyRelationshipRandomKey],
            tagIdsList: [],
            parentPhoneNumbersList: [],
            remarks: randomString(20),
        };
    });

    const { response } = await usermgmtUserModifierService.createParentReq(token, {
        schoolId,
        studentId,
        parentProfilesList,
    });

    const parentList = response!.parentProfilesList.map(({ parent }) => {
        const userProfile = parent?.userProfile;

        return {
            id: userProfile!.userId,
            email: userProfile!.email,
            name: userProfile!.name,
            avatar: userProfile!.avatar,
            phoneNumber: userProfile!.phoneNumber,
            givenName: userProfile!.givenName,
            password,
        };
    });

    return parentList;
}

export async function createACoursePromise(cms: CMSInterface): Promise<CourseEntityWithLocation> {
    const token = await cms.getToken();

    const { iconUrl, schoolId } = await cms.getContentBasic();
    const locationsList = await retrieveLowestLocations(cms);

    const id = genId();
    const randomLocations = getRandomElementsWithLength<LocationInfoGRPC>(locationsList, 1);
    const locationIdsList = randomLocations.map((_) => _.locationId);

    const course: NsMasterCourseService.UpsertCoursesRequest = {
        id,
        name: `Course Name ${id}`,
        displayOrder: 1,
        bookIdsList: [],
        icon: iconUrl,
        schoolId,
        locationIdsList,
        courseType: '',
    };

    const { request: courses } = await masterCourseService.upsertCourses(token, [course]);
    const courseData = courses[0];

    return {
        id: courseData.id,
        name: courseData.name,
        iconUrl: courseData.icon,
        locations: randomLocations,
    };
}

export async function createCoursePromise(
    cms: CMSInterface,
    payload: {
        studentId: string;
        courseLength: number;
        courseStatus: CourseStatus;
        studentLocations?: LocationInfoGRPC[];
        withLocation?: boolean;
    }
): Promise<Omit<CreateStudentResponseEntity, 'student' | 'parents'>> {
    const {
        studentId,
        courseLength,
        courseStatus = 'available',
        withLocation = false,
        studentLocations = [],
    } = payload;
    const token = await cms.getToken();

    const createCourseApi = withLocation ? createRandomCoursesWithLocations : createRandomCourses;
    const locations =
        withLocation && studentLocations.length ? { locations: studentLocations } : {};

    const { request } = await createCourseApi(cms, {
        quantity: courseLength,
        ...locations,
    });

    const courses = request;
    const startTime = new Date();
    const endTime = new Date();

    if (courseStatus === 'available') {
        startTime.setDate(startTime.getDate() - 1);
        endTime.setDate(endTime.getDate() + 1);
    } else {
        startTime.setDate(startTime.getDate() - 3);
        endTime.setDate(endTime.getDate() - 2);
    }

    const newCourses = await createStudentPackageProfiles(cms, {
        courseIds: request.map(
            (
                course:
                    | NsYasuoCourseServiceRequest.UpsertCourses
                    | NsMasterCourseService.UpsertCoursesRequest
            ) => course.id
        ),
        startTime,
        endTime,
    });

    const studentPackages: NsUsermgmtUserModifierService.StudentPackage[] = newCourses.map(
        ({ endTime, startTime, courseId }) => {
            return {
                courseId,
                startTime,
                endTime,
                studentPackageId: '',
                locationId: studentLocations[0].locationId,
            };
        }
    );

    const { response } = await usermgmtUserModifierService.upsertStudentCoursePackageReq(token, {
        studentId,
        studentPackages,
    });

    const packages = response!.studentPackageProfilesList;
    const studentCoursePackages =
        packages.map((studentPackage, index) => {
            return {
                courseId: courses[index].id,
                courseName: courses[index].name,
                studentPackageId: studentPackage.studentCoursePackageId,
                startDate: convertTimestampToDate(studentPackage.startTime),
                endDate: convertTimestampToDate(studentPackage.endTime),
                locationIds:
                    studentPackage.studentPackageExtraList?.map((item) => item?.locationId) || [],
            };
        }) ?? [];

    return {
        packages,
        courses,
        studentCoursePackages,
    };
}
interface CreateARandomStudentGRPCOptionProps {
    parentLength?: number;
    studentPackageProfileLength?: number;
    courseStatus?: CourseStatus;
    defaultEnrollmentStatus?: keyof typeof StudentEnrollmentStatus;
    locations?: LocationInfoGRPC[];
    grade?: GradeMaster;
}
interface CreateARandomStudentWithParentAndCourseOptionProps
    extends CreateARandomStudentGRPCOptionProps {
    hasPhoneNumber?: boolean;
}

async function createARandomStudentWithParentAndCourse(
    cms: CMSInterface,
    options?: CreateARandomStudentWithParentAndCourseOptionProps
): Promise<CreateStudentResponseEntity> {
    const { defaultEnrollmentStatus, hasPhoneNumber, locations, grade } = options!;
    const newStudent = await createAStudentPromise(cms, {
        defaultEnrollmentStatus,
        hasPhoneNumber,
        locations,
        grade,
        locationLength: locations?.length ?? 1,
    });

    let newParentAssociateWithStudent: UserProfileEntity[] = [];

    if (options?.parentLength) {
        newParentAssociateWithStudent = await createParentsPromise(cms, {
            studentId: newStudent.id,
            studentName: newStudent.email,
            parentLength: options.parentLength,
            hasPhoneNumber: options?.hasPhoneNumber ?? true,
        });
    }

    if (options?.studentPackageProfileLength) {
        const { packages, courses, studentCoursePackages } = await createCoursePromise(cms, {
            studentId: newStudent.id,
            courseLength: options.studentPackageProfileLength,
            courseStatus: options?.courseStatus ?? 'available',
            studentLocations: newStudent.locations,
            withLocation: true,
        });
        return {
            student: newStudent,
            parents: newParentAssociateWithStudent,
            packages,
            courses,
            studentCoursePackages,
        };
    }

    return {
        student: newStudent,
        parents: newParentAssociateWithStudent,
        packages: [],
        courses: [],
        studentCoursePackages: [],
    };
}

export async function createARandomStudentGRPC(
    cms: CMSInterface,
    options?: CreateARandomStudentGRPCOptionProps
): Promise<CreateStudentResponseEntity> {
    const optionsRandomStudent: CreateARandomStudentGRPCOptionProps = {
        parentLength: options?.parentLength ?? 1,
        studentPackageProfileLength: options?.studentPackageProfileLength ?? 0,
        courseStatus: options?.courseStatus ?? 'available',
        defaultEnrollmentStatus: options?.defaultEnrollmentStatus,
        locations: options?.locations,
        grade: options?.grade,
    };

    return retry(
        () => {
            return createARandomStudentWithParentAndCourse(cms, optionsRandomStudent);
        },
        { retries: 3 }
    ).catch(() => {
        return createARandomStudentWithParentAndCourse(cms, optionsRandomStudent);
    });
}

export async function createStudentPackageProfile(
    cms: CMSInterface,
    { courseId, startTime, endTime }: { courseId: string; startTime?: Date; endTime?: Date }
) {
    const timezone = await cms.getTimezone();
    const start = startTime || new Date();
    let end = endTime;

    if (!end) {
        end = new Date(start);
        end.setDate(end.getDate() + 1);
    }

    return {
        courseId,
        startTime: toTimestampServerTimezone({
            originDate: start,
            timeSlice: 'start',
            typeSlice: 'date',
            timezone: timezone.value,
        }),
        endTime: toTimestampServerTimezone({
            originDate: end,
            timeSlice: 'end',
            typeSlice: 'date',
            timezone: timezone.value,
        }),
    };
}

export function createStudentPackageProfiles(
    cms: CMSInterface,
    { courseIds, ...rest }: { courseIds: string[]; startTime?: Date; endTime?: Date }
) {
    return Promise.all(
        courseIds.map((courseId) => createStudentPackageProfile(cms, { courseId, ...rest }))
    );
}

export async function clickOnEditParentByEmail(cms: CMSInterface, email: string) {
    const page = cms.page!;

    await cms.instruction('Click Add Parent dropdown button', async () => {
        await page
            .locator(studentPageSelectors.studentParentItem, { hasText: email })
            .locator(studentPageSelectors.moreHorizIcon)
            .click();
    });

    await cms.instruction(`Click Edit Parent button`, async () => {
        await page
            .locator(`${studentPageSelectors.actionPanelMenuList} [aria-label="Edit"]`)
            .click();
    });
}

export async function clickOnAddNewParentDropdownButton(cms: CMSInterface) {
    const page = cms.page!;

    await cms.instruction('Click Add Parent dropdown button', async () => {
        await page.click(CMSKeys.addParentDropdownButton);
    });

    await cms.instruction(`Click Add New Parent button`, async () => {
        await page.click(addParentOption(AddParentOption.NEW), { delay: 1000 });
        await cms.waitForSkeletonLoading();
    });
}

export async function clickOnAddExistingParentDropdownButton(cms: CMSInterface) {
    const page = cms.page!;

    await cms.instruction('Click Add Parent dropdown button', async () => {
        await page.click(CMSKeys.addParentDropdownButton);
    });

    await cms.instruction(`Click Add Existing Parent button`, async () => {
        await page.click(addParentOption(AddParentOption.EXISTING), { delay: 1000 });
        await cms.waitForSkeletonLoading();
    });
}

export async function fillInParentInformation(
    cms: CMSInterface,
    username: string,
    phoneNumber: string
) {
    const cmsPage = cms.page!;
    const addParentDialog = cmsPage.locator(studentPageSelectors.dialogWithHeaderFooterWrapper);
    const parentNameTextField = addParentDialog.locator(studentPageSelectors.nameName);
    await parentNameTextField.fill(username);
    const emailTextField = addParentDialog.locator(studentPageSelectors.nameEmail);
    await emailTextField.fill(username);

    const relationshipBox = addParentDialog.locator(
        studentPageSelectors.formParentSearchNewSelectRelationship
    );
    await relationshipBox.click();

    const relationshipMenu = cmsPage.locator(studentPageSelectors.relationshipMenu);
    await relationshipMenu.click();

    const relationshipRandomValue =
        FamilyRelationship[randomEnumKey(FamilyRelationship, ['FAMILY_RELATIONSHIP_NONE'])];
    await cms.chooseOptionInAutoCompleteBoxByOrder(relationshipRandomValue);

    const parentPrimaryPhoneNumberTextField = addParentDialog.locator(
        studentPageSelectors.parentPrimaryPhoneNumber
    );
    await parentPrimaryPhoneNumberTextField.fill(phoneNumber);

    return {
        name: username,
        email: username,
        phoneNumber,
        relationship: relationshipRandomValue,
    };
}

export async function getLearnerInformationAfterCreateStudentSuccessfully(
    cms: CMSInterface,
    context: ScenarioContext,
    learnerProfile: StudentInformation
) {
    const page = cms.page!;
    const dialogStudentAccountInfo = page.locator(studentPageSelectors.dialogStudentInfo);
    const emailCredential = dialogStudentAccountInfo.locator(
        studentPageSelectors.accountInfoTypeEmail
    );
    await cms.instruction('school admin sees email credential', async function () {
        const emailValue = await emailCredential.getAttribute('title');

        weExpect(emailValue).toBe(learnerProfile.email);
    });

    const passwordCredential = page.locator(studentPageSelectors.accountInfoInputPassword);
    const passwordInput = passwordCredential.locator('input');

    await cms.instruction(
        'school admin clicks hide password icon to see password credential',
        async function () {
            const currentPasswordType = await passwordInput.getAttribute('type');
            weExpect(currentPasswordType).toBe('password');

            await passwordCredential.locator(studentPageSelectors.hidePasswordIcon).click();

            const newPasswordType = await passwordInput.getAttribute('type');
            weExpect(newPasswordType).toBe('text');
        }
    );
    const passwordValue = await passwordInput.getAttribute('value');

    await cms.instruction('school admins closes student info dialog', async function () {
        const closeButton = dialogStudentAccountInfo.locator(
            studentPageSelectors.dialogStudentAccountInfoFooterButtonClose
        );
        await closeButton.click();
    });

    const newLearnerProfile: UserProfileEntity = {
        ...learnerProfile,
        id: '',
        avatar: '',
        givenName: '',
        password: passwordValue!,
    };
    context.set(learnerProfileAlias, newLearnerProfile);
}

export async function getStudentIdInStudentTableByName(cms: CMSInterface, studentName: string) {
    const studentItem = await cms.page!.waitForSelector(
        CMSKeys.tableRowByText(studentPageSelectors.tableStudent, studentName)
    );
    return await studentItem.evaluate((element) => element.getAttribute('data-value'));
}

export async function findLearnerOnSwitchKidComponent(
    learner: LearnerInterface,
    currentLearner: UserProfileEntity
) {
    const learnerDriver = learner.flutterDriver!;

    const studentAvatarFinder = new ByValueKey(
        LearnerKeys.studentCurrentChildAvatar(currentLearner.id)
    );
    await learnerDriver.waitFor(studentAvatarFinder);
}

// TODO: should remove this function and replace by common function clickOnSaveInDialog
export async function clickOnSaveButtonInParentElement(
    cms: CMSInterface,
    parent: ElementHandle<SVGElement | HTMLElement> | null = null
) {
    let saveButton;
    if (parent != null) {
        saveButton = await parent!.waitForSelector(
            studentPageSelectors.footerDialogConfirmButtonSave
        );
    } else {
        saveButton = await cms!.page!.waitForSelector(
            studentPageSelectors.footerDialogConfirmButtonSave
        );
    }

    await saveButton.click();
}

/// Search existed parent
export async function clickOnSearchParentButton(cms: CMSInterface) {
    const cmsPage = cms.page!;

    const tableParent = await cmsPage.$(studentPageSelectors.tableParent);
    const searchParentButton = await tableParent!.waitForSelector(
        studentPageSelectors.tableParentSearchButton
    );

    await searchParentButton.click();
}

export async function cannotSearchExistingParent(
    cms: CMSInterface,
    username: string
): Promise<boolean> {
    const cmsPage = cms.page!;

    await openAddExistingParentDialog(cms);

    await cms.instruction(`Search imported parent: ${username}`, async function () {
        await cmsPage.fill(studentPageSelectors.parentAutoComplete, username);
    });

    await cms.waitForHasuraResponse('ParentsManyReference');

    try {
        await cmsPage.waitForSelector(`[role='listbox']`, { timeout: 10000 });
        return true;
    } catch (error) {
        return false;
    }
}

export async function searchAndSelectExistedParent(cms: CMSInterface, username: string) {
    await openAddExistingParentDialog(cms);

    /// Have instructions inside function
    await searchExistedParentProfile(cms, username);
}

async function openAddExistingParentDialog(cms: CMSInterface) {
    await cms.instruction(`Go to Family Tab`, async function () {
        await schoolAdminChooseTabInStudentDetail(cms, StudentDetailTab.FAMILY);
    });
    await cms.instruction(`Click Add Existing Parent dropdown button`, async function () {
        await clickOnAddExistingParentDropdownButton(cms);
    });
}

export async function searchExistedParentProfile(cms: CMSInterface, username: string) {
    const cmsPage = cms.page!;

    const addParentDialog = await cmsPage.$(studentPageSelectors.dialogWithHeaderFooterWrapper);

    await cms.instruction(`Search and select parent: ${username}`, async function () {
        await cmsPage.fill(studentPageSelectors.parentAutoComplete, username);
        await cms.chooseOptionInAutoCompleteBoxByText(username);
    });

    await cms.instruction(`Select relationship`, async function () {
        const relationshipBox = await addParentDialog!.waitForSelector(
            studentPageSelectors.formParentSearchNewSelectRelationship
        );
        await relationshipBox.click();

        await cms.chooseOptionInAutoCompleteBoxByOrder(1);
    });

    await cms.instruction('Verify can not edit email', async function () {
        await addParentDialog!.waitForSelector(
            studentPageSelectors.formSearchParentNewInputEmailReadOnly
        );
    });

    await cms.instruction(`Click on Add parent button`, async function () {
        await clickOnSaveButtonInParentElement(cms, addParentDialog!);
    });
}

export async function checkKidChartStatistic(learner: LearnerInterface) {
    const learnerDriver = learner.flutterDriver!;

    const chartPageViewFinder = new ByValueKey(LearnerKeys.learningProgressPageView);
    await delay(2000);
    await learnerDriver.waitFor(chartPageViewFinder);
}

export const schoolAdminChooseTabInStudentDetail = async (
    cms: CMSInterface,
    tab: StudentDetailTab
) => {
    const cmsPage = cms.page!;
    const shouldShowPaymentTab = await isEnabledFeatureFlag('MANAGE_PAYMENT_INFORMATION');
    const studentDetailTabList = await cmsPage.waitForSelector(
        `[data-testid="StudentDetail"] [role="tablist"]`
    );

    const allTabItems = await studentDetailTabList.$$('[role="tab"]');

    /// Student Detail Tabs
    /// Detail | Family | Course | Entry & Exit

    let selectedTab;

    switch (tab) {
        case StudentDetailTab.DETAIL:
            selectedTab = allTabItems[0];
            break;
        case StudentDetailTab.FAMILY:
            selectedTab = allTabItems[1];
            break;
        case StudentDetailTab.PAYMENT:
            selectedTab = allTabItems[2];
            break;
        case StudentDetailTab.COURSE:
            selectedTab = shouldShowPaymentTab ? allTabItems[3] : allTabItems[2];
            break;
        case StudentDetailTab.ENTRY_EXIT:
            selectedTab = allTabItems[4];
            break;
        default:
            break;
    }

    await selectedTab?.click();
};

export async function clickOnAddParentAndFillInParentInformation(
    cms: CMSInterface,
    learnerUsername: string
): Promise<UserSimpleInformation> {
    const parentUsername = learnerUsername.replace('@manabie.com', '+parent@manabie.com');
    const parentPhoneNumber = getRandomPhoneNumber();
    await cms.instruction(`Go to Family Tab`, async function () {
        await schoolAdminChooseTabInStudentDetail(cms, StudentDetailTab.FAMILY);
    });
    await cms.instruction(`Click Add New Parent dropdown button`, async function () {
        await clickOnAddNewParentDropdownButton(cms);
    });

    await cms.instruction(`Fill in parent information: ${parentUsername}`, async function () {
        await fillInParentInformation(cms, parentUsername, parentPhoneNumber);
    });

    await cms.instruction(`Click on save button`, async function () {
        const addParentDialog = await cms.page?.$(
            studentPageSelectors.dialogWithHeaderFooterWrapper
        );

        await clickOnSaveButtonInParentElement(cms, addParentDialog);
        await cms.waitingForLoadingIcon();
    });

    return {
        userName: parentUsername,
        phoneNumber: parentPhoneNumber,
    };
}

export async function clickOnSaveCourseDuration(cms: CMSInterface) {
    const cmsPage = cms.page!;

    const upsertCourseDialog = await cmsPage.waitForSelector(
        studentPageSelectors.upsertCourseInfoDialog
    );

    await clickOnSaveButtonInParentElement(cms, upsertCourseDialog);
}

export async function clickOnSaveCourseDialog(cms: CMSInterface) {
    await cms.instruction(`Click on Save button in Edit course duration dialog`, async function () {
        await clickOnSaveCourseDuration(cms);
        await cms.page?.waitForSelector(studentPageSelectors.upsertCourseInfoDialog, {
            state: 'hidden',
        });
        await cms.waitForSkeletonLoading();
    });
}

export async function clickOnEditCourse(cms: CMSInterface) {
    await cms.instruction(`Click to Edit Course button`, async function () {
        const editCourseButton = await cms.page?.waitForSelector(
            studentPageSelectors.editCourseButton
        );
        await editCourseButton?.click();
    });
}

export async function createStudentWithRandomData(
    cms: CMSInterface,
    context: ScenarioContext,
    options?: {
        locations?: LocationInfoGRPC[];
    }
) {
    const { locations } = options || {};
    const randomStudentData = await createRandomStudentData(cms, { locations });

    await goToAddStudentPageAndFillInStudentInformation(cms, context, randomStudentData);

    return randomStudentData;
}

export async function schoolAdminCreateNewStudent(
    cms: CMSInterface,
    context: ScenarioContext,
    locationLength?: number,
    locationList?: RetrieveLowestLevelLocationsResponse.Location.AsObject[]
) {
    const firstGrantedLocation = context.get<LocationObjectGRPC>(aliasFirstGrantedLocation);
    const locations = locationList ?? [firstGrantedLocation];
    const length = locationLength || 1;
    const randomLocations = getRandomElementsWithLength<LocationInfoGRPC>(locations, length);

    context?.set(studentLocationsAlias, randomLocations);

    const studentData = await createARandomStudentGRPC(cms, {
        locations: randomLocations,
    });

    return studentData;
}

export async function schoolAdminCreateNewStudentWithNewParent(
    cms: CMSInterface,
    context: ScenarioContext
) {
    const studentData = await schoolAdminCreateNewStudent(cms, context);

    await cms.instruction(
        `Get learner new credentials after create account successfully`,
        async function () {
            context.set(learnerProfileAlias, studentData.student);
        }
    );

    await cms.instruction(
        `Get parent new credentials after create new parent successfully`,
        async function () {
            context.set(parentProfilesAlias, studentData.parents);
        }
    );
}

export async function schoolAdminCreateNewStudentWithExistingParent(
    cms: CMSInterface,
    context: ScenarioContext,
    accountRole: AccountRoles,
    parentProfiles: UserProfileEntity[],
    locationLength?: number,
    locationList?: RetrieveLowestLevelLocationsResponse.Location.AsObject[]
) {
    const studentData = await schoolAdminCreateNewStudent(
        cms,
        context,
        locationLength,
        locationList
    );

    await cms.instruction(
        `Get learner new credentials after create account successfully`,
        async function () {
            context.set(learnerProfileAliasWithAccountRoleSuffix(accountRole), studentData.student);
        }
    );

    await schoolAdminFindStudentAndGoesToStudentDetail(cms, studentData.student);

    const firstParent = parentProfiles[0];
    const parentUsername = firstParent.name;

    context.set(parentProfilesAliasWithAccountRoleSuffix(accountRole), parentProfiles);

    /// Have instructions inside
    await searchAndSelectExistedParent(cms, parentUsername);
}

export async function schoolAdminCreateNewStudentWithCourse(
    cms: CMSInterface,
    context: ScenarioContext,
    courseDuration: CourseDuration
) {
    const page = cms.page!;

    const studentData = await schoolAdminCreateNewStudent(cms, context);

    await cms.instruction(
        `Get learner new credentials after create account successfully`,
        async function () {
            context.set(learnerProfileAlias, studentData.student);
        }
    );

    await cms.instruction(
        `Get parent new credentials after create new parent successfully`,
        async function () {
            context.set(parentProfilesAlias, studentData.parents);
        }
    );

    await schoolAdminFindStudentAndGoesToStudentDetail(cms, studentData.student);

    await cms.instruction(`Go to Course Tab`, async function () {
        await schoolAdminChooseTabInStudentDetail(cms, StudentDetailTab.COURSE);
    });

    await cms.instruction(`Click to Edit Course button`, async function () {
        const editCourseButton = await page.waitForSelector(studentPageSelectors.editCourseButton);
        await editCourseButton.click();
    });

    await cms.instruction(
        `Click on Add button and fill course in Edit course dialog`,
        async function () {
            await addCourseInCourseDialog(cms, context, courseDuration);
        }
    );

    await cms.instruction(`Click on Save button in Edit course duration dialog`, async function () {
        await clickOnSaveCourseDuration(cms);
    });
}

export async function addCourseInCourseDialog(
    cms: CMSInterface,
    context: ScenarioContext,
    courseDuration: CourseDuration
) {
    //TODO: need createRandomCourses with location
    const student = context.get<UserProfileEntity>(learnerProfileAlias);

    const course = (await createRandomCoursesWithLocations(cms)).request[0];

    await clickAddCourseButton(cms);

    await findAndChooseLastCourse(cms, course.name);

    let studentPackage: StudentCoursePackageEntity;

    await cms.instruction(
        `Select course duration: ${course.name} with duration ${courseDuration}`,
        async function () {
            const startAndEndDate = await selectCourseDuration(cms, courseDuration);

            studentPackage = {
                courseId: course.id,
                courseName: course.name,
                /// Does not need studentPackageId after create on UI for now.
                studentPackageId: '',
                startDate: startAndEndDate.startDate,
                endDate: startAndEndDate.endDate,
            };
        }
    );

    const studentCourseLocations = student.locations?.filter((_) =>
        course.locationIdsList?.includes(_.locationId)
    );
    const randomLocation = getRandomElementsWithLength(studentCourseLocations || [], 1)[0];

    await cms.instruction(`Select location`, async function () {
        await selectCourseLocation(cms, randomLocation);
        studentPackage.locationIds = randomLocation?.locationId ? [randomLocation.locationId] : [];
    });

    const _studentCourses = context.get<Array<StudentCoursePackageEntity>>(studentPackagesAlias);
    const studentCourses = _studentCourses ? _studentCourses : [];
    context.set(studentPackagesAlias, [...studentCourses, studentPackage!]);
}

export async function schoolAdminFindStudentAndGoesToStudentDetail(
    cms: CMSInterface,
    student: UserProfileEntity
) {
    await cms.instruction(`Find student ${student.name} on student list`, async function () {
        await findNewlyCreatedLearnerOnCMSStudentsPage(cms, student, undefined, true);
    });

    await cms.instruction(
        'school admin selects org location on location setting',
        async function () {
            await applyOrgForLocationSetting(cms);
        }
    );

    await cms.instruction(`Click student ${student.name} on student list`, async function () {
        await clickOnStudentOnStudentsTab(cms, student);
    });
}

export async function teacherSelectsCourseLocationOnTeacherApp(
    teacher: TeacherInterface,
    locationIds: string[]
) {
    await teacherOpenLocationFilterDialogOnTeacherApp(teacher);

    await teacherSelectLocationsOnTeacherApp(teacher, locationIds);
    await teacherAppliesSelectedLocationOnTeacherApp(teacher);
}
