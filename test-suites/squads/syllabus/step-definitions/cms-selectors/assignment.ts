import { getTestId } from 'test-suites/squads/syllabus/utils/common';

export const assignmentFormRoot = getTestId('AssignmentForm__root');

export const assignmentFormName = getTestId('AssignmentForm__name');

export const assignmentFormGrade = getTestId('AssignmentForm__maxGrade');

export const assignmentFormIns = getTestId('AssignmentForm__instruction');

export const assignmentFormSelectGradeMethod = getTestId('AssignmentForm__gradingMethod');

export const assignmentInstruction = getTestId('ShowAssignment__instruction');
export const assignmentMaxGrade = getTestId('ShowAssignment__maxGrade');

export const assignmentInstructionText = (info: string) =>
    `${assignmentInstruction}:has-text("${info}")`;

export const assignmentMaxGradeText = (info: string) => `${assignmentMaxGrade}:has-text("${info}")`;

export const assignmentSetting = (setting: string) => `input[name="${setting}"]`;
