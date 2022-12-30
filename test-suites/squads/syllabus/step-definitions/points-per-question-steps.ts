import { asyncForEach } from '@syllabus-utils/common';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { genId } from '@supports/utils/ulid';

import { Quiz } from '@services/common/quiz';

import {
    aliasCourseId,
    aliasCurrentAttemptIndex,
    aliasExamLOId,
    aliasExamLOName,
    aliasLOSelected,
    aliasPreviousPointsPerQuestion,
    aliasQuizDescription,
    aliasQuizDetail,
    aliasQuizDetailList,
    aliasQuizQuestionNames,
    aliasQuizResultListByDescSubmission,
    aliasRandomQuizzes,
} from './alias-keys/syllabus';
import { LearningObjective } from './cms-models/learning-material';
import { QuizDescription, QuizDetail, QuizDifficultyLevels, QuizResult } from './cms-models/quiz';
import { teacherGoToCourseStudentDetail } from './create-course-studyplan-definitions';
import {
    schoolAdminCreatesQuestionWithPoints,
    schoolAdminDeletesQuestion,
    teacherOpensAttemptHistory,
} from './points-per-question-definitions';
import {
    studentSeePointsPerQuestion,
    teacherSeePointsPerQuestion,
    teacherSeesPointsPerQuestionInMarkingPage,
} from './points-per-question.definitions';
import {
    schoolAdminFillQuizPoint,
    schoolAdminFillQuizQuestionData,
    schoolAdminSeePointOnQuestionPreview,
    schoolAdminSelectPreviewQuestionInTable,
    teacherGoesToSeeNextQuizQuestion,
    teacherSeesQuizQuestion,
} from './syllabus-create-question-definitions';
import {
    schoolAdminSelectTabInExamLODetail,
    studentSelectIndexedQuestion,
    teacherChoosesStudentAttemptByIndexInMarkingPage,
    teacherMoveBetweenQuestionInMarkingPage,
    teacherSeesLearningRecordPopupAtIndex,
} from './syllabus-do-exam-lo-definitions';
import { studentStartExamLOFromInstructionScreen } from './syllabus-exam-lo-common-definition';
import {
    schoolAdminChooseToCreateQuizWithTypeV2,
    schoolAdminFillsAllAnswersByQuestionType,
    schoolAdminGoesToEditQuestionPage,
    schoolAdminSubmitQuestion,
    schoolAdminWaitingQuizTableInTheLODetail,
    studentSeeQuizProgress,
    studentWaitingQuestionScreenByQuestionNumber,
    studentWaitingQuizScreenByLMType,
} from './syllabus-question-utils';
import {
    getConvertedStringType,
    getQuizTypeValue,
    mappedLOTypeWithAliasStringName,
    waitForLoadingAbsent,
} from './syllabus-utils';
import { QuizTypeTitle } from './types/cms-types';
import {
    convertDataQuizToQuizDetails,
    getConvertedQuizDetail,
    getValidPointsPerQuestion,
} from './utils/question-utils';
import { ByValueKey } from 'flutter-driver-x/dist/common/find';
import { cmsExamDetail } from 'test-suites/squads/syllabus/cms-locators/exam-detail';

When('school admin creates points per {string} question', async function (quizTypeTitle: string) {
    const randomQuestionList = this.scenario.get<Quiz[]>(aliasRandomQuizzes) || [];
    const questionType = getConvertedStringType<QuizTypeTitle>(quizTypeTitle);
    const quizDetailList: QuizDetail[] = convertDataQuizToQuizDetails(randomQuestionList);

    const createdQuizDetail: QuizDetail = getConvertedQuizDetail({
        description: {
            content: `Points per ${questionType} question ${genId()}`,
            point: getValidPointsPerQuestion(),
            type: questionType,
        },
    });

    const { description } = createdQuizDetail;

    await this.cms.instruction(
        `school admin chooses the ${description.type} question type`,
        async () => {
            await schoolAdminChooseToCreateQuizWithTypeV2(this.cms, description.type);
        }
    );

    await this.cms.instruction(`school admin fills the point is ${description.point}`, async () => {
        await schoolAdminFillQuizPoint(this.cms, description.point);
    });

    await this.cms.instruction(
        `school admin fills the question is ${description.content}`,
        async () => {
            await schoolAdminFillQuizQuestionData(this.cms, description.content);
        }
    );

    await this.cms.instruction('school admin fills all answers', async () => {
        await schoolAdminFillsAllAnswersByQuestionType(this.cms, description.type);
    });

    await this.cms.instruction(`school admin saves question`, async () => {
        await schoolAdminSubmitQuestion(this.cms);
    });

    this.scenario.set(aliasQuizDetail, createdQuizDetail);
    this.scenario.set(aliasQuizDetailList, [...quizDetailList, createdQuizDetail]);
});

