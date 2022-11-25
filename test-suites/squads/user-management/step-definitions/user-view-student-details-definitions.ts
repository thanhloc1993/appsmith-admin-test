import { pick1stElement } from '@legacy-step-definitions/utils';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';
import { isEnabledFeatureFlag } from '@user-common/helper/feature-flag';

import { CMSInterface, LearnerInterface } from '@supports/app-types';
import { emptyValue } from '@supports/constants';
import {
    StudentCoursePackageEntity,
    StudentCoursePackageHasura,
} from '@supports/entities/student-course-package-entity';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';
import { StudentDetailTab } from '@supports/types/cms-types';
import { formatDate } from '@supports/utils/time/time';

import { schoolAdminChooseTabInStudentDetail } from './user-create-student-definitions';
import {
    assertStudentCourseListIsEmpty,
    assertStudentCourseListToBeMatched,
    courseRespMapKey,
    findNewlyCreatedLearnerOnCMSStudentsPage,
    mapCoursesEachUniqStudent,
    applyOrgForLocationSetting,
    openMenuPopupOnWeb,
} from './user-definition-utils';
import { verifyNeverLoggedInTagOnCMS } from './user-never-logged-in-tag-definitions';
import {
    checkStudentAvatarOnAppBar,
    tapOnSwitchStudent,
    tapToSwitchStudent,
} from './user-switch-student-definitions';
import { strictEqual } from 'assert';
import { FamilyRelationship } from 'manabuf/yasuo/v1/enums_pb';

export interface NeverLoggedInTagCondition {
    shouldVerifyNeverLoggedInTag: boolean;
    hasLoggedInTag: boolean;
}

export interface StudentDetailData {
    learnerProfile: UserProfileEntity;
    parents: Array<UserProfileEntity>;
    studentCoursePackages: Array<StudentCoursePackageEntity>;
    neverLoggedInTagCondition?: NeverLoggedInTagCondition;
}

