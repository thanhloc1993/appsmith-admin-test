import { CMSInterface } from '@supports/app-types';

import { cmsExamForm } from 'test-suites/squads/syllabus/cms-locators/exam-form';
import { ExamLODetail } from 'test-suites/squads/syllabus/step-definitions/cms-models/exam-lo-settings';
import { RequiredProperty } from 'test-suites/squads/syllabus/step-definitions/create-exam-with-manual-grading-definitions';

export const schoolAdminFillExamWithShowingAnswerKey = async (
    cms: CMSInterface,
    {
        name,
        instruction,
        showingAnswerKey,
    }: RequiredProperty<ExamLODetail, 'name' | 'instruction' | 'showingAnswerKey'>
) => {
    const { page } = cms;

    await cmsExamForm.fillName(page!, name);
    await cmsExamForm.fillInstruction(page!, instruction);
    await cmsExamForm.selectShowingAnswerKey(page!, showingAnswerKey);
};
