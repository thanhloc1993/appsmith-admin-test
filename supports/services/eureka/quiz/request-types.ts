import { Quiz } from '@supports/services/common/quiz';

import { QuizType } from 'manabuf/common/v1/contents_pb';
import { UpsertFlashcardContentRequest } from 'manabuf/syllabus/v1/quiz_service_pb';

declare namespace NsQuizModifierServiceRequest {
    interface UpsertQuizV2 {
        quizes: Quiz[];
        kind: QuizType;
    }

    interface UpsertSingleQuiz {
        quiz: Quiz;
    }

    interface UpsertFlashcardContent
        extends Omit<UpsertFlashcardContentRequest.AsObject, 'quizzesList'> {
        quizzes: Quiz[];
    }
}

export default NsQuizModifierServiceRequest;
