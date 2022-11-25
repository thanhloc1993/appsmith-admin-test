import { exec } from 'child_process';

export async function cmd(command: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        console.log('esimulator', command);
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log('esimulator', `error: ${error.message}`);
                reject(`error: ${error.message}`);
                return;
            }

            if (stderr) {
                console.log('esimulator', `stderr: ${stderr}`);
                reject(`stderr: ${stderr}`);
                return;
            }

            resolve(stdout);
        });
    });
}
