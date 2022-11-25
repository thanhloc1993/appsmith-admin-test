import { cmd } from './cmd';
import { ANDROID_HOME } from './env';

const ADB = `${ANDROID_HOME}/platform-tools/adb`;

export async function killAVD(shell: string): Promise<string> {
    return cmd(`${ADB} -s ${shell} shell emu kill`);
}

export async function waitForDevice(shell: string): Promise<void> {
    await cmd(`${ADB} -s ${shell} wait-for-device`);
}

export async function waitForBootCompleted(shell: string): Promise<void> {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const code = await cmd(`${ADB} -s ${shell} shell getprop sys.boot_completed`);
        if (code.trim() === '1') break;
        await new Promise((r) => setTimeout(r, 1000));
    }
}

export async function getDevices(): Promise<Array<string>> {
    const result = await cmd(`${ADB} devices`);
    return result.split('\n').filter((value) => value.includes('\tdevice'));
}
