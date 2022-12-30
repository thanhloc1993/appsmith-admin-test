import {
    Browser,
    BrowserContext,
    BrowserContextOptions,
    chromium,
    ConsoleMessage,
    Page,
} from 'playwright';

import axios from 'axios';

import { genId } from '@drivers/message-formatter/utils';

import Logs from '../../configurations/tools/log';
import { FlutterDriver } from 'flutter-driver-x';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

export interface AttachmentLogTypes {
    readonly attach: (
        data: Buffer | Readable | string,
        mediaType?: string,
        callback?: () => void
    ) => void | Promise<void>;
    readonly log: (text: string) => void | Promise<void>;
}

export interface ConnectOptions {
    browser: Browser;
    page?: Page;
    context?: BrowserContext;
}
export interface IAbstractDriver extends AttachmentLogTypes {
    waitForConnection(url: string): Promise<void>;
    connectPlaywrightDriver(options: AbstractDriverOptions): Promise<void>;
    quitPlaywrightDriver(): Promise<void>;
    instructionDriver<T>(description: string, fn: (context: T) => Promise<void>): Promise<void>;
    setOffline(offline: boolean): Promise<void>;
    attachScreenshot(): Promise<void>;
    connect: (options: ConnectOptions) => Promise<void>;
    quit: () => Promise<void>;
}

export interface AbstractDriverOptions {
    origin: string;
    timeout: number;
    browser: Browser;
}

export default abstract class AbstractDriver implements IAbstractDriver {
    flutterDriver?: FlutterDriver;
    page?: Page;
    context?: BrowserContext;
    browser?: Browser;
    origin = '';
    readonly driverName: string;
    private developMode = !process.env.CI;
    private headless = process.env.HEADLESS === 'true';
    private logs?: Logs;
    readonly attach: AttachmentLogTypes['attach'];
    readonly log: AttachmentLogTypes['log'];

    constructor(options: AttachmentLogTypes, { driverName }: { driverName: string }) {
        this.log = options.log;
        this.attach = options.attach;
        this.driverName = driverName;
    }

    abstract connect(options: ConnectOptions): Promise<void>;
    abstract quit(): Promise<void>;

    setOffline(offline: boolean): Promise<void> {
        return this.page!.context().setOffline(offline);
    }

    /**
     * @param url
     * @returns {Promise<void>} connect
     */
    async waitForConnection(url: string) {
        return new Promise<void>((resolve, reject) => {
            const timeout = 900 * 1000; // 15 minutes
            const intervalTime = 5000;

            console.log('Retry connect', url);
            const interval = setInterval(async () => {
                console.log('.');

                await axios({
                    method: 'get',
                    url,
                    headers: {
                        'Content-Type': 'text/html',
                        Accept: 'text/html',
                    },
                })
                    .then(function () {
                        clearInterval(interval);
                        resolve();
                    })
                    .catch(function (error) {
                        console.error('waitForConnection', error.message, url);
                    });
            }, intervalTime);

            setTimeout(function () {
                clearInterval(interval);
                reject(new Error('Timeout connect'));
            }, timeout);
        });
    }
    async connectPlaywrightDriver(options: AbstractDriverOptions) {
        console.log(`Welcome to ${this.driverName} driver`);
        let browser = options.browser;
        this.origin = options.origin;

        if (browser && !browser.isConnected()) {
            const browserServer = await chromium.launchServer();
            const wsEndpoint = browserServer.wsEndpoint();
            //browser can close when app crash, connect again to exist browser instance
            browser = await chromium.connect({
                timeout: 10000,
                wsEndpoint: wsEndpoint,
            });
        }

        const contextOptions: BrowserContextOptions = {
            acceptDownloads: true,
            permissions: [
                'camera',
                'microphone',
                'notifications',
                'clipboard-read',
                'clipboard-write',
            ],
            viewport: { width: 1600, height: 900 },
            baseURL: this.origin,
            locale: 'en-US',
        };
        //record when running headless mode in develop mode
        if (this.developMode && this.headless) {
            contextOptions.recordVideo = {
                dir: path.resolve(__dirname, '../../record/video'),
                size: { width: 1600, height: 900 },
            };
        }

        const context: BrowserContext = await browser.newContext(contextOptions);
        await context.addInitScript(() => {
            console.log("====> I'm in the browser context");
            window.localStorage.setItem('isTest', 'true');
        });

        this.context = context;
        await this.startTraceViewer();
        const page: Page = await context.newPage();

        await this.waitForConnection(this.origin);
        await page.goto(this.origin, {
            waitUntil: 'networkidle',
            timeout: options.timeout, //match with timeout in hook steps
        });

        this.page = page;
        this.browser = browser;
        this.logs = new Logs(this.driverName);

        page.on('console', this.handlePageConsole(this.logs));
    }

