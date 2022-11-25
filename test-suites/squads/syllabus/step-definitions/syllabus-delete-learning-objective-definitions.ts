import { CMSInterface, LOType } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { ActionOptions } from '@supports/types/cms-types';

import { aliasLOName } from './alias-keys/syllabus';
import { loAndAssignmentByName } from './cms-selectors/cms-keys';
import { wrapperHeaderRoot } from './cms-selectors/cms-keys';
import { getLOTypeValue } from './syllabus-utils';
import {
    Assignment,
    LearningObjective,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

export const schoolAdminClickOptionOnHeader = async (cms: CMSInterface, action: ActionOptions) => {
    await cms.selectActionButton(action, {
        target: 'actionPanelTrigger',
        wrapperSelector: wrapperHeaderRoot,
    });
};

export const schoolAdminClickLOsItemOption = async (
    cms: CMSInterface,
    loName: string,
    action: ActionOptions
) => {
    await cms.selectActionButton(action, {
        target: 'actionPanelTrigger',
        wrapperSelector: loAndAssignmentByName(loName),
    });
};

export async function deleteLOByNameInBookDetail(cms: CMSInterface, loName: string) {
    const elementSelector = loAndAssignmentByName(loName);

    await cms.page!.waitForSelector(elementSelector);

    await schoolAdminClickLOsItemOption(cms, loName, ActionOptions.DELETE);

    await cms.confirmDialogAction();
}

export async function schoolAdminDeletesLO(
    cms: CMSInterface,
    context: ScenarioContext,
    loType: LOType,
    data: { topicId: string; loList: LearningObjective[] }
) {
    const { topicId, loList } = data;
    const { loTypeNumber } = await getLOTypeValue({ loType });

    for (const lo of loList) {
        if (lo.topicId === topicId && lo.type === loTypeNumber) {
            await cms.instruction(`Delete ${lo.info.name}`, async function (this: CMSInterface) {
                await deleteLOByNameInBookDetail(this, lo.info.name);
                context.set(aliasLOName, lo.info.name);
            });
        }
    }
}

export async function schoolAdminDeletesAssignment(
    cms: CMSInterface,
    context: ScenarioContext,
    loType: LOType,
    data: { topicId: string; assignmentList: Assignment[] }
) {
    const { topicId, assignmentList } = data;
    const { loTypeNumber } = await getLOTypeValue({ loType });

    for (const assignment of assignmentList) {
        if (assignment.content?.topicId === topicId && assignment.assignmentType === loTypeNumber) {
            await cms.instruction(`Delete ${assignment.name}`, async function (this: CMSInterface) {
                await deleteLOByNameInBookDetail(this, assignment.name);
                context.set(aliasLOName, assignment.name);
            });
        }
    }
}
