import {
    delay,
    getLearnerInterfaceFromRole,
    getRandomElement,
} from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { courseAliasWithSuffix, studentListAlias } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, Books, IMasterWorld, LearnerInterface } from '@supports/app-types';
import { CourseEntityWithLocation } from '@supports/entities/course-entity';
import { ScenarioContext } from '@supports/scenario-context';
import { Quiz } from '@supports/services/common/quiz';

import {
    aliasAssignmentName,
    aliasAssignmentNotRequireGradeName,
    aliasExamLOName,
    aliasFlashcardName,
    aliasLOName,
    aliasLOWithMaterialName,
    aliasQuizzesByLOName,
    aliasScoreByStudyPlanItemNameAndLearnerName,
    aliasSelectedNonScoredLearningType,
    aliasSelectedNonScoredStudyPlanItemName,
    aliasSelectedScoredLearningType,
    aliasSelectedScoredStudyPlanItemName,
    aliasTaskAssignmentName,
    aliasTaskAssignmentWithCorrectnessName,
    aliasTopicName,
} from './alias-keys/syllabus';
import { studentSubmitAssignment } from './syllabus-assignment-submit-definitions';
import { schoolAdminHasCreateQuizzesForLOsWithAnswer } from './syllabus-content-book-create-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import {
    studentSeesAndDoesExamLOQuestionsWithCorrectQuizzes,
    studentSubmitExamLO,
} from './syllabus-do-exam-lo-definitions';
import { studentStartExamLOFromInstructionScreen } from './syllabus-exam-lo-common-definition';
import { teacherTapsOnTopic } from './syllabus-expand-collapse-topic-definitions';
import {
    studentBackToTopicListAfterSubmitAssignment,
    studentBackToTopicListAfterSubmitExamLO,
    studentBackToTopicListAfterSubmitLO,
    studentDoesFlashCardWithCorrectQuizzes,
    studentLearnsStudyGuide,
    studentSeesAndDoesLOQuestionsWithCorrectQuizzes,
    teacherGoesToStudyPlanItemDetailsCourseStatisticsFlow,
    teacherSeesAverageGradeOfStudyPlanItem,
    teacherSeesAverageGradeOfTopic,
    teacherSeesCompletedDateOfStudyPlanItem,
    teacherSeesCompletedStudentOfStudyPlanItem,
    teacherSeesCompletedStudentOfTopic,
    teacherSeesGradeOfStudyPlanItem,
} from './syllabus-sees-statistics-on-course-statistics-definitions';
import { teacherSeeStudyPlanItemWithStatus } from './syllabus-study-plan-common-definitions';
import {
    studentFillsCorrectnessOnTaskAssignment,
    studentGetsCorrectnessOnTaskAssignment,
} from './syllabus-submit-task-assignment-on-learner-app-definitions';
import {
    calculateStudentGradeInPercent,
    studentGoToCourseDetail,
    studentGoToStudyPlanItemDetail,
    studentRefreshHomeScreen,
    teacherClicksBackButtonOnActionBar,
} from './syllabus-utils';
import { studentGoesToFlashcardPracticePage } from './syllabus-view-flashcard-learn-definitions';
import { ByValueKey } from 'flutter-driver-x';
import { QuizType } from 'manabuf/common/v1/contents_pb';
import { CreatedContentBookReturn } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';
import { randomInteger } from 'test-suites/squads/syllabus/utils/common';

export type LearningTypeWithScore =
    | 'LO with quizzes'
    | 'Assignment requires grading'
    | 'TaskAssignment has Correctness'
    | 'Flashcard'
    | 'Exam LO';
export type LearningTypeWithoutScore =
    | 'non LO with quizzes'
    | 'Assignment non requires grading'
    | 'TaskAssignment no Correctness';

export type LearningType = LearningTypeWithScore | LearningTypeWithoutScore;

