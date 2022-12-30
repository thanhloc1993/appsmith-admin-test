import { constructQuizCoreV2 } from '@supports/services/common/quiz';

import NsQuizModifierServiceRequest from './request-types';
import { UpsertFlashcardContentRequest } from 'manabuf/syllabus/v1/quiz_service_pb';

export const createUpsertFlashcardContentRequest = (
    data: NsQuizModifierServiceRequest.UpsertFlashcardContent
) => {
    const { kind, quizzes, flashcardId } = data;

    const request = new UpsertFlashcardContentRequest();

    const quizzesList = quizzes.map((currentQuiz) => {
        return constructQuizCoreV2(currentQuiz);
    });

    request.setKind(kind);
    request.setFlashcardId(flashcardId);
    request.setQuizzesList(quizzesList);

    return request;
};
