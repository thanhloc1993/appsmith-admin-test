import { FeatureFlagsConstants } from './constants';
import { EnvironmentStrategy, OrganizationStrategy } from './custom-strategies';
import { startUnleash, Unleash } from 'unleash-client';

export class FeatureFlagsHelper {
    private instance: Unleash | undefined;
    url: string;

    constructor(url = FeatureFlagsConstants.manabieUnleashAPI) {
        this.url = url;
    }

    private async initInstance(): Promise<Unleash> {
        return await startUnleash({
            appName: 'manabie',
            disableMetrics: this.url.includes('unit-test'),
            url: this.url,
            customHeaders: {
                Authorization: FeatureFlagsConstants.unleashClientKey(),
            },
            strategies: [new EnvironmentStrategy(), new OrganizationStrategy()],
        });
    }

    async isSkip(featureTags: string[] | undefined): Promise<boolean> {
        if (!this.instance) {
            try {
                this.instance = await this.initInstance();
            } catch (e) {
                console.warn('[Unleash]: isSkip', e);
                return false;
            }
        }

        if (!featureTags) {
            return false;
        }

        const featureFlags = this.instance?.getFeatureToggleDefinitions() || [];

        for (let index = 0; index < featureTags!.length; index++) {
            const tag = featureTags[index];
            const featureFlag = tag.replace('@', '');
            if (
                featureFlags?.findIndex((feature) => feature.name.trim() == featureFlag.trim()) ==
                -1
            ) {
                continue;
            }

            const isEnable = this.instance?.isEnabled(featureFlag, {
                env: FeatureFlagsConstants.currentUnleashENV,
                org: '',
            });
            console.log(`${featureFlag}: ${isEnable}`);
            if (!isEnable) {
                return true;
            }
        }
        return false;
    }

    async isEnabled(featureToggle: string, orgId = ''): Promise<boolean> {
        if (!this.instance) {
            try {
                this.instance = await this.initInstance();
            } catch (e) {
                console.warn('[Unleash]: isEnabled', e);
                return false;
            }
        }

        if (!featureToggle) {
            return false;
        }

        const isEnable = this.instance?.isEnabled(featureToggle, {
            env: FeatureFlagsConstants.currentUnleashENV,
            org: orgId,
        });
        console.log(`${featureToggle}: ${isEnable}`);
        return isEnable;
    }

    async getDisabledFeatureFlags(): Promise<string[]> {
        if (!this.instance) {
            try {
                this.instance = await this.initInstance();
            } catch (e) {
                console.warn('[Unleash]: isSkip', e);
                return [];
            }
        }
        const featureFlags = this.instance?.getFeatureToggleDefinitions() || [];

        const disabledFeatureFlags = [] as string[];
        if (!featureFlags.length) return disabledFeatureFlags;

        featureFlags.forEach((featureFlag) => {
            const isEnable = this.instance?.isEnabled(featureFlag.name, {
                env: FeatureFlagsConstants.currentUnleashENV,
                org: '',
            });

            if (!isEnable) {
                disabledFeatureFlags.push(featureFlag.name);
            }
        });

        return disabledFeatureFlags;
    }
}

export const featureFlagsHelper = new FeatureFlagsHelper();
