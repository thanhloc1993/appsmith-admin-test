import { CMSInterface } from '@supports/app-types';
import { ActionOptions } from '@supports/types/cms-types';

import {
    questionGroupListItemByText,
    questionInQuestionGroupItemByText,
} from './cms-selectors/syllabus';

export const schoolAdminDeletesQuestionGroup = async (
    cms: CMSInterface,
    questionGroupName: string
) => {
    const wrapperSelector = questionGroupListItemByText(questionGroupName);

    await cms.selectActionButton(ActionOptions.DELETE, {
        target: 'actionPanelTrigger',
        wrapperSelector,
    });
    await cms.confirmDialogAction();
};

export const schoolAdminDeletesQuestion = async (cms: CMSInterface, questionName: string) => {
    await cms.selectActionButton(ActionOptions.DELETE, {
        target: 'actionPanelTrigger',
        wrapperSelector: questionInQuestionGroupItemByText(questionName),
    });
    await cms.confirmDialogAction();
};

export async function schoolAdminDoesNotSeeQuestionGroup(
    cms: CMSInterface,
    questionGroupName: string
): Promise<void> {
    await cms.page?.waitForSelector(questionGroupListItemByText(questionGroupName), {
        state: 'detached',
    });
}

export async function schoolAdminDoesNotSeeQuestionInQuestionGroup(
    cms: CMSInterface,
    questionName: string
): Promise<void> {
    await cms.page?.waitForSelector(questionInQuestionGroupItemByText(questionName), {
        state: 'detached',
    });
}
