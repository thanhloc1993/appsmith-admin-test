import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld, StudyPlanItemStatus, TeacherInterface } from '@supports/app-types';

import { aliasStudyPlanItemEditMode } from './alias-keys/syllabus';
import { teacherConfirmEditStudyPlanAction } from './syllabus-archive-study-plan-item-definitions';
import {
    studentDoesNotSeeArchivedStudyPlanItem,
    studentSeeActiveStudyPlanItem,
    teacherSeeStudyPlanItemsWithStatus,
} from './syllabus-archive-study-plan-item-steps';
import {
    EditMenuAction,
    teacherChoosesEditStudyPlanItem,
} from './syllabus-study-plan-common-definitions';
import { fillStudyPlanItemSchoolDate } from './syllabus-update-study-plan-item-school-date-steps';
import { teacherScrollToMenuButton } from './syllabus-update-study-plan-item-time-definitions';
import {
    fillStudyPlanItemTime,
    SelectMode,
    selectStudyPlanItems,
    selectStudyPlanItemsByTopic,
} from './syllabus-update-study-plan-item-time-steps';

Given(`teacher has archived all study plan items`, async function (): Promise<void> {
    await editStudyPlanItems(this, 'all', 'archive', true);
});

When(
    'teacher unarchives {string} study plan items',
    async function (mode: SelectMode): Promise<void> {
        await editStudyPlanItems(this, mode, 'unarchive');
    }
);

When(
    `teacher unarchives study plan items of {string} topics`,
    async function (mode: SelectMode): Promise<void> {
        await editStudyPlanItems(this, mode, 'unarchive', true);
    }
);

export async function editStudyPlanItems(
    masterWorld: IMasterWorld,
    mode: SelectMode,
    action: EditMenuAction,
    selectByTopic = false,
    data?: {
        schoolDate?: Date;
        startDate?: Date;
        endDate?: Date;
    }
): Promise<void> {
    const context = masterWorld.scenario;
    const teacher = masterWorld.teacher;

    const { schoolDate = new Date(), startDate = new Date(), endDate = new Date() } = data || {};

    if (selectByTopic) {
        await selectStudyPlanItemsByTopic(masterWorld, mode);
    } else {
        await selectStudyPlanItems(masterWorld, mode);
    }

    await teacher.instruction(
        `teacher scrolls to menu button`,
        async (teacher: TeacherInterface) => {
            await teacherScrollToMenuButton(teacher);
        }
    );

    await teacher.instruction(
        `teacher scrolls to menu button`,
        async (teacher: TeacherInterface) => {
            await teacherScrollToMenuButton(teacher);
        }
    );
    await teacher.instruction(
        `teacher chooses ${action} study plan items`,
        async (teacher: TeacherInterface) => {
            await teacherChoosesEditStudyPlanItem(teacher, action);
        }
    );

    if (action == 'edit time') {
        await fillStudyPlanItemTime(masterWorld, startDate, endDate);
    }
    if (action == 'edit school date') {
        await fillStudyPlanItemSchoolDate(masterWorld, schoolDate);
    }

    await teacher.instruction(
        `teacher confirm ${action} study plan items`,
        async (teacher: TeacherInterface) => {
            await teacherConfirmEditStudyPlanAction(teacher);
        }
    );

    context.set(aliasStudyPlanItemEditMode, action);
}

Then(
    'teacher sees the items with {string} status',
    async function (status: StudyPlanItemStatus): Promise<void> {
        await teacherSeeStudyPlanItemsWithStatus(this, status);
    }
);

Then(
    'student does not see archived items in todo and book screen',
    { timeout: 100000 },
    async function (): Promise<void> {
        await studentDoesNotSeeArchivedStudyPlanItem(this);
    }
);

Then(
    'student sees active items in todo and book screen',
    { timeout: 100000 },
    async function (): Promise<void> {
        await studentSeeActiveStudyPlanItem(this);
    }
);
