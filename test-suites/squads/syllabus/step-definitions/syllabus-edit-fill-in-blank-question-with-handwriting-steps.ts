import {
    asyncForEach,
    convertOneOfStringTypeToArray,
    createNumberArrayWithLength,
    getRandomElement,
} from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import { LOType } from '@supports/app-types';

import { Quiz } from '@services/common/quiz';

import {
    aliasContentBookLOQuestionQuantity,
    aliasHandwritingSelectedOptions,
    aliasLONameSelected,
    aliasLOTypeSelected,
    aliasQuestionFIBList,
    aliasQuizQuestionContent,
    aliasRandomLearningObjectives,
} from './alias-keys/syllabus';
import { examLOQuestionsTab } from './cms-selectors/exam-lo';
import { getAnswerFIBHandwritingSettingInputNthV2 } from './cms-selectors/syllabus';
import { schoolAdminChooseHandwritingAnswerInFIB } from './syllabus-create-fill-in-blank-question-with-handwriting-definitions';
import {
    schoolAdminCountAnswerInputOfFillInBlankQuestion,
    schoolAdminFillAnswerOfFillInBlank,
} from './syllabus-create-fill-in-blank-question.definitions';
import {
    learnerEnterHandwritingMode,
    learnerTapToHandwritingFIBAnswerAtPosition,
    studentCannotSeeButtonChangeToHandwriting,
    studentCannotSeeButtonChangeToKeyboard,
    studentCannotSeeWhiteboard,
    studentCanSeeWhiteboard,
} from './syllabus-do-lo-quiz-definitions';
import {
    getHandwritingOption,
    HandwritingOption,
    HandwritingSettingCase,
    schoolAdminFocusOnAnswerInput,
    schoolAdminGoesToEditQuestionPage,
    schoolAdminScansOCR,
    schoolAdminSubmitQuestion,
    schoolAdminUploadsQuizMaterial,
    schoolAdminWaitingQuizTableInTheLODetail,
} from './syllabus-question-utils';
import { getLOTypeValue } from './syllabus-utils';
import { schoolAdminClickLOByName } from './syllabus-view-task-assignment-definitions';
import { QuizItemAttributeConfig } from 'manabuf/common/v1/contents_pb';
import { LearningObjective } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

When(
    'school admin edits the fill in the blank answers by {string} handwriting settings in {string}',
    async function (handwritingSettingCase: HandwritingSettingCase, loTypeCase: LOType) {
        const loType = getRandomElement(convertOneOfStringTypeToArray<LOType>(loTypeCase));
        const { loTypeNumber } = getLOTypeValue({ loType });

        const selectedLO = this.scenario
            .get<LearningObjective[]>(aliasRandomLearningObjectives)
            .filter((lo) => lo.type === loTypeNumber)[0];

        // TODO: Remove aliasQuestionFIBList and replace by another way
        const questionFIB = this.scenario
            .get<Quiz[]>(aliasQuestionFIBList)
            .filter((quiz) => quiz.loId === selectedLO.info.id)[0];

        const createdHandwritingOptions: HandwritingOption[] = questionFIB.optionsList.map(
            (question) =>
                getHandwritingOption({
                    key: question.attribute?.configsList[0],
                })
        );

        let selectedHandwritingOptions: HandwritingOption[] = [...createdHandwritingOptions];

        switch (handwritingSettingCase) {
            case 'shuffle': {
                const option = selectedHandwritingOptions.shift();
                selectedHandwritingOptions.push(option!);
                break;
            }

            case 'disabled':
                selectedHandwritingOptions = createdHandwritingOptions.map(() =>
                    getHandwritingOption({
                        key: QuizItemAttributeConfig.FLASHCARD_LANGUAGE_CONFIG_NONE,
                    })
                );
                break;

            default:
                break;
        }

        await this.cms.instruction(
            `school admin goes to FIB question ${questionFIB.externalId} edit page in ${loType} ${selectedLO.info.name}`,
            async () => {
                await schoolAdminClickLOByName(this.cms, selectedLO.info.name);
                await this.cms.waitingForLoadingIcon();

                if (loType === 'exam LO') await this.cms.page?.click(examLOQuestionsTab);

                await schoolAdminWaitingQuizTableInTheLODetail(this.cms);

                await schoolAdminGoesToEditQuestionPage(this.cms, questionFIB.externalId);
            }
        );

        await this.cms.instruction(
            `school admin sees the created handwriting answers`,
            async () => {
                await schoolAdminFocusOnAnswerInput(
                    this.cms,
                    getAnswerFIBHandwritingSettingInputNthV2(1)
                );
            }
        );

        const totalAnswerInput = await schoolAdminCountAnswerInputOfFillInBlankQuestion(this.cms);

        const totalAnswerInputArr = createNumberArrayWithLength(totalAnswerInput);

        await asyncForEach(totalAnswerInputArr, async (_, index) => {
            const answerSelectedHandwritingOption = selectedHandwritingOptions[index];
            const answerNumber = index + 1;

            await this.cms.instruction(
                `school admin chooses ${answerSelectedHandwritingOption.value} option for handwriting answer ${answerNumber}`,
                async () => {
                    await schoolAdminChooseHandwritingAnswerInFIB(
                        this.cms,
                        answerNumber,
                        answerSelectedHandwritingOption.key
                    );
                    // From Math
                    if (
                        createdHandwritingOptions[index].key == QuizItemAttributeConfig.MATH_CONFIG
                    ) {
                        await schoolAdminFillAnswerOfFillInBlank(
                            this.cms,
                            answerNumber,
                            questionFIB.externalId
                        );
                    }

                    // To Math
                    if (
                        answerSelectedHandwritingOption.key == QuizItemAttributeConfig.MATH_CONFIG
                    ) {
                        await schoolAdminUploadsQuizMaterial(this.cms);
                        await schoolAdminScansOCR(this.cms, 'Latex', `Answer ${answerNumber}`);
                        await this.cms.page!.waitForTimeout(500); // make sure answer is filled
                    }
                }
            );
        });

        await this.cms.instruction(`school admin saves question`, async () => {
            await schoolAdminSubmitQuestion(this.cms);
        });

        this.scenario.set(aliasQuizQuestionContent, questionFIB.externalId);
        this.scenario.set(aliasHandwritingSelectedOptions, selectedHandwritingOptions);
        this.scenario.set(aliasLONameSelected, selectedLO.info.name);
        this.scenario.set(aliasLOTypeSelected, loType);
    }
);

