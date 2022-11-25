import { getTestId } from './cms-keys';

export const examLOUpsertFormNameWrapper = getTestId('ExamUpsertForm__nameTextField');
export const examLONameInput = getTestId('ExamUpsertForm__name');

export const examLOInstructionInput = getTestId('ExamUpsertForm__instruction');

export const examLODetailName = getTestId('ExamDetailInstruction__examNameLabelValue');
export const examLODetailInstruction = getTestId(
    'ExamDetailInstruction__examInstructionLabelValue'
);
export const manualGradingRadioOn = getTestId('Radio__on');
export const manualGradingRadioOff = getTestId('Radio__off');
export const manualGradingValue = getTestId('ExamDetailInstruction__manualGradingValue');

export const gradeToPassInput = getTestId('ExamUpsertForm__gradeToPass');
export const gradeToPassValue = getTestId('ExamDetailInstruction__gradeToPassValue');
export const examErrorHelper = '[aria-label="TextFieldHF__formHelperText"]';

export const examLOQuestionsTab = getTestId('ExamDetail__questionsTab');
export const examLODetailsTab = getTestId('ExamDetail__detailsTab');

export const examLOAddQuestionButton = getTestId('ExamQuestions__buttonAddQuestions');

export const timeLimitInput = getTestId('ExamUpsertForm__timeLimit');
export const timeLimitValue = getTestId('ExamDetailInstruction__timeLimitValue');