Given(
    'school admin has modified some study plan items to require and not require grade',
    async function (this: IMasterWorld) {
        const cms = this.cms;
        const scenario = this.scenario;

        const listLearningTypesWithScore: LearningTypeWithScore[] = [
            // 'Assignment requires grading',  // another grading flow, will test in another test
            'Exam LO',
            'Flashcard',
            'LO with quizzes',
            'TaskAssignment has Correctness',
        ];

        const listLearningTypesWithoutScore: LearningTypeWithoutScore[] = [
            'non LO with quizzes',
            'Assignment non requires grading',
            'TaskAssignment no Correctness',
        ];

        const selectedLearningTypeWithScore: LearningType = getRandomElement<LearningTypeWithScore>(
            listLearningTypesWithScore
        );

        const selectedLearningTypeWithoutScore: LearningType =
            getRandomElement<LearningTypeWithoutScore>(listLearningTypesWithoutScore);

        scenario.set(aliasSelectedScoredLearningType, selectedLearningTypeWithScore);
        scenario.set(aliasSelectedNonScoredLearningType, selectedLearningTypeWithoutScore);

        const taskAssignmentRequireCorrectnessName = scenario.get(
            aliasTaskAssignmentWithCorrectnessName
        );
        const taskAssignmentNotRequireCorrectnessName = scenario.get(aliasTaskAssignmentName);

        const assignmentRequireGradeName = scenario.get(aliasAssignmentName);
        const assignmentNotRequireGradeName = scenario.get(aliasAssignmentNotRequireGradeName);

        const loWithQuizName = scenario.get(aliasLOName);
        const loNoQuizName = scenario.get(aliasLOWithMaterialName);

        const examLOName = scenario.get(aliasExamLOName);
        const flashcardName = scenario.get(aliasFlashcardName);

        await cms.instruction('School admin create quiz by gRPC', async function (cms) {
            await schoolAdminHasCreateQuizzesForLOsWithAnswer(cms, scenario, 2, loNoQuizName);
        });

        switch (selectedLearningTypeWithScore) {
            case 'Assignment requires grading':
                scenario.set(aliasSelectedScoredStudyPlanItemName, assignmentRequireGradeName);
                break;
            case 'Exam LO':
                scenario.set(aliasSelectedScoredStudyPlanItemName, examLOName);
                break;
            case 'Flashcard':
                scenario.set(aliasSelectedScoredStudyPlanItemName, flashcardName);
                break;
            case 'LO with quizzes':
                scenario.set(aliasSelectedScoredStudyPlanItemName, loWithQuizName);
                break;
            case 'TaskAssignment has Correctness':
                scenario.set(
                    aliasSelectedScoredStudyPlanItemName,
                    taskAssignmentRequireCorrectnessName
                );
                break;
            default:
                break;
        }

        switch (selectedLearningTypeWithoutScore) {
            case 'Assignment non requires grading':
                scenario.set(
                    aliasSelectedNonScoredStudyPlanItemName,
                    assignmentNotRequireGradeName
                );
                break;
            case 'TaskAssignment no Correctness':
                scenario.set(
                    aliasSelectedNonScoredStudyPlanItemName,
                    taskAssignmentNotRequireCorrectnessName
                );
                break;
            case 'non LO with quizzes':
                scenario.set(aliasSelectedNonScoredStudyPlanItemName, loNoQuizName);
                break;
            default:
                break;
        }
    }
);

When(
    'students do a study plan item that does not require grade',
    { timeout: 100000 },
    async function (this: IMasterWorld) {
        const scenario = this.scenario;
        const topicName = scenario.get<string>(aliasTopicName);
        const nonScoredStudyPlanItemType = scenario.get<LearningTypeWithoutScore>(
            aliasSelectedNonScoredLearningType
        );
        const studyPlanNoScoreName = scenario.get<string>(aliasSelectedNonScoredStudyPlanItemName);
        const studentList = scenario.get<AccountRoles[]>(studentListAlias);

        // Students do test in parallel
        await Promise.all(
            studentList.map(async (student) => {
                const learner = getLearnerInterfaceFromRole(this, student) ?? this.learner;

                return await studentDoesStudyPlanItemNoScore(
                    learner,
                    topicName,
                    studyPlanNoScoreName,
                    nonScoredStudyPlanItemType
                );
            })
        );
    }
);