    handlePageConsole(logs?: Logs) {
        return async function (message: ConsoleMessage) {
            if (!logs) return;
            let messages = message.text();

            const args = message.args();
            if (!args.length) return logs.log(messages);

            try {
                for (const arg of args) {
                    let mess = await arg.jsonValue();

                    if (typeof mess === 'object') {
                        mess = JSON.stringify(mess, null, 2);
                    }

                    messages += `${mess}`;
                }
            } catch (err) {
                //JSHandles are auto-disposed when their origin frame gets navigated or the parent context gets destroyed.
            }

            return logs.log(messages);
        };
    }
    async quitPlaywrightDriver() {
        if (process.env.CI) {
            const applicationLog = this.logs?.readFile('base64');
            if (applicationLog) {
                await this.attach(Buffer.from(applicationLog, 'base64'), 'text/plain');
            }
        } else {
            await this.attach(
                `<a href='logs/${this.logs?.getFileName()}'>${this.logs?.getFileName()}</a>`,
                'text/html'
            );
        }
        await this.stopTraceViewer();
        await this.context?.close();
    }

    /**
     *
     * @param description
     * @param fn
     * @param bufferScreenshot
     * @returns {Promise<void>} void
     */
    async instructionDriver<T>(
        description: string,
        fn: (context: T) => Promise<void>,
        bufferScreenshot?: Buffer | string
    ): Promise<void> {
        await this.attach(description);
        try {
            await fn.call(this, this as unknown as T);
        } finally {
            if (!this.isOnTrunk()) {
                await this.attachScreenshot(bufferScreenshot);
            }
        }
    }

    /**
     * Attach screenshot
     * @param bufferScreenshot
     * @returns {Promise<void>} void
     */
    async attachScreenshot(bufferScreenshot?: Buffer | string): Promise<void> {
        try {
            let buffer = bufferScreenshot;
            if (this.page) {
                buffer = await this.page!.screenshot({
                    quality: 50,
                    type: 'jpeg',
                    timeout: 10000,
                }).catch(async (err) => {
                    console.log('attachScreenshot', err);
                    await this.attach(`Cannot take screenshot ${err.message}`);
                    return undefined;
                });
            } else {
                buffer = await this.flutterDriver?.screenshot();
            }
            if (buffer) {
                await this.attach(buffer, 'image/png');
            }
        } catch (error) {
            console.warn(error);
        }
    }

    protected async startTraceViewer() {
        return await this.context?.tracing.start({
            screenshots: true,
            snapshots: true,
        });
    }

    protected async stopTraceViewer() {
        if (!this.browser?.isConnected()) return;
        try {
            const pathTraceView = path.join(
                __dirname,
                `../../report/trace-viewer/${this.driverName}-${genId()}.zip`
            );
            await this.context?.tracing.stop({
                path: pathTraceView,
            });

            const traceView = fs.readFileSync(pathTraceView);
            if (traceView) {
                await this.attach(traceView, 'application/zip');
                if (!this.developMode) {
                    fs.unlinkSync(pathTraceView);
                }
            }
        } catch (error) {
            console.error("Can't stop trace viewer", error);
        }

        return;
    }

    isOnTrunk = () => {
        const { ME_REF, FE_REF, EIBANAM_REF } = process.env;
        return (
            (!ME_REF || ME_REF === 'develop') &&
            (EIBANAM_REF === 'develop' || EIBANAM_REF === 'refs/heads/develop') &&
            (!FE_REF || FE_REF === 'develop')
        );
    };
}
