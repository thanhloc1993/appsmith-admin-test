import { chromium } from 'playwright';

import { genId } from '../../../step-definitions/utils';

export interface WindowWithOptionalValues extends Window {
    [x: string]: any;
}

/***
 * Create a fake browser env, can be used for execute function that rely on `document` object
 * @param rootHtmlPath a local html file path, which contains all the functions dependencies
 * @return object an object that has the `exec` function as a property
 */
export function createFakeBrowserEnv(rootHtmlPath: string) {
    return {
        async exec<T extends (window: WindowWithOptionalValues, params: any) => any>(
            fnToExec: T,
            params: Parameters<T>[1]
        ): Promise<ReturnType<T>> {
            const functionId = genId();
            const browser = await chromium.launch({ headless: true });
            const page = await browser.newPage();
            page.on('console', (consoleObj) => console.log(consoleObj)); // for debug purpose

            await page.goto(`file:${rootHtmlPath}`);

            await page.addScriptTag({
                content: `window['${functionId}'] = ${fnToExec}`, // inject the function to window to invoke later
            });

            const result = await page.evaluate(
                ([functionId, params]) => {
                    return (window as WindowWithOptionalValues)[functionId](window, params);
                },
                [functionId, params]
            );

            await browser.close();

            return result;
        },
    };
}