When(
    'students do a study plan item that requires grade',
    { timeout: 200000 },
    async function (this: IMasterWorld) {
        const scenario = this.scenario;
        const courseData = scenario.get<CourseEntityWithLocation>(courseAliasWithSuffix('course'));
        const courseName = courseData.name;
        const topicName = scenario.get<string>(aliasTopicName);
        const scoredStudyPlanItemType = scenario.get<LearningTypeWithScore>(
            aliasSelectedScoredLearningType
        );
        const studyPlanItemScoreName = scenario.get<string>(aliasSelectedScoredStudyPlanItemName);
        const studentList = scenario.get<AccountRoles[]>(studentListAlias);

        // Students do test in parallel
        await Promise.all(
            studentList.map(async (student) => {
                const learner = getLearnerInterfaceFromRole(this, student) ?? this.learner;

                return await studentDoesStudyPlanItemWithScore(
                    scenario,
                    learner,
                    courseName,
                    topicName,
                    studyPlanItemScoreName,
                    scoredStudyPlanItemType
                );
            })
        );
    }
);

Then(
    'teacher sees statistics of the course',
    { timeout: 30000 },
    async function (this: IMasterWorld) {
        const scenario = this.scenario;
        const teacher = this.teacher;
        const studyPlanItemScoreName = scenario.get<string>(aliasSelectedScoredStudyPlanItemName);
        const studyPlanItemNonScoreName = scenario.get<string>(
            aliasSelectedNonScoredStudyPlanItemName
        );

        const studentList = scenario.get<AccountRoles[]>(studentListAlias) ?? [];
        let sum = 0;

        for (const student of studentList) {
            const learner = getLearnerInterfaceFromRole(this, student) ?? this.learner;
            const learnerProfile = await learner.getProfile();
            const learnerName = learnerProfile.name;
            const learnerGrade = scenario.get<string>(
                aliasScoreByStudyPlanItemNameAndLearnerName(studyPlanItemScoreName, learnerName)
            );
            const learnerGradeInPercentage = calculateStudentGradeInPercent(learnerGrade);
            sum += learnerGradeInPercentage;
        }

        const averageGrade =
            studentList.length == 0 ? '--' : `${Math.round(sum / studentList.length)}%`;

        const bookData = this.scenario.get<CreatedContentBookReturn>('book' as Books);
        const topics = bookData.topicList;
        const topicName = topics.map((topic) => topic.name)[0];
        const topicCompletedStudentsNum =
            studentList.length == 0 ? '--/--' : `0/${studentList.length}`;
        const itemCompletedStudentsNum =
            studentList.length == 0 ? '--/--' : `${studentList.length}/${studentList.length}`;

        await delay(3000);

        await teacher.instruction(`teacher taps on a topic ${topicName}`, async () => {
            await teacherTapsOnTopic(teacher, topicName);
        });

        await teacher.instruction(
            `teacher sees ${averageGrade} average grade of topic ${topicName}`,
            async () => {
                await teacherSeesAverageGradeOfTopic(teacher, `${averageGrade}`, topicName);
            }
        );

        await teacher.instruction(
            `teacher sees ${topicCompletedStudentsNum} completed students of topic ${topicName}`,
            async () => {
                await teacherSeesCompletedStudentOfTopic(
                    teacher,
                    topicCompletedStudentsNum,
                    topicName
                );
            }
        );

        await teacher.instruction(
            `teacher sees ${itemCompletedStudentsNum} completed students of ${studyPlanItemNonScoreName}`,
            async () => {
                await teacherSeesCompletedStudentOfStudyPlanItem(
                    teacher,
                    itemCompletedStudentsNum,
                    studyPlanItemNonScoreName
                );
            }
        );

        await teacher.instruction(
            `teacher sees ${averageGrade} average grade of ${studyPlanItemScoreName}`,
            async () => {
                await teacherSeesAverageGradeOfStudyPlanItem(
                    teacher,
                    `${averageGrade}`,
                    studyPlanItemScoreName
                );
            }
        );
        await teacher.instruction(
            `teacher sees ${itemCompletedStudentsNum} completed students of ${studyPlanItemScoreName}`,
            async () => {
                await teacherSeesCompletedStudentOfStudyPlanItem(
                    teacher,
                    itemCompletedStudentsNum,
                    studyPlanItemScoreName
                );
            }
        );
        await teacher.instruction(
            `teacher see -- in average grade of ${studyPlanItemNonScoreName}`,
            async () => {
                await teacherSeesAverageGradeOfStudyPlanItem(
                    teacher,
                    '--',
                    studyPlanItemNonScoreName
                );
            }
        );
        await teacher.instruction(
            `teacher sees ${topicCompletedStudentsNum} completed students of ${studyPlanItemNonScoreName}`,
            async () => {
                await teacherSeesCompletedStudentOfStudyPlanItem(
                    teacher,
                    itemCompletedStudentsNum,
                    studyPlanItemNonScoreName
                );
            }
        );
    }
);