When('school admin edits points per question in exam LO', async function () {
    const selectedLO = this.scenario.get<LearningObjective>(aliasLOSelected);
    const { kind, point, question } = this.scenario
        .get<Quiz[]>(aliasRandomQuizzes)
        .filter((quiz) => quiz.loId === selectedLO.info.id)[0];
    this.scenario.set<number>(aliasPreviousPointsPerQuestion, point!.value);

    if (!question) throw new Error(`Cannot get question content created by gRPC`);
    if (!point) throw new Error(`Cannot get point per question created by gRPC`);

    const editedQuizPoint = getValidPointsPerQuestion({ min: point.value + 1 });
    const { quizTypeTitle } = getQuizTypeValue({ quizTypeNumber: kind });

    const editedQuizDetail: QuizDetail = getConvertedQuizDetail({
        description: { content: question.raw, point: editedQuizPoint, type: quizTypeTitle },
    });

    const { description } = editedQuizDetail;

    await this.cms.instruction(
        `school admin goes to edit ${description.content} question page`,
        async () => {
            await schoolAdminSelectTabInExamLODetail(this.cms, 'Questions');
            await schoolAdminWaitingQuizTableInTheLODetail(this.cms);

            await schoolAdminGoesToEditQuestionPage(this.cms, description.content);
        }
    );

    await this.cms.instruction(`school admin edits the point to ${description.point}`, async () => {
        await schoolAdminFillQuizPoint(this.cms, description.point);
    });

    await this.cms.instruction(`school admin saves question`, async () => {
        await schoolAdminSubmitQuestion(this.cms);
    });

    this.scenario.set(aliasQuizDetail, editedQuizDetail);
});

Then('school admin sees points per question on preview', async function () {
    const {
        description: { content, point },
    } = this.scenario.get<QuizDetail>(aliasQuizDetail);

    await schoolAdminWaitingQuizTableInTheLODetail(this.cms);

    await this.cms.instruction(
        `school admin clicks on preview button of ${content} question`,
        async () => {
            await schoolAdminSelectPreviewQuestionInTable(this.cms, content);
        }
    );

    await this.cms.instruction(
        `school admin sees ${point} points per ${content} question on preview`,
        async () => {
            await schoolAdminSeePointOnQuestionPreview(this.cms, point);
        }
    );
});

Then('student sees points per question in exam LO', async function () {
    const quizDetailList = this.scenario.get<QuizDetail[]>(aliasQuizDetailList);
    const studyPlanItemName = this.scenario.get<string>(mappedLOTypeWithAliasStringName['exam LO']);

    await this.learner.instruction(
        `Student taps start button to do the exam lo ${studyPlanItemName}`,
        async () => {
            await studentStartExamLOFromInstructionScreen(this.learner);

            await studentWaitingQuizScreenByLMType(this.learner, {
                type: 'exam LO',
                name: studyPlanItemName,
            });

            await studentSeeQuizProgress(this.learner, quizDetailList.length);
        }
    );

    await asyncForEach(quizDetailList, async (quizDetail, index) => {
        const {
            description: { type, content, point },
        } = quizDetail;
        const questionNumber = index + 1;

        await this.learner.instruction(`Student selects question ${questionNumber}`, async () => {
            await studentSelectIndexedQuestion(this.learner, this.scenario, index);
            await studentWaitingQuestionScreenByQuestionNumber(this.learner, questionNumber);
        });

        await this.learner.instruction(
            `Student sees the question:
            \n- Name: ${content}
            \n- Type: ${type}
            \n- Point: ${point}pts`,
            async () => {
                await studentSeePointsPerQuestion(this.learner, point);
            }
        );
    });
});

