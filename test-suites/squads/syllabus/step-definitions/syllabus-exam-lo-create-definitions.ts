import { CMSInterface } from '@supports/app-types';

import { wrapperHeaderRoot } from './cms-selectors/cms-keys';
import {
    examLODetailInstruction,
    examLODetailName,
    examLOInstructionInput,
    examLONameInput,
    examLOUpsertFormNameWrapper,
} from './cms-selectors/exam-lo';
import {
    schoolAdminSelectCreateLO,
    schoolAdminSelectLOType,
} from './syllabus-create-task-assignment-definitions';
import { schoolAdminSeesErrorMessageField } from './syllabus-utils';

export interface ExamLODetail {
    name?: string;
    instruction?: string;
    manualGrading?: boolean;
    gradeToPass?: number;
    timeLimit?: number;
}

export type ExamLOUpsertField = 'name' | 'instruction';

export const schoolAdminCreateExamLO = async (
    cms: CMSInterface,
    createExamLOParam: ExamLODetail = {}
) => {
    await schoolAdminFillExamLOForm(cms, createExamLOParam);

    await cms.selectAButtonByAriaLabel('Save');
};

export const schoolAdminFillExamLOForm = async (
    cms: CMSInterface,
    createExamLOParam: ExamLODetail = {}
) => {
    const { name, instruction } = createExamLOParam;

    if (name) await schoolAdminFillExamLOName(cms, name);

    if (instruction) {
        await schoolAdminFillExamLOInstruction(cms, instruction);
    }
};

export const schoolAdminSelectExamLOTypeAndOpenUpsertDialog = async (
    cms: CMSInterface,
    topicName: string
) => {
    await schoolAdminSelectCreateLO(cms, topicName);
    await schoolAdminSelectLOType(cms, 'exam LO');
    await cms.selectAButtonByAriaLabel('Confirm');
};

export const schoolAdminFillExamLOName = async (cms: CMSInterface, name: string) => {
    await cms.page?.fill(examLONameInput, name);
};

export const schoolAdminFillExamLOInstruction = async (cms: CMSInterface, instruction: string) => {
    await cms.page?.fill(examLOInstructionInput, instruction);
};

export const schoolAdminSeeValidationErrorMessages = async (
    cms: CMSInterface,
    missingField: ExamLOUpsertField
) => {
    switch (missingField) {
        case 'name':
            await schoolAdminSeeValidationMessageForNameField(cms);
            break;
        default:
            throw Error(`Please handle for error for "${missingField}" field`);
    }
};

export const schoolAdminSeeValidationMessageForNameField = async (cms: CMSInterface) => {
    await schoolAdminSeesErrorMessageField(cms, {
        wrapper: examLOUpsertFormNameWrapper,
        errorMessage: 'This field is required',
    });
};

export const schoolAdminAssertExamDetail = async (cms: CMSInterface, examDetail: ExamLODetail) => {
    const { name, instruction } = examDetail;

    await cms.waitForSelectorHasText(wrapperHeaderRoot, name || '');

    await cms.attach(`Assert exam detail name ${name}`);
    await cms.waitForSelectorHasText(examLODetailName, name || '');

    await cms.attach(`Assert exam detail instruction ${instruction}`);
    await cms.waitForSelectorHasText(examLODetailInstruction, instruction || '--');
};
