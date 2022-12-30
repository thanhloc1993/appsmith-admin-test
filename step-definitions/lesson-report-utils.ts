import { CMSInterface } from '@supports/app-types';

export type LessonReportButtonsStatus = 'enabled' | 'disabled';

export async function selectValueForAllAutocompleteFields(params: {
    cms: CMSInterface;
    autocompleteInputSelector: string;
    chooseItemAt: number;
}) {
    const { cms, autocompleteInputSelector, chooseItemAt } = params;
    const page = cms.page!;

    const allAutocompleteInputs = await page.$$(autocompleteInputSelector);

    for (const input of allAutocompleteInputs) {
        await input.click();
        await cms.chooseOptionInAutoCompleteBoxByOrder(chooseItemAt);
    }
}

export async function fillAllInputOfLessonReport(params: {
    cms: CMSInterface;
    inputSelector: string;
    fillContent: string | number;
}) {
    const { cms, inputSelector, fillContent } = params;
    const page = cms.page!;

    const allInputNeedFill = await page.$$(inputSelector);

    for (const input of allInputNeedFill) {
        await input.fill(`${fillContent}`);
    }
}
