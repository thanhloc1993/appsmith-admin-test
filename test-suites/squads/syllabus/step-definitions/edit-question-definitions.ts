import { genId, getRandomElement } from '@legacy-step-definitions/utils';
import { asyncForEach } from '@legacy-step-definitions/utils';

import { CMSInterface } from '@supports/app-types';

import {
    fillInTheBlankInput,
    quizAnswerConfigCheckbox,
    quizAnswerEditorInput,
    quizAnswerListItem,
    quizExplanationBoxInput,
    quizQuestionEditorInput,
    quizSelectedTypeMenuOption,
    quizTypeSelect,
} from './cms-selectors/cms-keys';
import {
    schoolAdminFillQuizExplanationData,
    schoolAdminFillQuizQuestionData,
    schoolAdminFillsQuizAnswers,
} from './create-question-definitions';
import { selectQuizTypeOptionByDataValue } from './syllabus-question-utils';
import { getQuizTypeValue } from './syllabus-utils';
import { QuizEditInfoTitle, QuizTypeTitle, QuizUpdateInfoValue } from './types/cms-types';
import { canEditQuizInfo } from './utils/question-utils';

export async function schoolAdminGetAnswersData(cms: CMSInterface, quizTypeTitle: QuizTypeTitle) {
    let answers: string[];
    if (quizTypeTitle === 'fill in the blank') {
        answers = await cms.page!.$$eval<string[], HTMLInputElement>(
            fillInTheBlankInput,
            (editors) => editors.map((editor) => editor.value)
        );
    } else {
        answers = await cms.page!.$$eval<string[], HTMLDivElement>(
            quizAnswerEditorInput,
            (editors) => editors.map((editor) => editor.innerText)
        );
    }
    return answers;
}

export async function schoolAdminChangeQuestionType(cms: CMSInterface) {
    const allTypeOptions: QuizTypeTitle[] = [
        'fill in the blank',
        'manual input',
        'multiple answer',
        'multiple choice',
    ];
    await cms.selectElementByDataTestId(quizTypeSelect);
    const selectedMenuOption = await cms.page!.waitForSelector(quizSelectedTypeMenuOption);
    const selectedOptionValue = await selectedMenuOption.evaluate((li) => {
        const value = li.getAttribute('data-value');
        return value ? parseInt(value) : undefined;
    });
    weExpect(selectedOptionValue).not.toBe(undefined);
    const availableOptions = allTypeOptions.filter(
        (option) =>
            getQuizTypeValue({ quizTypeTitle: option }).quizTypeNumber !== selectedOptionValue
    );
    const updatedType = getRandomElement(availableOptions);
    await selectQuizTypeOptionByDataValue(cms, updatedType);
    await schoolAdminFillsQuizAnswers(cms, updatedType);

    return updatedType;
}

export async function schoolAdminEditsQuestionExplanation(cms: CMSInterface) {
    const explanationContent = `Explanation ${genId()}`;
    await schoolAdminFillQuizExplanationData(cms, explanationContent);
    return explanationContent;
}

export async function schoolAdminEditsQuestionDescription(cms: CMSInterface) {
    const descriptionContent = `Description ${genId()}`;
    await schoolAdminFillQuizQuestionData(cms, descriptionContent);
    return descriptionContent;
}

export async function schoolAdminEditsNumberOfAnswers(
    cms: CMSInterface,
    quizTypeTitle: QuizTypeTitle
) {
    await cms.selectElementByDataTestId('QuizAnswerList__btnAddAnswer');
    await schoolAdminFillsQuizAnswers(cms, quizTypeTitle);
    const updatedNumberOfAnswers = await cms.page!.$$eval(
        quizAnswerListItem,
        (items) => items.length
    );
    return updatedNumberOfAnswers;
}

export async function schoolAdminEditsAnswerConfig(cms: CMSInterface) {
    const checkboxes = await cms.page!.$$(quizAnswerConfigCheckbox);
    const updatedValues: boolean[] = [];
    await asyncForEach(checkboxes, async (checkbox) => {
        const isChecked = await checkbox.isChecked();
        await checkbox.setChecked(!isChecked);
        updatedValues.push(!isChecked);
    });

    return updatedValues;
}

