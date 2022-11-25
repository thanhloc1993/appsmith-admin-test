import { CMSInterface } from '@supports/app-types';

import {
    examErrorHelper,
    gradeToPassInput,
    gradeToPassValue,
} from 'test-suites/squads/syllabus/step-definitions/cms-selectors/exam-lo';
import { RequiredProperty } from 'test-suites/squads/syllabus/step-definitions/create-exam-with-manual-grading-definitions';
import {
    ExamLODetail,
    schoolAdminFillExamLOInstruction,
    schoolAdminFillExamLOName,
} from 'test-suites/squads/syllabus/step-definitions/syllabus-exam-lo-create-definitions';

export const schoolAdminFillGradeToPass = async (
    cms: CMSInterface,
    gradeToPass?: number | string
) => {
    await cms.page!.fill(gradeToPassInput, gradeToPass?.toString() ?? '');
};

export const schoolAdminFillExamWithGradeToPass = async (
    cms: CMSInterface,
    { name, instruction, gradeToPass }: RequiredProperty<ExamLODetail, 'name' | 'instruction'>
) => {
    await schoolAdminFillExamLOName(cms, name);
    await schoolAdminFillExamLOInstruction(cms, instruction);
    await schoolAdminFillGradeToPass(cms, gradeToPass);
};

export const schoolAdminAssertGradeToPass = async (cms: CMSInterface, gradeToPass?: number) => {
    if (gradeToPass === undefined) {
        await cms.waitForSelectorHasText(gradeToPassValue, '--');

        return;
    }

    await cms.waitForSelectorHasText(gradeToPassValue, gradeToPass.toString());
};

export const schoolAdminAssertGradeToPassErrorMsg = async (cms: CMSInterface, message: string) => {
    await cms.waitForSelectorHasText(examErrorHelper, message);
};
