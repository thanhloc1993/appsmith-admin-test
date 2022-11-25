import { dialogMessage, snackbarContent } from '@legacy-step-definitions/cms-selectors/cms-keys';

import { CMSInterface } from '@supports/app-types';

import { MessageTypes } from '../types/bdd';

export async function schoolAdminSeesMultipleSnackbar(
    cms: CMSInterface,
    typeMessage: MessageTypes,
    content: string
) {
    let colorType = '';
    //TODO: Need to refactor check color from test-suites/squads/user-management/features/import-users/import-students-successfully.feature
    switch (typeMessage) {
        case 'info':
            colorType = 'rgb(33, 150, 243)';
            break;
        case 'successful':
            colorType = 'rgb(76, 175, 80)';
            break;
        case 'error':
            colorType = 'rgb(244, 67, 54)';
            break;
        default:
            return;
    }

    await cms.instruction(
        `School admin sees ${typeMessage} contained ${content}`,
        async function () {
            const message = await cms.waitForSelectorHasText(dialogMessage, content);
            const color = await message?.evaluate((el) => {
                return window.getComputedStyle(el).getPropertyValue('background-color');
            });
            weExpect(color).toBe(colorType);
        }
    );
}

export async function schoolAdminScreenShotMultipleSnackbar(
    cms: CMSInterface,
    typeMessage: MessageTypes,
    content: string
) {
    await cms.instruction(`School admin screenshot multiple snackbar`, async function () {
        const messages = cms.page!.locator(`${snackbarContent}`);
        const count = await messages.count();
        for (let index = 0; index < count; index++) {
            const message = messages.nth(index);
            const screenshot = await message.screenshot();

            await cms.attach(screenshot, 'image/png');
        }
    });

    await schoolAdminSeesMultipleSnackbar(cms, typeMessage, content);
}

export async function checkMessageOnCMSByText(
    cms: CMSInterface,
    message: string,
    numberOfMessages = 1
) {
    await cms.instruction(`school admin sees the message ${message} `, async function () {
        const elements = cms.page!.locator(`text=${message}`);

        const count = await elements.count();

        for (let i = 0; i < count; i++) {
            const textContent = await elements.nth(i).textContent();
            weExpect(textContent).toBe(message);
        }

        weExpect(count).toBe(numberOfMessages);
    });
}
