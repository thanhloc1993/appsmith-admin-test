import { Page } from 'playwright';

import { CMSInterface } from '@supports/app-types';

import { loadJprepConfiguration } from 'configurations/load-environment';

export class CMSJprepPage {
    readonly cms: CMSInterface;
    readonly page: Page;

    constructor(cms: CMSInterface) {
        this.cms = cms;
        this.page = cms.page!;
    }

    async initialCMS() {
        const cms = this.cms;
        const page = this.cms.page!;

        const switcherLocale = page.locator('[data-testid="LocaleSwitcher"]');
        const language = await switcherLocale.innerText();

        await cms.attach(`Current language is ${language}`);
        await cms.attachScreenshot();

        if (language !== 'English') {
            await cms.attach('Switch language to English');
            await switcherLocale.click();

            await page
                .locator('[data-testid="MenuComponent__popper"] button:has-text("English")')
                .click();

            await cms.attachScreenshot();
        }
    }

    async waitForGRPCResponse(
        endpointString: string,
        options?: Parameters<Page['waitForResponse']>[1]
    ): ReturnType<Page['waitForResponse']> {
        const cms = this.cms;
        const page = this.cms.page!;

        const gRPCEndpoint = loadJprepConfiguration(process.env.ENV).GRPC_ENDPOINT;
        const desireEndpoint = `${gRPCEndpoint}/${endpointString}`;

        await cms.attach(`Waiting for a response from gRPC endpoint ${desireEndpoint}`);

        return page.waitForResponse(
            (response) =>
                response &&
                response.request().method() === 'POST' &&
                response.url() === `${desireEndpoint}` &&
                response.ok(),
            options
        );
    }
}
