import { CMSInterface } from '@supports/app-types';
import { MoveDirection } from '@supports/types/cms-types';

import { moveDirectionMapped, tableBaseRow, typographyRoot } from './cms-selectors/cms-keys';
import { randomInteger } from 'test-suites/squads/syllabus/utils/common';

export const getCardWillBeMoveInFlashcard = async (
    cms: CMSInterface,
    direction: MoveDirection,
    totalCard: number
) => {
    let moveIndex = randomInteger(0, totalCard - 2);
    if (direction === 'up') moveIndex = randomInteger(1, totalCard - 1);

    // TODO: update selector
    const selector = `${tableBaseRow}:nth-child(${
        moveIndex + 1
    }) td:nth-child(2) p${typographyRoot}`;
    const termElement = await cms.page?.waitForSelector(selector);

    const name = await termElement?.textContent();

    if (!name) throw new Error('Card name is invalid');

    return { moveIndex, name };
};

export const schoolAdminMoveCardInFlashcard = async (
    cms: CMSInterface,
    cardIndex: number,
    direction: MoveDirection
) => {
    const moveActionSelector = moveDirectionMapped[direction];

    const rowSelectToMove = await cms.page?.waitForSelector(
        `${tableBaseRow}:nth-child(${cardIndex + 1})`
    );

    const moveActionElement = await rowSelectToMove?.waitForSelector(moveActionSelector);

    await moveActionElement?.click();
};
