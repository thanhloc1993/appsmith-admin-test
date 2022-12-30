import { Then, When } from '@cucumber/cucumber';

import {
    IMasterWorld,
    LearnerInterface,
    StudyPlanItemStatus,
    TeacherInterface,
} from '@supports/app-types';

import {
    aliasCourseName,
    aliasSelectedStudyPlanItemsByTopicId,
    aliasUnselectedStudyPlanItemsByTopicId,
    aliasStudyPlanItemEditMode,
} from './alias-keys/syllabus';
import { studentBackNavigate } from './create-course-studyplan-definitions';
import {
    studentDoesNotSeeEmptyTopicInCourseDetail,
    studentDoesNotSeeStudyPlanItemInCourseDetail,
    studentDoesNotSeeStudyPlanItemInTodoTab,
    studentGoesToTopicDetail,
    studentSeeStudyPlanItemInCourseDetail,
    studentSeeStudyPlanItemInTodoTab,
} from './syllabus-archive-study-plan-item-definitions';
import { teacherScrollIntoTopic } from './syllabus-expand-collapse-topic-definitions';
import {
    EditMenuAction,
    teacherSeeStudyPlanItemWithStatus,
} from './syllabus-study-plan-common-definitions';
import { editStudyPlanItems } from './syllabus-unarchive-study-plan-item-steps';
import { SelectedStudyPlanItem } from './syllabus-update-study-plan-item-time-definitions';
import { SelectMode } from './syllabus-update-study-plan-item-time-steps';
import {
    searchingStudyPlanItemNamesByTopicId,
    studentGoesBackToHomeScreenFromCourseDetails,
    studentGoesToHomeTab,
    studentGoesToTabInToDoScreen,
    studentGoesToTodosScreen,
    studentGoToCourseDetail,
    studentRefreshHomeScreen,
} from './syllabus-utils';

When(
    `teacher archives study plan items of {string} topics`,
    async function (mode: SelectMode): Promise<void> {
        await editStudyPlanItems(this, mode, 'archive', true);
    }
);

Then(
    `teacher sees the items of the topics with {string} status`,
    async function (status: StudyPlanItemStatus) {
        await teacherSeeStudyPlanItemsWithStatus(this, status);
    }
);

export async function teacherSeeStudyPlanItemsWithStatus(
    masterWorld: IMasterWorld,
    status: StudyPlanItemStatus
): Promise<void> {
    const context = masterWorld.scenario;
    const teacher = masterWorld.teacher;
    const selectedStudyPlanItemsByTopicId = context.get<SelectedStudyPlanItem[]>(
        aliasSelectedStudyPlanItemsByTopicId
    );

    for (const selectedStudyPlanItems of selectedStudyPlanItemsByTopicId) {
        const topicId = selectedStudyPlanItems.topicId;
        const topicName = 'Topic ' + topicId;
        await teacher.instruction(
            `teacher scrolls into topic ${topicName}`,
            async function (this: TeacherInterface) {
                await teacherScrollIntoTopic(this, topicName);
            }
        );

        const studyPlanItemNames = searchingStudyPlanItemNamesByTopicId(
            selectedStudyPlanItemsByTopicId,
            topicId.toString()
        );
        for (const studyPlanItemName of studyPlanItemNames) {
            await teacher.instruction(
                `teacher sees ${status} study plan item ${studyPlanItemName}`,
                async function (this: TeacherInterface) {
                    await teacherSeeStudyPlanItemWithStatus(this, studyPlanItemName, status);
                }
            );
        }
    }
}

