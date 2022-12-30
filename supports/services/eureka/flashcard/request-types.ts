import { InsertLearningMaterialBase } from '@supports/services/common/learning-material';

import { FlashcardBase } from 'manabuf/syllabus/v1/flashcard_service_pb';

declare namespace NsFlashcardModifierServiceRequest {
    interface InsertFlashcard
        extends InsertLearningMaterialBase,
            Omit<FlashcardBase.AsObject, 'base' | 'totalQuestion'> {}
}

export default NsFlashcardModifierServiceRequest;
