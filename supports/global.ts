import { Browser } from 'playwright';

export const initCucumber = () => {
    global._cucumber = {
        timeout: 900 * 1000,
        counter: 0,
        skipAll: false,
        durationLimit: parseInt(process.env.DURATION_LIMIT || '-1'),
        startTime: 0,
        browser: {} as Browser,
    };
};
