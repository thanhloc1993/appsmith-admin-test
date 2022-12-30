import { delay } from '@legacy-step-definitions/utils';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { CMSInterface } from '@supports/app-types';

export const schoolAdminEnableRemoveBookChapter = () => {
    return featureFlagsHelper.isEnabled('Syllabus_BookManagement_BackOffice_RemoveBookChapter');
};

// TODO: Hieu will remove
// TODO: I will update it later by feature flag or manual
export const schoolAdminShouldUseInsertLO = async () => {
    return Promise.resolve(false);
};

// TODO: I will update it later by feature flag or manual
export const schoolAdminShouldUseInsertAssignment = async () => {
    return Promise.resolve(false);
};

// TODO: I will update it later by feature flag or manual
export const schoolAdminShouldUseUpdateAssignment = async () => {
    return Promise.resolve(false);
};

export const schoolAdminWaitingQuestionDataSync = async (cms: CMSInterface) => {
    console.log('Waiting question data sync');

    await delay(3000);
    await cms.page!.reload();
};

export const checkIsManualGradingEnabled = () =>
    featureFlagsHelper.isEnabled(
        'Syllabus_ManualGradingExam_BackOffice_ManualGradingExamManagement'
    );

export const checkIsGradeToPassEnabled = () =>
    featureFlagsHelper.isEnabled('Syllabus_ManualGradingExam_BackOffice_GradeToPass');

export const checkIsQuestionGroupEnabled = async () =>
    featureFlagsHelper.isEnabled('Syllabus_Quiz_GroupOfQuestions');

export const UPSERT_STUDYPLAN_ENDPOINT_TIMEOUT = 60000;

// TODO: We need to check checkIsQuestionGroupEnabled so it take time
export const ASSERT_EDIT_MULTIPLE_CHOICE_QUESTION = 90000;

export const schoolAdminDelayBeforeDisplayNextSnackbar = () => delay(300);

export const schoolAdminWaitingAfterUploadImageIntoEditor = () => delay(300);

export const schoolAdminShouldUseUpsertFlashcardContent = () => {
    return featureFlagsHelper.isEnabled('Syllabus_Flashcard_BackOffice_ApplyHandwriting');
};
