import { getRandomElement, getRandomElements } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld, TeacherInterface } from '@supports/app-types';
import { formatDate } from '@supports/utils/time/time';

import {
    aliasRandomAssignments,
    aliasRandomLearningObjectives,
    aliasSelectedStudyPlanItemsByTopicId,
    aliasTopicNames,
    aliasUnselectedStudyPlanItemsByTopicId,
} from './alias-keys/syllabus';
import { teacherSelectAllStudyPlanItemsInTopic } from './syllabus-archive-study-plan-item-definitions';
import { teacherScrollIntoTopic } from './syllabus-expand-collapse-topic-definitions';
import { teacherChoosesEditStudyPlanItem } from './syllabus-study-plan-common-definitions';
import {
    teacherPickDateTime,
    teacherClearsExistingDates,
    teacherScrollToMenuButton,
    teacherSeesSaveChangesButtonIsDisabled,
    teacherSelectsStudyPlanItems,
    SelectedStudyPlanItem,
} from './syllabus-update-study-plan-item-time-definitions';
import {
    convertToStudyPlanItemNamesByTopicId,
    searchingStudyPlanItemNamesByTopicId,
} from './syllabus-utils';
import {
    Assignment,
    LearningObjective,
    StudyPlanItem,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

export type SelectMode = 'one' | 'some' | 'all';

Given(`teacher selects {string} study plan items`, async function (mode: SelectMode) {
    await selectStudyPlanItems(this, mode);
});

export async function selectStudyPlanItemsByTopic(
    masterWorld: IMasterWorld,
    mode: SelectMode
): Promise<void> {
    const context = masterWorld.scenario;
    const teacher = masterWorld.teacher;
    let topicNames = context.get<string[]>(aliasTopicNames);
    const loList = context.get<LearningObjective[]>(
        aliasRandomLearningObjectives
    ) as StudyPlanItem[];
    const assignmentList = context.get<Assignment[]>(aliasRandomAssignments) as StudyPlanItem[];
    const studyPlanItems: StudyPlanItem[] = loList.concat(assignmentList);
    const unselectedStudyPlanItemsByTopicId = convertToStudyPlanItemNamesByTopicId(studyPlanItems);
    const selectedStudyPlanItemsByTopicId: SelectedStudyPlanItem[] = [];

    if (mode == 'one') {
        topicNames = [getRandomElement(topicNames)];
    }
    if (mode == 'some') {
        topicNames = getRandomElements(topicNames);
    }

    for (const topicName of topicNames) {
        await teacher.instruction(
            `teacher scrolls into topic ${topicName}`,
            async function (this: TeacherInterface) {
                await teacherScrollIntoTopic(this, topicName);
            }
        );
        await teacher.instruction(
            `teacher selects all items in topic ${topicName}`,
            async function (this: TeacherInterface) {
                const topicId = topicName.split(' ')[1];
                await teacherSelectAllStudyPlanItemsInTopic(this, topicId);
                selectedStudyPlanItemsByTopicId.push({
                    topicId: topicId,
                    studyPlanItemNames: searchingStudyPlanItemNamesByTopicId(
                        unselectedStudyPlanItemsByTopicId,
                        topicId
                    ),
                });
                unselectedStudyPlanItemsByTopicId.forEach((item, index) => {
                    if (item.topicId == topicId) {
                        unselectedStudyPlanItemsByTopicId.splice(index, 1);
                    }
                });
            }
        );
    }

    context.set(aliasSelectedStudyPlanItemsByTopicId, selectedStudyPlanItemsByTopicId);
    context.set(aliasUnselectedStudyPlanItemsByTopicId, unselectedStudyPlanItemsByTopicId);
}
export async function selectStudyPlanItems(
    masterWorld: IMasterWorld,
    mode: SelectMode
): Promise<void> {
    const context = masterWorld.scenario;
    const teacher = masterWorld.teacher;
    const loList = context.get<LearningObjective[]>(
        aliasRandomLearningObjectives
    ) as StudyPlanItem[];
    const assignmentList = context.get<Assignment[]>(aliasRandomAssignments) as StudyPlanItem[];
    const studyPlanItems: StudyPlanItem[] = loList.concat(assignmentList);
    let selectedStudyPlanItems: StudyPlanItem[] = [...studyPlanItems];
    if (mode == 'one') {
        selectedStudyPlanItems = [getRandomElement(selectedStudyPlanItems)];
    }
    if (mode == 'some') {
        selectedStudyPlanItems = getRandomElements(selectedStudyPlanItems);
    }

    const unselectedStudyPlanItems = studyPlanItems.filter((item) => {
        return selectedStudyPlanItems.indexOf(item) == -1;
    });

    const selectedStudyPlanItemsByTopicId =
        convertToStudyPlanItemNamesByTopicId(selectedStudyPlanItems);

    for (const selectedStudyPlanItem of selectedStudyPlanItemsByTopicId) {
        const topicId = selectedStudyPlanItem.topicId;
        await teacher.instruction(
            `teacher scrolls into topic ${topicId}`,
            async function (this: TeacherInterface) {
                await teacherScrollIntoTopic(this, 'Topic ' + topicId);
            }
        );

        await teacher.instruction(
            `teacher selects items in topic ${topicId} randomly`,
            async function (this: TeacherInterface) {
                await teacherSelectsStudyPlanItems(
                    this,
                    searchingStudyPlanItemNamesByTopicId(
                        selectedStudyPlanItemsByTopicId,
                        topicId.toString()
                    )
                );
            }
        );
    }

    context.set(aliasSelectedStudyPlanItemsByTopicId, selectedStudyPlanItemsByTopicId);
    context.set(
        aliasUnselectedStudyPlanItemsByTopicId,
        convertToStudyPlanItemNamesByTopicId(unselectedStudyPlanItems)
    );
}
Given(`teacher selects updating study plan items time`, async function (): Promise<void> {
    await this.teacher.instruction(
        `teacher scrolls to menu button`,
        async function (this: TeacherInterface) {
            await teacherScrollToMenuButton(this);
        }
    );
    await this.teacher.instruction(
        `teacher chooses update time`,
        async function (this: TeacherInterface) {
            await teacherChoosesEditStudyPlanItem(this, 'edit time');
        }
    );
});

When(`teacher chooses start date later than end date`, async function (): Promise<void> {
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() + 12);
    await fillStudyPlanItemTime(this, startDate, endDate);
});

export async function fillStudyPlanItemTime(
    masterWorld: IMasterWorld,
    startDate: Date,
    endDate: Date
) {
    const teacher = masterWorld.teacher;
    await teacher.instruction(
        `teacher clears existing dates`,
        async function (this: TeacherInterface) {
            await teacherClearsExistingDates(this);
        }
    );

    await teacher.instruction(
        `teacher chooses start date at ${formatDate(startDate, 'YYYY/MM/DD')}`,
        async function (this: TeacherInterface) {
            await teacherPickDateTime(this, startDate, 'start date');
        }
    );

    await teacher.instruction(
        `teacher chooses end date at ${formatDate(endDate, 'YYYY/MM/DD')}`,
        async function (this: TeacherInterface) {
            await teacherPickDateTime(this, endDate, 'end date');
        }
    );
}

Then(`teacher sees save button is disabled`, async function (): Promise<void> {
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() + 12);

    await this.teacher.instruction(
        `teacher sees save changes button is disabled`,
        async function (this: TeacherInterface) {
            await teacherSeesSaveChangesButtonIsDisabled(this);
        }
    );
});
