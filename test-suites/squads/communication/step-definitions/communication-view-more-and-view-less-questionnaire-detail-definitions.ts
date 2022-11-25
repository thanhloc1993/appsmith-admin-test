import { CMSInterface } from '@supports/app-types';

import * as CommunicationSelectors from './cms-selectors/communication';
import { ToggleViewButtonType } from './communication-common-questionnaire-definitions';

export async function clickToggleViewButtonInQuestionSectionDetail(
    cms: CMSInterface,
    toggleViewButton: ToggleViewButtonType
) {
    await cms.instruction(
        `Click button ${toggleViewButton} in questionnaire detail section`,
        async function () {
            const toggleButton = await cms.page!.waitForSelector(
                CommunicationSelectors.getToggleViewButtonSelectorByToggleViewButtonType(
                    toggleViewButton
                )
            );
            if (!toggleButton) {
                throw Error(`Cannot find ${toggleButton} in questionnaire detail section`);
            }

            await toggleButton.click();
        }
    );
}
