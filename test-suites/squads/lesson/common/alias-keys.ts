import { Tenant } from '@supports/app-types';

import { MaterialFile } from 'test-suites/squads/lesson/types/material';

export const aliasLessonInfo = 'aliasLessonInfo';
export const aliasIndividualLessonInfo = 'aliasIndividualLessonInfo';
export const aliasGroupLessonInfo = 'aliasGroupLessonInfo';

export const aliasLessonDateOfEditedLessonOnRecurringChain =
    'aliasLessonDateOfEditedLessonOnRecurringChain';

export const aliasWeeklyDayOfEditedLessonOnRecurringChain =
    'aliasWeeklyDayOfEditedLessonOnRecurringChain';

export const aliasEndDateOfEditedLessonOnRecurringChain =
    'aliasEndDateOfEditedLessonOnRecurringChain';

export const aliasLessonId = 'aliasLessonId';
export const aliasEditedLessonId = 'aliasEditedLessonId';
export const aliasDuplicatedLessonId = 'aliasDuplicatedLessonId';

export const aliasAttendanceStatusValue = 'aliasAttendanceStatusValue';

export const aliasLessonTime = 'aliasLessonTime';

export const aliasLocationId = 'aliasLocationId';
export const aliasLocationName = 'aliasLocationName';
export const aliasLocationIdWithTenant = (tenant: Tenant) => `aliasLocationId_${tenant}`;
export const aliasLocationNameWithTenant = (tenant: Tenant) => `aliasLocationName_${tenant}`;

export const aliasCourseId = 'aliasCourseId';
export const aliasCourseName = 'aliasCourseName';
export const aliasCourseStartDate = 'aliasCourseStartDate';
export const aliasCourseEndDate = 'aliasCourseEndDate';

export const aliasClassId = 'aliasClassId';
export const aliasClassName = 'aliasClassName';

export const aliasLessonName = 'aliasLessonName';

export const aliasStudentInfoList = 'aliasStudentInfoList';

export const aliasCourseIdByStudent = (studentId: string) => `aliasCourseFor_${studentId}`;
export const aliasStudentByClassId = (classId: string) => `aliasStudentOf_${classId}`;

export const aliasFileName = 'aliasFileName';
export const aliasCourse = 'aliasCourse';
export const aliasImportedClass = 'aliasImportedClass';
export const aliasEditedLesson = 'aliasEditedLesson';

export const aliasCourseJPREP = 'aliasCourseJPREP';
export const aliasLessonJPREP = 'aliasLessonJPREP';

export const aliasMaterialId: Record<MaterialFile, string> = {
    pdf: 'aliasMaterialIdPDF',
    video: 'aliasMaterialIdVideo',
    'pdf 1': 'aliasMaterialId1stPDF',
    'pdf 2': 'aliasMaterialId2ndPDF',
    'video 1': 'aliasMaterialId1stVideo',
    'video 2': 'aliasMaterialId2ndVideo',
    'brightcove video': 'aliasMaterialIdBrightcove',
};

export const aliasMaterialNamePrefix = 'aliasMaterialName';

export const aliasMaterialName: Record<MaterialFile, string> = {
    pdf: `${aliasMaterialNamePrefix}PDF`,
    video: `${aliasMaterialNamePrefix}Video`,
    'pdf 1': `${aliasMaterialNamePrefix}1stPDF`,
    'pdf 2': `${aliasMaterialNamePrefix}2ndPDF`,
    'video 1': `${aliasMaterialNamePrefix}1stVideo`,
    'video 2': `${aliasMaterialNamePrefix}2ndVideo`,
    'brightcove video': `${aliasMaterialNamePrefix}Brightcove`,
};

export const aliasUploadedPDFUrl = 'aliasUploadedPDFUrl';
export const aliasDeletedLessonDate = 'aliasDeletedLessonDate';

export const aliasStartDate = 'aliasStartDate';
export const aliasEndDate = 'aliasEndDate';

export const aliasTeachingMedium = 'aliasTeachingMedium';

export const aliasLessonReportData = 'aliasLessonReportData';

export const aliasLessonDate = 'aliasLessonDate';

export const aliasRepeatDuration = 'aliasRepeatDuration';

export const aliasOrderEditLessonWeeklyRecurring = 'aliasOrderEditLessonWeeklyRecurring';

export const aliasFilledLessonFields = 'aliasFilledLessonFields';
