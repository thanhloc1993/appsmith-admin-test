import { canMoveItem } from '@legacy-step-definitions/utils';

import { CMSInterface, LOType } from '@supports/app-types';
import { updateDisplayOrderLOsAndAssignmentEndpoint } from '@supports/services/grpc/constants';
import { MoveDirection } from '@supports/types/cms-types';

import {
    entityIcon,
    getTestId,
    loAndAssignmentItem,
    loAndAssignmentItemAtIndex,
    loAndAssignmentItemMoveDown,
    loAndAssignmentItemMoveUp,
    loAndAssignmentName,
    loAndAssignmentRoot,
    mappedLOTypeIconSelector,
    topicList,
} from './cms-selectors/cms-keys';

export const schoolAdminWaitingLOsForTopic = async (
    cms: CMSInterface,
    topicName: string,
    shouldEmpty?: boolean
) => {
    const wrapper = await cms.waitForSelectorHasText(getTestId(topicList), topicName);

    await wrapper?.waitForSelector(loAndAssignmentRoot);

    if (!shouldEmpty) {
        await wrapper?.waitForSelector(loAndAssignmentItem);
    }
};
export const schoolAdminMoveLOs = async (
    cms: CMSInterface,
    loName: string,
    direction: MoveDirection,
    index: number
) => {
    const moveBtn = direction === 'up' ? loAndAssignmentItemMoveUp : loAndAssignmentItemMoveDown;

    const selector = `${moveBtn}:right-of(li:nth-child(${index + 1}) ${loAndAssignmentName})`;

    await cms.waitForSelectorHasText(loAndAssignmentItemAtIndex(index + 1), loName);

    const control = await cms.page?.waitForSelector(selector);

    await control?.click();
};

export const schoolAdminWaitingForLOsOrderEndPoint = async (cms: CMSInterface) => {
    await cms.waitForGRPCResponse(updateDisplayOrderLOsAndAssignmentEndpoint, {
        // TODO: BE in refactoring progress then increase the timeout to avoid error
        timeout: 120000,
    });
};

export const getLOsWillBeMove = async (
    cms: CMSInterface,
    loType: LOType,
    direction: MoveDirection
) => {
    const list = await cms.page?.$$(`${loAndAssignmentRoot} ${loAndAssignmentItem}`);

    const mappedTestIdType = mappedLOTypeIconSelector[loType];

    if (!list) throw Error('LO list is not found');

    const size = list.length;
    let moveIndex: number | null = null;

    for (let i = 0; i < size; i++) {
        const current = list[i];
        const x = await current.$(`${entityIcon} svg`);
        const attributeValue = (await x?.getAttribute('data-testid')) || '';

        if (getTestId(attributeValue) === mappedTestIdType && canMoveItem(direction, i, size)) {
            moveIndex = i;
            break;
        }
    }

    if (moveIndex === null) throw new Error(`${loType} index is invalid to move`);

    const element = await list[moveIndex].waitForSelector(`${loAndAssignmentName} p`);
    const name = await element?.innerText();

    return { moveIndex, name };
};
