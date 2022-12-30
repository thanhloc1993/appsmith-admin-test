import { DecideActions, LOPlace } from '@legacy-step-definitions/types/common';

import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld, LOType } from '@supports/app-types';
import { ActionOptions } from '@supports/types/cms-types';

import {
    aliasAssignmentNameSelected,
    aliasRandomStudyPlanItems,
    aliasRandomTopics,
} from './alias-keys/syllabus';
import { loAndAssignmentByName } from './cms-selectors/cms-keys';
import {
    schoolAdminClickLOsItemOption,
    schoolAdminClickOptionOnHeader,
} from './syllabus-delete-learning-objective-definitions';
import {
    getLOTypeValue,
    getStudyPlanItemNamesByTopicIdAndType,
    schoolAdminNotSeeLOsItemInBook,
    schoolAdminSeeLOsItemInBook,
} from './syllabus-utils';
import { schoolAdminClickLOByName } from './syllabus-view-task-assignment-definitions';
import {
    StudyPlanItem,
    Topic,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

Given(
    'school admin selects an assignment type {string} in {string} to delete',
    async function (this: IMasterWorld, loType: LOType, place: LOPlace) {
        const studyPlanItemList = this.scenario.get<StudyPlanItem[]>(aliasRandomStudyPlanItems);
        const topic = this.scenario.get<Topic[]>(aliasRandomTopics)[0];
        const { loTypeNumber } = await getLOTypeValue({ loType });
        const { assignmentNames } = getStudyPlanItemNamesByTopicIdAndType(
            topic.id,
            studyPlanItemList,
            loTypeNumber
        );

        this.scenario.set(aliasAssignmentNameSelected, assignmentNames[0]);

        await this.cms.instruction(
            `school admin will select ${loType} ${assignmentNames[0]} to delete`,
            async () => {
                await this.cms.page?.waitForSelector(loAndAssignmentByName(assignmentNames[0]));
            }
        );

        if (place === 'book') {
            await this.cms.instruction('school admin select delete option', async () => {
                await schoolAdminClickLOsItemOption(
                    this.cms,
                    assignmentNames[0],
                    ActionOptions.DELETE
                );
            });

            return;
        }

        await this.cms.instruction(
            `school admin go to ${assignmentNames[0]} detail page`,
            async () => {
                await schoolAdminClickLOByName(this.cms, assignmentNames[0]);
                await this.cms.waitingForLoadingIcon();
            }
        );

        await this.cms.instruction('school admin select delete option', async () => {
            await schoolAdminClickOptionOnHeader(this.cms, ActionOptions.DELETE);
        });
    }
);

When(
    'school admin {string} the deleting assignment process',
    async function (this: IMasterWorld, action: DecideActions) {
        const name = this.scenario.get(aliasAssignmentNameSelected);

        await this.cms.instruction(
            `school admin ${action} the deleting ${name} process`,
            async () => {
                if (action === 'cancels') return await this.cms.cancelDialogAction();

                await this.cms.confirmDialogAction();
            }
        );
    }
);

Then(
    'school admin does not see the deleted assignment in book',
    async function (this: IMasterWorld) {
        await this.cms.waitingForLoadingIcon();
        await this.cms.waitForSkeletonLoading();

        const name = this.scenario.get(aliasAssignmentNameSelected);

        await this.cms.instruction(`School admin does not see ${name}`, async () => {
            await schoolAdminNotSeeLOsItemInBook(this.cms, name);
        });
    }
);

Then(
    'school admin still sees the assignment in {string}',
    async function (this: IMasterWorld, place: 'book' | 'detail') {
        const name = this.scenario.get(aliasAssignmentNameSelected);

        const instruction = `school admin still sees ${name} in ${place}`;

        if (place === 'book') {
            await this.cms.instruction(instruction, async () => {
                await schoolAdminSeeLOsItemInBook(this.cms, name);
            });

            return;
        }

        await this.cms.instruction(instruction, async () => {
            await this.cms.assertThePageTitle(name);
        });
    }
);
