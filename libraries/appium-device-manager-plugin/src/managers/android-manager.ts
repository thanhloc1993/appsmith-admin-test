import { waitForBootCompleted, waitForDevice } from '../commands/adb';
import { createAvd } from '../commands/avdmanager';
import { launchAvd } from '../commands/emulator';
import { DeviceManager } from './device-manager';
import { DeviceState } from './device-state';

class AndroidManager extends DeviceManager {
    constructor() {
        super();
        this.virtualDeviceStates = new Map<string, DeviceState>([
            ['emulator-5554', DeviceState.Off],
            ['emulator-5556', DeviceState.Off],
            ['emulator-5558', DeviceState.Off],
            ['emulator-5560', DeviceState.Off],
            ['emulator-5562', DeviceState.Off],
            ['emulator-5564', DeviceState.Off],
            ['emulator-5566', DeviceState.Off],
            ['emulator-5568', DeviceState.Off],
            ['emulator-5570', DeviceState.Off],
            ['emulator-5572', DeviceState.Off],
            ['emulator-5574', DeviceState.Off],
            ['emulator-5576', DeviceState.Off],
            ['emulator-5578', DeviceState.Off],
            ['emulator-5580', DeviceState.Off],
            ['emulator-5582', DeviceState.Off],
            ['emulator-5584', DeviceState.Off],
        ]);
    }

    getUdid(name: string): string {
        return name;
    }

    async create(name: string): Promise<void> {
        await createAvd(name);
    }

    async launch(name: string): Promise<string> {
        launchAvd(name);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return name;
    }

    async waitForBootCompleted(udid: string): Promise<void> {
        await waitForDevice(udid);
        await waitForBootCompleted(udid);
    }

    async configParallel(udid: string, caps: any): Promise<void> {
        const deviceSession = androidManager.udidDeviceSessions.get(udid);
        if (deviceSession) {
            caps.firstMatch[0]['appium:udid'] = udid;
            caps.firstMatch[0]['appium:systemPort'] = deviceSession.port;
        }
    }
}

const androidManager = new AndroidManager();
export default androidManager;
