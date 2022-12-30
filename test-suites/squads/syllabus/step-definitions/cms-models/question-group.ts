import { QuizTypeTitle } from '@supports/types/cms-types';

export interface QuestionDetail {
    groupType: 'individual question' | 'group';
    questionList: string;
}

export interface QuestionUpsertFormValue {
    selectedTypeTitle: QuizTypeTitle;
    questionName: string;
    explanationContent: string;
}

export interface QuestionGroupDetail {
    groupType?: QuestionDetail['groupType'];
    questionGroupName: string;
    questionGroupDescription: string;
    questionNames?: string[];
    questionTypeNumbers?: number[];
}
