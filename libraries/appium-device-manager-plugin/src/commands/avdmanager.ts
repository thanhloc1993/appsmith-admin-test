import { cmd } from './cmd';
import { ANDROID_HOME, HOME } from './env';

const ADV_MANAGER = `${ANDROID_HOME}/cmdline-tools/tools/bin/avdmanager`;

export async function createAvd(name: string): Promise<string> {
    return cmd(
        `echo "no" | ${ADV_MANAGER} create avd -n ${name} -k "system-images;android-30;google_apis;x86" -f -p ${HOME}/${name}`
    );
}

export async function deleteAvd(name: string) {
    return cmd(`${ADV_MANAGER} delete avd -n ${name}`);
}
