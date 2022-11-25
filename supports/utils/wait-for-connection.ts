import axios from 'axios';

export async function waitForConnection(url: string) {
    return new Promise<void>((resolve, reject) => {
        const timeout = 900 * 1000; // 15 minutes
        const intervalTime = 5000;

        const interval = setInterval(async () => {
            console.log('Retry connect', url);
            try {
                await axios.get(url);
                clearInterval(interval);
                resolve();
            } catch (error) {
                console.error(error);
            }
        }, intervalTime);
        setTimeout(function () {
            clearInterval(interval);
            reject(new Error('Timeout connect'));
        }, timeout);
    });
}
