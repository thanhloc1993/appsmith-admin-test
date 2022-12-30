import {
    questionGroupListHeader,
    questionListItemByText,
} from '@legacy-step-definitions/cms-selectors/syllabus';
import { upsertMedia } from '@legacy-step-definitions/endpoints/live-lesson';
import { asyncForEach } from '@syllabus-utils/common';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { ElementHandle, Page, Route } from 'playwright';

import { CMSInterface, LearnerInterface, LOType, TeacherInterface } from '@supports/app-types';
import { gRPCEndpoint } from '@supports/services/grpc/constants';
import { ActionOptions, QuizTypeTitle } from '@supports/types/cms-types';

import { QuizDescription } from './cms-models/quiz';
import {
    confirmDialogButton,
    draftEditor,
    formDialogContent,
    quizAnswerEditorInputNth,
    quizAnswerListItem,
    quizExplanationHelperText,
    quizFIBAnswerHFInputV2,
    quizPreviewAnswerContent,
    quizPreviewExplanationContent,
    quizQuestionHelperText,
    quizSubmitBtn,
    quizTypeSelectDataValueInput,
    quizTypeSelectHFRoot,
    saveButtonInDialog,
    tableRowByText,
} from './cms-selectors/cms-keys';
import {
    getOCRTypeSelector,
    quizMaterialUploadInput,
    quizOCRFieldOptions,
    quizOCRFieldSelectContainer,
    quizOCRTypeOptionsContainer,
    quizTableRoot,
} from './cms-selectors/syllabus';
import { schoolAdminClickAddQuestionOrQuestionGroupActionPanel } from './question-group.definition';
import {
    studentSeesAndDoesFIBQuestion,
    studentSeesAndDoesFIBQuestionCorrectly,
    studentSeesAndDoesMAQQuestion,
    studentSeesAndDoesMAQQuestionCorrect,
    studentSeesAndDoesMCQQuestion,
    studentSeesAndDoesMCQQuestionCorrect,
} from './syllabus-create-question-definitions';
import { getQuizTypeValue, waitForLoadingAbsent } from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';
import { QuizItemAttributeConfig, QuizType } from 'manabuf/common/v1/contents_pb';
import { cmsExamDetail } from 'test-suites/squads/syllabus/cms-locators/exam-detail';
import { checkIsQuestionGroupEnabled } from 'test-suites/squads/syllabus/step-definitions/syllabus-migration-temp';
import { randomInteger } from 'test-suites/squads/syllabus/utils/common';

export type HandwritingSettingCase = 'multiple' | 'disabled' | 'shuffle' | 'multiple with math';

export type HandwritingOptionValue = 'Off' | 'Japanese' | 'English' | 'Math';

export type HandwritingOptionKey =
    | QuizItemAttributeConfig.FLASHCARD_LANGUAGE_CONFIG_NONE
    | QuizItemAttributeConfig.LANGUAGE_CONFIG_JP
    | QuizItemAttributeConfig.LANGUAGE_CONFIG_ENG
    | QuizItemAttributeConfig.MATH_CONFIG;

export interface HandwritingOption {
    key: HandwritingOptionKey;
    value: HandwritingOptionValue;
}

export interface QuizAttribute {
    audioLink?: string;
    imgLink?: string;
    configs: QuizItemAttributeConfig[];
}

export interface AnswerFIBConfig {
    addingQuantity: number;
    selectedHandwritingOptions: HandwritingOption[];
}

export const defaultHandwritingOptions: HandwritingOption[] = [
    { key: QuizItemAttributeConfig.FLASHCARD_LANGUAGE_CONFIG_NONE, value: 'Off' },
    { key: QuizItemAttributeConfig.LANGUAGE_CONFIG_JP, value: 'Japanese' },
    { key: QuizItemAttributeConfig.LANGUAGE_CONFIG_ENG, value: 'English' },
];

export type QuizOCROption = 'Text' | 'Image' | 'Latex';

