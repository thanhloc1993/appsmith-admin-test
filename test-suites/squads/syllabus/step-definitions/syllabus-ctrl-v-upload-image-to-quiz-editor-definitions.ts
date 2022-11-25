import {
    questionListItemByText,
    questionSingleDescription,
} from '@legacy-step-definitions/cms-selectors/syllabus';
import { genId } from '@legacy-step-definitions/utils';

import { DataTable } from '@cucumber/cucumber';

import { ElementHandle, Page } from 'playwright';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { ActionOptions, QuizTypeTitle } from '@supports/types/cms-types';

import { aliasQuizQuestionDataTable, aliasQuizQuestionPasteImageName } from './alias-keys/syllabus';
import {
    fillInTheBlankInput,
    questionListTable,
    quizExplanationBox,
    quizQuestionBox,
    tableBaseRow,
    tableRowByText,
    textBox,
    editorLoadingImage,
    questionRow,
    quizAnswerMultipleChoiceRoot,
    quizAnswerMultipleAnswerRoot,
} from './cms-selectors/cms-keys';
import { correctAnswer } from './syllabus-create-question-definitions';
import { checkIsQuestionGroupEnabled } from './syllabus-migration-temp';
import {
    delayUpsertMediaEndpoint,
    schoolAdminChooseToCreateQuizWithTypeV2,
} from './syllabus-question-utils';

export async function schoolAdminPasteScreenshotToLOQuestionAndSave(
    cms: CMSInterface,
    quizTypeTitle: QuizTypeTitle,
    scenario: ScenarioContext,
    quizFieldsDataTable: DataTable
): Promise<void> {
    const page = cms.page!;
    const questionName = `Question ${genId()}`;
    const quizFieldsData = parseQuizFieldsDataTable(quizFieldsDataTable);

    await schoolAdminChooseToCreateQuizWithTypeV2(cms, quizTypeTitle);

    await schoolAdminPasteImageToQuiz(cms, quizTypeTitle, quizFieldsData, questionName);

    await page.waitForSelector(editorLoadingImage, { state: 'detached' });

    await cms.selectAButtonByAriaLabel(`Save`);
    await waitForLoading(cms);
    scenario.set(aliasQuizQuestionPasteImageName, questionName);
    scenario.set(aliasQuizQuestionDataTable, quizFieldsData);
}

export async function schoolAdminPasteScreenshotToLOQuestion(
    cms: CMSInterface,
    quizTypeTitle: QuizTypeTitle,
    scenario: ScenarioContext,
    quizFieldsDataTable: DataTable
): Promise<void> {
    const page = cms.page!;
    const questionName = `Question ${genId()}`;
    const quizFieldsData = parseQuizFieldsDataTable(quizFieldsDataTable);

    await schoolAdminChooseToCreateQuizWithTypeV2(cms, quizTypeTitle);

    await delayUpsertMediaEndpoint(page, 20000);

    await schoolAdminPasteImageToQuiz(cms, quizTypeTitle, quizFieldsData, questionName);

    scenario.set(aliasQuizQuestionPasteImageName, questionName);
    scenario.set(aliasQuizQuestionDataTable, quizFieldsData);
}

export async function schoolAdminSaveQuizWhenImageUploading(
    cms: CMSInterface,
    quizTypeTitle: QuizTypeTitle,
    scenario: ScenarioContext
): Promise<void> {
    await schoolAdminSeeLoadingImageOnQuiz(cms, quizTypeTitle, scenario, 1);

    await cms.selectAButtonByAriaLabel(`Save`);
    await waitForLoading(cms);
}

export async function schoolAdminPasteImageToQuiz(
    cms: CMSInterface,
    quizTypeTitle: QuizTypeTitle,
    quizFieldsData: QuizFieldsData,
    questionName?: string
): Promise<void> {
    const page = cms.page!;

    await schoolAdminPasteImageToQuizQuestion(cms, questionName);

    switch (quizTypeTitle) {
        case 'multiple choice': {
            await cms.instruction(
                `school admin paste image to MCQ answers data`,
                async function () {
                    await schoolAdminPasteImageToQuizAnswers(
                        page,
                        quizFieldsData,
                        quizTypeTitle,
                        quizAnswerMultipleChoiceRoot
                    );
                }
            );
            break;
        }

        case 'fill in the blank': {
            await cms.instruction(`school admin fill FIB answers data`, async function () {
                await page.fill(fillInTheBlankInput, correctAnswer);
            });
            break;
        }

        case 'multiple answer': {
            await cms.instruction(
                `school admin paste image to MAQ answers data`,
                async function () {
                    await schoolAdminPasteImageToQuizAnswers(
                        page,
                        quizFieldsData,
                        quizTypeTitle,
                        quizAnswerMultipleAnswerRoot
                    );
                }
            );
            break;
        }

        default:
            break;
    }

    await schoolAdminPasteImageToQuizExplanation(cms);
}

