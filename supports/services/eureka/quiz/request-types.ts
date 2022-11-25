import { Quiz } from '@supports/services/common/quiz';

import { QuizType } from 'manabuf/common/v1/contents_pb';

declare namespace NsQuizModifierServiceRequest {
    interface UpsertQuizV2 {
        quizes: Quiz[];
        kind: QuizType;
    }

    interface UpsertSingleQuiz {
        quiz: Quiz;
    }
}

export default NsQuizModifierServiceRequest;