// TODO: Rename the function to use for both LO and Exam LO
export const schoolAdminWaitingQuizTableInTheLODetail = async (cms: CMSInterface) => {
    const isQuestionGroupEnabled = await checkIsQuestionGroupEnabled();
    const questionGroupListSelector = isQuestionGroupEnabled
        ? questionGroupListHeader
        : quizTableRoot;

    await cms.page?.waitForSelector(questionGroupListSelector);

    await cms.waitForSkeletonLoading();

    // Wait loading the question description
    await cms.waitingForLoadingIcon();
};

export const schoolAdminWaitingLODetailPage = async (cms: CMSInterface) => {
    // Wait loading the LO detail page
    await cms.waitingForLoadingIcon();
    // Wait loading breadcrumb
    await cms.waitForSkeletonLoading();

    await schoolAdminWaitingQuizTableInTheLODetail(cms);
};

export const schoolAdminWaitingUpsertQuestionDialog = async (cms: CMSInterface) => {
    const cmsPage = cms.page!;

    // Wait for loading when firstly going to the dialog
    await cms.waitingForLoadingIcon();
    // Wait for the first draft editor in upsert question dialog
    await cmsPage.waitForSelector(draftEditor);
    // Wait for loading of other draft editors
    await cms.waitingForLoadingIcon();
};

export const schoolAdminChooseAddQuestionButtonByLOType = async (
    cms: CMSInterface,
    loType: LOType
) => {
    const cmsPage = cms.page!;

    const isGroupOfQuestionEnabled = await checkIsQuestionGroupEnabled();

    if (isGroupOfQuestionEnabled) {
        await schoolAdminClickAddQuestionOrQuestionGroupActionPanel(cms, 'createQuestion');
    } else {
        if (loType === 'exam LO') {
            await cmsExamDetail.clickAddQuestion(cmsPage);

            return;
        }

        await cms.selectAButtonByAriaLabel(`Create`);
    }
};

export const schoolAdminSelectCreateQuiz = async (cms: CMSInterface) => {
    await schoolAdminWaitingQuizTableInTheLODetail(cms);

    await schoolAdminClickCreateQuestion(cms);

    await cms.waitingForLoadingIcon();
    await cms.waitingForProgressBar();
};

export const schoolAdminGoesToEditQuestionPage = async (
    cms: CMSInterface,
    questionContent: string
) => {
    const isQuestionGroupEnabled = await checkIsQuestionGroupEnabled();
    const wrapperSelector = isQuestionGroupEnabled
        ? questionListItemByText(questionContent)
        : tableRowByText(quizTableRoot, questionContent);

    await cms.selectActionButton(ActionOptions.EDIT, {
        target: 'actionPanelTrigger',
        wrapperSelector,
    });

    await schoolAdminWaitingUpsertQuestionDialog(cms);
};

export const schoolAdminChooseToCreateQuizWithType = async (
    cms: CMSInterface,
    quizTypeTitle: QuizTypeTitle
) => {
    await cms.instruction(
        `school admin choose ${quizTypeTitle} from dropdown list`,
        async function () {
            await cms.selectElementByDataTestId(`BaseSelect`);

            await selectQuizType(cms, quizTypeTitle);
        }
    );
};

export const schoolAdminChooseToCreateQuizWithTypeV2 = async (
    cms: CMSInterface,
    quizTypeTitle: QuizTypeTitle
) => {
    const cmsPage = cms.page!;

    await cmsPage.click(quizTypeSelectHFRoot);

    await selectQuizTypeOptionByDataValue(cms, quizTypeTitle);
};

export const schoolAdminCannotSubmitQuestion = async (cms: CMSInterface) => {
    const submitElement = await cms.page?.waitForSelector(quizSubmitBtn);

    const isDisabled = await submitElement?.isDisabled();

    weExpect(isDisabled, 'The submit question button should be disabled').toEqual(true);
};

export const schoolAdminSeeManualQuestionError = async (
    cms: CMSInterface,
    missingField: string
) => {
    const missingFieldTestId: Record<string, string> = {
        question: quizQuestionHelperText,
        explanation: quizExplanationHelperText,
    };

    const fieldTestId = missingFieldTestId[missingField];

    const errorText = await cms.page!.waitForSelector(fieldTestId);
    await schoolAdminSeesQuizAnswersValidation(errorText, 'This field is required');
};

