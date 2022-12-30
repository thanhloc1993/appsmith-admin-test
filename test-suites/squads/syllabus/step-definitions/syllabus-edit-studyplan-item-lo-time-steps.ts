import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Then, When } from '@cucumber/cucumber';

import { CMSInterface, TeacherInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import {
    aliasCourseId,
    aliasCourseName,
    aliasCurrentLearnerToDoTab,
    aliasLOName,
    aliasStudyPlanItemEndDate,
    aliasStudyPlanItemStartDate,
    aliasStudyPlanName,
    aliasTopicName,
} from './alias-keys/syllabus';
import { convertStudyPlanItemTimeToUI } from './edit-study-plan-item-by-past-and-tab-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import {
    schoolAdminsSeesStudyPlanItemWithEditedEndDateOnCMS,
    studentDoesQuizAndCompletesLO,
    teacherEditsStudyPlanItemTime,
    teacherSeesStudyPlanItemWithEditedTime,
    teacherSelectsTheStudyPlanItem,
} from './syllabus-edit-studyplan-item-lo-time-definitions';
import {
    schoolAdminGoesToStudentStudyPlanDetailPage,
    schoolAdminSelectStudyPlanTabByType,
    teacherChoosesEditStudyPlanItem,
} from './syllabus-study-plan-common-definitions';
import {
    studentSeeStudyPlanItem,
    teacherGoesToStudyPlanDetails,
    teacherSeeStudyPlanItem,
} from './syllabus-study-plan-upsert-definitions';
import {
    getLearnerToDoKeys,
    LearnerToDoTab,
    studentGoesToHomeTab,
    studentGoesToTabInToDoScreen,
    studentGoesToTodosScreen,
    studentGoToCourseDetail,
    studentGoToStudyPlanItemDetailsFromTodo,
    studentRefreshHomeScreen,
    studentSeeStudyPlanItemInToDoTab,
} from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';
import { schoolAdminChooseTabInCourseDetail } from 'test-suites/common/step-definitions/course-definitions';

export type Timeline = 'past' | 'future';

When(
    `teacher edits time of LO to the {string}`,
    async function (timeline: Timeline): Promise<void> {
        const context = this.scenario;
        const courseName = context.get<string>(aliasCourseName);
        const courseId = context.get<string>(aliasCourseId);
        const loName = context.get<string>(aliasLOName);
        const studentId = await this.learner.getUserId();

        await this.teacher.instruction(
            `teacher goes to course ${courseName} student tab from home page`,
            async function (this: TeacherInterface) {
                await teacherGoesToStudyPlanDetails(this, courseId, studentId);
            }
        );

        await this.teacher.instruction(
            `teacher select the LO to edit study plan item time`,
            async function (teacher: TeacherInterface) {
                await teacherSeeStudyPlanItem(teacher, loName);
                await teacherSelectsTheStudyPlanItem(teacher, loName);
                await teacherChoosesEditStudyPlanItem(teacher, 'edit time');
                await teacherEditsStudyPlanItemTime(teacher, context, timeline);
            }
        );
    }
);

When(`student has done LO quiz`, async function (): Promise<void> {
    const context = this.scenario;
    const learner = this.learner;
    const learnerTodoTab = context.get<LearnerToDoTab>(aliasCurrentLearnerToDoTab);
    const loName = context.get<string>(aliasLOName);

    await studentGoesToTodosScreen(learner);

    await studentGoesToTabInToDoScreen(learner, context, learnerTodoTab);

    await studentGoToStudyPlanItemDetailsFromTodo(learner, loName, learnerTodoTab);

    await studentDoesQuizAndCompletesLO(learner, context);
});

Then(`teacher sees the edited time of LO on Teacher App`, async function (): Promise<void> {
    const context = this.scenario;
    const loName = context.get<string>(aliasLOName);

    await this.teacher.instruction(
        `teacher sees the edited time of LO on Teacher App`,
        async function (teacher: TeacherInterface) {
            await teacherSeesStudyPlanItemWithEditedTime(teacher, context, loName);
        }
    );
});