Then(
    `student does not see archived items of the topics in todo and book screen`,
    async function () {
        await studentDoesNotSeeArchivedStudyPlanItem(this);
    }
);
export async function studentDoesNotSeeArchivedStudyPlanItem(
    masterWorld: IMasterWorld
): Promise<void> {
    const context = masterWorld.scenario;
    const learner = masterWorld.learner;
    const courseName = context.get<string>(aliasCourseName);
    const editMode = context.get<EditMenuAction>(aliasStudyPlanItemEditMode);
    if (editMode != 'archive' && editMode != 'unarchive') return;
    const archivedStudyPlanItemsByTopicId = context.get<SelectedStudyPlanItem[]>(
        editMode == 'archive'
            ? aliasSelectedStudyPlanItemsByTopicId
            : aliasUnselectedStudyPlanItemsByTopicId
    );
    const activeStudyPlanItemsByTopicId = context.get<SelectedStudyPlanItem[]>(
        editMode == 'archive'
            ? aliasUnselectedStudyPlanItemsByTopicId
            : aliasSelectedStudyPlanItemsByTopicId
    );

    await learner.instruction(
        `student go to active tab in todo screen`,
        async function (this: LearnerInterface) {
            await studentGoesToTodosScreen(this);
            await studentGoesToTabInToDoScreen(this, context, 'active');
        }
    );

    for (const archivedStudyPlanItem of archivedStudyPlanItemsByTopicId) {
        for (const studyPlanItemName of archivedStudyPlanItem.studyPlanItemNames) {
            await learner.instruction(
                `student does not see archived ${studyPlanItemName} in todo tab`,
                async function (this: LearnerInterface) {
                    await studentDoesNotSeeStudyPlanItemInTodoTab(
                        this,
                        studyPlanItemName,
                        'active'
                    );
                }
            );
        }
    }

    await learner.instruction(
        `student goes to course detail screen`,
        async (learner: LearnerInterface) => {
            await studentGoesToHomeTab(learner);
            await studentRefreshHomeScreen(learner);
            await studentGoToCourseDetail(learner, courseName);
        }
    );

    for (const archivedStudyPlanItem of archivedStudyPlanItemsByTopicId) {
        const topicId = archivedStudyPlanItem.topicId;
        const topicName = 'Topic ' + topicId;
        const archivedStudyPlanItemsInTopic = searchingStudyPlanItemNamesByTopicId(
            archivedStudyPlanItemsByTopicId,
            topicId
        );
        const activeStudyPlanItemsInTopic = searchingStudyPlanItemNamesByTopicId(
            activeStudyPlanItemsByTopicId,
            topicId
        );
        if (activeStudyPlanItemsInTopic.length == 0 || activeStudyPlanItemsInTopic == undefined) {
            await learner.instruction(
                `student does not see topic ${topicName}`,
                async function (this: LearnerInterface) {
                    await studentDoesNotSeeEmptyTopicInCourseDetail(this, topicName);
                }
            );
        } else {
            await studentGoesToTopicDetail(learner, topicName);
            for (const studyPlanItemName of archivedStudyPlanItemsInTopic) {
                await learner.instruction(
                    `student doesn't see study plan item ${studyPlanItemName} in topic detail screen`,
                    async function (this: LearnerInterface) {
                        await studentDoesNotSeeStudyPlanItemInCourseDetail(
                            this,
                            topicName,
                            studyPlanItemName
                        );
                    }
                );
            }
            await studentBackNavigate(learner);
        }
    }
}
Then(
    `student sees active items of the topics in todo and book screen`,
    { timeout: 100000 },
    async function () {
        await studentSeeActiveStudyPlanItem(this);
    }
);
export async function studentSeeActiveStudyPlanItem(masterWorld: IMasterWorld): Promise<void> {
    const context = masterWorld.scenario;
    const learner = masterWorld.learner;
    const courseName = context.get<string>(aliasCourseName);
    const editMode = context.get<EditMenuAction>(aliasStudyPlanItemEditMode);
    if (editMode != 'archive' && editMode != 'unarchive') return;
    const activeStudyPlanItemsByTopicId = context.get<SelectedStudyPlanItem[]>(
        editMode == 'archive'
            ? aliasUnselectedStudyPlanItemsByTopicId
            : aliasSelectedStudyPlanItemsByTopicId
    );

    await learner.instruction(
        `student go to active tab in todo screen`,
        async function (this: LearnerInterface) {
            await studentGoesBackToHomeScreenFromCourseDetails(this);
            await studentGoesToTodosScreen(this);
            await studentGoesToTabInToDoScreen(this, context, 'active');
        }
    );

    for (const studyPlanItems of activeStudyPlanItemsByTopicId) {
        for (const studyPlanItemName of studyPlanItems.studyPlanItemNames) {
            await learner.instruction(
                `student sees active study plan item ${studyPlanItemName} in todo tab`,
                async function (this: LearnerInterface) {
                    await studentSeeStudyPlanItemInTodoTab(this, studyPlanItemName, 'active');
                }
            );
        }
    }

    await learner.instruction(
        `student goes to course detail screen`,
        async function (this: LearnerInterface) {
            await studentGoesToHomeTab(this);
            await studentGoToCourseDetail(this, courseName);
        }
    );

    for (const activeStudyPlanItem of activeStudyPlanItemsByTopicId) {
        const topicId = activeStudyPlanItem.topicId;
        const topicName = 'Topic ' + topicId;
        const studyPlanItems = searchingStudyPlanItemNamesByTopicId(
            activeStudyPlanItemsByTopicId,
            topicId
        );
        await studentGoesToTopicDetail(learner, topicName);
        for (const studyPlanItemName of studyPlanItems) {
            await learner.instruction(
                `student sees active study plan item ${studyPlanItemName} in topic detail screen`,
                async function (this: LearnerInterface) {
                    await studentSeeStudyPlanItemInCourseDetail(this, topicName, studyPlanItemName);
                }
            );
        }
        await studentBackNavigate(learner);
    }
}