export const schoolAdminSubmitQuestion = async (cms: CMSInterface) => {
    await cms.selectAButtonByAriaLabel(`Save`);

    await cms.waitingForLoadingIcon();
};

export const selectQuizType = async (cms: CMSInterface, quizTypeTitle: QuizTypeTitle) => {
    const page = cms.page!;

    const { quizTypeNumber } = getQuizTypeValue({ quizTypeTitle });

    await page.click(`[data-value="${quizTypeNumber}"]`);

    try {
        await page.waitForSelector(formDialogContent, {
            timeout: 500,
        });
        const confirmBtn = await page.locator(confirmDialogButton).elementHandles();
        if (confirmBtn.length > 0) {
            await cms.selectElementByDataTestId(confirmDialogButton);
        }
    } catch (e) {
        console.log('Not change question type');
    }
};

export const selectQuizTypeOptionByDataValue = async (
    cms: CMSInterface,
    quizTypeTitle: QuizTypeTitle
) => {
    const cmsPage = cms.page!;
    const { quizTypeNumber } = getQuizTypeValue({ quizTypeTitle });

    const quizTypeInput = await cmsPage.waitForSelector(quizTypeSelectDataValueInput);
    const currentDataValue = await quizTypeInput.inputValue();

    await cms.selectElementByDataValue(quizTypeNumber.toString());

    if (parseInt(currentDataValue) !== quizTypeNumber) {
        await cmsPage.click(saveButtonInDialog);
    }
};

export const delayUpsertMediaEndpoint = async (page: Page, ms = 10000) => {
    await page.route(`${gRPCEndpoint}/${upsertMedia}`, async (route) => {
        const routeDelay = async (route: Route, ms: number) => {
            await page.waitForTimeout(ms);
            await route.continue();
        };
        await routeDelay(route, ms);
    });
};

export const schoolAdminFocusOnAnswerInput = async (cms: CMSInterface, selector: string) => {
    const cmsPage = cms.page!;

    const answerElement = await cmsPage.waitForSelector(selector);

    await answerElement.focus();
};

export const getHandwritingOption = ({
    key,
    value,
}: {
    key?: HandwritingOptionKey | QuizItemAttributeConfig;
    value?: HandwritingOptionValue;
}): HandwritingOption => {
    switch (key || value) {
        case 'Japanese':
        case QuizItemAttributeConfig.LANGUAGE_CONFIG_JP:
            return {
                key: QuizItemAttributeConfig.LANGUAGE_CONFIG_JP,
                value: 'Japanese',
            };
        case 'English':
        case QuizItemAttributeConfig.LANGUAGE_CONFIG_ENG:
            return {
                key: QuizItemAttributeConfig.LANGUAGE_CONFIG_ENG,
                value: 'English',
            };
        case 'Math':
        case QuizItemAttributeConfig.MATH_CONFIG:
            return {
                key: QuizItemAttributeConfig.MATH_CONFIG,
                value: 'Math',
            };
        default:
            return {
                key: QuizItemAttributeConfig.FLASHCARD_LANGUAGE_CONFIG_NONE,
                value: 'Off',
            };
    }
};

export const schoolAdminFillsAllAnswersByQuestionType = async (
    cms: CMSInterface,
    questionType: QuizTypeTitle
) => {
    const cmsPage = cms.page!;
    let answerContentList: string[] = [];

    if (questionType === 'manual input') {
        return answerContentList;
    }

    const answerSelector = `${quizAnswerListItem} ${
        questionType === 'fill in the blank' ? quizFIBAnswerHFInputV2 : draftEditor
    }`;

    const answerList = await cmsPage.waitForSelector(quizAnswerListItem);

    await answerList.scrollIntoViewIfNeeded();
    const answerEditors = await cmsPage.$$(answerSelector);

    if (!answerEditors) {
        await cms.waitingForLoadingIcon();
    }

    await asyncForEach(answerEditors, async (editor, index) => {
        const content = `Answer ${index + 1}`;

        await editor.scrollIntoViewIfNeeded();
        await editor.fill(content);

        answerContentList = [...answerContentList, content];
    });

    return answerContentList;
};