Then(
    'student cannot open the whiteboard of answers with disabled handwriting settings',
    async function () {
        const selectedHandwritingOptions = this.scenario.get<HandwritingOption[]>(
            aliasHandwritingSelectedOptions
        );
        const questionQuantity = this.scenario.get<number>(aliasContentBookLOQuestionQuantity);

        await asyncForEach(selectedHandwritingOptions, async (handwritingOption, index) => {
            if (handwritingOption.key === QuizItemAttributeConfig.FLASHCARD_LANGUAGE_CONFIG_NONE) {
                const answerNumber = index + 1;

                await this.learner.instruction(
                    `student taps to answer ${answerNumber} with ${handwritingOption.value} handwriting setting`,
                    async () => {
                        await learnerTapToHandwritingFIBAnswerAtPosition(
                            this.learner,
                            questionQuantity,
                            answerNumber
                        );
                    }
                );

                await this.learner.instruction(`student cannot see the whiteboard`, async () => {
                    await studentCannotSeeWhiteboard(this.learner);
                });

                await this.learner.instruction(
                    `student cannot see change to keyboard button`,
                    async () => {
                        await studentCannotSeeButtonChangeToKeyboard(this.learner);
                    }
                );

                await this.learner.instruction(
                    `student cannot see change to handwriting button`,
                    async () => {
                        await studentCannotSeeButtonChangeToHandwriting(this.learner);
                    }
                );
            }
        });
    }
);

Then(
    'student can open the whiteboard of answers with enabled handwriting settings',
    async function () {
        const selectedHandwritingOptions = this.scenario.get<HandwritingOption[]>(
            aliasHandwritingSelectedOptions
        );
        const questionQuantity = this.scenario.get<number>(aliasContentBookLOQuestionQuantity);

        await asyncForEach(selectedHandwritingOptions, async (handwritingOption, index) => {
            if (handwritingOption.key !== QuizItemAttributeConfig.FLASHCARD_LANGUAGE_CONFIG_NONE) {
                const answerNumber = index + 1;

                await this.learner.instruction(
                    `student taps to answer ${answerNumber} with ${handwritingOption.value} handwriting setting`,
                    async () => {
                        await learnerTapToHandwritingFIBAnswerAtPosition(
                            this.learner,
                            questionQuantity,
                            answerNumber
                        );
                    }
                );

                await this.learner.instruction(`student enters handwriting mode`, async () => {
                    await learnerEnterHandwritingMode(this.learner);
                });

                await this.learner.instruction(`student see the whiteboard`, async () => {
                    await studentCanSeeWhiteboard(this.learner);
                });
            }
        });
    }
);
