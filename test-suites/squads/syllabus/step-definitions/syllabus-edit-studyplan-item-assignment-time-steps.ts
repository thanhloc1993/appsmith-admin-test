import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { CMSInterface, TeacherInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import {
    aliasAssignmentName,
    aliasCourseId,
    aliasCourseName,
    aliasCSVStudyPlanItemEndDate,
    aliasCurrentLearnerToDoTab,
    aliasStudyPlanItemEndDate,
    aliasStudyPlanItemStartDate,
    aliasStudyPlanName,
    aliasTimeline,
    aliasTopicName,
} from './alias-keys/syllabus';
import { convertStudyPlanItemTimeToUI } from './edit-study-plan-item-by-past-and-tab-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import {
    studentGoesBackToTodoPageFromAssignmentScreen,
    studentSeeChangedTopDueDateOnAssignmentScreen,
    studentSubmitsAssignment,
} from './syllabus-edit-studyplan-item-assignment-time-definitions';
import {
    schoolAdminsSeesStudyPlanItemWithEditedEndDateOnCMS,
    teacherEditsStudyPlanItemTime,
    teacherSeesStudyPlanItemWithEditedTime,
    teacherSelectsTheStudyPlanItem,
} from './syllabus-edit-studyplan-item-lo-time-definitions';
import { Timeline } from './syllabus-edit-studyplan-item-lo-time-steps';
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
    studentRefreshHomeScreen,
    studentSeeStudyPlanItemInToDoTab,
} from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';
import { schoolAdminChooseTabInCourseDetail } from 'test-suites/common/step-definitions/course-definitions';

Then(
    `student sees an assignment at {string} in Todos screen on Learner App`,
    async function (todoTab: LearnerToDoTab): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;
        const assignmentName = context.get<string>(aliasAssignmentName);

        await studentGoesToTodosScreen(learner);

        await studentGoesToTabInToDoScreen(learner, context, todoTab);

        await studentSeeStudyPlanItemInToDoTab(learner, assignmentName, todoTab);
    }
);

When(
    `teacher edits time of assignment to the {string}`,
    async function (timeline: Timeline): Promise<void> {
        const context = this.scenario;
        const courseName = context.get<string>(aliasCourseName);
        const courseId = context.get<string>(aliasCourseId);
        const assignmentName = context.get<string>(aliasAssignmentName);
        const studentId = await this.learner.getUserId();

        context.set(aliasTimeline, timeline);

        await this.teacher.instruction(
            `teacher goes to course ${courseName} people tab from home page`,
            async function (this: TeacherInterface) {
                await teacherGoesToStudyPlanDetails(this, courseId, studentId);
            }
        );

        await this.teacher.instruction(
            `teacher select the assignment to edit study plan item time`,
            async function (teacher: TeacherInterface) {
                await teacherSeeStudyPlanItem(teacher, assignmentName);
                await teacherSelectsTheStudyPlanItem(teacher, assignmentName);
                await teacherChoosesEditStudyPlanItem(teacher, 'edit time');
                await teacherEditsStudyPlanItemTime(teacher, context, timeline);
            }
        );
    }
);

Then(`teacher sees the edited time of assignment on Teacher App`, async function (): Promise<void> {
    const context = this.scenario;
    const assignmentName = context.get<string>(aliasAssignmentName);

    await this.teacher.instruction(
        `teacher sees the edited time of assignment on Teacher App`,
        async function (teacher: TeacherInterface) {
            await teacherSeesStudyPlanItemWithEditedTime(teacher, context, assignmentName);
        }
    );
});

Then(
    `student sees the assignment at {string} in Todos screen on Learner App`,
    { timeout: 100000 },
    async function (todoTab: LearnerToDoTab): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;
        const assignmentName = context.get<string>(aliasAssignmentName);
        const assignmentItemKey = new ByValueKey(
            SyllabusLearnerKeys.study_plan_item(assignmentName)
        );

        await studentGoesToTodosScreen(learner);

        await studentGoesToTabInToDoScreen(learner, context, todoTab);
        try {
            await learner.flutterDriver?.waitFor(assignmentItemKey);
        } catch (error) {
            await studentSeeStudyPlanItemInToDoTab(learner, assignmentName, todoTab);
        }
    }
);

Then(
    `student sees the edited due date of assignment in Todos screen on Learner App`,
    { timeout: 40000 },
    async function (): Promise<void> {
        const context = this.scenario;
        const assignmentName = context.get<string>(aliasAssignmentName);
        const endDate = convertStudyPlanItemTimeToUI(context.get<Date>(aliasStudyPlanItemEndDate));
        const toDoTabPage = context.get<LearnerToDoTab>(aliasCurrentLearnerToDoTab);
        await this.learner.instruction(
            `Student sees the assignment ${assignmentName} with edited due time`,
            async (learner) => {
                const assignmentDueDateKey = new ByValueKey(
                    SyllabusLearnerKeys.assignment_due_date(assignmentName, endDate.split(',')[0])
                );

                const { pageKey } = getLearnerToDoKeys(toDoTabPage);
                const listKey = new ByValueKey(pageKey);

                try {
                    await learner.flutterDriver?.waitFor(assignmentDueDateKey);
                } catch (error) {
                    await learner.flutterDriver!.waitFor(listKey);
                    await learner.flutterDriver!.scrollUntilVisible(
                        listKey,
                        assignmentDueDateKey,
                        0.0,
                        0.0,
                        -350,
                        20000
                    );
                }

                await learner.flutterDriver!.tap(assignmentDueDateKey);
            }
        );
    }
);
Then(
    `student sees the edited due date of assignment in assignment detail screen on Learner App`,
    async function (): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;
        const endDate = context.get<string>(aliasCSVStudyPlanItemEndDate);
        const assignmentName = context.get<string>(aliasAssignmentName);
        const timeline = context.get<string>(aliasTimeline);

        await studentSeeChangedTopDueDateOnAssignmentScreen(learner, endDate, timeline);
        await studentGoesBackToTodoPageFromAssignmentScreen(learner, assignmentName);
    }
);
Then(
    `student still sees the assignment in course on Learner app`,
    { timeout: 100000 },
    async function (): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;
        const courseName = context.get<string>(aliasCourseName);
        const topicName = context.get<string>(aliasTopicName);
        const assignmentName = context.get<string>(aliasAssignmentName);

        await studentGoesToHomeTab(learner);

        await studentRefreshHomeScreen(learner);

        await studentGoToCourseDetail(learner, courseName);

        await studentGoToTopicDetail(learner, topicName);

        await studentSeeStudyPlanItem(learner, topicName, assignmentName);
    }
);
Given(`student has submitted assignment`, async function (): Promise<void> {
    const context = this.scenario;
    const learner = this.learner;
    await studentSubmitsAssignment(learner, context);
});

Then(`school admin sees the edited time of assignment on CMS`, async function (): Promise<void> {
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
            const studyPlanItemName = context.get<string>(aliasAssignmentName);
            await schoolAdminsSeesStudyPlanItemWithEditedEndDateOnCMS(
                cms,
                studyPlanItemName,
                editedStartDate,
                editedEndDate
            );
        }
    );
});
