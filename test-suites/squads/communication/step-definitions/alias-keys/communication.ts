import { learnerProfileAlias, parentProfilesAlias } from '@user-common/alias-keys/user';

import { AccountRoles, LearnerRolesWithTenant, ParentRolesWithTenant } from '@supports/app-types';

import { NotificationFields } from '../communication-common-definitions';

export const messageContentKey = 'messageContentKey';

export const aliasNotificationCreatedCourseName = 'aliasNotificationCreatedCourseName';
export const aliasNotificationGradeName = 'aliasNotificationGradeName';

export const aliasNotificationCategory = 'aliasNotificationCategory';

export const aliasCreatedNotificationID = 'aliasCreatedNotificationID';
export const aliasCreatedNotificationName = 'aliasCreatedNotificationName';

export const aliasCreatedScheduleNotificationID = 'aliasCreatedScheduleNotificationID';
export const aliasCreatedScheduleNotificationName = 'aliasCreatedScheduleNotificationName';
export const aliasCreatedScheduleNotification = 'aliasCreatedScheduleNotification';

export function cmsScheduleNotificationData(notificationField: NotificationFields) {
    return `${aliasCreatedScheduleNotification}-${notificationField}`;
}

export const aliasCreatedNotificationContent = 'aliasCreatedNotificationContent';
export const aliasCreatedNotificationStatus = 'aliasCreatedNotificationStatus';
export const aliasCreatedNotificationContentLink = 'aliasCreatedNotificationContentLink';
export const aliasMessageType = 'aliasMessageType';
export const aliasLearnerRole = 'aliasLearnerRole';
export const aliasAccountRole = 'aliasAccountRole';
export const aliasAccountRoles = 'aliasAccountRoles';

export const aliasChatGroupCourseIdC1 = 'aliasChatGroupCourseIdC1';
export const aliasChatGroupCourseNameC1 = 'aliasChatGroupCourseNameC1';
export const aliasChatGroupCourseIdC2 = 'aliasChatGroupCourseIdC2';
export const aliasChatGroupCourseNameC2 = 'aliasChatGroupCourseNameC2';

export const aliasMessageTypeFilter = 'aliasMessageTypeFilter';
export const aliasContactFilter = 'aliasContactFilter';
export const aliasSearchConversationType = 'aliasSearchConversationType';
export const aliasCourseFilter = 'aliasCourseFilter';
export const aliasPartialName = 'aliasPartialName';

export const aliasStudentName = 'aliasStudentName';

export const aliasSelectedReaderAccount = 'aliasSelectedReaderAccount';
export const aliasWaitTimeForSchedule = 'aliasWaitTimeForSchedule';
export const aliasNotificationScheduleAt = 'aliasNotificationScheduleAt';
export const aliasNotificationSentAt = 'aliasNotificationSentAt';
export const aliasStudentId = 'aliasStudentId';

export const aliasUserNameUpdated = 'aliasUserNameUpdated';
export const aliasUserAvatarUpdated = 'aliasUserAvatarUpdated';

export const aliasNotificationRequiredFieldArray = 'aliasNotificationRequiredFieldArray';

export const aliasCreatedNotificationData = 'aliasCreatedNotificationData';
export const aliasCreatedQuestionnaire = 'aliasCreatedQuestionnaire';

export const aliasQuestionnaireTable = 'aliasQuestionnaireTable';
export const aliasQuestionnaireAnswerCsv = 'aliasQuestionnaireAnswerCsv';
export const aliasWaitTimeForQuestionnaire = 'aliasWaitTimeForQuestionnaire';

export const aliasCreateTitleNotificationWithTenant = 'aliasCreateTitleNotificationWithTenant';

export function learnerProfileAliasWithTenant(learnerRoles: LearnerRolesWithTenant) {
    return `${learnerProfileAlias}-${learnerRoles}`;
}

export function parentProfilesAliasWithTenant(parentRoles: ParentRolesWithTenant) {
    return `${parentProfilesAlias}-${parentRoles}`;
}

export function aliasQuestionnaireAnswersByRole(role: AccountRoles) {
    return `aliasQuestionnaireAnswers-${role}`;
}
