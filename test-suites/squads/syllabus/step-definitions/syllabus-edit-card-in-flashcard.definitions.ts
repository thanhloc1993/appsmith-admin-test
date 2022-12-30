import { asyncForEach, createNumberArrayWithLength } from '@legacy-step-definitions/utils';

import { CMSInterface } from '@supports/app-types';

import { imagePreviewDelete } from './cms-selectors/cms-keys';
import {
    schoolAdminFillCardFlashcardForm,
    schoolAdminGetCardFlashcardByIndex,
    schoolAdminOpenDialogUpsertCardInFlashcard,
    schoolAdminSaveCardFlashcard,
    schoolAdminWaitingForSaveCardFlashcardSuccess,
} from './syllabus-create-card-in-flashcard-definition';
import { CardFlashcard } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

export const schoolAdminClickAddMoreCardInFlashcard = async (
    cms: CMSInterface,
    totalClick: number
) => {
    const list = createNumberArrayWithLength(totalClick);

    await asyncForEach<number, void>(list, async () => {
        await cms.selectAButtonByAriaLabel('Add More');
    });
};

export const schoolAdminCheckAndPrepareImage = async (cms: CMSInterface, formIndex: number) => {
    const cardFormElement = await schoolAdminGetCardFlashcardByIndex(cms, formIndex);

    const isExistedImage = await cardFormElement.$(imagePreviewDelete);

    if (!isExistedImage) {
        const formData: CardFlashcard = {
            term: '',
            definition: '',
            image: true,
        };
        await cms.instruction('Upload image to mutation', async () => {
            await schoolAdminFillCardFlashcardForm(cms, formIndex, formData);
        });

        await cardFormElement.waitForSelector(imagePreviewDelete);

        await cms.instruction('Saving data', async () => {
            await schoolAdminSaveCardFlashcard(cms);
            await schoolAdminWaitingForSaveCardFlashcardSuccess(cms);
            await cms.waitForHasuraResponse('QuizzesManyByLearningObjectId');
        });

        await cms.instruction('Open again upsert dialog', async () => {
            await schoolAdminOpenDialogUpsertCardInFlashcard(cms);
        });
    }
};

export const schoolAdminDeleteCardImageInFlashcard = async (
    cms: CMSInterface,
    formIndex: number
) => {
    const formCard = await schoolAdminGetCardFlashcardByIndex(cms, formIndex);
    const deleteElement = await formCard.waitForSelector(imagePreviewDelete);
    await deleteElement?.click();
};
