import { UPSERT_QUIZ_V2_ENDPOINT } from '@legacy-step-definitions/endpoints/eureka';

import { CMSInterface } from '@supports/app-types';
import { sampleImageFilePath, sampleImage12MBFilePath } from '@supports/constants';

import { getTestId } from './cms-selectors/cms-keys';
import {
    formHelperText,
    imagePreviewDefault,
    imagePreviewImage,
    tableBaseRow,
    paperBulkActionsDelete,
} from './cms-selectors/cms-keys';
import {
    flashcardFormBulkAction,
    flashcardTableTermAudio,
    flashcardTableDefinitionAudio,
} from './cms-selectors/flashcard';
import { schoolAdminDelayBeforeDisplayNextSnackbar } from './syllabus-migration-temp';
import { CardFlashcard } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

export const schoolAdminGetAllCardFormFlashcard = async (cms: CMSInterface) => {
    const forms = await cms.page!.$$(flashcardFormBulkAction);
    return forms;
};

export const schoolAdminOpenDialogUpsertCardInFlashcard = async (cms: CMSInterface) => {
    await cms.selectAButtonByAriaLabel('Add/Edit');
};

export const schoolAdminGetCardFlashcardByIndex = async (cms: CMSInterface, index: number) => {
    const elements = await schoolAdminGetAllCardFormFlashcard(cms);
    const element = elements[index];

    return element;
};

export const schoolAdminDeleteCardFlashcardByIndex = async (cms: CMSInterface, index: number) => {
    const element = await schoolAdminGetCardFlashcardByIndex(cms, index);

    const deleteBtn = await element?.waitForSelector(paperBulkActionsDelete);

    await deleteBtn?.click();

    await cms.selectAButtonByAriaLabel('Confirm');
};

export const schoolAdminFillCardFlashcardForm = async (
    cms: CMSInterface,
    index: number,
    data: CardFlashcard
) => {
    const { term, definition, image, language } = data;

    const termElement = await cms.page?.waitForSelector(`[name="flashcards.${index}.term"]`);
    const definitionElement = await cms.page?.waitForSelector(
        `[name="flashcards.${index}.definition"]`
    );

    if (image) await schoolAdminUploadCardImageFlashcard(cms, index);

    if (term) await termElement?.fill(term);

    if (definition) await definitionElement?.fill(definition);

    if (language) await schoolAdminChangeLanguageCardFlashcard(cms, index, language);
};

export const schoolAdminSaveCardFlashcard = async (cms: CMSInterface) => {
    await cms.confirmDialogAction();
};

export const schoolAdminWaitingForSaveCardFlashcardSuccess = async (cms: CMSInterface) => {
    await cms.waitForGRPCResponse(UPSERT_QUIZ_V2_ENDPOINT);
    await cms.waitForSkeletonLoading();
};

export const schoolAdminChangeLanguageCardFlashcard = async (
    cms: CMSInterface,
    index: number,
    language: number
) => {
    // TODO: update CMS selector
    const selectTermLanguage = await cms.page?.waitForSelector(
        `${getTestId('SelectHF__select')}:near([name="flashcards.${index}.termLanguage"])`
    );
    await selectTermLanguage?.click();

    await cms.page?.click(`[data-value="${language}"]`);

    const selectDefinitionLanguage = await cms.page?.waitForSelector(
        `${getTestId('SelectHF__select')}:near([name="flashcards.${index}.definition"])`
    );

    await selectDefinitionLanguage?.click();
    await cms.page?.click(`[data-value="${language}"]`);
};

export const schoolAdminUploadCardImageFlashcard = async (
    cms: CMSInterface,
    index: number,
    validSize = true
) => {
    const form = await schoolAdminGetCardFlashcardByIndex(cms, index);
    const input = await form.waitForSelector('input[type="file"]', { state: 'attached' });

    await input.setInputFiles(validSize ? sampleImageFilePath : sampleImage12MBFilePath);

    if (validSize) await cms.waitingForLoadingIcon();
};

export const schoolAdminSeesErrorForField = async (
    cms: CMSInterface,
    _missingField: string,
    totalError: number
) => {
    await cms.page?.waitForSelector(formHelperText);
    // TODO: add selector to check with the _missingField
    const errors = await cms.page?.$$(formHelperText);

    weExpect(errors?.length, `Should see ${totalError} form msg error`).toEqual(totalError);
};

export const schoolAdminDeleteCardsInFlashcard = async (cms: CMSInterface, total: number) => {
    for (let i = total; i > 0; i--) {
        await schoolAdminDeleteCardFlashcardByIndex(cms, i);
        await schoolAdminDelayBeforeDisplayNextSnackbar();
    }
};

export const schoolAdminCheckAudioCardInFlashcard = async (
    cms: CMSInterface,
    shouldVisible: boolean,
    index: number
) => {
    const rowSelector = `${tableBaseRow}:nth-child(${index + 1})`;

    await cms.page?.waitForSelector(`${rowSelector} ${flashcardTableTermAudio}`, {
        state: shouldVisible ? 'visible' : 'detached',
    });

    await cms.page?.waitForSelector(`${rowSelector} ${flashcardTableDefinitionAudio}`, {
        state: shouldVisible ? 'visible' : 'detached',
    });
};

export const schoolAdminSeeImageOfCardInFlashcard = async (cms: CMSInterface, index: number) => {
    const rowSelector = `${tableBaseRow}:nth-child(${index + 1})`;

    await cms.page?.waitForSelector(`${rowSelector} ${imagePreviewImage} > img`);
};

// TODO: I will refactor it later
export const schoolAdminSeeTermOfCardInFlashcard = async (
    cms: CMSInterface,
    content: string,
    index: number
) => {
    const rowSelector = `${tableBaseRow}:nth-child(${index + 1})`;
    await cms.waitForSelectorHasText(rowSelector, content);
};
// TODO: I will refactor it later
export const schoolAdminSeeDefinitionOfCardInFlashcard = async (
    cms: CMSInterface,
    content: string,
    index: number
) => {
    const rowSelector = `${tableBaseRow}:nth-child(${index + 1})`;
    await cms.waitForSelectorHasText(rowSelector, content);
};

export const schoolAdminSeeDefaultImageOfCardInFlashcard = async (
    cms: CMSInterface,
    index: number
) => {
    const rowSelector = `${tableBaseRow}:nth-child(${index + 1})`;
    await cms.page?.waitForSelector(`${rowSelector} ${imagePreviewDefault}`);
};
