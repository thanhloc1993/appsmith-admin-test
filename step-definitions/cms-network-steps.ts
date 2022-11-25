import { When, Then } from '@cucumber/cucumber';

When('network connectivity down on CMS', async function (): Promise<void> {
    await this.cms.instruction('network connectivity down on CMS', async function (cms) {
        await cms.setOffline(true);
    });
});

Then(`school admin can not connect network`, async function () {
    await this.cms.instruction(
        'school admin try to refresh current page and see network is down',
        async function (cms) {
            const page = cms.page!;
            try {
                await page.reload();
            } catch (err) {
                if (!(err instanceof Error)) {
                    throw err;
                }
                weExpect(
                    err.message,
                    'site throw error page.reload: net::ERR_INTERNET_DISCONNECTED'
                ).toContain('page.reload: net::ERR_INTERNET_DISCONNECTED');
            }
        }
    );
});

When('network connectivity back to normal on CMS', async function () {
    await this.cms.instruction('network connectivity back to normal on CMS', async function (cms) {
        await cms.setOffline(false);
    });
});

Then('school admin can reload to back to the site', async function () {
    await this.cms.instruction(
        'school admin try to refresh current page and see network is back',
        async function (cms) {
            const page = cms.page!;
            await page.reload();
            await page.waitForLoadState('networkidle'); // This resolves after 'networkidle'
        }
    );
});