Then(
    'teacher sees statistics of each study plan item',
    { timeout: 30000 },
    async function (this: IMasterWorld) {
        const scenario = this.scenario;
        const teacher = this.teacher;

        const studyPlanItemScoreName = scenario.get<string>(aliasSelectedScoredStudyPlanItemName);
        const studyPlanItemNonScoreName = scenario.get<string>(
            aliasSelectedNonScoredStudyPlanItemName
        );
        const studyPlanItemNonScoreType = scenario.get<LearningTypeWithoutScore>(
            aliasSelectedNonScoredLearningType
        );

        const studentList = scenario.get<AccountRoles[]>(studentListAlias);

        const today = new Date();
        const date = today.getDate();
        const formattedDate = date > 9 ? `${date}` : `0${date}`;
        const month = today.getMonth() + 1;
        const formattedMonth = month > 9 ? `${month}` : `0${month}`;
        const completeDate = `${formattedMonth}/${formattedDate}`;

        await teacher.instruction(
            `Go to detail screen of ${studyPlanItemScoreName}`,
            async function (teacher) {
                await teacherGoesToStudyPlanItemDetailsCourseStatisticsFlow(
                    teacher,
                    studyPlanItemScoreName
                );
            }
        );

        if (studentList.length == 0) {
            console.log('There is no student');
        } else {
            for (const student of studentList) {
                const learner = getLearnerInterfaceFromRole(this, student) ?? this.learner;
                const learnerProfile = await learner.getProfile();
                const learnerName = learnerProfile.name;
                const learnerGrade = scenario.get<string>(
                    aliasScoreByStudyPlanItemNameAndLearnerName(studyPlanItemScoreName, learnerName)
                );
                await teacher.instruction(
                    `See complete date ${completeDate} of ${studyPlanItemScoreName} of ${learnerName}`,
                    async function (teacher) {
                        await teacherSeesCompletedDateOfStudyPlanItem(
                            teacher,
                            learnerName,
                            completeDate
                        );
                    }
                );
                await teacher.instruction(
                    `See grade ${learnerGrade} of ${studyPlanItemScoreName} of ${learnerName}`,
                    async function (teacher) {
                        await teacherSeesGradeOfStudyPlanItem(teacher, learnerName, learnerGrade);
                    }
                );
                await teacher.instruction(`Sees complete status`, async function (teacher) {
                    await teacherSeeStudyPlanItemWithStatus(teacher, learnerName, 'completed');
                });
            }
        }

        await teacher.instruction(`Go back to course statistics`, async function (teacher) {
            await teacherClicksBackButtonOnActionBar(teacher);
        });

        await teacher.instruction(
            `Go to detail screen of ${studyPlanItemNonScoreName}`,
            async function (teacher) {
                await teacherGoesToStudyPlanItemDetailsCourseStatisticsFlow(
                    teacher,
                    studyPlanItemNonScoreName
                );
            }
        );

        if (studentList.length == 0) {
            console.log('There is no student');
        } else {
            for (const student of studentList) {
                const learner = getLearnerInterfaceFromRole(this, student) ?? this.learner;
                const learnerProfile = await learner.getProfile();
                const learnerName = learnerProfile.name;

                await teacher.instruction(
                    `See complete date ${completeDate} of ${studyPlanItemNonScoreName} of ${learnerName}`,
                    async function (teacher) {
                        await teacherSeesCompletedDateOfStudyPlanItem(
                            teacher,
                            learnerName,
                            completeDate
                        );
                    }
                );
                await teacher.instruction(
                    `Sees completed / not marked (if assignment) status of ${learnerName}`,
                    async function (teacher) {
                        if (studyPlanItemNonScoreType == 'Assignment non requires grading') {
                            await teacherSeeStudyPlanItemWithStatus(
                                teacher,
                                learnerName,
                                'not marked'
                            );
                        } else {
                            await teacherSeeStudyPlanItemWithStatus(
                                teacher,
                                learnerName,
                                'completed'
                            );
                        }
                    }
                );
            }
        }
    }
);