Then(
    `teacher sees points per question in exam lo's attempt {int}`,
    async function (attemptNumber: number) {
        const quizResultListByDescSubmission = this.scenario.get<QuizResult[]>(
            aliasQuizResultListByDescSubmission
        );
        const currentAttemptIndex = this.scenario.get<number>(aliasCurrentAttemptIndex);
        const selectedAttemptIndex = quizResultListByDescSubmission.length - attemptNumber;
        const currentQuizResult = quizResultListByDescSubmission[selectedAttemptIndex];
        const { questionSubmissionList } = currentQuizResult;

        await this.teacher.instruction(
            `Teacher chooses the student's submission attempt ${attemptNumber}`,
            async () => {
                const attemptIndex = await teacherChoosesStudentAttemptByIndexInMarkingPage(
                    this.teacher,
                    {
                        currentIndex: currentAttemptIndex,
                        selectedIndex: selectedAttemptIndex,
                    }
                );
                await waitForLoadingAbsent(this.teacher.flutterDriver!);

                this.scenario.set(aliasCurrentAttemptIndex, attemptIndex);
            }
        );

        await asyncForEach(questionSubmissionList, async (questionSubmission, index) => {
            const { questionPoint } = questionSubmission;
            const questionNumber = index + 1;

            await this.teacher.instruction(
                `Teacher sees the question:
                \n- Number: ${questionNumber}
                \n- Point: ${questionPoint}`,
                async () => {
                    await teacherSeesPointsPerQuestionInMarkingPage(this.teacher, questionPoint);
                }
            );

            if (questionNumber < questionSubmissionList.length) {
                await this.teacher.instruction(
                    `Teacher goes to the next question ${questionNumber + 1}`,
                    async () => {
                        await teacherMoveBetweenQuestionInMarkingPage(this.teacher, 'next');
                        await waitForLoadingAbsent(this.teacher.flutterDriver!);
                    }
                );
            }
        });
    }
);

Then('teacher sees points per question in exam LO', async function () {
    const quizDetailList = this.scenario.get<QuizDetail[]>(aliasQuizDetailList);

    await asyncForEach(quizDetailList, async (quizDetail, index) => {
        const {
            description: { type, content, point },
        } = quizDetail;
        const questionNumber = index + 1;

        await this.teacher.instruction(
            `Teacher sees the question:
            - Name: ${content}
            - Type: ${type}
            - Point: ${point}`,
            async () => {
                await teacherSeesQuizQuestion(this.teacher, content, type);
                await teacherSeePointsPerQuestion(this.teacher, point);
            }
        );

        if (questionNumber < quizDetailList.length) {
            await this.teacher.instruction(
                `Teacher goes to the next question ${questionNumber + 1}`,
                async () => {
                    await teacherGoesToSeeNextQuizQuestion(this.teacher);
                }
            );
        }
    });
});

Then(
    `student sees points per question in exam lo's attempt {int}`,
    async function (attemptNumber: number) {
        const quizResultListByDescSubmission = this.scenario.get<QuizResult[]>(
            aliasQuizResultListByDescSubmission
        );
        const attemptIndex = quizResultListByDescSubmission.length - attemptNumber;
        const currentQuizResult = quizResultListByDescSubmission[attemptIndex];
        const { questionSubmissionList } = currentQuizResult;

        await this.learner.instruction(
            `Student chooses exam lo's attempt ${attemptNumber} in attempt history screen`,
            async () => {
                await this.learner.flutterDriver!.tap(
                    new ByValueKey(SyllabusLearnerKeys.attemptHistoryRecordItem(attemptIndex))
                );
                await waitForLoadingAbsent(this.learner.flutterDriver!);
            }
        );

        await this.learner.instruction(
            `Student taps view answer keys button in exam lo's attempt ${attemptNumber}`,
            async () => {
                await this.learner.flutterDriver!.tap(
                    new ByValueKey(SyllabusLearnerKeys.viewAnswerKeyButtonWithState(true))
                );
            }
        );

        await asyncForEach(questionSubmissionList, async (questionSubmission, index) => {
            const { content, type, questionPoint } = questionSubmission;
            const questionNumber = index + 1;

            await this.learner.instruction(
                `Student selects the question ${questionNumber} in quiz progress`,
                async () => {
                    await studentSelectIndexedQuestion(this.learner, this.scenario, index);
                    await waitForLoadingAbsent(this.learner.flutterDriver!);
                }
            );

            await this.learner.instruction(
                `Student sees the question: 
                - Name: ${content}, 
                - Type: ${type}
                - Point: ${questionPoint}pts`,
                async () => {
                    await studentSeePointsPerQuestion(this.learner, questionPoint);
                }
            );
        });

        await this.learner.instruction(`Student backs to attempt history screen`, async () => {
            await this.learner.flutterDriver!.tap(new ByValueKey(SyllabusLearnerKeys.back_button));
        });
    }
);

