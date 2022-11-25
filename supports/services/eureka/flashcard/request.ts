import { createLearningMaterialBaseForInsert } from '@supports/services/common/learning-material';

import NsFlashcardModifierServiceRequest from './request-types';
import { FlashcardBase, InsertFlashcardRequest } from 'manabuf/syllabus/v1/flashcard_service_pb';

export const createInsertFlashcardRequest = (
    payload: NsFlashcardModifierServiceRequest.InsertFlashcard
) => {
    const request = new InsertFlashcardRequest();

    const { name, topicId } = payload;

    const flashcard = new FlashcardBase();

    flashcard.setBase(
        createLearningMaterialBaseForInsert({
            name,
            topicId,
        })
    );

    request.setFlashcard(flashcard);

    return request;
};
