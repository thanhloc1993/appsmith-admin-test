import { chromium } from 'playwright';

import { ByValueKey, FlutterDriverFactory } from 'flutter-driver-x';

async function main() {
    const platform = process.env.PLATFORM ?? '';
    let browser;
    let driver;

    if (platform === 'web') {
        const url = process.env.URL ?? '';
        browser = await chromium.launch({
            headless: false,
        });
        const page = await browser.newPage();
        driver = await FlutterDriverFactory.connectWeb(url, page);
    } else {
        const app = process.env.APP ?? '';
        driver = await FlutterDriverFactory.connectAppium(app, platform);
    }
    await new Promise((r) => setTimeout(r, 5000));

    await driver.setTextEntryEmulation({ enabled: false }); // You must do this step before focusing the TextField
    await driver.tap(new ByValueKey('TextField'));
    await driver.webDriver!.page.keyboard.type('Hello World!');
    await driver.setTextEntryEmulation({ enabled: true });

    await new Promise((r) => setTimeout(r, 10000));
    await driver.close();

    if (platform === 'web') {
        await browser?.close();
    }
}

main();
