import { Given, Then } from '@cucumber/cucumber';

Given('school admin has imported location master data', async function () {
    await this.cms.importLocationData();
});

Then('school admin sees message {string}', async function (msg: string) {
    await this.cms.instruction(`User sees msg: ${msg}`, async () => {
        await this.cms.assertNotification(msg);
    });
});
