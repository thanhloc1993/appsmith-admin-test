import { CMSInterface } from '@supports/app-types';

import {
    manualGradingRadioOff,
    manualGradingRadioOn,
    manualGradingValue,
} from 'test-suites/squads/syllabus/step-definitions/cms-selectors/exam-lo';
import {
    ExamLODetail,
    schoolAdminFillExamLOInstruction,
    schoolAdminFillExamLOName,
} from 'test-suites/squads/syllabus/step-definitions/syllabus-exam-lo-create-definitions';

export enum ManualGrading {
    On = 'on',
    Off = 'off',
}

export type RequiredProperty<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export const schoolAdminFillExamWithManualGrading = async (
    cms: CMSInterface,
    {
        name,
        instruction,
        manualGrading,
    }: RequiredProperty<ExamLODetail, 'name' | 'instruction' | 'manualGrading'>
) => {
    await schoolAdminFillExamLOName(cms, name);
    await schoolAdminFillExamLOInstruction(cms, instruction);
    await cms.page!.click(manualGrading ? manualGradingRadioOn : manualGradingRadioOff);
};

export const schoolAdminAssertManualGrading = async (cms: CMSInterface, manualGrading: string) => {
    await cms.waitForSelectorHasText(manualGradingValue, manualGrading);
};
