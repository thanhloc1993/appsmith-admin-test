import { Page } from 'playwright';

import {
    GetDiagnosticsTree,
    DiagnosticsType,
    GetDiagnosticsWidgetTreeResult,
} from '../common/diagnostics-tree/diagnostics-tree';
import { ByValueKey, SerializableFinder, WaitFor, WaitForAbsent } from '../common/find';
import { SetFrameSync } from '../common/frame-sync';
import { Scroll, ScrollIntoView, Tap } from '../common/gesture';
import { Command, Result } from '../common/message';
import { GetRenderTree, RenderTree } from '../common/render-tree';
import { RequestData, RequestDataResult } from '../common/request-data';
import { GetText, EnterText, GetTextResult, SetTextEntryEmulation } from '../common/text';
import { delay } from '../utils/helpers';
import { WidgetTreeUtils } from '../utils/widget-tree';
import { SocketClient } from './vmservice-driver';
import { Browser } from 'webdriverio';

const _timeout = 5000;
const _interval = 1000;

export class WebDriver {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     *
     * @returns {Promise<string>} url origin
     */
    async getUrlOrigin(): Promise<string> {
        const url = this.page.url();

        if (!url) throw new Error('Cannot get the url');
        const urlIns = new URL(url);

        return `${urlIns.origin}/#/`;
    }
}

export abstract class FlutterDriver {
    abstract appiumClientDriver?: Browser<'async'>;
    abstract socketClient?: SocketClient;
    abstract webDriver?: WebDriver;

    abstract close(): Promise<void>;

    abstract sendCommand(command: Command): Promise<any>;

    abstract restart(): Promise<void>;

    abstract reload(): Promise<void>;

    abstract screenshot(): Promise<string>;

    abstract isApp(): boolean;

    abstract setOffline(offline: boolean): Promise<void>;

    async tap(finder: SerializableFinder, timeout: number = _timeout): Promise<Result> {
        await this.waitFor(finder, timeout);
        const command = new Tap(finder, { timeout }).flat;
        return await this.sendCommand(command);
    }

    async getText(finder: SerializableFinder, timeout: number = _timeout): Promise<string> {
        const command = new GetText(finder, { timeout }).flat;

        const response: GetTextResult = await this.sendCommand(command);
        return response.response.text;
    }

    async enterText(text: string, timeout: number = _timeout): Promise<Result> {
        const command = new EnterText(text, { timeout }).flat;
        return await this.sendCommand(command);
    }

    async waitFor(finder: SerializableFinder, timeout: number = _timeout): Promise<Result> {
        const command = new WaitFor(finder, { timeout }).flat;
        return await this.sendCommand(command);
    }

    async waitForAbsent(finder: SerializableFinder, timeout: number = _timeout): Promise<Result> {
        const command = new WaitForAbsent(finder, { timeout }).flat;
        return await this.sendCommand(command);
    }

    async scroll(
        finder: SerializableFinder,
        dx: number,
        dy: number,
        duration: number,
        frequency: number,
        timeout: number = _timeout
    ): Promise<Result> {
        const command = new Scroll(finder, dx, dy, duration, frequency, { timeout }).flat;
        return await this.sendCommand(command);
    }

