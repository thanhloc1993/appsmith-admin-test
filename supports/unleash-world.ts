import AbstractDriver, { ConnectOptions } from '@drivers/abstract-driver';

import { FeatureFlagsConstants } from '../drivers/feature-flags/constants';
import { UnleashAdminInterface } from './app-types';

export class UnleashAdmin extends AbstractDriver implements UnleashAdminInterface {
    /**
     * @param options
     * @returns {Promise<void>}: connect
     */
    connect = async (options: ConnectOptions): Promise<void> => {
        this.browser = options.browser;
        await this.connectPlaywrightDriver({
            origin: FeatureFlagsConstants.manabieUnleashHosting,
            timeout: 900 * 1000,
            browser: this.browser,
        });
    };
    /**
     * @returns {Promise<void>}: quit
     */
    quit = async (): Promise<void> => {
        await this.quitPlaywrightDriver();
    };

    /**
     *
     * @param description
     * @param fn
     * @returns {Promise<void>} void
     */
    instruction = async (
        description: string,
        fn: (context: UnleashAdminInterface) => Promise<void>
    ): Promise<void> => {
        return await this.instructionDriver<UnleashAdminInterface>(description, fn);
    };

    /**
     *
     * @param featureName
     * @returns {Promise<void>} void
     */
    archiveFeature = async (featureName: string): Promise<void> => {
        await this.page?.click('text=Feature toggles');
        await this.page?.click(`text=${featureName}`);
        await this.page?.click('button:has-text("Archive feature toggle")');
        await this.page?.click('button:has-text("Archive toggle")');
    };
}