export async function viewStudentDetails(
    cms: CMSInterface,
    learnerProfile: UserProfileEntity,
    neverLoggedInTagCondition: NeverLoggedInTagCondition = {
        shouldVerifyNeverLoggedInTag: false,
        hasLoggedInTag: false,
    }
) {
    /// Name        | Enrollment Status
    //  Email       | Grade
    /// Phone       | External Student ID
    /// Student ID
    /// Note

    const cmsPage = cms.page!;

    await cms.instruction(`Go to DETAIL Tab`, async function () {
        await schoolAdminChooseTabInStudentDetail(cms, StudentDetailTab.DETAIL);
    });

    const studentDetailInfo = await cmsPage.waitForSelector(
        studentPageSelectors.tabStudentDetailRoot
    );

    const allColumns = await studentDetailInfo.$$(studentPageSelectors.studentGeneralInfoItem);

    const isEnabledStudentTag = await isEnabledFeatureFlag('STUDENT_MANAGEMENT_STUDENT_TAG');
    const generalInfoColumns = isEnabledStudentTag ? 11 : 10;

    strictEqual(
        allColumns.length,
        generalInfoColumns,
        `There should be only ${generalInfoColumns} columns in General Info`
    );

    const nameItem = await studentDetailInfo.waitForSelector(studentPageSelectors.generalNameValue);
    const username = await nameItem.innerText();
    strictEqual(username, learnerProfile.name, `New learner name should match with the UI`);

    if (learnerProfile.fullNamePhonetic) {
        const fullNamePhoneticItem = await studentDetailInfo.waitForSelector(
            studentPageSelectors.generalPhoneticNameValue
        );
        const fullNamePhonetic = await fullNamePhoneticItem.innerText();
        strictEqual(
            fullNamePhonetic,
            learnerProfile.fullNamePhonetic,
            `New learner fullNamePhonetic should match with the UI`
        );
    }

    const emailItem = await studentDetailInfo.waitForSelector(
        studentPageSelectors.generalEmailValue
    );
    const email = await emailItem.innerText();
    strictEqual(email, learnerProfile.email, `New learner email should match with the UI`);

    const enrollmentStatusItem = await studentDetailInfo.waitForSelector(
        studentPageSelectors.generalEnrollmentStatusValue
    );
    const enrollmentStatus = await enrollmentStatusItem.innerText();
    strictEqual(
        enrollmentStatus.toLowerCase(),
        learnerProfile.enrollmentStatus,
        `New learner enrollment status should match with the UI`
    );

    await cms.instruction(`Verify student contact phone number section`, async function () {
        await verifyStudentContactPhoneNumber(cms);
    });

    if (learnerProfile.studentExternalId) {
        const studentExternalIdItem = await studentDetailInfo.waitForSelector(
            studentPageSelectors.generalExternalStudentIDValue
        );
        const studentExternalId = await studentExternalIdItem.innerText();
        strictEqual(
            studentExternalId,
            learnerProfile.studentExternalId,
            `New learner external Id should match with the UI`
        );
    } else {
        const studentExternalIdItem = await studentDetailInfo.waitForSelector(
            studentPageSelectors.generalExternalStudentIDValue
        );
        await studentExternalIdItem.waitForSelector('p', {
            state: 'hidden',
        });
    }

    if (learnerProfile.birthday) {
        const studentBirthdayItem = await studentDetailInfo.waitForSelector(
            studentPageSelectors.generalBirthdayValue
        );
        const studentBirthday = await studentBirthdayItem.innerText();
        strictEqual(
            studentBirthday,
            formatDate(learnerProfile.birthday, 'YYYY/MM/DD'),
            `New learner birthday should match with the UI`
        );
    } else {
        const studentBirthdayItem = await studentDetailInfo.waitForSelector(
            studentPageSelectors.generalBirthdayValue
        );
        await studentBirthdayItem.waitForSelector('p', {
            state: 'hidden',
        });
    }

    if (learnerProfile.gender) {
        const studentGenderItem = await studentDetailInfo.waitForSelector(
            studentPageSelectors.generalGenderValue
        );
        const studentGender = await studentGenderItem.innerText();
        strictEqual(
            studentGender.toUpperCase(),
            learnerProfile.gender,
            `New learner gender should match with the UI`
        );
    } else {
        const studentGenderItem = await studentDetailInfo.waitForSelector(
            studentPageSelectors.generalGenderValue
        );
        await studentGenderItem.waitForSelector('p', {
            state: 'hidden',
        });
    }

    if (learnerProfile.studentNote) {
        const studentNoteItem = await studentDetailInfo.waitForSelector(
            studentPageSelectors.generalNoteValue
        );
        const studentNote = await studentNoteItem.innerText();
        strictEqual(
            studentNote,
            learnerProfile.studentNote,
            `New learner note should match with the UI`
        );
    } else {
        const studentNoteItem = await studentDetailInfo.waitForSelector(
            studentPageSelectors.generalNoteValue
        );
        await studentNoteItem.waitForSelector('p', {
            state: 'hidden',
        });
    }

    if (learnerProfile.locations && learnerProfile.locations.length) {
        const { locations } = learnerProfile;
        const studentLocationItem = await studentDetailInfo.waitForSelector(
            studentPageSelectors.generalLocationValue
        );
        const studentLocation = await studentLocationItem.innerText();
        const studentLocationsSplit = studentLocation?.split(', ');

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
    } else {
        const studentLocationItem = await studentDetailInfo.waitForSelector(
            studentPageSelectors.generalLocationValue
        );
        await studentLocationItem.waitForSelector('p', {
            state: 'hidden',
        });
    }

    if (neverLoggedInTagCondition.shouldVerifyNeverLoggedInTag) {
        const header = await cmsPage.waitForSelector(studentPageSelectors.studentDetailsHeader);
        await verifyNeverLoggedInTagOnCMS(
            cms,
            learnerProfile.name,
            'Student Details',
            neverLoggedInTagCondition.hasLoggedInTag,
            header
        );
    }
}

export async function verifyStudentContactPhoneNumber(cms: CMSInterface) {
    const cmsPage = cms.page!;
    const isEnabledParentSecondaryPhoneNumberAndRemarks = await isEnabledFeatureFlag(
        'STUDENT_MANAGEMENT_PARENT_SECONDARY_PHONE_NUMBER'
    );

    const studentDetailInfo = await cmsPage.waitForSelector(
        studentPageSelectors.tabStudentDetailRoot
    );
    const studentPhoneNumberItem = await studentDetailInfo.waitForSelector(
        studentPageSelectors.studentPhoneNumberValue
    );
    const studentPhoneNumber = await studentPhoneNumberItem.innerText();

    const homePhoneNumberItem = await studentDetailInfo.waitForSelector(
        studentPageSelectors.homePhoneNumberValue
    );
    const homePhoneNumber = await homePhoneNumberItem.innerText();

    let parentPrimaryPhoneNumber = emptyValue;
    let parentSecondaryPhoneNumber = emptyValue;
    let preferredContactNumber = emptyValue;
    if (isEnabledParentSecondaryPhoneNumberAndRemarks) {
        const parentPrimaryPhoneNumberItem = await studentDetailInfo.waitForSelector(
            studentPageSelectors.parentPrimaryPhoneNumberValue
        );
        parentPrimaryPhoneNumber = await parentPrimaryPhoneNumberItem.innerText();

        const parentSecondaryPhoneNumberItem = await studentDetailInfo.waitForSelector(
            studentPageSelectors.parentSecondaryPhoneNumberValue
        );
        parentSecondaryPhoneNumber = await parentSecondaryPhoneNumberItem.innerText();

        const preferredContactNumberItem = await studentDetailInfo.waitForSelector(
            studentPageSelectors.preferredContactNumberValue
        );
        preferredContactNumber = await preferredContactNumberItem.innerText();
    }

    // TODO: update when have data
    const mockStudentContactPhoneNumber = {
        studentPhoneNumber: emptyValue,
        homePhoneNumber: emptyValue,
        parentPrimaryPhoneNumber: emptyValue,
        parentSecondaryPhoneNumber: emptyValue,
        preferredContactNumber: 'Student Phone Number',
    };
    const studentContactPhoneNumberOnUI = {
        studentPhoneNumber,
        homePhoneNumber,
        parentPrimaryPhoneNumber,
        parentSecondaryPhoneNumber,
        preferredContactNumber,
    };

    let phoneNumberKey: keyof typeof mockStudentContactPhoneNumber &
        keyof typeof studentContactPhoneNumberOnUI;
    for (phoneNumberKey in studentContactPhoneNumberOnUI) {
        assertContactPhoneNumber(
            mockStudentContactPhoneNumber[phoneNumberKey],
            studentContactPhoneNumberOnUI[phoneNumberKey]
        );
    }
}

