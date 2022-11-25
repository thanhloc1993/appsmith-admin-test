import { DeviceManager } from './device-manager';
import { DeviceState } from './device-state';
import { Simctl } from 'node-simctl';

interface IOSDevice {
    name: string;
    udid: string;
    state: string;
}

class IOSManager extends DeviceManager {
    deviceType: string;
    version: string;
    waitingLaunchDevice = {
        name: '',
        udid: '',
    };
    constructor() {
        super();
        this.deviceType = 'iPhone 13';
        this.version = '15.2';
        this.virtualDeviceStates = new Map<string, DeviceState>([
            ['simulator-1', DeviceState.Off],
            ['simulator-2', DeviceState.Off],
            ['simulator-3', DeviceState.Off],
            ['simulator-4', DeviceState.Off],
            ['simulator-5', DeviceState.Off],
            ['simulator-6', DeviceState.Off],
            ['simulator-7', DeviceState.Off],
            ['simulator-8', DeviceState.Off],
            ['simulator-9', DeviceState.Off],
            ['simulator-10', DeviceState.Off],
            ['simulator-11', DeviceState.Off],
            ['simulator-12', DeviceState.Off],
            ['simulator-13', DeviceState.Off],
            ['simulator-14', DeviceState.Off],
            ['simulator-15', DeviceState.Off],
            ['simulator-16', DeviceState.Off],
        ]);
    }

    async create(name: string): Promise<void> {
        let udid;
        const device = await this.getDevice(name);
        if (device) {
            udid = device.udid;
        } else {
            const simctl = new Simctl();
            udid = await simctl.createDevice(name, this.deviceType, this.version);
        }
        this.waitingLaunchDevice = {
            name: name,
            udid: udid,
        };
    }

    async launch(name: string): Promise<string> {
        if (this.waitingLaunchDevice.name === name && this.waitingLaunchDevice.udid) {
            const udid = this.waitingLaunchDevice.udid;
            this.waitingLaunchDevice = {
                name: '',
                udid: '',
            };
            const simctl = new Simctl();
            simctl.udid = udid;
            await simctl.bootDevice();
            return udid;
        } else {
            throw 'udid is invalid';
        }
    }

    async waitForBootCompleted(udid: string): Promise<void> {
        if (udid) {
            const simctl = new Simctl();
            simctl.udid = udid;
            await simctl.startBootMonitor({ timeout: 300000 });
        } else {
            throw 'udid is invalid';
        }
    }

    async configParallel(udid: string, caps: any): Promise<void> {
        const deviceSession = iosManager.udidDeviceSessions.get(udid);
        if (deviceSession) {
            caps.firstMatch[0]['appium:udid'] = udid;
            caps.firstMatch[0]['appium:deviceName'] = deviceSession.deviceName;
            caps.firstMatch[0]['appium:wdaLocalPort'] = deviceSession.port;
        }
    }

    private async getDevices(): Promise<Array<IOSDevice>> {
        const simctl = new Simctl();
        const allDevices = await simctl.getDevices();
        return allDevices[this.version];
    }

    private async getDevice(name: string): Promise<IOSDevice | undefined> {
        const devices = await this.getDevices();
        return devices.find((device) => device.name === name);
    }
}

const iosManager = new IOSManager();
export default iosManager;
