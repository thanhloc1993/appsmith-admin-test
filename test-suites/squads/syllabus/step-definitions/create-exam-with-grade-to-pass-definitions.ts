import { CMSInterface } from '@supports/app-types';

import { cmsExamForm } from 'test-suites/squads/syllabus/cms-locators/exam-form';
import { ExamLODetail } from 'test-suites/squads/syllabus/step-definitions/cms-models/exam-lo-settings';
import { RequiredProperty } from 'test-suites/squads/syllabus/step-definitions/create-exam-with-manual-grading-definitions';

export const schoolAdminFillExamWithGradeToPass = async (
    cms: CMSInterface,
    { name, instruction, gradeToPass }: RequiredProperty<ExamLODetail, 'name' | 'instruction'>
) => {
    const { page } = cms;

    await cmsExamForm.fillName(page!, name);
    await cmsExamForm.fillInstruction(page!, instruction);
    await cmsExamForm.fillGradeToPass(page!, gradeToPass);
};
