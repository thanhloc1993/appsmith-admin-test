import { ComposeType } from './communication-common-definitions';
import { QuestionnaireDataTableRow } from './communication-notification-questionnaire-definitions';
import { NotificationStatus, Question, QuestionType } from 'manabuf/common/v1/notifications_pb';

export function createQuestionsFromQuestionnaireData(
    questionnaireData: QuestionnaireDataTableRow[]
): Question[] {
    const sampleChoices = ['Answer 1', 'Answer 2', 'Answer 3'];
    const questions: Question[] = [];
    let orderIndex = 0;
    for (let rowIndex = 0; rowIndex < questionnaireData.length; rowIndex++) {
        const dataRow = questionnaireData[rowIndex];
        let questionType = -1;
        switch (dataRow.questionType) {
            case 'CheckBox':
                questionType = QuestionType.QUESTION_TYPE_CHECK_BOX;
                break;
            case 'Multiple choice':
                questionType = QuestionType.QUESTION_TYPE_MULTIPLE_CHOICE;
                break;
            case 'Short answer':
                questionType = QuestionType.QUESTION_TYPE_FREE_TEXT;
                break;

            default:
                break;
        }

        for (let index = 0; index < dataRow.numberOfQuestions; index++) {
            const question = new Question();
            question.setOrderIndex(orderIndex);
            question.setTitle(`Question ${orderIndex}`);
            question.setRequired(dataRow.required);
            question.setType(questionType);
            if (
                questionType == QuestionType.QUESTION_TYPE_CHECK_BOX ||
                questionType == QuestionType.QUESTION_TYPE_MULTIPLE_CHOICE
            ) {
                question.setChoicesList(sampleChoices);
            }
            questions.push(question);
            orderIndex = orderIndex + 1;
        }
    }

    return questions;
}

export function getAccordionQuestionContentWithPrefix(
    questionContent: string,
    questionIndex: number
) {
    return `Question ${questionIndex + 1}: ${questionContent}`;
}

/**
 * @param alphabetCase format alphabet added into UpperCase or LowerCase
 * @description create array alphabet(26 items)
 * @returns array alphabet, example with alphabetCase = lowercase: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
 */
export function getAlphabetArray(
    alphabetCase: 'uppercase' | 'lowercase' = 'uppercase'
): Array<string> {
    return alphabetCase === 'uppercase'
        ? [...Array(26)].map((_, i) => String.fromCharCode(i + 97).toUpperCase())
        : [...Array(26)].map((_, i) => String.fromCharCode(i + 97));
}

/**
 * @param arr array of string(max length = 26)
 * @param charInMiddle character between array items
 * @description convert from array string into array with alphabet, example: ["2022","Manabie"] => ["A. 2022","B. Manabie"]
 * @returns array of string, begin by alphabet
 */
export function addAlphabetToArrayString(
    arr: Array<string>,
    charInMiddle: '.' | '/' | ',' = '.'
): Array<string> {
    return arr.map(
        (item, index) => `${getAlphabetArray('uppercase')[index]}${charInMiddle} ${item}`
    );
}

export function getEnumString<T extends string>(objEnum = {}, value: any): T | undefined {
    const index = Object.values(objEnum).indexOf(value);
    if (index >= 0) {
        return Object.keys(objEnum)[index] as T;
    }
}

export type NotificationStatusKeysType = keyof typeof NotificationStatus;

export function getNotificationStatusText(
    status: NotificationStatusKeysType
): ComposeType | undefined {
    switch (status) {
        case 'NOTIFICATION_STATUS_DRAFT':
            return 'Draft';
        case 'NOTIFICATION_STATUS_SCHEDULED':
            return 'Scheduled';
        case 'NOTIFICATION_STATUS_SENT':
            return 'Sent';
        default:
            return undefined;
    }
}
