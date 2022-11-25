const env = process.env.ENV || 'staging';

export class FeatureFlagsConstants {
    static unleashURLs: any = {
        manabie: {
            staging: 'admin.staging-green.manabie.io',
            uat: 'admin.uat.manabie.io',
            production: 'admin.prod.manabie-vn.manabie.io:31600',
        },
        jprep: {
            staging: 'admin.staging.jprep.manabie.io',
            uat: 'admin.uat.jprep.manabie.io:31600',
            production: 'admin.prod.jprep.manabie.io:31600',
        },
        // more partners configs
    };

    static envsMapping: any = {
        staging: 'stag',
        uat: 'uat',
        production: 'prod',
    };

    static unleashClientKey = (): string => {
        let clientKey = process.env.UNLEASH_CLIENT_KEY || '';
        clientKey = clientKey.replace(/"/g, '');
        return clientKey;
    };

    static manabieUnleashAPI = `https://${FeatureFlagsConstants.unleashURLs.manabie[env]}/unleash/api/`;

    static manabieUnleashHosting = `https://${FeatureFlagsConstants.unleashURLs.manabie[env]}/unleash/`;

    static currentUnleashENV = FeatureFlagsConstants.envsMapping[env];

    // Credential
    static unleashUsername = (): string => {
        return JSON.parse(process.env.UNLEASH_CREDENTIAL || '{}')[env]?.['username'];
    };

    static unleashPassword = (): string => {
        return JSON.parse(process.env.UNLEASH_CREDENTIAL || '{}')[env]?.['password'];
    };
}