export const studentDoesStudyPlanItemWithScore = async (
    scenario: ScenarioContext,
    learner: LearnerInterface,
    courseName: string,
    topicName: string,
    studyPlanItemScoreName: string,
    scoredStudyPlanItemType: LearningTypeWithScore
) => {
    const learnerProfile = await learner.getProfile();
    const learnerName = learnerProfile.name;

    await learner.instruction(`Go to course ${courseName} detail`, async function (learner) {
        await studentRefreshHomeScreen(learner);
        await studentGoToCourseDetail(learner, courseName);
    });

    await learner.instruction(`Go to topic ${topicName} detail`, async function (learner) {
        await studentGoToTopicDetail(learner, topicName);
    });

    await learner.instruction(
        `Go to study plan item detail ${studyPlanItemScoreName}`,
        async function (learner) {
            await studentGoToStudyPlanItemDetail(learner, topicName, studyPlanItemScoreName);
        }
    );

    let quizDataOfExamLO = [] as Quiz[];
    let quizDataOfLO = [] as Quiz[];
    let quizDataOfFlashcard = [] as Quiz[];
    let totalQuizzes = 1;
    let correctQuizzes = 0;
    if (scoredStudyPlanItemType == 'Exam LO') {
        quizDataOfExamLO = scenario.get<Quiz[]>(aliasQuizzesByLOName(studyPlanItemScoreName));
        totalQuizzes = quizDataOfExamLO.length;
        correctQuizzes = randomInteger(0, totalQuizzes);
        scenario.set(
            aliasScoreByStudyPlanItemNameAndLearnerName(studyPlanItemScoreName, learnerName),
            `${correctQuizzes}/${totalQuizzes}`
        );
    }

    if (scoredStudyPlanItemType == 'Flashcard') {
        quizDataOfFlashcard = scenario.get<Quiz[]>(aliasQuizzesByLOName(studyPlanItemScoreName));
        totalQuizzes = quizDataOfFlashcard.length;
        correctQuizzes = randomInteger(0, totalQuizzes);
        scenario.set(
            aliasScoreByStudyPlanItemNameAndLearnerName(studyPlanItemScoreName, learnerName),
            `${correctQuizzes}/${totalQuizzes}`
        );
    }

    if (scoredStudyPlanItemType == 'LO with quizzes') {
        quizDataOfLO = scenario.get<Quiz[]>(aliasQuizzesByLOName(studyPlanItemScoreName));
        totalQuizzes = quizDataOfLO.length;
        correctQuizzes = randomInteger(0, totalQuizzes);
        scenario.set(
            aliasScoreByStudyPlanItemNameAndLearnerName(studyPlanItemScoreName, learnerName),
            `${correctQuizzes}/${totalQuizzes}`
        );
    }

    switch (scoredStudyPlanItemType) {
        case 'Assignment requires grading':
            await studentSubmitsAssignmentOnLearnerApp(learner, studyPlanItemScoreName);
            await learner.instruction(
                `Back to home screen after submit assignment success`,
                async function (learner) {
                    await studentBackToTopicListAfterSubmitAssignment(learner, topicName);
                }
            );
            break;
        case 'TaskAssignment has Correctness':
            await studentSubmitsTaskAssignmentWithCorrectnessOnLearnerApp(
                scenario,
                learner,
                studyPlanItemScoreName,
                learnerName
            );
            await learner.instruction(
                `Back to home screen after submit assignment success`,
                async function (learner) {
                    await studentBackToTopicListAfterSubmitAssignment(learner, topicName);
                }
            );
            break;
        case 'LO with quizzes':
            await studentSeesAndDoesLOQuestionsWithCorrectQuizzes(
                learner,
                correctQuizzes,
                totalQuizzes,
                quizDataOfLO
            );
            await learner.instruction(
                `Back to home screen after submit lo success`,
                async function (learner) {
                    await studentBackToTopicListAfterSubmitLO(learner, topicName);
                }
            );
            break;
        case 'Exam LO':
            await studentStartExamLOFromInstructionScreen(learner);
            await studentDoesExamLOOnLearnerApp(
                scenario,
                learner,
                studyPlanItemScoreName,
                correctQuizzes,
                totalQuizzes
            );
            await learner.instruction(
                `Back to home screen after submit exam lo success`,
                async function (learner) {
                    await studentBackToTopicListAfterSubmitExamLO(learner);
                }
            );
            break;
        case 'Flashcard':
            await learner.instruction(`Student go to the flashcard practice screen`, async () => {
                await studentGoesToFlashcardPracticePage(learner);
            });
            await studentDoesFlashCardWithCorrectQuizzes(
                scenario,
                learner,
                correctQuizzes,
                totalQuizzes,
                quizDataOfFlashcard
            );
            await learner.instruction(
                `Back to home screen after submit assignment success`,
                async function (learner) {
                    await studentBackToTopicListAfterSubmitLO(learner, topicName);
                }
            );
            break;
        default:
            break;
    }
};

