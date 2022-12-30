import { featureFlagsHelper } from '../../../drivers/feature-flags/helper';

export async function parseDisabledUnleashFeatureToTagExpression() {
    const res = await featureFlagsHelper.getDisabledFeatureFlags();
    if (!res || !res.length) return '';

    return res.map((e) => `not @${e}`).join(' and ');
}
