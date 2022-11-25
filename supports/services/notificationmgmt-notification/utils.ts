import { Question, Questionnaire } from 'manabuf/common/v1/notifications_pb';
import { Timestamp } from 'manabuf/google/protobuf/timestamp_pb';

export function questionnaireToGrpcObject(questionnaire: Questionnaire.AsObject): Questionnaire {
    const result = new Questionnaire();
    result.setQuestionnaireId(questionnaire.questionnaireId);
    result.setResubmitAllowed(questionnaire.resubmitAllowed);
    const questions: Question[] = [];
    for (const question of questionnaire.questionsList) {
        questions.push(questionToGrpcObject(question));
    }
    result.setQuestionsList(questions);

    const expirationDateTimeStamp = questionnaire.expirationDate as Timestamp.AsObject;
    const timestamp = new Timestamp();
    timestamp.setSeconds(expirationDateTimeStamp.seconds);
    timestamp.setNanos(expirationDateTimeStamp.nanos);
    result.setExpirationDate(timestamp);

    return result;
}

export function questionToGrpcObject(question: Question.AsObject): Question {
    const result = new Question();
    result.setOrderIndex(question.orderIndex);
    result.setChoicesList(question.choicesList);
    result.setQuestionnaireQuestionId(question.questionnaireQuestionId);
    result.setRequired(question.required);
    result.setTitle(question.title);
    result.setType(question.type);
    return result;
}
