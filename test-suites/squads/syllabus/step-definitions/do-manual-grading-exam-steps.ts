import { getRandomQuestionTypeForExamLO } from '@syllabus-utils/question-utils';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { DataTable, Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import {
    aliasContentBookLOQuestionQuantity,
    aliasCourseId,
    aliasExamLOGradeToPass,
    aliasExamLOManualGrading,
    aliasExamLOName,
    aliasRandomExam,
    aliasRandomLearningObjectives,
    aliasRandomQuizzes,
} from './alias-keys/syllabus';
import { LearningObjective } from './cms-models/content';
import { ExamLOSettings } from './cms-models/exam-lo-settings';
import { teacherGoToCourseStudentDetail } from './create-course-studyplan-definitions';
import {
    mergeAndSetRandomStudyPlanItemsContext,
    schoolAdminCreateDefaultSimpleBookAndSetContext,
    schoolAdminCreateRandomExamLOsAndSetContext,
    schoolAdminCreateRandomQuestionsAndSetContext,
} from './create-data-book-content-utils';
import { teacherSeeStudyPlanItemOnPopupWithStatus } from './do-manual-grading-exam-definitions';
import { teacherSeesLearningRecordPopupAtIndex } from './syllabus-do-exam-lo-definitions';
import {
    formatNumberString,
    teacherSeesLatestQuizResultOnStudyPlanTable,
} from './syllabus-do-lo-quiz-definitions';
import { teacherSeeStudyPlanItemWithStatus } from './syllabus-study-plan-common-definitions';
import { ByValueKey } from 'flutter-driver-x';

Given(
    'school admin has created a exam lo with settings',
    async function (this: IMasterWorld, examLOSettings: DataTable): Promise<void> {
        const examLOSettingsTable: ExamLOSettings[] = examLOSettings.hashes();
        const scenario = this.scenario;
        const cms = this.cms;

        if (examLOSettingsTable.length == 0) {
            return;
        }

        const examLOList: LearningObjective[] = [];
        await schoolAdminCreateDefaultSimpleBookAndSetContext(cms, scenario);

        for (const examLOSetting of examLOSettingsTable) {
            const manualGrading = examLOSetting.manualGrading == 'on';
            const gradeToPass =
                examLOSetting.gradeToPass == 'null' ? undefined : Number(examLOSetting.gradeToPass);
            const totalQuestions = Number(examLOSetting.totalQuestions);

            const examLO = await schoolAdminCreateRandomExamLOsAndSetContext(cms, scenario, {
                manualGrading: manualGrading,
                gradeToPass: gradeToPass,
            });

            const { quizRaws } = await schoolAdminCreateRandomQuestionsAndSetContext(
                cms,
                scenario,
                {
                    quantity: totalQuestions,
                    parentId: examLO[0].learningMaterialId,
                    type: getRandomQuestionTypeForExamLO(),
                }
            );

            scenario.set(aliasRandomQuizzes, quizRaws);
            scenario.set(aliasExamLOManualGrading, manualGrading);
            scenario.set(aliasExamLOGradeToPass, gradeToPass);
            scenario.set(aliasContentBookLOQuestionQuantity, totalQuestions);
            scenario.set(aliasRandomExam, examLO);

            examLOList.push(examLO[0]);
        }
        mergeAndSetRandomStudyPlanItemsContext(scenario, examLOList);

        scenario.set(aliasRandomLearningObjectives, examLOList);
    }
);

When(
    `teacher goes to student study plan page`,
    { timeout: 200 * 1000 },
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const courseId = context.get(aliasCourseId);

        const profile = await this.learner.getProfile();
        await this.teacher.instruction(
            `teacher goes to course student detail on url = ${courseId}/studentStudyPlan?student_id=${profile.id}`,
            async () => {
                await teacherGoToCourseStudentDetail(this.teacher, courseId, profile.id);
            }
        );
    }
);

Then(
    `teacher sees the total graded point per total point of exam lo`,
    { timeout: 200 * 1000 },
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const totalQuestion = context.get<number>(aliasContentBookLOQuestionQuantity);
        const loName = context.get<string>(aliasExamLOName) ?? '';

        await this.teacher.instruction(
            `teacher sees the total graded point per total point of ${loName}`,
            async () => {
                await teacherSeesLatestQuizResultOnStudyPlanTable(
                    this.teacher,
                    loName,
                    formatNumberString(`0/${totalQuestion}`)
                );
            }
        );
    }
);

Then(
    'teacher sees the latest status of exam lo is completed',
    { timeout: 200 * 1000 },
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const loName = context.get<string>(aliasExamLOName) ?? '';

        await this.teacher.instruction(
            `teacher sees the latest status of exam lo is completed`,
            async () => {
                await teacherSeeStudyPlanItemWithStatus(this.teacher, loName, 'completed');
            }
        );
    }
);

Then(
    `teacher also see the score and status of latest attempt when click on the arrow icon`,
    { timeout: 200 * 1000 },
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const totalQuestion = context.get<number>(aliasContentBookLOQuestionQuantity);
        const loName = context.get<string>(aliasExamLOName) ?? '';

        await this.teacher.instruction(
            `teacher opens "${loName}"'s history records`,
            async (teacher) => {
                await teacher.flutterDriver?.waitFor(
                    new ByValueKey(
                        SyllabusTeacherKeys.studentStudyPlanItemGradeDropdownButton(loName)
                    ),
                    20000
                );
                await teacher.flutterDriver?.tap(
                    new ByValueKey(
                        SyllabusTeacherKeys.studentStudyPlanItemGradeDropdownButton(loName)
                    )
                );
            }
        );

        await this.teacher.instruction(
            `teacher sees the total graded point per total point in popup`,
            async () => {
                await teacherSeesLearningRecordPopupAtIndex(this.teacher, 0, totalQuestion, 0);
            }
        );
        await this.teacher.instruction(`teacher sees status is complete in popup`, async () => {
            await teacherSeeStudyPlanItemOnPopupWithStatus(this.teacher, 'completed'.toUpperCase());
        });
    }
);
