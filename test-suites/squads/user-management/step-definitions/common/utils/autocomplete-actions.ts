import { autoCompleteBaseListBox } from '@legacy-step-definitions/cms-selectors/cms-keys';

import { CMSInterface } from '@supports/app-types';

export async function chooseAutocompleteOptionByText(cms: CMSInterface, value: string) {
    const page = cms.page!;
    let optionListBox = page.locator(autoCompleteBaseListBox);
    const isVisible = await optionListBox.isVisible();

    if (!isVisible) optionListBox = page.getByRole('listbox');

    const optionList = optionListBox.getByRole('option');
    const optionItem = optionList.getByText(value).first();
    await optionItem.click();
}

export async function chooseAutocompleteOptionByExactText(cms: CMSInterface, value: string) {
    const page = cms.page!;
    let optionListBox = page.locator(autoCompleteBaseListBox);
    const isVisible = await optionListBox.isVisible();

    if (!isVisible) optionListBox = page.getByRole('listbox');

    const optionList = optionListBox.getByRole('option');
    const optionItem = optionList.getByText(value, { exact: true }).first();
    await optionItem.click();
}
