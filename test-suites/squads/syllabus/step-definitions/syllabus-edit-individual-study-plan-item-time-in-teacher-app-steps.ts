import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Then, When } from '@cucumber/cucumber';

import { CMSInterface, LOType, TeacherInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import {
    aliasCourseId,
    aliasCourseName,
    aliasLOName,
    aliasStudyPlanItemEndDate,
    aliasStudyPlanItemName,
    aliasStudyPlanItemStartDate,
    aliasStudyPlanItemType,
    aliasStudyPlanName,
    aliasTimeline,
    aliasTopicName,
} from './alias-keys/syllabus';
import { schoolAdminGotoCourseDetail } from './create-course-studyplan-definitions';
import { convertStudyPlanItemTimeToUI } from './edit-study-plan-item-by-past-and-tab-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import {
    aRandomStudyPlanItem,
    studentSeesEditedDueDateOfLOOnTodoScreen,
} from './syllabus-edit-individual-study-plan-item-time-in-teacher-app-definitions';
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

export type TeacherEditedDate = 'start date' | 'due date';
export type UserActionAbility = 'does' | 'does not';

When(
    'teacher edits {string} of a study plan item to the {string}',
    async function (teacherEditedDate: TeacherEditedDate, timeline: Timeline): Promise<void> {
        const context = this.scenario;
        const courseName = context.get<string>(aliasCourseName);
        const courseId = context.get<string>(aliasCourseId);
        let studyPlanItemName: string;

        studyPlanItemName = context.get<string>(aliasStudyPlanItemName);
        if (studyPlanItemName == null || studyPlanItemName == undefined) {
            studyPlanItemName = await aRandomStudyPlanItem(context);
        }

        const studentId = await this.learner.getUserId();
        context.set(aliasTimeline, timeline);
        const studyPlanTabKey = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanTab);

        try {
            await this.teacher.flutterDriver?.waitFor(studyPlanTabKey);
        } catch {
            await this.teacher.instruction(
                `teacher goes to course ${courseName} people tab from home page`,
                async function (this: TeacherInterface) {
                    await teacherGoesToStudyPlanDetails(this, courseId, studentId);
                }
            );
        }

        await this.teacher.instruction(
            `teacher select the to edit ${studyPlanItemName} time`,
            async function (teacher: TeacherInterface) {
                await teacherSeeStudyPlanItem(teacher, studyPlanItemName);
                await teacherSelectsTheStudyPlanItem(teacher, studyPlanItemName);
                await teacherChoosesEditStudyPlanItem(teacher, 'edit time');
                await teacherEditsStudyPlanItemTime(teacher, context, timeline, teacherEditedDate);
            }
        );
    }
);

Then(
    `teacher sees the edited time of a study plan item on Teacher App`,
    async function (): Promise<void> {
        const context = this.scenario;
        const studyPlanItemName = context.get<string>(aliasStudyPlanItemName);

        await this.teacher.instruction(
            `teacher sees the edited time of study plan item on Teacher App`,
            async function (teacher: TeacherInterface) {
                await teacherSeesStudyPlanItemWithEditedTime(teacher, context, studyPlanItemName);
            }
        );
    }
);

Then(
    `student sees a study plan item at {string} in Todos screen on Learner App`,
    { timeout: 30000 },
    async function (todoTab: LearnerToDoTab): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;
        const studyPlanItemName = context.get<string>(aliasStudyPlanItemName);
        const studyPlanItemKey = new ByValueKey(
            SyllabusLearnerKeys.study_plan_item(studyPlanItemName)
        );

        await studentGoesToTodosScreen(learner);
        await studentGoesToTabInToDoScreen(learner, context, todoTab);

        try {
            await learner.flutterDriver?.waitFor(studyPlanItemKey);
        } catch (error) {
            await studentSeeStudyPlanItemInToDoTab(learner, studyPlanItemName, todoTab);
        }
    }
);