When('school admin deletes the question and adds new a question', async function () {
    const scenario = this.scenario;
    const cms = this.cms;

    const { point } = this.scenario.get<Quiz[]>(aliasRandomQuizzes)[0];
    const questionName = scenario.get<string>(aliasQuizQuestionNames)[0] ?? '';

    const quizDescription: QuizDescription = {
        content: `Points per question ${genId()}`,
        point: getValidPointsPerQuestion(),
        type: 'fill in the blank',
        difficultyLevel: QuizDifficultyLevels.ONE,
        taggedLOs: [],
    };

    scenario.set(aliasQuizDescription, quizDescription);
    scenario.set<number>(aliasPreviousPointsPerQuestion, point!.value);

    await cms.instruction(`school admin clicks on questions tab`, async function () {
        const { page } = cms;

        await cmsExamDetail.waitForQuestionTab(page!);
        await cmsExamDetail.selectQuestionTab(page!);
    });

    await cms.instruction(`school admin deletes question`, async function () {
        await schoolAdminDeletesQuestion(questionName, cms);
    });

    await cms.instruction(`school admin adds a new question`, async function () {
        await schoolAdminCreatesQuestionWithPoints(quizDescription, cms);
    });
});

Then('student sees total score has changed', async function () {
    const { point } = this.scenario.get<QuizDescription>(aliasQuizDescription);
    const previousPoints = this.scenario.get<number>(aliasPreviousPointsPerQuestion);

    const pointsText = (point < 10 ? '0' : '') + point.toString();
    const previousPointsText = (previousPoints < 10 ? '0' : '') + previousPoints.toString();

    await this.learner.instruction(
        `student does sees previous total score for the exam LO`,
        async () => {
            await this.learner.flutterDriver?.waitFor(
                new ByValueKey(SyllabusLearnerKeys.quizSetResult(1, `00/${previousPointsText}`))
            );
        }
    );

    await this.learner.instruction(
        `student does sees new total score for the exam LO`,
        async () => {
            await this.learner.flutterDriver?.waitFor(
                new ByValueKey(SyllabusLearnerKeys.quizSetResult(0, `00/${pointsText}`))
            );
        }
    );
});

Then(
    `teacher sees the score of the old attempt with no change`,
    { timeout: 200 * 1000 },
    async function () {
        const context = this.scenario;
        const studentKey = learnerProfileAliasWithAccountRoleSuffix('student');
        const profile = context.get<UserProfileEntity>(studentKey);
        const courseId = context.get(aliasCourseId);
        const loId = context.get(aliasExamLOId);
        const loName = context.get(aliasExamLOName);

        await this.teacher.instruction(
            `teacher goes to course student detail on url = ${courseId}/studentStudyPlan?student_id=${profile.id}`,
            async () => {
                await teacherGoToCourseStudentDetail(this.teacher, courseId, profile.id);
            }
        );

        await this.teacher.instruction(`teacher opens attempt history of ${loId}`, async () => {
            await teacherOpensAttemptHistory(this.teacher, loName, loId);
        });

        const previousPoints = this.scenario.get<number>(aliasPreviousPointsPerQuestion);

        await this.teacher.instruction(`teacher sees correct old points`, async () => {
            await teacherSeesLearningRecordPopupAtIndex(this.teacher, 0, previousPoints, 1);
        });
    }
);

Then(
    `teacher sees the score of the new attempt changed`,
    { timeout: 200 * 1000 },
    async function (this: IMasterWorld) {
        const { point } = this.scenario.get<QuizDescription>(aliasQuizDescription);

        await this.teacher.instruction(`teacher sees correct new points`, async () => {
            await teacherSeesLearningRecordPopupAtIndex(this.teacher, 0, point, 0);
        });
    }
);
