import { ElementHandle } from 'playwright';

import { CMSInterface } from '@supports/app-types';

import * as CommunicationSelectors from './cms-selectors/communication';
import {
    AccordionStatus,
    ArrowType,
    QuestionnaireFormData,
} from './communication-common-questionnaire-definitions';
import {
    addAlphabetToArrayString,
    getAccordionQuestionContentWithPrefix,
} from './communication-utils';

export async function clickArrowIconInQuestionSectionDetail(
    cms: CMSInterface,
    arrowIconType: ArrowType,
    questionSectionIndex: number
) {
    await cms.instruction(
        `Click ${arrowIconType} in question section detail ${questionSectionIndex + 1}`,
        async function () {
            const accordionQuestionWrapper = await cms.page!.waitForSelector(
                CommunicationSelectors.getAccordionSummarySelectorByQuestionSectionIndex(
                    questionSectionIndex
                )
            );
            const arrowIcon = await accordionQuestionWrapper.$(
                CommunicationSelectors.getArrowIconSelectorByArrowIconType(arrowIconType)
            );
            if (!arrowIcon) {
                throw Error(
                    `Cannot find ${arrowIconType} in question section ${questionSectionIndex + 1}`
                );
            }

            await arrowIcon.click();
        }
    );
}

export async function checkArrowIconInQuestionSectionDetail(
    cms: CMSInterface,
    arrowIconType: ArrowType,
    questionSectionIndex: number
) {
    await cms.attach(
        `Check ${arrowIconType} in question section detail ${questionSectionIndex + 1}`
    );

    const accordionQuestionWrapper = await cms.page!.waitForSelector(
        CommunicationSelectors.getAccordionSummarySelectorByQuestionSectionIndex(
            questionSectionIndex
        )
    );
    const arrowIcon = await accordionQuestionWrapper.$(
        CommunicationSelectors.getArrowIconSelectorByArrowIconType(arrowIconType)
    );

    weExpect(arrowIcon).not.toBeNull();
}

export async function checkQuestionnaireDetailAnswers(
    cms: CMSInterface,
    accordionWrapper: ElementHandle | null,
    accordionStatus: AccordionStatus
) {
    const accordionQuestionContent = await accordionWrapper?.waitForSelector(
        CommunicationSelectors.accordionQuestionContent
    );
    const questionTextContent = await accordionQuestionContent?.textContent();

    await cms.attach(`Check questionnaire detail ${questionTextContent} answer ${accordionStatus}`);

    const state = accordionStatus === 'expand' ? 'visible' : 'hidden';

    await accordionWrapper?.waitForSelector(CommunicationSelectors.questionnaireDetailAnswers, {
        state,
    });
}

export async function checkDetailAnswerExpandStateInQuestionSectionDetail(
    cms: CMSInterface,
    accordionStatus: AccordionStatus,
    questionSectionIndex: number
) {
    const accordionQuestionWrapper = await cms.page!.waitForSelector(
        CommunicationSelectors.getAccordionSummarySelectorByQuestionSectionIndex(
            questionSectionIndex
        )
    );
    const accordionQuestionContent = await accordionQuestionWrapper.waitForSelector(
        CommunicationSelectors.accordionQuestionContent
    );
    const questionTextContent = await accordionQuestionContent.textContent();

    await cms.attach(
        `Check question detail ${questionTextContent} answer ${accordionStatus} in question section detail ${
            questionSectionIndex + 1
        }`
    );

    const accordionWrapper = await accordionQuestionWrapper.getProperty('parentNode');

    await checkQuestionnaireDetailAnswers(cms, accordionWrapper.asElement(), accordionStatus);
}

export async function checkAccordionQuestionContent(
    cms: CMSInterface,
    questionnaireFormData: QuestionnaireFormData,
    questionSectionIndex: number
) {
    await cms.attach(
        `Check accordion question content in question section ${questionSectionIndex + 1}`
    );

    const accordionQuestionWrapper = await cms.page!.waitForSelector(
        CommunicationSelectors.getAccordionSummarySelectorByQuestionSectionIndex(
            questionSectionIndex
        )
    );

    const accordionQuestionTitle = await accordionQuestionWrapper.waitForSelector(
        CommunicationSelectors.accordionQuestionTitle
    );

    const questionTextContent = await accordionQuestionTitle.textContent();

    const accordionQuestionContentWithPrefix = getAccordionQuestionContentWithPrefix(
        questionnaireFormData.questionContent,
        questionSectionIndex
    );

    await cms.attach(
        `Compare accordion question content ${questionTextContent} and ${accordionQuestionContentWithPrefix}`
    );

    //TODO: @communication Expect question text content with rate of respondents when implement automation test for Consolidated Statistic
    weExpect(questionTextContent).toEqual(accordionQuestionContentWithPrefix);
}

export async function checkAccordionAnswerContent(
    cms: CMSInterface,
    questionnaireFormData: QuestionnaireFormData,
    questionSectionIndex: number
) {
    await cms.attach(
        `Check accordion answer content in question section ${questionSectionIndex + 1}`
    );

    const accordionQuestionWrapper = await cms.page!.waitForSelector(
        CommunicationSelectors.getAccordionSummarySelectorByQuestionSectionIndex(
            questionSectionIndex
        )
    );

    // get parent node to query list answer in this question section
    const accordionWrapper = await accordionQuestionWrapper.getProperty('parentNode');
    const questionDetailAnswers = await accordionWrapper
        .asElement()
        ?.$$(CommunicationSelectors.accordionAnswerContent);

    if (!questionDetailAnswers || questionDetailAnswers.length === 0) {
        throw Error(`Cannot find answer item in question section ${questionSectionIndex + 1}`);
    }

    const answerContentsWithPrefix = addAlphabetToArrayString(questionnaireFormData.answerContents);

    for (const [answerItemIndex, answerItem] of questionDetailAnswers.entries()) {
        const answerItemContent = await answerItem.textContent();

        await cms.attach(
            `Compare accordion answer content ${answerItemContent} and ${answerContentsWithPrefix[answerItemIndex]}`
        );

        weExpect(answerItemContent).toEqual(answerContentsWithPrefix[answerItemIndex]);
    }
}
