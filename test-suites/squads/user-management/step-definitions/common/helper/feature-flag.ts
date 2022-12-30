import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { FeatureFlags } from '../constants/feature-flag';

export type FeatureFlag = keyof typeof FeatureFlags;

export function isEnabledFeatureFlag(featureFlag: FeatureFlag) {
    return featureFlagsHelper.isEnabled(FeatureFlags[featureFlag]);
}