export const schoolAdminSeesQuizAnswersValidation = async (
    selector: ElementHandle<SVGElement | HTMLElement>,
    message: string
) => {
    const errContent = await selector.textContent();
    weExpect(errContent).toEqual(message);
};

export const schoolAdminFillAnswerQuestion = async (
    cms: CMSInterface,
    index: number,
    content: string
) => {
    await cms.page?.fill(quizAnswerEditorInputNth(index), content);
};

export async function studentDoesQuestionCorrect(
    learner: LearnerInterface,
    question: { name: string; type: QuizType }
) {
    const { name, type } = question;

    switch (type) {
        case QuizType.QUIZ_TYPE_FIB:
            await studentSeesAndDoesFIBQuestionCorrectly(learner, name);
            break;
        case QuizType.QUIZ_TYPE_MAQ:
            await studentSeesAndDoesMAQQuestionCorrect(learner, name);
            break;
        default:
            await studentSeesAndDoesMCQQuestionCorrect(learner, name);
            break;
    }
}

export async function studentDoesQuestionIncorrect(
    learner: LearnerInterface,
    question: { name: string; type: QuizType }
) {
    const { name, type } = question;

    switch (type) {
        case QuizType.QUIZ_TYPE_FIB:
            await studentSeesAndDoesFIBQuestion(learner, name);
            break;
        case QuizType.QUIZ_TYPE_MAQ:
            await studentSeesAndDoesMAQQuestion(learner, name);
            break;
        default:
            await studentSeesAndDoesMCQQuestion(learner, name);
            break;
    }
}

export async function studentSeeQuizProgress(learner: LearnerInterface, questionQuantity: number) {
    const driver = learner.flutterDriver!;

    await driver.waitFor(new ByValueKey(SyllabusLearnerKeys.showQuizProgress(questionQuantity)));
}

export async function teacherChoosesQuizResultAtIndex(
    teacher: TeacherInterface,
    index: number,
    result: string
) {
    const driver = teacher.flutterDriver!;
    const quizHistoryDropdownFinder = new ByValueKey(SyllabusTeacherKeys.quizHistoryDropdown);
    const quizSetResultFinder = new ByValueKey(SyllabusTeacherKeys.quizSetResult(index, result));

    await driver.tap(quizHistoryDropdownFinder);
    await driver.tap(quizSetResultFinder);

    await waitForLoadingAbsent(driver);
}

export const genRandomQuestionDifficultLevel = () => {
    const minDifficultLevel = 1;
    const maxDifficultLevel = 5;

    return randomInteger(minDifficultLevel, maxDifficultLevel);
};

export const schoolAdminSeesErrMsgWhenNoCorrectAnswerInQuestion = async (cms: CMSInterface) => {
    await cms.assertNotification('Must have at least 1 answer marked as CORRECT');
};

export const schoolAdminSeesDescriptionQuestionErr = async (cms: CMSInterface) => {
    await cms.page!.waitForSelector(quizQuestionHelperText);
};

export const schoolAdminSeesExplanationQuestionErr = async (cms: CMSInterface) => {
    await cms.page!.waitForSelector(quizExplanationHelperText);
};

export const schoolAdminSeesExplanationOnQuestionPreview = async (
    cms: CMSInterface,
    explanation: string
) => {
    await cms.waitForSelectorHasText(quizPreviewExplanationContent, explanation);
};

export const getQuestionTypeNumberFromQuizDescriptions = (
    questionName: string,
    quizDescriptions: QuizDescription[]
): QuizType | null => {
    const quizTypeTitle = quizDescriptions.find((e) => e.content == questionName)?.type;
    if (quizTypeTitle) {
        const { quizTypeNumber } = getQuizTypeValue({ quizTypeTitle });
        return quizTypeNumber;
    }
    return null;
};

export const schoolAdminUploadsQuizMaterial = async (cms: CMSInterface) => {
    const filePath = `./assets/syllabus-quiz-material-sample.pdf`;
    const fileName = filePath.split('/').pop()!;

    await cms.page!.setInputFiles(quizMaterialUploadInput, filePath);
    await cms.page!.waitForSelector('div.react-pdf__Page');

    return fileName;
};