Then(
    `student sees the edited due date of a study plan item in Todos screen on Learner App`,
    { timeout: 40000 },
    async function (): Promise<void> {
        const context = this.scenario;
        const studyPlanItemName = context.get<string>(aliasStudyPlanItemName);
        const endDate = convertStudyPlanItemTimeToUI(context.get<Date>(aliasStudyPlanItemEndDate));

        await this.learner.instruction(
            `Student sees the study plan item ${studyPlanItemName} with edited due time ${endDate}`,
            async (learner) => {
                const studyPlanItemType = context.get<LOType>(aliasStudyPlanItemType);
                let studyPlanItemDueDateKey: ByValueKey;

                if (studyPlanItemType == 'assignment') {
                    studyPlanItemDueDateKey = new ByValueKey(
                        SyllabusLearnerKeys.assignment_due_date(
                            studyPlanItemName,
                            endDate.split(',')[0]
                        )
                    );
                    await studentSeesEditedDueDateOfLOOnTodoScreen(
                        studyPlanItemDueDateKey,
                        learner
                    );
                } else {
                    studyPlanItemDueDateKey = new ByValueKey(
                        SyllabusLearnerKeys.scheduled_lo_due_date(
                            studyPlanItemName,
                            endDate.split(',')[0]
                        )
                    );
                    await studentSeesEditedDueDateOfLOOnTodoScreen(
                        studyPlanItemDueDateKey,
                        learner
                    );
                }
            }
        );
    }
);

Then(
    `student {string} see a study plan item at {string} in Todos screen on Learner App`,
    { timeout: 30000 },
    async function (result: UserActionAbility, todoTab: LearnerToDoTab): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;
        const studyPlanItemName = context.get<string>(aliasStudyPlanItemName);
        const studyPlanItemKey = new ByValueKey(
            SyllabusLearnerKeys.study_plan_item(studyPlanItemName)
        );

        await studentGoesToTodosScreen(learner);
        await studentGoesToTabInToDoScreen(learner, context, todoTab);

        if (result == 'does') {
            try {
                await learner.flutterDriver?.waitFor(studyPlanItemKey);
            } catch (error) {
                await studentSeeStudyPlanItemInToDoTab(learner, studyPlanItemName, todoTab);
            }
        } else {
            await learner.flutterDriver?.waitForAbsent(studyPlanItemKey);
        }
    }
);

Then(
    `school admin sees the edited time of a study plan item on CMS`,
    async function (): Promise<void> {
        const context = this.scenario;
        const studyPlanName = context.get<string>(aliasStudyPlanName);

        const editedStartDate = context.get<Date>(aliasStudyPlanItemStartDate);
        const editedEndDate = context.get<Date>(aliasStudyPlanItemEndDate);
        const studyPlanItemName = context.get<string>(aliasStudyPlanItemName);
        const courseId = context.get<string>(aliasCourseId);

        await this.cms.instruction(`User go to the course: ${courseId} detail`, async () => {
            await schoolAdminGotoCourseDetail(this.cms, courseId);
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
            `school admin sees the edited time of ${studyPlanItemName} editedStartDate ${editedStartDate} - editedEndDate ${editedEndDate}`,
            async function (cms: CMSInterface) {
                await schoolAdminsSeesStudyPlanItemWithEditedEndDateOnCMS(
                    cms,
                    studyPlanItemName,
                    editedStartDate,
                    editedEndDate
                );
            }
        );
    }
);

Then(
    `student sees a study plan item in course on Learner App`,
    { timeout: 50000 },
    async function (): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;
        const courseName = context.get<string>(aliasCourseName);
        const topicName = context.get<string>(aliasTopicName);
        const loName = context.get<string>(aliasLOName);

        await studentGoesToHomeTab(learner);

        await studentRefreshHomeScreen(learner);

        await studentGoToCourseDetail(learner, courseName);

        await studentGoToTopicDetail(learner, topicName);

        await this.learner.instruction(
            `Student sees the study plan item ${loName}`,
            async (learner) => {
                await studentSeeStudyPlanItem(learner, topicName, loName);
            }
        );
    }
);
