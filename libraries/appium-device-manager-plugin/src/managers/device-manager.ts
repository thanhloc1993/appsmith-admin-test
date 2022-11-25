import { DeviceState } from './device-state';
import getPort from 'get-port';

class DeviceSession {
    udid: string;
    appiumSessionId: string;
    deviceName: string;
    deviceState: DeviceState;
    port: number;

    constructor(
        udid: string,
        appiumSessionId: string,
        deviceName: string,
        deviceState: DeviceState,
        port: number
    ) {
        this.udid = udid;
        this.appiumSessionId = appiumSessionId;
        this.deviceName = deviceName;
        this.deviceState = deviceState;
        this.port = port;
    }
}

export abstract class DeviceManager {
    virtualDeviceStates = new Map<string, DeviceState>();
    udidDeviceSessions = new Map<string, DeviceSession>();
    hasLoading = false;

    abstract create(name: string): Promise<void>;

    abstract launch(name: string): Promise<string>;

    abstract waitForBootCompleted(udid: string): Promise<void>;

    abstract configParallel(udid: string, caps: any): Promise<void>;

    async waitForManagerReady() {
        while (this.hasLoading) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log('Having loading device');
        }
        this.hasLoading = true;
    }

    async getFreeUdid(): Promise<string> {
        await this.waitForManagerReady();
        try {
            const freeUdid = this.getUdidWithState(DeviceState.Free);
            if (!freeUdid) {
                const offDeviceName = this.getOffDevice();
                if (offDeviceName) {
                    await this.create(offDeviceName);

                    const udid = await this.launch(offDeviceName);
                    this.virtualDeviceStates.set(offDeviceName, DeviceState.Booted);

                    const port = await getPort();
                    const session = new DeviceSession(
                        udid,
                        '',
                        offDeviceName,
                        DeviceState.Busy,
                        port
                    );
                    this.udidDeviceSessions.set(udid, session);
                    this.hasLoading = false;
                    await this.waitForBootCompleted(udid);

                    return udid;
                } else {
                    this.hasLoading = false;
                    return '';
                }
            } else {
                this.updateStateWithUdid(freeUdid, DeviceState.Busy);
                this.hasLoading = false;
                return freeUdid;
            }
        } catch (e) {
            this.hasLoading = false;
            throw e;
        }
    }

    private getOffDevice(): string {
        for (const [name, state] of this.virtualDeviceStates.entries()) {
            if (state === DeviceState.Off) {
                return name;
            }
        }
        return '';
    }

    private getUdidWithState(expectState: DeviceState): string {
        console.log('getADevice', expectState);
        for (const [udid, session] of this.udidDeviceSessions.entries()) {
            console.log('getADeviceItem', [udid, session]);
            if (session.deviceState === expectState) {
                return udid;
            }
        }
        return '';
    }

    updateStateWithUdid(udid: string, newState: DeviceState) {
        const deviceSession = this.udidDeviceSessions.get(udid);
        if (deviceSession) {
            deviceSession.deviceState = newState;
        } else {
            throw `Don't find any device session of ${udid}`;
        }
    }

    handleStartSession(udid: string, appiumSessionId: string) {
        const deviceSession = this.udidDeviceSessions.get(udid);
        if (deviceSession) {
            deviceSession.appiumSessionId = appiumSessionId;
        } else {
            throw `Don't have any device sessions of ${udid}`;
        }
    }

    handleEndSession(sessionId: string) {
        for (const session of this.udidDeviceSessions.values()) {
            if (session.appiumSessionId === sessionId) {
                session.deviceState = DeviceState.Free;
                session.appiumSessionId = '';
            }
        }
    }
}
