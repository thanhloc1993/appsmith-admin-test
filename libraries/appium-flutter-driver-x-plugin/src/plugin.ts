import BasePlugin from '@appium/base-plugin';

import { adbForward } from './adb';
import { getPort } from './helpers/get-port';
import { Command, FlutterDriver, FlutterDriverFactory } from 'flutter-driver-x-js';

export default class AppiumFlutterDriverXPlugin extends BasePlugin {
    flutterDrivers = new Map<string, FlutterDriver>();

    static newMethodMap = {
        '/session/:sessionId/flutter/connect': {
            POST: {
                command: 'connect',
                // payloadParams: { required: ['data'] },
                neverProxy: true,
            },
        },
        '/session/:sessionId/flutter/sendCommand': {
            POST: {
                command: 'sendCommand',
                payloadParams: { required: ['command'] },
                neverProxy: true,
            },
        },
        '/session/:sessionId/flutter/close': {
            POST: {
                command: 'close',
                neverProxy: true,
            },
        },
    };

    async connect(next: any, driver: any): Promise<string> {
        const url = await this.getUrl(driver);
        const flutterDriver = await FlutterDriverFactory.connectMobile(url);
        if (flutterDriver) {
            this.flutterDrivers.set(driver.sessionId, flutterDriver);
            return JSON.stringify({ isSuccess: true });
        } else {
            return JSON.stringify({ isSuccess: false });
        }
    }

    async sendCommand(next: any, driver: any, command: Command) {
        const flutterDriver = this.flutterDrivers.get(driver.sessionId);
        if (flutterDriver) {
            flutterDriver.sendCommand(command);
        } else {
            throw 'flutterDriver is null';
        }
    }

    async close() { }

    async getUrl(driver: any): Promise<string> {
        const platform = driver.caps.platformName;
        // eslint-disable-next-line no-async-promise-executor
        return new Promise<string>(async (resolve, reject) => {
            let retryCount = 0;
            let log;
            let nameLog;
            if (platform === 'Android') {
                nameLog = 'logcat';
            } else if (platform === 'iOS') {
                nameLog = 'syslog';
            } else {
                throw `Don't support ${platform}`;
            }

            while (log === undefined) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                const logs = await driver.getLog(nameLog);
                log = logs.find((element: any) =>
                    element.message.includes('Observatory listening on')
                );

                if (log) {
                    const httpListenerServiceUrl = log.message.match(/http.+/)[0];
                    const wsDebuggerServiceUrl =
                        httpListenerServiceUrl.replace(/http/, 'ws') + 'ws';
                    if (platform === 'Android') {
                        const port = getPort(wsDebuggerServiceUrl);
                        await adbForward(driver, port);
                    }
                    resolve(wsDebuggerServiceUrl);
                } else {
                    retryCount++;
                    if (retryCount === 100) {
                        reject('Flutter get url timeout');
                    }
                }
            }
        });
    }
}