export async function schoolAdminPasteImageToQuizQuestion(
    cms: CMSInterface,
    questionName?: string
): Promise<void> {
    await cms.instruction(`school admin paste image to quiz question`, async function () {
        const page = cms.page!;

        const questionEditor = await page
            .waitForSelector(quizQuestionBox)
            .then((question) => question.waitForSelector(textBox));

        if (questionName) {
            await questionEditor.fill(questionName);
        }

        const buffer = await page.screenshot({
            type: 'png',
        });

        await pasteImage(page, questionEditor, buffer.toString('base64'));
    });
}

export async function schoolAdminPasteImageToQuizExplanation(cms: CMSInterface): Promise<void> {
    await cms.instruction(`school admin paste image to quiz explanation`, async function () {
        const page = cms.page!;

        const explanationBox = await page
            .waitForSelector(quizExplanationBox)
            .then((explanationArea) => explanationArea.waitForSelector(textBox));

        const buffer = await page.screenshot({
            type: 'png',
        });
        await pasteImage(page, explanationBox, buffer.toString('base64'));
    });
}

export const schoolAdminPasteImageToQuizAnswers = async (
    page: Page,
    quizFieldsData: QuizFieldsData,
    quizTypeTitle: QuizTypeTitle,
    selector: string
) => {
    const answerEditors = await page!.locator(selector).elementHandles();
    const buffer = await page.screenshot({
        type: 'png',
    });
    for (const answerEditor of answerEditors) {
        const testAnswer = await answerEditor.waitForSelector(textBox);
        if (quizFieldsData[quizTypeTitle].answer) {
            await pasteImage(page, testAnswer, buffer.toString('base64'));
        } else {
            await testAnswer.fill(`Answer ${genId()}`);
        }
    }
};

export const pasteImage = async (
    page: Page,
    element: ElementHandle<SVGElement | HTMLElement>,
    image: string
) => {
    await page.evaluate(
        async ({ image }) => {
            const data = await fetch(`data:image/png;base64,${image}`);

            const clipboardItem = new ClipboardItem({
                'image/png': data.blob(),
            });
            await navigator.clipboard.write([clipboardItem]);
        },
        { image }
    );
    const userAgent = await page.evaluate(() => navigator.userAgent);
    const isMac = userAgent.toUpperCase().indexOf('MAC') >= 0;
    if (isMac) {
        await element.press('Command+V');
    } else {
        await element.press(`Control+V`);
    }
};

export const waitForLoading = async (cms: CMSInterface) => {
    await cms.waitingForLoadingIcon();
    await cms.waitingForProgressBar();
};

export type QuizFieldsData = {
    [key in QuizTypeTitle]: {
        question: boolean;
        answer: boolean;
        explanation: boolean;
    };
};

export const parseQuizFieldsDataTable = (quizFieldsDataTable: DataTable): QuizFieldsData => {
    const quizFields = quizFieldsDataTable.rows();

    return quizFields.reduce(
        (obj, row) =>
            Object.assign(obj, {
                [row[0]]: {
                    question: row[1] == '1',
                    answer: row[2] == '1',
                    explanation: row[3] == '1',
                },
            }),
        {} as QuizFieldsData
    );
};

export const schoolAdminSeeImageShowOnQuiz = async (
    cms: CMSInterface,
    quizTypeTitle: QuizTypeTitle,
    scenario: ScenarioContext,
    numberImage = 1
): Promise<void> => {
    const questionName = scenario.get<string>(aliasQuizQuestionPasteImageName);
    const quizFieldsData = scenario.get<QuizFieldsData>(aliasQuizQuestionDataTable);

    await cms.instruction(
        `school admin choose edit question ${questionName} type ${quizTypeTitle} created/edited on CMS`,
        async function (cms) {
            const isQuestionGroupEnabled = await checkIsQuestionGroupEnabled();
            const selector = isQuestionGroupEnabled
                ? questionListItemByText(questionName)
                : tableRowByText(questionListTable, questionName);

            await cms.page!.waitForSelector(selector);

            await cms.selectActionButton(ActionOptions.EDIT, {
                target: 'actionPanelTrigger',
                wrapperSelector: selector,
            });

            await cms.waitingForLoadingIcon();
        }
    );

    await schoolAdminSeeImageOnQuizEditor(
        cms,
        quizTypeTitle,
        quizFieldsData,
        questionName,
        numberImage
    );
};