    async scrollUntilVisible(
        scrollable: SerializableFinder,
        item: SerializableFinder,
        _alignment: number,
        dx: number,
        dy: number,
        timeout: number = _timeout,
        timeoutInterval: number = _interval
    ): Promise<Result> {
        return new Promise<Result>((resolve, reject) => {
            setTimeout(function () {
                reject(`scrollUntilVisible timeout`);
            }, timeout);
            return this.tryScrollUntilVisible(scrollable, item, _alignment, dx, dy, timeoutInterval)
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    private async tryScrollUntilVisible(
        scrollable: SerializableFinder,
        item: SerializableFinder,
        _alignment: number,
        dx: number,
        dy: number,
        timeoutInterval: number
    ): Promise<Result> {
        await this.waitFor(scrollable);

        let isVisible;
        try {
            await this.waitFor(item, timeoutInterval);
            isVisible = true;
        } catch (e) {
            console.warn(e);
        }

        while (!isVisible) {
            try {
                await this.scroll(scrollable, dx, dy, 100, 60);
                await this.waitFor(item, timeoutInterval);
                isVisible = true;
            } catch (e) {
                console.warn(e);
            }
        }
        return await this.scrollIntoView(item, _alignment);
    }

    /**
     * Scroll until tap success
     * @param scrollable: SerializableFinder
     * @param item: SerializableFinder
     * @param dx: number
     * @param dy: number
     * @param timeout: number (optional)
     * @returns Promise<boolean>
     * @example
     *   await teacher.flutterDriver!.scrollUntilTap(
     *       new ByValueKey(TeacherKeys.studentStudyPlanScrollView),
     *       new ByValueKey(TeacherKeys.studentStudyPlanItemStatusNotMarked(assignmentName)),
     *       0.0,
     *       0.0,
     *       -500,
     *       5000
     *   );
     */
    async scrollUntilTap(
        scrollable: SerializableFinder,
        item: SerializableFinder,
        dx: number,
        dy: number,
        timeout: number = _timeout
    ): Promise<boolean> {
        let tapped = false;
        // Make sure has scrollable
        await this.waitFor(scrollable);

        this.tap(item, timeout).then<void>(() => {
            tapped = true;
        });

        await delay(1000);

        while (!tapped) {
            // Because sometime navigate to other screen after tap success,
            // so scroll fail
            try {
                await this.scroll(scrollable, dx, dy, 100, 60);
            } catch (e) {
                console.warn(e);
            }
            await delay(500);
        }
        return tapped;
    }

    /**
     * Scroll into view
     * @param finder: SerializableFinder
     * @param alignment: number
     * @param timeout: number
     * @returns Promise<Result>
     * @param timeout: number (optional)
     * @example
     *   await driver!.scrollIntoView(
     *       new ByValueKey(TeacherKeys.courseItem),
     *       0.0,
     *   );
     */
    async scrollIntoView(
        finder: SerializableFinder,
        alignment: number,
        timeout: number = _timeout
    ): Promise<Result> {
        return await this.sendCommand(
            new ScrollIntoView(finder, { alignment: alignment || 0.0, timeout: timeout }).flat
        );
    }

    /**
     *
     * @param action: () => Promise<T>
     * @param timeout: number (optional, default is 5000)
     * @returns Promise<T>
     * @example
     * await driver.runUnsynchronized(async () => {
     *    await driver.waitFor(new ByValueKey('value_key'));
     * });
     */
    async runUnsynchronized<T>(action: () => Promise<T>, timeout: number = _timeout): Promise<T> {
        await this.sendCommand(new SetFrameSync(false, { timeout }).flat);
        let result: T;
        try {
            result = await action();
        } finally {
            await this.sendCommand(new SetFrameSync(true, { timeout }).flat);
        }
        return result;
    }

    async requestData(message: string, timeout: number = _timeout): Promise<RequestDataResult> {
        const command = new RequestData(message, { timeout }).flat;
        return await this.sendCommand(command);
    }

    async getRenderTree(timeout: number = _timeout): Promise<RenderTree> {
        const command = new GetRenderTree({ timeout }).flat;

        return await this.sendCommand(command);
    }

    async getRenderWidgetDiagnostics(
        finder: SerializableFinder,
        {
            subtreeDepth = 0,
            includeProperties = true,
            timeout = _timeout,
        }: { subtreeDepth?: number; includeProperties?: boolean; timeout?: number }
    ): Promise<GetDiagnosticsWidgetTreeResult> {
        const command = new GetDiagnosticsTree(finder, DiagnosticsType.widget, {
            subtreeDepth,
            includeProperties,
            timeout,
        }).flat;

        return await this.sendCommand(command);
    }

    async getRenderObjectDiagnostics(
        finder: SerializableFinder,
        {
            subtreeDepth = 0,
            includeProperties = true,
            timeout = _timeout,
        }: { subtreeDepth?: number; includeProperties?: boolean; timeout?: number }
    ): Promise<Result> {
        const command = new GetDiagnosticsTree(finder, DiagnosticsType.renderObject, {
            subtreeDepth,
            includeProperties,
            timeout,
        }).flat;

        return await this.sendCommand(command);
    }

    async getFinders(
        finder: SerializableFinder,
        prefix: string,
        { subtreeDepth = 10, timeout = _timeout }: { subtreeDepth?: number; timeout?: number }
    ): Promise<SerializableFinder[]> {
        const command = new GetDiagnosticsTree(finder, DiagnosticsType.widget, {
            subtreeDepth: subtreeDepth,
            includeProperties: false,
            timeout: timeout,
        }).flat;

        const result = (await this.sendCommand(command)) as GetDiagnosticsWidgetTreeResult;

        let finders: SerializableFinder[] = [];

        const keys = WidgetTreeUtils.getKeysPrefix(result.response, prefix);

        finders = keys.map((key) => {
            return new ByValueKey(key);
        });

        return finders;
    }

    async setTextEntryEmulation({ enabled, timeout }: { enabled: boolean, timeout?: number }): Promise<void> {
        const command = new SetTextEntryEmulation(enabled, { timeout: timeout }).flat;
        await this.sendCommand(command);
    }

    async clearSharedPreferences() {
        await this.requestData('clearSharedPreferences');
    }
}