export const schoolAdminScansOCR = async (
    cms: CMSInterface,
    ocrOption: QuizOCROption,
    fieldToSelect?: string
) => {
    const page = cms.page!;
    const mouse = page.mouse;
    const pdfCanvas = await page.waitForSelector('canvas.react-pdf__Page__canvas');

    await page.waitForTimeout(1000); // make sure canvas is fully loaded

    const pdfBox = await pdfCanvas.boundingBox();

    if (!pdfBox) throw Error('Cannot get quiz material bounding box');

    const startPoint = {
        x: pdfBox.x + 65,
        y: pdfBox.y + 150,
    };
    const endPoint = {
        x: startPoint.x + 80,
        y: startPoint.y + 45,
    };

    await mouse.move(startPoint.x, startPoint.y);
    await mouse.down();
    await mouse.move(endPoint.x, endPoint.y);
    await mouse.up();

    await page.waitForSelector(quizOCRTypeOptionsContainer);

    const ocrTypeSelectScreenshot = await page.screenshot({
        fullPage: true,
    });
    await cms.attachScreenshot(ocrTypeSelectScreenshot);

    const ocrTypeSelector = getOCRTypeSelector(ocrOption);

    const ocrOptionButton = await page.$(ocrTypeSelector);

    if (!ocrOptionButton) throw Error(`Cannot get OCR type ${ocrOption} button`);

    await ocrOptionButton.click();

    await page.waitForSelector(quizOCRFieldSelectContainer);

    const availableFieldsInText = await page.$$eval(
        quizOCRFieldOptions,
        (fields) => fields.map((field) => field.textContent).filter(Boolean) as string[]
    );

    const ocrFieldsSelectScreenshot = await page.screenshot({
        fullPage: true,
    });

    await cms.attachScreenshot(ocrFieldsSelectScreenshot);

    if (fieldToSelect) {
        const selectedField = await cms.waitForSelectorWithText(quizOCRFieldOptions, fieldToSelect);

        if (!selectedField) throw Error(`Cannot find field ${selectedField} to select`);

        await selectedField.click();

        await page.waitForLoadState('networkidle');
    }

    return availableFieldsInText;
};

export const schoolAdminClickCreateQuestion = async (
    cms: CMSInterface,
    actionType: 'createQuestion' | 'createQuestionGroup' = 'createQuestion'
) => {
    const isGroupOfQuestionEnabled = await checkIsQuestionGroupEnabled();

    if (!isGroupOfQuestionEnabled) {
        await cms.selectAButtonByAriaLabel(`Create`);
    } else {
        await schoolAdminClickAddQuestionOrQuestionGroupActionPanel(cms, actionType);
    }
};

export const schoolAdminAssertCorrectAnswerOrderInPreview = async (
    cms: CMSInterface,
    answersList: string[]
) => {
    const allAnswers = await cms.page!.$$(quizPreviewAnswerContent);
    weExpect(allAnswers).toHaveLength(answersList.length);

    await asyncForEach(allAnswers, async (answer, index) => {
        const answerText = await answer.textContent();

        weExpect(answerText).toEqual(answersList[index]);
    });
};

export const studentWaitingQuizScreenByLMType = async (
    learner: LearnerInterface,
    studyPlanItem: { type: LOType; name: string }
) => {
    const driver = learner.flutterDriver!;
    const { type, name } = studyPlanItem;

    await waitForLoadingAbsent(driver);

    const keyQuizScreenByLMType =
        type === 'exam LO'
            ? SyllabusLearnerKeys.exam_lo_quiz_screen(name)
            : SyllabusLearnerKeys.quiz_screen(name);

    await driver.waitFor(new ByValueKey(keyQuizScreenByLMType));
};

export const studentWaitingQuestionScreenByQuestionNumber = async (
    learner: LearnerInterface,
    questionNumber: number
) => {
    const driver = learner.flutterDriver!;

    await driver.waitFor(new ByValueKey(SyllabusLearnerKeys.quiz));

    await driver.waitFor(new ByValueKey(SyllabusLearnerKeys.currentQuizNumber(questionNumber)));
};