export function assertPhoneNumber(phoneNumberData: string, phoneNumberOnUI: string) {
    if (phoneNumberOnUI.length == 0) {
        strictEqual(
            phoneNumberData,
            phoneNumberOnUI,
            `New learner phone number should match with the UI`
        );
    } else {
        strictEqual(
            phoneNumberData,
            phoneNumberOnUI.split(' ')[1],
            `New learner phone number should match with the UI`
        );
    }
}

export function assertContactPhoneNumber(phoneNumberData: string, phoneNumberOnUI: string) {
    strictEqual(
        phoneNumberData,
        phoneNumberOnUI,
        `New learner phone number should match with the UI`
    );
}

export async function clickOnStudentOnStudentsTab(cms: CMSInterface, learner: UserProfileEntity) {
    const newlyCreatedStudentItem = await findNewlyCreatedLearnerOnCMSStudentsPage(
        cms,
        learner,
        undefined,
        true
    );

    await newlyCreatedStudentItem.click();
}

export async function verifyParentListInStudentDetails(
    cms: CMSInterface,
    parents: Array<UserProfileEntity>
) {
    const cmsPage = cms.page!;

    await cms.instruction(`Go to FAMILY Tab`, async function () {
        await schoolAdminChooseTabInStudentDetail(cms, StudentDetailTab.FAMILY);
    });

    if (parents && parents.length > 0) {
        await cms.instruction(`Verify parent list in student details`, async function () {
            const parentListRoot = await cmsPage.locator(studentPageSelectors.studentParentList);

            for (let i = 0; i < parents.length; i++) {
                const parent = parents[i];
                const allColumns = await parentListRoot.locator(
                    studentPageSelectors.studentParentItemWithId(parent.id)
                );

                await cms.instruction(
                    `Verify parent ${parent.name} in parent list`,
                    async function () {
                        /// Name            | Relationship
                        /// Phone Number    | Email
                        const nameItem = await allColumns.locator(
                            studentPageSelectors.parentItemNameValue
                        );
                        const parentName = await nameItem.innerText();
                        strictEqual(
                            parentName,
                            parent.name,
                            `Parent name should match with the UI`
                        );

                        const emailItem = await allColumns.locator(
                            studentPageSelectors.parentItemEmailValue
                        );
                        const parentEmail = await emailItem.innerText();
                        strictEqual(
                            parentEmail,
                            parent.email,
                            `Parent email should match with the UI`
                        );
                    }
                );
            }
        });
    } else {
        await cms.instruction(`Parent list in student details should be empty`, async function () {
            const parentListContainer = await cmsPage.waitForSelector(
                studentPageSelectors.studentParentList
            );

            const noDataMessage = await parentListContainer.waitForSelector(
                studentPageSelectors.studentParentNoDataMessage
            );

            await noDataMessage.scrollIntoViewIfNeeded();
        });
    }
}

export function getFamilyRelationshipNameList(): Array<string> {
    const relationshipNameList = new Array<string>();

    for (const enumMember in FamilyRelationship) {
        relationshipNameList.push(enumMember.replace('FAMILY_RELATIONSHIP_', ''));
    }

    return relationshipNameList;
}

export async function tapOnSwitchButtonAndSelectKid(
    learner: LearnerInterface,
    learnerProfile: UserProfileEntity
) {
    try {
        await checkStudentAvatarOnAppBar(learner, learnerProfile);
    } catch (error) {
        await learner.instruction(`Go to switch student screen`, async function () {
            await openMenuPopupOnWeb(learner);

            await tapOnSwitchStudent(learner);
        });

        await learner.instruction(`Select kid ${learnerProfile.name}`, async function () {
            await tapToSwitchStudent(learner, learnerProfile.id);
        });
    }
}