Then(`school admin sees the edited time of LO on CMS`, async function (): Promise<void> {
    const context = this.scenario;
    const studyPlanName = context.get<string>(aliasStudyPlanName);

    await this.cms.instruction(`School admin reloads page`, async (cms) => {
        await cms.page!.reload();
    });

    await this.cms.instruction(
        `School admin chooses student study plan v2: ${studyPlanName}`,
        async (cms) => {
            await schoolAdminChooseTabInCourseDetail(cms, 'studyPlan');
        }
    );

    await this.cms.instruction(
        `School admin selects individual studyPlan: ${studyPlanName}`,
        async (cms) => {
            await schoolAdminSelectStudyPlanTabByType(cms, 'student');
            const studentProfile = context.get<UserProfileEntity>(
                learnerProfileAliasWithAccountRoleSuffix('student')
            );
            const studyPlanName = context.get<string>(aliasStudyPlanName);
            await schoolAdminGoesToStudentStudyPlanDetailPage(cms, {
                name: studentProfile.name,
                studyPlanName: studyPlanName,
            });
        }
    );

    await this.cms.instruction(
        `school admin sees the edited time`,
        async function (cms: CMSInterface) {
            const editedStartDate = context.get<Date>(aliasStudyPlanItemStartDate);
            const editedEndDate = context.get<Date>(aliasStudyPlanItemEndDate);
            const studyPlanItemName = context.get<string>(aliasLOName);

            await schoolAdminsSeesStudyPlanItemWithEditedEndDateOnCMS(
                cms,
                studyPlanItemName,
                editedStartDate,
                editedEndDate
            );
        }
    );
});

Then(
    `student sees the LO at {string} in Todos screen on Learner App`,
    async function (todoTab: LearnerToDoTab): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;
        const loName = context.get<string>(aliasLOName);

        await studentGoesToTodosScreen(learner);

        await studentGoesToTabInToDoScreen(learner, context, todoTab);

        await studentSeeStudyPlanItemInToDoTab(learner, loName, todoTab);
    }
);

Then(
    `student sees the edited due date of LO in Todos screen on Learner App`,
    async function (): Promise<void> {
        const context = this.scenario;
        const loName = context.get<string>(aliasLOName);
        const endDate = convertStudyPlanItemTimeToUI(context.get<Date>(aliasStudyPlanItemEndDate));
        const toDoTabPage = context.get<LearnerToDoTab>(aliasCurrentLearnerToDoTab);

        await this.learner.instruction(
            `Student sees the LO ${loName} with edited due time`,
            async (learner) => {
                const loDueDateKey = new ByValueKey(
                    SyllabusLearnerKeys.scheduled_lo_due_date(loName, endDate.split(',')[0])
                );

                try {
                    await learner.flutterDriver!.waitFor(loDueDateKey);
                } catch (e) {
                    const { pageKey } = getLearnerToDoKeys(toDoTabPage);
                    const listKey = new ByValueKey(pageKey);

                    await learner.flutterDriver!.waitFor(listKey);
                    await learner.flutterDriver!.scrollUntilVisible(
                        listKey,
                        loDueDateKey,
                        0.0,
                        0.0,
                        -350,
                        20000
                    );
                }
            }
        );
    }
);

Then(`student still sees the LO in course on Learner app`, async function (): Promise<void> {
    const context = this.scenario;
    const learner = this.learner;
    const courseName = context.get<string>(aliasCourseName);
    const topicName = context.get<string>(aliasTopicName);
    const loName = context.get<string>(aliasLOName);

    await studentGoesToHomeTab(learner);

    await studentRefreshHomeScreen(learner);

    await studentGoToCourseDetail(learner, courseName);

    await studentGoToTopicDetail(learner, topicName);

    await studentSeeStudyPlanItem(learner, topicName, loName);
});
