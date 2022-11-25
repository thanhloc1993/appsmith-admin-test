import { Browser } from 'playwright';

import exportExpect, { Matchers } from 'expect';

declare global {
    type ExportExpect = typeof exportExpect;
    interface Expect extends ExportExpect {
        /**
         * The `expect` function is used every time you want to test a value.
         * You will rarely call `expect` by itself.
         *
         * Examples:
         * weExpect('end-to-end', `this repository's name is end-to-end.`).toEqual('manabie.com')
         *
         * @param actual The value to apply matchers against.
         * @param message Clarification message
         *
         */
        <T = any>(actual: T, message?: string): Matchers<T>;
    }
    namespace NodeJS {
        interface Global {
            weExpect: Expect;
            _cucumber: {
                timeout: number;
                counter: number;
                browser: Browser;
                skipAll: boolean;
                durationLimit: number;
                startTime: number;
            };
        }
    }

    const weExpect: Expect;
    const _cucumber: {
        timeout: number;
        counter: number;
        browser: Browser;
        skipAll: boolean;
        durationLimit: number;
        startTime: number;
    };
}
