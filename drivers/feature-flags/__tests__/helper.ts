import { FeatureFlagsHelper } from '../helper';
import nock from 'nock';

let counter = 1;
const getUrl = () => `http://unit-test${counter++}.app/`;

const defaultToggles = [
    {
        name: 'feature-a',
        enabled: true,
        strategies: [],
    },
    {
        name: 'feature-b',
        enabled: false,
        strategies: [],
    },
    {
        name: 'feature-c',
        enabled: true,
        strategies: [],
    },
];

let featureFlagsHelper: FeatureFlagsHelper;
let url: string;

function mockNetwork(toggles = defaultToggles, shouldError = false, url = getUrl()) {
    const path = '/client/features';

    if (!shouldError) {
        nock(url).get(path).reply(200, { features: toggles });
    } else {
        nock(url).persist().get(path).replyWithError('Internal Server Error');
    }
    return url;
}

describe.skip('feature-flags-helper', () => {
    beforeEach(async () => {
        url = mockNetwork();
        featureFlagsHelper = new FeatureFlagsHelper(url);
    });

    it('isSkip = false, because not match any tag', async () => {
        expect(await featureFlagsHelper.isSkip(['@a', '@b', '@c'])).toEqual(false);
    });

    it('isSkip = false, because @feature-a is enable', async () => {
        expect(await featureFlagsHelper.isSkip(['@a', '@b', '@c', '@feature-a'])).toEqual(false);
    });

    it('isSkip = true, because @feature-b is disable', async () => {
        expect(await featureFlagsHelper.isSkip(['@a', '@b', '@c', '@feature-b'])).toEqual(true);
    });

    it('isSkip = false, if server dies', async () => {
        url = mockNetwork(defaultToggles, true);
        featureFlagsHelper = new FeatureFlagsHelper(url);
        expect(await featureFlagsHelper.isSkip(['@a', '@b', '@c', '@feature-b'])).toEqual(false);
    });

    it('isEnabled = true, if the flag is enable', async () => {
        expect(await featureFlagsHelper.isEnabled('feature-a')).toEqual(true);
    });

    it('isEnabled = false, if the flag is disable', async () => {
        expect(await featureFlagsHelper.isEnabled('feature-d')).toEqual(true);
    });

    it('isEnabled = false, if server dies', async () => {
        url = mockNetwork(defaultToggles, true);
        featureFlagsHelper = new FeatureFlagsHelper(url);
        expect(await featureFlagsHelper.isEnabled('@feature-b')).toEqual(false);
    });
});
