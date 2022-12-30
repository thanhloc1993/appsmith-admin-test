import { aliasFirstGrantedLocation } from '@legacy-step-definitions/alias-keys/architecture';

import {
    AccountRoles,
    LearnerRolesWithTenant,
    Courses,
    Locations,
    Classes,
    SchoolAdminRolesWithTenant,
} from '@supports/app-types';

import { TypeOfUserTag } from 'test-suites/squads/user-management/step-definitions/student-info/user-tag/type';

export const adminProfileAlias = `adminProfileAlias`;
export const teacherCreatedInfoAlias = `teacherCreatedInfoAlias`;
export const teacherProfileAlias = `teacherProfileAlias`;
export const teacherNameAlias = `teacherNameAlias`;
export const teacherListAlias = `teacherListAlias`;
export const staffListAlias = `staffListAlias`;
export const staffProfileAlias = `staffProfileAlias`;
export const staffNameAlias = `staffNameAlias`;

export const learnerProfileAlias = `learnerProfileAlias`;
export const learnersProfileAlias = `learnersProfileAlias`;
export const studentPackagesAlias = `studentPackagesAlias`;
export const studentCoursePackagesAlias = `studentCoursePackagesAlias`;
export const newStudentEmailAlias = `newStudentEmailAlias`;
export const studentHomeAddressAlias = `studentHomeAddressAlias`;
export const studentPhoneNumberAlias = `studentPhoneNumberAlias`;
export const studentParentsAlias = `studentParentsAlias`;

export const parentProfilesAlias = `parentProfilesAlias`;
export const editedParentProfilesAlias = `editedParentProfilesAlias`;
export const kidProfilesOfParentAlias = `kidProfilesOfParentAlias`;

export const coursesAlias = `coursesAlias`;
export const totalCoursesAlias = `totalCoursesAlias`;
export const newCourseAlias = `newCourseAlias`;
export const newStudentPackageAlias = `newStudentPackageAlias`;
export const newPasswordAlias = `newPasswordAlias`;
export const oldLearnerProfileAlias = `oldLearnerProfileAlias`;
export const editedLearnerProfileAlias = `editedLearnerProfileAlias`;

export const currentTypeErrorAlias = `currentTypeErrorAlias`;

export const userGroupProfileAlias = `userGroupProfileAlias`;
export const userGroupsListAlias = 'userGroupsListAlias';
export const userGroupGrantedRoleList = 'userGroupGrantedRole';
export const numberOfUserGroupsAlias = 'numberOfUserGroupsAlias';
export const currentUserGroupsAlias = 'currentUserGroupsAlias';
export const userGroupIdsListAlias = 'userGroupIdsListAlias';
export const roleAlias = `roleAlias`;
export const roleListAlias = `roleListAlias`;
export const selectedRoleListAlias = `selectedRoleListAlias`;
export const userGroupsDataAlias = 'userGroupsDataAlias';

// table student
export const studentsListAlias = `studentsListAlias`;
export const totalStudentsAlias = `totalStudentsAlias`;
export const totalCountStudentListAlias = `totalCountStudentListAlias`;
export const gradesOfStudentsListAlias = `gradesOfStudentsListAlias`;
export const packagesByListStudentAlias = `packagesByListStudentAlias`;
export const coursesListAlias = `coursesListAlias`;
export const currentOffsetStudentsListAlias = 'currentOffsetStudentsListAlias';
export const currentLimitStudentsListAlias = 'currentLimitStudentsListAlias';

export const lessonNameAlias = 'lessonAlias';
export const gradeAlias = 'gradeAlias';
export const neverLoggedInTagPositionOnCMSAlias = 'neverLoggedInTagPositionOnCMSAlias';

export const commentListHistoryTeacherAlias = 'commentListHistoryTeacherAlias';

export function learnerProfileAliasWithAccountRoleSuffix(accountRoles: AccountRoles) {
    return `${learnerProfileAlias}-${accountRoles}`;
}

export function parentProfilesAliasWithAccountRoleSuffix(accountRoles: AccountRoles) {
    return `${parentProfilesAlias}-${accountRoles}`;
}

export function studentPackagesAliasWithAccountRoleSuffix(accountRoles: AccountRoles) {
    return `${studentPackagesAlias}-${accountRoles}`;
}

export function courseListAliasWithAccountRoleSuffix(accountRoles: AccountRoles) {
    return `${coursesAlias}-${accountRoles}`;
}
export function studentCoursePackageListAliasWithAccountRoleSuffix(accountRoles: AccountRoles) {
    return `${studentCoursePackagesAlias}-${accountRoles}`;
}

export function staffProfileAliasWithAccountRoleSuffix(accountRoles: AccountRoles) {
    return `${staffProfileAlias}-${accountRoles}`;
}

export function learnerProfileAliasWithTenantAccountRoleSuffix(
    accountRoles: SchoolAdminRolesWithTenant
) {
    return `${learnerProfileAlias}-${accountRoles}`;
}

export function parentProfilesAliasWithTenantAccountRoleSuffix(
    accountRoles: SchoolAdminRolesWithTenant
) {
    return `${parentProfilesAlias}-${accountRoles}`;
}

export function staffProfileAliasWithMultiTenantAccountRoleSuffix(
    accountRoles: SchoolAdminRolesWithTenant
) {
    return `${staffProfileAlias}-${accountRoles}`;
}

export const studentCreatingDataAlias = 'studentCreatingDataAlias';
export const studentListAlias = 'studentListAlias';

// Access control fields
export const locationListAlias = 'locationListAlias';
export const studentLocationsAlias = 'studentLocationsAlias';
export const studentLocationWithTypeAlias = 'studentLocationWithTypeAlias';
export const locationAddMoreAlias = 'locationAddMoreAlias';
export const treeLocationsAlias = 'treeLocationsAlias';

export function learnerTenantProfileAliasWithLearnerTenantRoleSuffix(
    learnerRole: LearnerRolesWithTenant
) {
    return `${learnerProfileAlias}-${learnerRole}`;
}

export function aliasFirstGrantedLocationWithAccountRoleSuffix(
    accountRoles: SchoolAdminRolesWithTenant
) {
    return `${aliasFirstGrantedLocation}-${accountRoles}`;
}

export const locationAlias = `locationAlias`;
export function locationAliasWithSuffix(location: Locations) {
    return `${locationAlias}-${location}`;
}

export const locationImportedAlias = 'locationImportedAlias';
export function locationImportedAliasWithSuffix(location: Locations) {
    return `${locationImportedAlias}-${location}`;
}

export const classImportedAlias = 'classImportedAlias';
export function classImportedAliasWithSuffix(_class: Classes) {
    return `${classImportedAlias}-${_class}`;
}

export const userTagAlias = `userTagAlias`;
export function userTagAliasWithSuffix(userTagType: TypeOfUserTag) {
    return `${userTagAlias}-${userTagType}`;
}

export const courseAlias = `courseAlias`;
export const courseLocationsAlias = 'courseLocationsAlias';
export const courseClassesAlias = 'courseClassesAlias';

export function courseClassesAliasWithSuffix(course: Courses) {
    return `${courseClassesAlias}-${course}`;
}
export function courseLocationsAliasWithSuffix(course: Courses) {
    return `${courseLocationsAlias}-${course}`;
}
export function courseAliasWithSuffix(course: Courses) {
    return `${courseAlias}-${course}`;
}

export const importedParentAlias = 'importedParentAlias';
