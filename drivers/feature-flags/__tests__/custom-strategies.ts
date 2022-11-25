import { EnvironmentStrategy, OrganizationStrategy } from '../custom-strategies';
import nock from 'nock';
import { startUnleash, Unleash } from 'unleash-client';

let counter = 1;
const getUrl = () => `http://test2${counter++}.app/`;

const defaultToggles = [
    {
        name: 'feature',
        enabled: true,
        strategies: [],
    },
    {
        name: 'f-context',
        enabled: true,
        strategies: [
            {
                name: 'strategy_environment',
                parameters: {
                    environments: 'stag,uat',
                },
            },
        ],
    },
    {
        name: 'ff-context',
        enabled: true,
        strategies: [
            {
                name: 'strategy_organization',
                parameters: {
                    organizations: '1, 2, 3',
                },
            },
        ],
    },
];

let instance: Unleash;

function mockNetwork(toggles = defaultToggles, url = getUrl()) {
    nock(url).get('/client/features').reply(200, { features: toggles });
    return url;
}

describe('custom-strategies', () => {
    beforeEach(async () => {
        const url = mockNetwork();
        instance = await startUnleash({
            appName: 'foo',
            disableMetrics: true,
            url,
            strategies: [new EnvironmentStrategy(), new OrganizationStrategy()],
        });
    });
    it('isEnable("unknown") is false', async () => {
        expect(instance.isEnabled('unknown')).toEqual(false);
        instance.destroy();
    });

    it('isEnable("feature") is true', async () => {
        expect(instance.isEnabled('feature')).toEqual(true);
        instance.destroy();
    });

    it('isEnable("feature") is true with env = stag', async () => {
        expect(
            instance.isEnabled('feature', {
                env: 'stag',
            })
        ).toEqual(true);
        instance.destroy();
    });

    it('isEnable("feature") is true with org = 1', async () => {
        expect(
            instance.isEnabled('feature', {
                org: 1,
            })
        ).toEqual(true);
        instance.destroy();
    });

    it('isEnable("f-context") is false without env', async () => {
        expect(instance.isEnabled('f-context')).toEqual(false);
        instance.destroy();
    });

    it('isEnable("f-context") is true with env = stag', async () => {
        expect(
            instance.isEnabled('f-context', {
                env: 'stag',
            })
        ).toEqual(true);
        instance.destroy();
    });

    it('isEnable("f-context") is false with env = pro', async () => {
        expect(
            instance.isEnabled('f-context', {
                env: 'pro',
            })
        ).toEqual(false);
        instance.destroy();
    });

    it('isEnable("ff-context") is false without org', async () => {
        expect(instance.isEnabled('ff-context')).toEqual(false);
        instance.destroy();
    });

    it('isEnable("ff-context") is true with org = 1', async () => {
        expect(
            instance.isEnabled('ff-context', {
                org: '1',
            })
        ).toEqual(true);
        instance.destroy();
    });

    it('isEnable("ff-context") is false with env = pro', async () => {
        expect(
            instance.isEnabled('ff-context', {
                env: 'pro',
            })
        ).toEqual(false);
        instance.destroy();
    });
});
