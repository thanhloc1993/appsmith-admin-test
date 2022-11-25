import { getTestId } from '@legacy-step-definitions/cms-selectors/cms-keys';

export const lessonManagementLessonSaveAsDraftButton = `${getTestId(
    'DialogFullScreen__footer'
)} button${getTestId('LessonUpsertFooter__buttonSaveDraft')}`;

export const lessonManagementUpsertChipStatus = getTestId(
    'HeaderLessonDetailWithAction__chipLessonStatus'
);

export const lessonManagementUpsertDatePicker = `${getTestId(
    'FormLessonUpsertV3__lessonDate'
)} input${getTestId('DatePickerHF__input')}`;
