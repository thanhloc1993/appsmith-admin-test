import { Lessons, Tenant } from '@supports/app-types';

import { LessonManagementLessonName } from 'step-definitions/lesson-default-sort-future-lessons-list-definitions';

export const aliasLessonName = 'aliasLessonName';

export const aliasLessonInfo = 'aliasLessonInfo';

export const aliasCourseName = 'aliasCourseName';

export const aliasCourseIdByCourseName = (courseName: string) => {
    return `aliasCourseIdByCourseName-${courseName}`;
};

export const aliasCourseNameByCoursePrefix = (prefix: string) => {
    return `aliasCourseName-${prefix}`;
};

export const aliasCourseId = 'aliasCourseId';

export const aliasPDFUploadedURL = 'aliasPDFUploadedURL';

export const aliasCurrentPDFPage = 'aliasCurrentPDFPage';

export const aliasLearnerSubmittedPollingOption = (accountRole: string): string =>
    `alias${accountRole}SubmittedPollingOption`;

export const aliasLessonId = 'aliasLessonId';

export const aliasLessonIdList = 'aliasLessonIdList';

export const aliasAttendanceStatusBulkAction = 'aliasAttendanceStatusBulkAction';

export const aliasLessonReportData = 'aliasLessonReportData';

export const aliasRowsPerPage = 'aliasRowsPerPage';

export const aliasStudentName = 'aliasStudentName';

export const aliasAttendanceStatusValue = 'aliasAttendanceStatusValue';

export const aliasLessonIdForPreviousReport = 'aliasLessonIdForPreviousReport';

export const aliasStudentInfoList = 'aliasStudentInfoList';

export const aliasLessonData = 'aliasLessonData';

export const aliasStartDate = 'aliasStartDate';

export const aliasEndDate = 'aliasEndDate';
export const aliasNewEndDate = 'aliasNewEndDate';

export const aliasDayOfTheWeek = 'aliasDayOfTheWeek';

export const aliasSearchKeyword = 'aliasSearchKeyword';

export const aliasTeacherName = 'aliasTeacherName';

export const aliasGrade = 'aliasGrade';

export const aliasLessonTime = 'aliasLessonTime';

export const aliasLessonFilterCriteria = 'aliasLessonFilterCriteria';

export const aliasLocationId = 'aliasLocationId';
export const aliasLocationName = 'aliasLocationName';

export const aliasLocationIdWithTenant = (tenant: Tenant) => `aliasLocationId_${tenant}`;
export const aliasLocationNameWithTenant = (tenant: Tenant) => `aliasLocationName_${tenant}`;

export const aliasLocationsListWithTenant = (tenant: Tenant) => `aliasLocationsList${tenant}`;

export const aliasCourseIdByStudent = (studentId: string) => `aliasCourseFor_${studentId}`;

export function aliasLessonNameLessonId(lessonName: LessonManagementLessonName) {
    return `${aliasLessonName}-${lessonName}`;
}

export const aliasLessonIdWithSuffix = (lesson: Lessons) => `aliasLessonId-${lesson}`;

// Location filter
export const aliasLocationIdsList = 'aliasLocationIdsList';
export const aliasLocationsList = 'aliasLocationsList';

export const aliasOrgLocation = 'aliasOrgLocation';
export const aliasParentLocation = 'aliasParentLocation';
export const aliasAllParentLocations = 'aliasAllParentLocations';
export const aliasChildLocation = 'aliasChildLocation';
export const aliasChildrenLocation = 'aliasChildrenLocation';

export const aliasSchoolAdminDriverNameByTenant = (tenant: Tenant) =>
    `aliasSchoolAdminDriverName_${tenant}`;

export const aliasLessonIdByLessonName = (lessonName: LessonManagementLessonName) =>
    `aliasLessonId_${lessonName}`;

export const aliasLessonInfoByLessonName = (lessonName: LessonManagementLessonName) =>
    `aliasLessonInfo_${lessonName}`;
