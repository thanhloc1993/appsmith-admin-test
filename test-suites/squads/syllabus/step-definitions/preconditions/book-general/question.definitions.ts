import { createDataQuestionList, getValidPointsPerQuestion } from '@syllabus-utils/question-utils';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { Quiz } from '@services/common/quiz';

import { aliasRandomLearningObjectives, aliasRandomQuizzes } from '../../alias-keys/syllabus';
import {
    mergeAndSetRandomStudyPlanItemsContext,
    schoolAdminCreateDefaultSimpleBookAndSetContext,
    schoolAdminCreateRandomExamLOsAndSetContext,
    schoolAdminCreateRandomQuestionsAndSetContext,
} from '../../create-data-book-content-utils';
import { LearningMaterialType } from 'manabuf/syllabus/v1/enums_pb';
import { getArrayElementWithLength } from 'test-suites/squads/syllabus/utils/common';

export const schoolAdminHasCreatedRandomQuestionExamLO = async (
    cms: CMSInterface,
    scenario: ScenarioContext,
    options: { quantityQuestion?: number } = {}
) => {
    const { quantityQuestion = 1 } = options;
    await schoolAdminCreateDefaultSimpleBookAndSetContext(cms, scenario);

    const examLO = await schoolAdminCreateRandomExamLOsAndSetContext(cms, scenario);

    const { schoolId } = await cms.getContentBasic();

    //TODO: Fix Quiz['point'] to return number
    const randomQuestionPointList = getArrayElementWithLength<Pick<Quiz, 'point'>>(
        quantityQuestion,
        () => ({
            point: {
                value: getValidPointsPerQuestion(),
            },
        })
    );

    const customQuestions = createDataQuestionList(
        {
            loId: examLO[0].learningMaterialId,
            schoolId,
        },
        {
            questionList: randomQuestionPointList,
            lmType: LearningMaterialType.LEARNING_MATERIAL_EXAM_LO,
        }
    );

    const { quizRaws } = await schoolAdminCreateRandomQuestionsAndSetContext(cms, scenario, {
        parentId: examLO[0].learningMaterialId,
        questions: customQuestions,
    });

    scenario.set(aliasRandomQuizzes, quizRaws);
    scenario.set(aliasRandomLearningObjectives, examLO);

    mergeAndSetRandomStudyPlanItemsContext(scenario, examLO);
};
