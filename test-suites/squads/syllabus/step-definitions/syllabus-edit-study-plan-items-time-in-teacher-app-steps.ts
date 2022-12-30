import { asyncForEach } from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Then, When } from '@cucumber/cucumber';

import { CMSInterface, LearnerInterface, TeacherInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import {
    aliasCourseId,
    aliasCourseName,
    aliasSelectedStudyPlanItemNames,
    aliasSelectedStudyPlanItems,
    aliasStudyPlanItemEndDate,
    aliasStudyPlanItemName,
    aliasStudyPlanItemStartDate,
    aliasStudyPlanName,
    aliasTimeline,
    aliasTopicName,
} from './alias-keys/syllabus';
import { convertStudyPlanItemTimeToUI } from './edit-study-plan-item-by-past-and-tab-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import {
    aRandomStudyPlanItem,
    studentSeesEditedDueDateOfLOOnTodoScreen,
} from './syllabus-edit-individual-study-plan-item-time-in-teacher-app-definitions';
import {
    TeacherEditedDate,
    UserActionAbility,
} from './syllabus-edit-individual-study-plan-item-time-in-teacher-app-steps';
import { teacherSelectsAllStudyPlanItems } from './syllabus-edit-study-plan-items-time-in-teacher-app-definitions';
import {
    schoolAdminsSeesStudyPlanItemWithEditedEndDateOnCMS,
    teacherEditsStudyPlanItemTime,
    teacherSeesStudyPlanItemWithEditedTime,
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
    selectedStudyPlanItemsByTopicIdWithSelectMode,
    teacherSelectsStudyPlanItems,
} from './syllabus-update-study-plan-item-time-definitions';
import { SelectMode } from './syllabus-update-study-plan-item-time-steps';
import {
    getDataByStudyPlanItemListWithTopicId,
    getTopicId,
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
import { StudyPlanItem } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

When(
    'teacher edits {string} of {string} study plan items to the {string}',
    async function (
        teacherEditedDate: TeacherEditedDate,
        mode: SelectMode,
        timeline: Timeline
    ): Promise<void> {
        const context = this.scenario;
        const courseName = context.get<string>(aliasCourseName);
        const courseId = context.get<string>(aliasCourseId);

        const studentId = await this.learner.getUserId();
        context.set(aliasTimeline, timeline);
        const studyPlanTabKey = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanTab);

        try {
            await this.teacher.flutterDriver?.waitFor(studyPlanTabKey);
        } catch {
            await this.teacher.instruction(
                `teacher goes to course ${courseName} people tab from home page`,
                async function (teacher: TeacherInterface) {
                    await teacherGoesToStudyPlanDetails(teacher, courseId, studentId);
                }
            );
        }

        await this.teacher.instruction(
            `teacher select the study plan items`,
            async function (teacher: TeacherInterface) {
                let studyPlanItemName: string;
                studyPlanItemName = context.get<string>(aliasStudyPlanItemName);
                if (studyPlanItemName == null || studyPlanItemName == undefined) {
                    studyPlanItemName = await aRandomStudyPlanItem(context);
                }
                await teacherSeeStudyPlanItem(teacher, studyPlanItemName);

                if (mode == 'all') {
                    const { studyPlanItemNames, studyPlanItems } =
                        selectedStudyPlanItemsByTopicIdWithSelectMode(context, 'all');
                    context.set(aliasSelectedStudyPlanItemNames, studyPlanItemNames);
                    context.set(aliasSelectedStudyPlanItems, studyPlanItems);
                    await teacherSelectsAllStudyPlanItems(context, teacher);
                } else {
                    const selectedStudyPlanItemNames = context.get<string[]>(
                        aliasSelectedStudyPlanItemNames
                    );
                    const selectedStudyPlanItems = context.get<StudyPlanItem[]>(
                        aliasSelectedStudyPlanItems
                    );
                    let studyPlanItemNamesList: string[];
                    let studyPlanItemsList: StudyPlanItem[];

                    if (selectedStudyPlanItemNames && selectedStudyPlanItems) {
                        studyPlanItemNamesList = selectedStudyPlanItemNames;
                        studyPlanItemsList = selectedStudyPlanItems;
                    } else {
                        const { studyPlanItemNames, studyPlanItems } =
                            selectedStudyPlanItemsByTopicIdWithSelectMode(context, 'some');
                        studyPlanItemNamesList = studyPlanItemNames;
                        studyPlanItemsList = studyPlanItems;
                        context.set(aliasSelectedStudyPlanItemNames, studyPlanItemNamesList);
                        context.set(aliasSelectedStudyPlanItems, studyPlanItemsList);
                    }
                    await teacherSelectsStudyPlanItems(teacher, studyPlanItemNamesList);
                }
            }
        );

        await this.teacher.instruction(
            `teacher chooses to edit time`,
            async function (teacher: TeacherInterface) {
                await teacherChoosesEditStudyPlanItem(teacher, 'edit time');
            }
        );

        await this.teacher.instruction(
            `teacher edits ${teacherEditedDate}`,
            async function (teacher: TeacherInterface) {
                await teacherEditsStudyPlanItemTime(teacher, context, timeline, teacherEditedDate);
            }
        );
    }
);

Then(
    `teacher sees the edited time of the study plan items on Teacher App`,
    async function (): Promise<void> {
        const context = this.scenario;
        await this.teacher.instruction(
            `teacher sees the edited time of study plan item on Teacher App`,
            async function (teacher: TeacherInterface) {
                const selectedStudyPlanItemNames =
                    context.get<string[]>(aliasSelectedStudyPlanItemNames) || [];
                for (const itemName of selectedStudyPlanItemNames!) {
                    await teacherSeesStudyPlanItemWithEditedTime(teacher, context, itemName);
                }
            }
        );
    }
);