export async function seeNewlyCreatedStudentOnCMS({
    cms,
    data,
    verifyStudentCoursePackages = true,
    shouldSelectAllLocations = true,
}: {
    cms: CMSInterface;
    data: StudentDetailData;
    verifyStudentCoursePackages?: boolean;
    shouldSelectAllLocations?: boolean;
}) {
    const { learnerProfile, parents, studentCoursePackages, neverLoggedInTagCondition } = data;

    await cms.instruction(`Go to student management page`, async function () {
        await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
    });

    if (shouldSelectAllLocations) {
        await cms.instruction(
            'school admin selects org location on location setting',
            async function () {
                await applyOrgForLocationSetting(cms);
            }
        );
    }

    await cms.instruction(`Find student ${learnerProfile.name} on student list`, async function () {
        await findNewlyCreatedLearnerOnCMSStudentsPage(
            cms,
            learnerProfile,
            neverLoggedInTagCondition,
            true
        );
    });

    await cms.instruction(
        `Click student ${learnerProfile.name} on student list`,
        async function () {
            await clickOnStudentOnStudentsTab(cms, learnerProfile);
        }
    );

    await verifyStudentOnStudentDetails(
        cms,
        learnerProfile,
        parents,
        studentCoursePackages,
        neverLoggedInTagCondition,
        verifyStudentCoursePackages
    );
}

export async function verifyStudentOnStudentDetails(
    cms: CMSInterface,
    learnerProfile: UserProfileEntity,
    parents: Array<UserProfileEntity>,
    studentCoursePackages: Array<StudentCoursePackageEntity> = [],
    neverLoggedInTagCondition: NeverLoggedInTagCondition = {
        shouldVerifyNeverLoggedInTag: false,
        hasLoggedInTag: false,
    },
    verifyStudentCoursePackages = true
) {
    await cms.instruction(`View student details: ${learnerProfile.name}`, async function () {
        await viewStudentDetails(cms, learnerProfile, neverLoggedInTagCondition);
    });

    await cms.instruction(`View parent list in student details`, async function () {
        await verifyParentListInStudentDetails(cms, parents);
    });

    if (verifyStudentCoursePackages) {
        await cms.instruction(`View course list in student details`, async function () {
            await verifyStudentPackagesListInStudentDetails(cms, studentCoursePackages);
        });
    }
}

export async function verifyStudentPackagesListInStudentDetails(
    cms: CMSInterface,
    studentPackages: StudentCoursePackageEntity[]
) {
    if (studentPackages && studentPackages.length > 0) {
        const [courses, studentPackagesHasura] = await Promise.all([
            cms.waitForHasuraResponse('User_CoursesManyWithLocation'),
            cms.waitForHasuraResponse('User_StudentPackagesByListStudentIdV2'),
            cms.selectTabButtonByText(studentPageSelectors.tabLayoutStudent, 'Course'),
        ]);

        const studentPackagesResp = studentPackagesHasura?.resp?.data?.student_packages || [];

        const coursesResp = courses?.resp?.data?.courses || [];

        const map = courseRespMapKey(coursesResp);

        const coursesData = mapCoursesEachUniqStudent(studentPackagesResp, map);

        const studentCoursePackages: StudentCoursePackageHasura[] =
            pick1stElement(coursesData)?.courses || [];

        await cms.waitForSkeletonLoading();

        const studentPackagesSortBaseOnHasura = studentPackages.sort(
            (studentPackageA, studentPackageB) => {
                const indexA = studentCoursePackages.findIndex(
                    (hasuraPackage) => hasuraPackage.course_id === studentPackageA.courseId
                );
                const indexB = studentCoursePackages.findIndex(
                    (hasuraPackage) => hasuraPackage.course_id === studentPackageB.courseId
                );

                if (indexA === -1 || indexB === -1) {
                    return 0;
                }
                return indexA - indexB;
            }
        );

        await assertStudentCourseListToBeMatched(cms, studentPackagesSortBaseOnHasura);
    } else {
        await assertStudentCourseListIsEmpty(cms);
    }
}

export async function verifyRecordOfParentInStudent(cms: CMSInterface, parentLength: number) {
    await cms.instruction(`Go to Family Tab`, async function () {
        await schoolAdminChooseTabInStudentDetail(cms, StudentDetailTab.FAMILY);
    });

    await cms.instruction(`Verify total record of parents on student detail page`, async () => {
        const parentListRoot = await cms.page!.waitForSelector(
            studentPageSelectors.studentParentList
        );
        const studentTableParent = await parentListRoot.$$(studentPageSelectors.studentParentItem);

        strictEqual(parentLength, studentTableParent?.length, `Check length of parents`);
    });
}
