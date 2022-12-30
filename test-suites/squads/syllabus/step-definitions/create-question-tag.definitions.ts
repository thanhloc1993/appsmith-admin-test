import { asyncForEach } from '@syllabus-utils/common';

import { CMSInterface } from '@supports/app-types';

import {
    questionTagPreview,
    questionTagSelectBox,
} from 'test-suites/squads/syllabus/step-definitions/cms-selectors/syllabus';

export const schoolAdminSelectQuestionTag = async (cms: CMSInterface, numOfTags = 1) => {
    const { page } = cms;
    const questionTags: string[] = [];

    await asyncForEach(
        Array.from(new Array(numOfTags), (_, i) => ++i),
        async (index) => {
            await page!.click(questionTagSelectBox);

            const text = await page!
                .locator(`[role='listbox'] li:nth-child(${index})`)
                .textContent();

            if (text) {
                questionTags.push(text);
            }

            await cms.chooseOptionInAutoCompleteBoxByOrder(index);
        }
    );

    return questionTags;
};

export const schoolAdminSeeSelectedTagInPreviewPanel = async (cms: CMSInterface, tags: string) => {
    await cms.waitForSelectorHasText(questionTagPreview, tags);
};