export async function schoolAdminEditsQuestionInfo(
    cms: CMSInterface,
    info: QuizEditInfoTitle,
    quizTypeTitle: QuizTypeTitle
) {
    const updatedInfo = {} as Record<QuizEditInfoTitle, QuizUpdateInfoValue>;
    if (!canEditQuizInfo(quizTypeTitle, info)) {
        return updatedInfo;
    }
    switch (info) {
        case 'type': {
            updatedInfo[info] = await schoolAdminChangeQuestionType(cms);
            break;
        }
        case 'explanation': {
            updatedInfo[info] = await schoolAdminEditsQuestionExplanation(cms);
            break;
        }
        case 'description': {
            updatedInfo[info] = await schoolAdminEditsQuestionDescription(cms);
            break;
        }
        case 'number of answers': {
            updatedInfo[info] = await schoolAdminEditsNumberOfAnswers(cms, quizTypeTitle);
            updatedInfo['answers'] = await schoolAdminGetAnswersData(cms, quizTypeTitle);
            break;
        }
        case 'answers': {
            updatedInfo[info] = await schoolAdminFillsQuizAnswers(cms, quizTypeTitle);
            break;
        }
        case 'answer config': {
            updatedInfo[info] = await schoolAdminEditsAnswerConfig(cms);
            break;
        }
        default:
            break;
    }

    return updatedInfo;
}

export async function schoolAdminChecksUpdatedQuestionType(cms: CMSInterface) {
    await cms.selectElementByDataTestId(quizTypeSelect);
    const selectedMenuOption = await cms.page!.waitForSelector(quizSelectedTypeMenuOption);
    const currentValue = await selectedMenuOption.evaluate((li) => {
        const value = li.getAttribute('data-value');
        return value ? parseInt(value) : undefined;
    });

    return currentValue;
}

export async function schoolAdminChecksUpdatedQuestionExplanation(cms: CMSInterface) {
    const explanationBox = await cms.page!.waitForSelector(quizExplanationBoxInput);
    const explanationText = await explanationBox.innerText();

    return explanationText;
}

export async function schoolAdminChecksUpdatedQuestionDescription(cms: CMSInterface) {
    const descriptionBox = await cms.page!.waitForSelector(quizQuestionEditorInput);
    const descriptionText = await descriptionBox.innerText();
    return descriptionText;
}

export async function schoolAdminChecksUpdatedNumberOfAnswers(cms: CMSInterface) {
    await cms.page!.waitForSelector(quizAnswerListItem);
    const numberOfAnswers = await cms.page!.$$eval(quizAnswerListItem, (items) => items.length);
    return numberOfAnswers;
}

export async function schoolAdminChecksUpdatedAnswerConfig(cms: CMSInterface) {
    const checkboxValues = await cms.page!.$$eval<boolean[], HTMLInputElement>(
        quizAnswerConfigCheckbox,
        (checkboxes) => checkboxes.map((checkbox) => checkbox.checked)
    );

    return checkboxValues;
}

export async function schoolAdminCheckUpdatedInfo(
    cms: CMSInterface,
    quizTypeTitle: QuizTypeTitle,
    info: QuizEditInfoTitle,
    expectedValue: QuizUpdateInfoValue
) {
    let currentValue: QuizUpdateInfoValue = undefined;
    let updatedValue = expectedValue;

    switch (info) {
        case 'type': {
            // convert quiz type title to number for comparison
            updatedValue = getQuizTypeValue({
                quizTypeTitle: expectedValue as QuizTypeTitle,
            }).quizTypeNumber;
            currentValue = await schoolAdminChecksUpdatedQuestionType(cms);
            break;
        }
        case 'explanation': {
            currentValue = await schoolAdminChecksUpdatedQuestionExplanation(cms);
            break;
        }
        case 'description': {
            currentValue = await schoolAdminChecksUpdatedQuestionDescription(cms);
            break;
        }
        case 'number of answers': {
            currentValue = await schoolAdminChecksUpdatedNumberOfAnswers(cms);
            break;
        }
        case 'answers': {
            currentValue = await schoolAdminGetAnswersData(cms, quizTypeTitle);
            break;
        }
        case 'answer config': {
            currentValue = await schoolAdminChecksUpdatedAnswerConfig(cms);
            break;
        }
        default:
            break;
    }
    weExpect(currentValue).toEqual(updatedValue);
}
