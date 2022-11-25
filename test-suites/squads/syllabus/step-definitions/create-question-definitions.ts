import { genId } from '@legacy-step-definitions/utils';

import { CMSInterface } from '@supports/app-types';
import { QuizTypeTitle } from '@supports/types/cms-types';

import {
    fillInTheBlankInput,
    quizAnswerEditorInput,
    quizMainExplanationEditor,
    quizQuestionEditorInput,
} from './cms-selectors/cms-keys';
import { asyncForEach } from './utils/common';

//TODO: Remove instruction
export const schoolAdminFillQuizQuestionData = async (cms: CMSInterface, content: string) => {
    await cms.instruction(
        `school admin fills quiz question description ${content}`,
        async function () {
            const page = cms.page!;

            const questionEditor = await page.waitForSelector(quizQuestionEditorInput);

            await questionEditor.fill(content);
        }
    );
};

//TODO: Remove instruction
export const schoolAdminFillQuizExplanationData = async (cms: CMSInterface, content: string) => {
    await cms.instruction(`school admin fills quiz explanation ${content}`, async function () {
        const page = cms.page!;

        const explanationEditor = await page.waitForSelector(quizMainExplanationEditor);

        await explanationEditor.scrollIntoViewIfNeeded();

        await explanationEditor.fill(content);
    });
};

//TODO: Replace to use schoolAdminFillsAllAnswersByQuestionType
export async function schoolAdminFillsQuizAnswers(cms: CMSInterface, quizTypeTitle: QuizTypeTitle) {
    const page = cms.page!;

    const updatedAnswers: string[] = [];

    switch (quizTypeTitle) {
        case 'multiple choice': {
            await cms.instruction(`school admin fills MCQ answers data`, async function () {
                const answerEditors = await page!.$$(quizAnswerEditorInput);
                await asyncForEach(answerEditors, async (editor) => {
                    const content = `Answer ${genId()}`;
                    await editor.fill(content);
                    updatedAnswers.push(content);
                });
            });
            break;
        }

        case 'fill in the blank': {
            await cms.instruction(`school admin fills FIB answers data`, async function () {
                const answerEditors = await page!.$$(fillInTheBlankInput);
                await asyncForEach(answerEditors, async (editor) => {
                    const content = `Answer ${genId()}`;
                    await editor.fill(content);
                    updatedAnswers.push(content);
                });
            });
            break;
        }

        case 'multiple answer': {
            await cms.instruction(`school admin fills MAQ answers data`, async function () {
                const answerEditors = await page!.$$(quizAnswerEditorInput);
                await asyncForEach(answerEditors, async (editor) => {
                    const content = `Answer ${genId()}`;
                    await editor.fill(content);
                    updatedAnswers.push(content);
                });
            });
            break;
        }

        default:
            break;
    }

    return updatedAnswers;
}
