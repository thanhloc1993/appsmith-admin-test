import { CMSInterface } from '@supports/app-types';

import {
    schoolAdminFillQuizExplanationData,
    schoolAdminFillQuizQuestionData,
} from './syllabus-create-question-definitions';

export interface QuizManualForm {
    question: string;
    explanation: string;
}

export const schoolAdminFillManualInputQuestionForm = async (
    cms: CMSInterface,
    form: QuizManualForm
) => {
    const { question, explanation } = form;
    await schoolAdminFillQuizQuestionData(cms, question);

    await schoolAdminFillQuizExplanationData(cms, explanation);
};

export const schoolAdminFillManualInputQuestionFormV2 = async (
    cms: CMSInterface,
    form: QuizManualForm
) => {
    const { question, explanation } = form;
    await schoolAdminFillQuizQuestionData(cms, question);

    await schoolAdminFillQuizExplanationData(cms, explanation);
};
