import { CMSInterface } from '@supports/app-types';
import { ActionOptions } from '@supports/types/cms-types';

import { cmsExamForm } from 'test-suites/squads/syllabus/cms-locators/exam-form';
import { ExamLODetail } from 'test-suites/squads/syllabus/step-definitions/cms-models/exam-lo-settings';

export async function schoolAdminSelectEditExamLO(cms: CMSInterface) {
    await cms.selectActionButton(ActionOptions.EDIT, { target: 'actionPanelTrigger' });
}

export const schoolAdminFillExamLOForm = async (
    cms: CMSInterface,
    createExamLOParam: ExamLODetail = {}
) => {
    const { page } = cms;
    const { name = '', instruction = '' } = createExamLOParam;

    await cmsExamForm.fillName(page!, name);
    await cmsExamForm.fillInstruction(page!, instruction);
};

export const schoolAdminEditExamLO = async (cms: CMSInterface, examLOParam: ExamLODetail = {}) => {
    await schoolAdminFillExamLOForm(cms, examLOParam);

    await cms.selectAButtonByAriaLabel('Save');
};
