import BasePlugin from '@appium/base-plugin';

import androidManager from './managers/android-manager';
import { DeviceManager } from './managers/device-manager';
import { DeviceState } from './managers/device-state';
import iosManager from './managers/ios-manager';

export default class AppiumDeviceManagerPlugin extends BasePlugin {
    async createSession(next: any, driver: any, jwpDesCaps: any, jwpReqCaps: any, caps: any) {
        let udid = '';
        const platform = jwpDesCaps.platformName;
        const deviceManager = this.getManager(platform);
        try {
            udid = await deviceManager.getFreeUdid();
            if (!udid) {
                throw `device is ${udid}`;
            }
            await deviceManager.configParallel(udid, caps);
            const session = await next();
            const sessionId = session.value[0];
            deviceManager.handleStartSession(udid, sessionId);
            return session;
        } catch (error) {
            console.log('createSession error', error);
            deviceManager.updateStateWithUdid(udid, DeviceState.Free);
            throw error;
        }
    }

    async deleteSession(next: any, driver: any, sessionId: any) {
        androidManager.handleEndSession(sessionId);
        iosManager.handleEndSession(sessionId);
        return await next();
    }

    onUnexpectedShutdown(driver: any, _: any) {
        androidManager.handleEndSession(driver.sessionId);
        iosManager.handleEndSession(driver.sessionId);
        console.log(
            `Unblocking device mapped with sessionId ${driver.sessionId} onUnexpectedShutdown from server`
        );
    }

    getManager(platform: string): DeviceManager {
        if (platform === 'Android') {
            return androidManager;
        } else {
            return iosManager;
        }
    }
}
