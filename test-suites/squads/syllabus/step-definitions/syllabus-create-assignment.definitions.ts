import { asyncForEach } from '@legacy-step-definitions/utils';

import { CMSInterface } from '@supports/app-types';

import {
    assignmentFormGrade,
    assignmentFormIns,
    assignmentFormName,
    assignmentFormRoot,
    assignmentFormSelectGradeMethod,
    assignmentInstructionText,
    assignmentMaxGradeText,
    assignmentSetting,
} from './cms-selectors/assignment';
import { AssignmentSettingInfo } from './syllabus-edit-assignment-steps';

export interface AssignmentForm {
    name?: string;
    grade?: string;
    gradeMethod?: 'required' | 'none';
    instruction?: string;
    settings?: AssignmentSettingInfo[];
}

const mapperCheckBoxSettingSelectors: { [key in AssignmentSettingInfo]: string } = {
    'Allow late submission': 'settings_allow_late_submission',
    'Allow resubmission': 'settings_allow_resubmission',
    'Require attachment submission': 'settings_require_attachment',
    'Require text note submission': 'settings_require_assignment_note',
    'Require recorded video submission': 'settings_require_video_submission',
};

const mapperSettingSelectors: { [key in AssignmentSettingInfo]: string } = {
    'Allow late submission': 'allow_late_submission',
    'Allow resubmission': 'allow_resubmission',
    'Require attachment submission': 'require_attachment',
    'Require text note submission': 'require_assignment_note',
    'Require recorded video submission': 'require_video_submission',
};

export const schoolAdminGetListAssignmentSettings = () => {
    return Object.keys(mapperSettingSelectors) as AssignmentSettingInfo[];
};

export const schoolAdminSeeAssignForm = async (cms: CMSInterface) => {
    await cms.page?.waitForSelector(assignmentFormRoot);
};

export const schoolAdminFillAssignmentForm = async (cms: CMSInterface, data: AssignmentForm) => {
    const { name, instruction, gradeMethod, grade, settings } = data;

    await cms.page?.fill(assignmentFormName, name || '');

    await cms.page?.fill(assignmentFormIns, instruction || '');

    await schoolAdminSelectGradeMethodOfAssignment(cms, gradeMethod);

    if (gradeMethod === 'required') {
        await schoolAdminFillGradeOfAssignmentForm(cms, grade);
    }

    await schoolAdminSelectAssignmentSettings(cms, settings || []);
};

export const schoolAdminFillGradeOfAssignmentForm = async (cms: CMSInterface, grade?: string) => {
    await cms.page?.fill(assignmentFormGrade, grade || '');
};

export const schoolAdminSelectGradeMethodOfAssignment = async (
    cms: CMSInterface,
    requiredMethod?: AssignmentForm['gradeMethod']
) => {
    const isRequiredGrade = requiredMethod === 'required';

    await cms.page!.click(assignmentFormSelectGradeMethod);

    await cms.selectElementByDataValue(isRequiredGrade ? 'true' : 'false');
};

export const schoolAdminSelectAssignmentSettings = async (
    cms: CMSInterface,
    settings: AssignmentSettingInfo[]
) => {
    await asyncForEach<AssignmentSettingInfo, void>(settings, async (setting) => {
        const dataId = mapperCheckBoxSettingSelectors[setting];

        await cms.page?.check(`#${dataId}`);
    });
};

export const schoolAdminCheckAssignmentSettings = async (
    cms: CMSInterface,
    settings: AssignmentSettingInfo[]
) => {
    await asyncForEach<AssignmentSettingInfo, void>(settings, async (setting) => {
        await schoolAdminSeeAssignmentSettingChecked(cms, setting);
    });
};

const schoolAdminSeeAssignmentSettingChecked = async (
    cms: CMSInterface,
    setting: AssignmentSettingInfo
) => {
    const element = await cms.page!.waitForSelector(
        assignmentSetting(mapperSettingSelectors[setting])
    );

    const isChecked = await element.isChecked();

    if (!isChecked) throw Error(`Setting ${setting} of assignment is not checked`);
};

export const schoolAdminSeeAssignmentInstruction = async (
    cms: CMSInterface,
    instruction: string
) => {
    await cms.page?.waitForSelector(assignmentInstructionText(instruction));
};

export const schoolAdminSeeAssignmentGrade = async (cms: CMSInterface, grade: string) => {
    await cms.page?.waitForSelector(assignmentMaxGradeText(grade));
};
