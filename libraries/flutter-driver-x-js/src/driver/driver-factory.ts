import { Page } from 'playwright';

import { AppiumFlutterDriver } from './appium-driver';
import { FlutterDriver } from './driver';
import { VMServiceFlutterDriver } from './vmservice-driver';
import { FlutterWebConnection, WebFlutterDriver } from './web-driver';

export class FlutterDriverFactory {
    static async connectWeb(url: string, page: Page, timeout = 100000): Promise<FlutterDriver> {
        const connection = await FlutterWebConnection.connect(url, page, timeout);
        return new WebFlutterDriver(connection);
    }

    static connectMobile(wsDebuggerServiceUrl: string): Promise<FlutterDriver> {
        return VMServiceFlutterDriver.connect(wsDebuggerServiceUrl);
    }

    static connectAppium(app: string, platform: string): Promise<FlutterDriver> {
        return AppiumFlutterDriver.connect(app, platform);
    }
}
