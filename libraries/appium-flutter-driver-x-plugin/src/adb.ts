import { exec } from 'child_process';

export async function cmd(command: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        console.log('cmd', command);
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log('cmd', `error: ${error.message}`);
                reject(`error: ${error.message}`);
                return;
            }

            if (stderr) {
                console.log('cmd', `stderr: ${stderr}`);
                reject(`stderr: ${stderr}`);
                return;
            }
            console.log('cmd', `stdout: ${stdout}`);
            resolve(stdout);
        });
    });
}

export async function adbForward(driver: any, port: number): Promise<string> {
    return cmd(
        `${driver.adb.executable.path} -s ${driver.opts.udid} forward tcp:${port} tcp:${port}`
    );
}
