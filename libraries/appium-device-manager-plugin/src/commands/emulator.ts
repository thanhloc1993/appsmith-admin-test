import { cmd } from './cmd';
import { ANDROID_HOME } from './env';

const EMULATOR = `${ANDROID_HOME}/emulator/emulator`;

export async function launchAvd(name: string) {
    return cmd(`${EMULATOR} -avd ${name}`);
}