Then(
    `student sees the study plan items at {string} in Todos screen on Learner App`,
    { timeout: 30000 },
    async function (todoTab: LearnerToDoTab): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;

        await studentGoesToTodosScreen(learner);
        await studentGoesToTabInToDoScreen(learner, context, todoTab);

        const selectedStudyPlanItemNames = context.get<string[]>(aliasSelectedStudyPlanItemNames);

        if (!selectedStudyPlanItemNames) {
            throw new Error(`selectedStudyPlanItemNames not found`);
        }
        for (const itemName of selectedStudyPlanItemNames) {
            const studyPlanItemKey = new ByValueKey(SyllabusLearnerKeys.study_plan_item(itemName));
            await this.learner.instruction(
                `Student sees the edited time of ${itemName} on Todos`,
                async function (learner: LearnerInterface) {
                    try {
                        await learner.flutterDriver?.waitFor(studyPlanItemKey);
                    } catch (error) {
                        await studentSeeStudyPlanItemInToDoTab(learner, itemName, todoTab);
                    }
                }
            );
        }
    }
);

Then(
    `student sees the edited due date of the study plan items in Todos screen on Learner App`,
    { timeout: 40000 },
    async function (): Promise<void> {
        const context = this.scenario;
        const endDate = convertStudyPlanItemTimeToUI(context.get<Date>(aliasStudyPlanItemEndDate));

        const topicId = getTopicId(context);
        const studyPlanItemList = context.get<StudyPlanItem[]>(aliasSelectedStudyPlanItems);

        const { loListByTopicId, assignmentListByTopicId } = getDataByStudyPlanItemListWithTopicId(
            topicId,
            studyPlanItemList
        );

        await asyncForEach(loListByTopicId, async (lo) => {
            await this.learner.instruction(
                `Student sees the study plan item ${lo.info.name} with edited due time ${endDate}`,
                async (learner) => {
                    const studyPlanItemDueDateKey = new ByValueKey(
                        SyllabusLearnerKeys.scheduled_lo_due_date(
                            lo.info.name,
                            endDate.split(',')[0]
                        )
                    );
                    await studentSeesEditedDueDateOfLOOnTodoScreen(
                        studyPlanItemDueDateKey,
                        learner
                    );
                }
            );
        });

        await asyncForEach(assignmentListByTopicId, async (assignment) => {
            await this.learner.instruction(
                `Student sees the study plan item ${assignment.name} with edited due time ${endDate}`,
                async (learner) => {
                    const studyPlanItemDueDateKey = new ByValueKey(
                        SyllabusLearnerKeys.assignment_due_date(
                            assignment.name,
                            endDate.split(',')[0]
                        )
                    );
                    await studentSeesEditedDueDateOfLOOnTodoScreen(
                        studyPlanItemDueDateKey,
                        learner
                    );
                }
            );
        });
    }
);

Then(
    `student {string} see the study plan items at {string} in Todos screen on Learner App`,
    { timeout: 30000 },
    async function (result: UserActionAbility, todoTab: LearnerToDoTab): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;

        await studentGoesToTodosScreen(learner);
        await studentGoesToTabInToDoScreen(learner, context, todoTab);

        const selectedStudyPlanItemNames = context.get<string[]>(aliasSelectedStudyPlanItemNames);
        if (!selectedStudyPlanItemNames) {
            throw new Error(`selectedStudyPlanItemNames not found`);
        }

        if (result === 'does') {
            for (const item of selectedStudyPlanItemNames) {
                const studyPlanItemKey = new ByValueKey(SyllabusLearnerKeys.study_plan_item(item));
                await this.learner.instruction(
                    `Student sees the edited time of ${item} on Todos`,
                    async function (learner: LearnerInterface) {
                        try {
                            await learner.flutterDriver?.waitFor(studyPlanItemKey);
                        } catch (error) {
                            await studentSeeStudyPlanItemInToDoTab(learner, item, todoTab);
                        }
                    }
                );
            }
            return;
        }
        for (const studyPlanItem of selectedStudyPlanItemNames) {
            const itemKey = new ByValueKey(SyllabusLearnerKeys.study_plan_item(studyPlanItem));
            await learner.flutterDriver?.waitForAbsent(itemKey);
        }
    }
);

Then(
    `school admin sees the edited time of the study plan items on CMS`,
    async function (): Promise<void> {
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

        const selectedStudyPlanItemNames = context.get<string[]>(aliasSelectedStudyPlanItemNames);

        const editedStartDate = context.get<Date>(aliasStudyPlanItemStartDate);
        const editedEndDate = context.get<Date>(aliasStudyPlanItemEndDate);
        for (const studyPlanItemName of selectedStudyPlanItemNames!) {
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
    }
);

Then(
    `student sees the study plan items in course on Learner App`,
    { timeout: 50000 },
    async function (): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;
        const courseName = context.get<string>(aliasCourseName);
        const topicName = context.get<string>(aliasTopicName);

        const selectedStudyPlanItemNames =
            context.get<string[]>(aliasSelectedStudyPlanItemNames) || [];

        await studentGoesToHomeTab(learner);

        await studentRefreshHomeScreen(learner);

        await studentGoToCourseDetail(learner, courseName);

        await studentGoToTopicDetail(learner, topicName);

        for (const itemName of selectedStudyPlanItemNames!) {
            await this.learner.instruction(
                `Student sees the study plan item ${itemName}`,
                async (learner) => {
                    await studentSeeStudyPlanItem(learner, topicName, itemName);
                }
            );
        }
    }
);
