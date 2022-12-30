import { CMSInterface } from '@supports/app-types';

import { wrapperHeaderRoot } from './cms-selectors/cms-keys';
import {
    schoolAdminSelectCreateLO,
    schoolAdminSelectLOType,
} from './syllabus-create-task-assignment-definitions';
import { cmsExamDetail } from 'test-suites/squads/syllabus/cms-locators/exam-detail';
import { cmsExamForm } from 'test-suites/squads/syllabus/cms-locators/exam-form';
import {
    ExamLODetail,
    ExamLOUpsertField,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/exam-lo-settings';

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
    const { page } = cms;
    const { name, instruction } = createExamLOParam;

    if (name) {
        await cmsExamForm.fillName(page!, name);
    }

    if (instruction) {
        await cmsExamForm.fillInstruction(page!, instruction);
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

export const schoolAdminSeeValidationErrorMessages = async (
    cms: CMSInterface,
    missingField: ExamLOUpsertField
) => {
    if (missingField === 'name') {
        await schoolAdminSeeValidationMessageForNameField(cms);

        return;
    }

    throw Error(`Please handle for error for "${missingField}" field`);
};

export const schoolAdminSeeValidationMessageForNameField = async (cms: CMSInterface) => {
    await cmsExamForm.findValidationError(cms, 'This field is required');
};

export const schoolAdminAssertExamDetail = async (cms: CMSInterface, examDetail: ExamLODetail) => {
    const { name, instruction } = examDetail;

    await cms.waitForSelectorHasText(wrapperHeaderRoot, name || '');

    await cms.attach(`Assert exam detail name ${name}`);
    await cmsExamDetail.findName(cms, name || '');

    await cms.attach(`Assert exam detail instruction ${instruction}`);
    await cmsExamDetail.findInstruction(cms, instruction || '--');
};
