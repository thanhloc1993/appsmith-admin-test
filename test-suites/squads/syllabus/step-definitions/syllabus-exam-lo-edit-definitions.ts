import { CMSInterface } from '@supports/app-types';
import { ActionOptions } from '@supports/types/cms-types';

import {
    ExamLODetail,
    schoolAdminFillExamLOInstruction,
    schoolAdminFillExamLOName,
} from './syllabus-exam-lo-create-definitions';

export async function schoolAdminSelectEditExamLO(cms: CMSInterface) {
    await cms.selectActionButton(ActionOptions.EDIT, { target: 'actionPanelTrigger' });
}

export const schoolAdminFillExamLOForm = async (
    cms: CMSInterface,
    createExamLOParam: ExamLODetail = {}
) => {
    const { name = '', instruction = '' } = createExamLOParam;

    await schoolAdminFillExamLOName(cms, name);
    await schoolAdminFillExamLOInstruction(cms, instruction);
};

export const schoolAdminEditExamLO = async (cms: CMSInterface, examLOParam: ExamLODetail = {}) => {
    await schoolAdminFillExamLOForm(cms, examLOParam);

    await cms.selectAButtonByAriaLabel('Save');
};