export const schoolAdminSeeImageOnQuizEditor = async (
    cms: CMSInterface,
    quizTypeTitle: QuizTypeTitle,
    quizFieldsData: QuizFieldsData,
    questionName: string,
    numberImage = 1
) => {
    const page = cms.page!;

    await cms.instruction(
        `school admin see ${numberImage} pasted image on ${questionName} quiz question`,
        async (cms) => {
            await schoolAdminSeeImageOnQuizEditorField(
                cms,
                questionName,
                numberImage,
                quizQuestionBox
            );
        }
    );

    switch (quizTypeTitle) {
        case 'multiple choice': {
            await cms.instruction(
                `school admin see ${numberImage} pasted image on MCQ answers data`,
                async function () {
                    await schoolAdminSeeImageOnQuizAnswerFields(
                        page,
                        quizTypeTitle,
                        quizFieldsData,
                        numberImage,
                        quizAnswerMultipleChoiceRoot
                    );
                }
            );
            break;
        }

        case 'multiple answer': {
            await cms.instruction(
                `school admin see ${numberImage} pasted image on MAQ answers data`,
                async function () {
                    await schoolAdminSeeImageOnQuizAnswerFields(
                        page,
                        quizTypeTitle,
                        quizFieldsData,
                        numberImage,
                        quizAnswerMultipleAnswerRoot
                    );
                }
            );
            break;
        }

        default:
            break;
    }

    await cms.instruction(
        `school admin see ${numberImage} pasted image on ${questionName} quiz explanation`,
        async (cms) => {
            await schoolAdminSeeImageOnQuizEditorField(
                cms,
                questionName,
                numberImage,
                quizExplanationBox
            );
        }
    );
};

export async function schoolAdminSeeImageOnQuizEditorField(
    cms: CMSInterface,
    questionName: string,
    numberImage = 1,
    selector: string
): Promise<void> {
    await cms.instruction(
        `school admin see ${numberImage} pasted image on ${questionName} quiz question/explanation`,
        async function () {
            const page = cms.page!;
            const questionEditor = page.locator(selector).locator(textBox);

            const images = await questionEditor
                .locator('[alt="wyswyg inlined upload"]')
                .elementHandles();

            weExpect(images).toHaveLength(numberImage);
        }
    );
}

export async function schoolAdminSeeImageOnQuizAnswerFields(
    page: Page,
    quizTypeTitle: QuizTypeTitle,
    quizFieldsData: QuizFieldsData,
    numberImage: number,
    selector: string
) {
    const answerEditors = page!.locator(selector).locator(textBox);
    const count = await answerEditors.count();
    for (let i = 0; i < count; i++) {
        const testAnswer = answerEditors.nth(i);
        if (quizFieldsData[quizTypeTitle].answer) {
            const images = await testAnswer
                .locator('[alt="wyswyg inlined upload"]')
                .elementHandles();
            weExpect(images).toHaveLength(numberImage);
        }
    }
}

export async function schoolAdminSeeLoadingImageOnQuiz(
    cms: CMSInterface,
    quizTypeTitle: QuizTypeTitle,
    scenario: ScenarioContext,
    numberImage = 1
) {
    const questionName = scenario.get<string>(aliasQuizQuestionPasteImageName);
    const quizFieldsData = scenario.get<QuizFieldsData>(aliasQuizQuestionDataTable);

    await cms.instruction(
        `school admin see ${numberImage} loading image on ${questionName} quiz question`,
        async (cms) => {
            await schoolAdminSeeLoadingImageOnQuizEditorField(cms, numberImage, quizQuestionBox);
        }
    );

    await schoolAdminSeeLoadingImageOnQuizAnswer(cms, quizTypeTitle, quizFieldsData, numberImage);

    await cms.instruction(
        `school admin see ${numberImage} loading image on ${questionName} quiz explanation`,
        async (cms) => {
            await schoolAdminSeeLoadingImageOnQuizEditorField(cms, numberImage, quizExplanationBox);
        }
    );
}

