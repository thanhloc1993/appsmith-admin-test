import { Page } from 'playwright';

import { DriverError } from '../common/error';
import { Command, Result } from '../common/message';
import { FlutterDriver, WebDriver } from './driver';
import { SocketClient } from './vmservice-driver';
import { Browser } from 'webdriverio';

// These lines are a trick to fix tslint
let $flutterDriver: null;
let $flutterDriverResult: null;

export class WebFlutterDriver extends FlutterDriver {
    socketClient?: SocketClient | undefined;
    appiumClientDriver?: Browser<'async'> | undefined;
    webDriver: WebDriver;

    private _connection: FlutterWebConnection;

    constructor(connection: FlutterWebConnection) {
        super();
        this._connection = connection;
        this.webDriver = connection.webDriver;
    }

    async restart() {
        return await this._connection.restart();
    }

    async reload(): Promise<void> {
        return await this._connection.reload();
    }

    isApp(): boolean {
        return false;
    }

    async sendCommand(command: Command): Promise<Result> {
        const webCommand = JSON.parse(JSON.stringify(command));
        Object.keys(webCommand).forEach((k) => {
            webCommand[k] = '' + webCommand[k];
        });
        let result: Result;
        const commandStringify = JSON.stringify(webCommand);
        try {
            console.log('>>>>', webCommand);
            result = await this._connection.sendCommand(commandStringify, command.timeout);
            console.log('<<<<', result);
        } catch (error: any) {
            throw new DriverError(
                `Failed to respond to ${
                    command!.command
                } due to remote error\n : $flutterDriver('${commandStringify}')`,
                error
            );
        }
        if (result.isError) {
            throw new DriverError(
                `Error in Flutter application: ${JSON.stringify(result.response)}`
            );
        }
        return result;
    }

    async screenshot(): Promise<string> {
        const buffer = await this._connection.webDriver.page.screenshot({
            quality: 50,
            type: 'jpeg',
        });
        return buffer.toString('base64');
    }

    async close() {
        await this._connection.webDriver?.page?.close();
    }

    async setOffline(offline: boolean): Promise<void> {
        return this._connection.webDriver.page.context().setOffline(offline);
    }
}

export class FlutterWebConnection {
    webDriver: WebDriver;
    url: string;

    constructor(url: string, webDriver: WebDriver) {
        this.url = url;
        this.webDriver = webDriver;
    }

    static async connect(url: string, page: Page, timeout = 100000): Promise<FlutterWebConnection> {
        if (!String(await page.url()).includes(url)) {
            await page.goto(url, {
                waitUntil: 'networkidle',
                timeout: timeout,
            });
        }

        const webDriver = new WebDriver(page);
        const connection = new FlutterWebConnection(url, webDriver);
        await connection.waitUntilExtensionInstalled();
        return connection;
    }

    async sendCommand(script: string, timeout = 10000): Promise<any> {
        const page = this.webDriver.page;
        await page.evaluate(`window.$flutterDriver('${script}')`);
        const result = await page.evaluate(async (timeout) => {
            return new Promise<any>((resolve, reject) => {
                const interval = setInterval(async () => {
                    const flutterDriverResult = $flutterDriverResult;
                    if (flutterDriverResult !== undefined && flutterDriverResult !== null) {
                        clearInterval(interval);
                        resolve(flutterDriverResult);
                    }
                }, 500);
                setTimeout(function () {
                    clearInterval(interval);
                    reject('sendCommand timeout');
                }, timeout);
            });
        }, timeout);

        // Resets the result.
        await page.evaluate(() => {
            $flutterDriverResult = null;
        });

        return JSON.parse(result);
    }

    async waitUntilExtensionInstalled(timeout = 30000) {
        const page = this.webDriver.page;
        await page.evaluate(async (timeout) => {
            return new Promise<void>((resolve, reject) => {
                const interval = setInterval(async () => {
                    if (typeof $flutterDriver === 'function') {
                        clearInterval(interval);
                        resolve();
                    }
                }, 500);
                setTimeout(function () {
                    clearInterval(interval);
                    reject();
                }, timeout);
            });
        }, timeout);
    }

    async restart() {
        await this.webDriver.page.goto(this.url);
        await this.waitUntilExtensionInstalled();
    }

    async reload() {
        const page = this.webDriver.page;
        const url = await page.url();
        const [newURL] = await Promise.all([
            page.waitForNavigation({ url }).then(async (res) => await res?.url()), //wait for navigation to finish after reload is called
            page.reload(),
        ]);

        if (url != newURL) {
            try {
                await page.waitForNavigation();
            } catch (err) {
                //ignore this error, because single application will redirect to home back when reload
            }
        }

        await this.waitUntilExtensionInstalled();
    }
}
