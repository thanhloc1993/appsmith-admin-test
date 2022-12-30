import { CMSInterface } from '@supports/app-types';

import { cmsExamForm } from 'test-suites/squads/syllabus/cms-locators/exam-form';
import { ExamLODetail } from 'test-suites/squads/syllabus/step-definitions/cms-models/exam-lo-settings';

export type RequiredProperty<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export const schoolAdminFillExamWithManualGrading = async (
    cms: CMSInterface,
    {
        name,
        instruction,
        manualGrading,
    }: RequiredProperty<ExamLODetail, 'name' | 'instruction' | 'manualGrading'>
) => {
    const { page } = cms;

    await cmsExamForm.fillName(page!, name);
    await cmsExamForm.fillInstruction(page!, instruction);
    await cmsExamForm.selectManualGrading(page!, manualGrading);
};