export async function schoolAdminSeeLoadingImageOnQuizAnswer(
    cms: CMSInterface,
    quizTypeTitle: QuizTypeTitle,
    quizFieldsData: QuizFieldsData,
    numberImage = 1
) {
    const page = cms.page!;
    switch (quizTypeTitle) {
        case 'multiple choice': {
            await cms.instruction(
                `school admin see ${numberImage} loading image on MCQ answers data`,
                async function () {
                    await schoolAdminSeeLoadingImageOnQuizAnswerFields(
                        page,
                        quizTypeTitle,
                        quizFieldsData,
                        numberImage,
                        quizAnswerMultipleChoiceRoot
                    );
                }
            );
            break;
        }

        case 'multiple answer': {
            await cms.instruction(
                `school admin see ${numberImage} loading image on MAQ answers data`,
                async function () {
                    await schoolAdminSeeLoadingImageOnQuizAnswerFields(
                        page,
                        quizTypeTitle,
                        quizFieldsData,
                        numberImage,
                        quizAnswerMultipleAnswerRoot
                    );
                }
            );
            break;
        }

        default:
            break;
    }
}

export async function schoolAdminSeeLoadingImageOnQuizEditorField(
    cms: CMSInterface,
    numberImage = 1,
    selector: string
): Promise<void> {
    const page = cms.page!;
    const questionEditor = page.locator(selector).locator(textBox);

    const images = await questionEditor.locator(editorLoadingImage).elementHandles();

    weExpect(images).toHaveLength(numberImage);
}

export async function schoolAdminSeeLoadingImageOnQuizAnswerFields(
    page: Page,
    quizTypeTitle: QuizTypeTitle,
    quizFieldsData: QuizFieldsData,
    numberImage = 1,
    selector: string
) {
    const answerEditors = page!.locator(selector).locator(textBox);
    const count = await answerEditors.count();
    for (let i = 0; i < count; i++) {
        const testAnswer = answerEditors.nth(i);
        if (quizFieldsData[quizTypeTitle].answer) {
            const images = await testAnswer.locator(editorLoadingImage).elementHandles();
            weExpect(images).toHaveLength(numberImage);
        }
    }
}

export async function schoolAdminHasPasteScreenshotToLOQuestionWhenEdit(
    cms: CMSInterface,
    quizTypeTitle: QuizTypeTitle,
    quizFieldsDataTable: DataTable,
    scenario: ScenarioContext
): Promise<void> {
    const page = cms.page!;
    const quizFieldsData = parseQuizFieldsDataTable(quizFieldsDataTable);
    const isQuestionGroupEnabled = await checkIsQuestionGroupEnabled();

    await cms.instruction(`school admin choose to edit quiz`, async function () {
        let questionName = null;
        await cms.waitForSkeletonLoading();
        await cms.waitingForLoadingIcon();

        if (!isQuestionGroupEnabled) {
            const tableRow = await page.locator(tableBaseRow).elementHandles();
            const quizDescription = await tableRow[0].waitForSelector(questionRow);
            questionName = await quizDescription.textContent();
        } else {
            const questionDescription = await page.waitForSelector(questionSingleDescription);
            questionName = await questionDescription.textContent();
        }

        scenario.set(aliasQuizQuestionPasteImageName, questionName);

        const selector = isQuestionGroupEnabled
            ? questionListItemByText(questionName!)
            : tableRowByText(questionListTable, questionName!);

        await cms.selectActionButton(ActionOptions.EDIT, {
            target: 'actionPanelTrigger',
            wrapperSelector: selector,
        });

        await waitForLoading(cms);

        await schoolAdminChooseToCreateQuizWithTypeV2(cms, quizTypeTitle);
    });

    await schoolAdminPasteImageToQuiz(cms, quizTypeTitle, quizFieldsData);

    await page.waitForSelector(editorLoadingImage, { state: 'detached' });

    scenario.set(aliasQuizQuestionDataTable, quizFieldsData);
}

export const schoolAdminPaste2ndImageToQuizAndSave = async (
    cms: CMSInterface,
    quizTypeTitle: QuizTypeTitle,
    scenario: ScenarioContext
) => {
    const page = cms.page!;
    const quizFieldsData = scenario.get<QuizFieldsData>(aliasQuizQuestionDataTable);
    await schoolAdminPasteImageToQuiz(cms, quizTypeTitle, quizFieldsData);
    await page.waitForSelector(editorLoadingImage, { state: 'detached' });

    await cms.selectAButtonByAriaLabel(`Save`);
    await waitForLoading(cms);
};
