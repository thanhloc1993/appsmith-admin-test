import { Command } from '../common/message';
import { FlutterDriver, WebDriver } from './driver';
import { SocketClient } from './vmservice-driver';
import { command } from 'webdriver';
import { Browser, remote } from 'webdriverio';

export class AppiumFlutterDriver extends FlutterDriver {
    socketClient?: SocketClient | undefined;
    appiumClientDriver: Browser<'async'>;
    webDriver?: WebDriver | undefined;

    static async connect(app: string, platform: string): Promise<FlutterDriver> {
        let platformName = '';
        let automationName = '';
        switch (platform) {
            case 'ios':
                platformName = 'iOS';
                automationName = 'XCUITest';
                break;
            case 'android':
                platformName = 'Android';
                automationName = 'UiAutomator2';
                break;
            default:
                throw `${platform} platform does not support`;
        }
        const remoteOptions = {
            path: '/wd/hub',
            port: 4723,
            connectionRetryTimeout: 300000,
            capabilities: {
                platformName: platformName,
                app: app,
                automationName: automationName,
            },
        };
        const appiumClientDriver = await remote(remoteOptions);
        appiumClientDriver.addCommand(
            'connect',
            command('POST', '/session/:sessionId/flutter/connect', {
                command: 'connect',
                description: '',
                ref: '',
                parameters: [],
            })
        );
        await appiumClientDriver.connect();
        return new AppiumFlutterDriver(appiumClientDriver);
    }

    constructor(appiumClientDriver: Browser<'async'>) {
        super();
        this.appiumClientDriver = appiumClientDriver;
    }

    async close(): Promise<void> {
        // await this.appiumClientDriver.execute('flutter', { method: 'close' });
        await this.appiumClientDriver.deleteSession();
    }

    async sendCommand(command: Command): Promise<any> {
        await this.appiumClientDriver.execute('flutter', {
            method: 'sendCommand',
            command: command,
        });
    }

    async restart(): Promise<void> {
        await this.appiumClientDriver.execute('flutter', { method: 'restart' });
    }

    async reload(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async screenshot(): Promise<string> {
        return await this.appiumClientDriver.takeScreenshot();
    }

    isApp(): boolean {
        return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setOffline(_: boolean): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
