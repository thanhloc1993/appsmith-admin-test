import { ElementHandle } from 'playwright';

import { CMSInterface } from '@supports/app-types';

import {
    actionPanelTriggerButton,
    createChapterButton,
    createLoButton,
    createTopicButton,
    loAndAssignmentItemMoveDown,
    loAndAssignmentItemMoveUp,
} from './cms-selectors/cms-keys';

export const schoolAdminSeeDisabledElement = async (
    selector: ElementHandle<SVGElement | HTMLElement>,
    message: string
): Promise<void> => {
    const isDisabled = await selector.isDisabled();
    weExpect(isDisabled, message).toEqual(true);
};

export const schoolAdminSeeAllToggleButtonDisabled = async (cms: CMSInterface): Promise<void> => {
    const selector = await cms.page!.$$(actionPanelTriggerButton);

    if (!selector.length) throw Error(`Cannot find selector in ${actionPanelTriggerButton}`);

    for (const el of selector) {
        await schoolAdminSeeDisabledElement(el, 'Toggle button should be disabled');
    }
};

export const schoolAdminSeeAllAddButtonDisabled = async (cms: CMSInterface): Promise<void> => {
    const selectorLO = await cms.page!.waitForSelector(createLoButton);
    const selectorTopic = await cms.page!.waitForSelector(createTopicButton);
    const selectorChapter = await cms.page!.waitForSelector(createChapterButton);

    if (!selectorLO || !selectorTopic || !selectorChapter)
        throw Error(`Cannot find add new button selector`);

    await schoolAdminSeeDisabledElement(selectorLO, 'Add new LO button should be disabled');
    await schoolAdminSeeDisabledElement(selectorTopic, 'Add new Topic button should be disabled');
    await schoolAdminSeeDisabledElement(
        selectorChapter,
        'Add new Chapter button should be disabled'
    );
};

export const schoolAdminSeeAllMoveLOsDisabled = async (cms: CMSInterface): Promise<void> => {
    const selectorUp = await cms.page!.$$(loAndAssignmentItemMoveUp);
    const selectorDown = await cms.page!.$$(loAndAssignmentItemMoveDown);

    if (!selectorUp.length || !selectorDown.length)
        throw Error('Cannot find move up/down button selector');

    for (let i = 0; i < selectorUp.length - 1; i++) {
        await schoolAdminSeeDisabledElement(selectorDown[i], 'Move down button should be disabled');
        await schoolAdminSeeDisabledElement(selectorUp[i], 'Move up button should be disabled');
    }
};