export const studentDoesStudyPlanItemNoScore = async (
    learner: LearnerInterface,
    topicName: string,
    studyPlanNoScoreName: string,
    nonScoredStudyPlanItemType: LearningTypeWithoutScore
) => {
    await learner.instruction(` Scroll to top`, async function (learner) {
        const listKey = new ByValueKey(SyllabusLearnerKeys.lo_list_screen(topicName));
        await learner.flutterDriver!.scroll(listKey, 0.0, 4000, 1000, 50); // Scroll to the top
    });

    await learner.instruction(
        `Go to study plan item detail ${studyPlanNoScoreName}`,
        async function (learner) {
            await studentGoToStudyPlanItemDetail(learner, topicName, studyPlanNoScoreName);
        }
    );

    switch (nonScoredStudyPlanItemType) {
        case 'Assignment non requires grading':
            await studentSubmitsAssignmentOnLearnerApp(learner, studyPlanNoScoreName);
            break;
        case 'TaskAssignment no Correctness':
            await studentSubmitAssignment(learner);
            break;
        case 'non LO with quizzes':
            await studentDoesLoNoQuizOnLearnerApp(learner, studyPlanNoScoreName);
            break;
        default:
            break;
    }
    await learner.instruction(
        `Back to home screen after submit assignment success`,
        async function (learner) {
            await studentBackToTopicListAfterSubmitAssignment(learner, topicName);
        }
    );
};

export const studentSubmitsAssignmentOnLearnerApp = async (
    learner: LearnerInterface,
    assignmentName: string
) => {
    await learner.instruction(`Submit assignment ${assignmentName}`, async function (learner) {
        await studentSubmitAssignment(learner);
    });
};

export const studentSubmitsTaskAssignmentWithCorrectnessOnLearnerApp = async (
    scenario: ScenarioContext,
    learner: LearnerInterface,
    taskAssignmentName: string,
    learnerName: string
) => {
    await learner.instruction(`student fills correctness`, async function (this: LearnerInterface) {
        await studentFillsCorrectnessOnTaskAssignment(this);
        await studentGetsCorrectnessOnTaskAssignment(
            this,
            scenario,
            taskAssignmentName,
            learnerName
        );
    });

    await learner.instruction(
        `Student submit assignment ${taskAssignmentName}`,
        async function (learner) {
            await studentSubmitAssignment(learner);
        }
    );
};

export const studentDoesExamLOOnLearnerApp = async (
    scenario: ScenarioContext,
    learner: LearnerInterface,
    examLoName: string,
    correctQuizzes: number,
    totalQuizzes: number
) => {
    await learner.instruction(
        `Student do ${examLoName} with ${correctQuizzes} correct answer`,
        async (learner) => {
            await studentSeesAndDoesExamLOQuestionsWithCorrectQuizzes(
                learner,
                scenario,
                correctQuizzes,
                totalQuizzes,
                totalQuizzes,
                QuizType.QUIZ_TYPE_MCQ
            );
        }
    );
    await learner.instruction(`Student submits ${examLoName}`, async (learner) => {
        await studentSubmitExamLO(learner, scenario, examLoName);
    });
};

export const studentDoesLoNoQuizOnLearnerApp = async (
    learner: LearnerInterface,
    loName: string
) => {
    await learner.instruction(`Finish learning LO ${loName}`, async function (learner) {
        await studentLearnsStudyGuide(learner);
    });
};
