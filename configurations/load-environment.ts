interface IEnvironment {
    GRAPHQL_SCHEMA_URL_BOB: string;
    GRAPHQL_SCHEMA_URL_EUREKA: string;
    GRAPHQL_SCHEMA_URL_FATIMA: string;
    GRPC_ENDPOINT: string;
}

interface IKeyCloakEndpoint {
    URL_AUTH: string;
    URL_TOKEN: string;
    URL_USER: string;
    URL_BASH_JPREP: string;
}

interface IAccountJprep {
    USERNAME: string;
    PASSWORD: string;
}

type IEnvironmentKey = 'staging' | 'uat';

const configs: {
    [key in IEnvironmentKey]: IEnvironment;
} = {
    staging: {
        GRAPHQL_SCHEMA_URL_BOB: 'https://admin.staging-green.manabie.io/v1/graphql',
        GRAPHQL_SCHEMA_URL_EUREKA: 'https://admin.staging-green.manabie.io/eureka/v1/graphql',
        GRAPHQL_SCHEMA_URL_FATIMA: 'https://admin.staging-green.manabie.io/fatima/v1/graphql',
        GRPC_ENDPOINT: 'https://web-api.staging-green.manabie.io',
    },
    uat: {
        GRAPHQL_SCHEMA_URL_BOB: 'https://admin.uat.manabie.io/v1/graphql',
        GRAPHQL_SCHEMA_URL_EUREKA: 'https://admin.uat.manabie.io/eureka/v1/graphql',
        GRAPHQL_SCHEMA_URL_FATIMA: 'https://admin.uat.manabie.io/fatima/v1/graphql',
        GRPC_ENDPOINT: 'https://web-api.uat.manabie.io',
    },
};

const configsJPREP: Record<IEnvironmentKey, IEnvironment> = {
    staging: {
        GRAPHQL_SCHEMA_URL_BOB: 'https://admin.staging.jprep.manabie.io:31600/v1/graphql',
        GRAPHQL_SCHEMA_URL_EUREKA: 'https://admin.staging.jprep.manabie.io:31600/eureka/v1/graphql',
        GRAPHQL_SCHEMA_URL_FATIMA: 'https://admin.staging.jprep.manabie.io:31600/fatima/v1/graphql',
        GRPC_ENDPOINT: 'https://web-api.staging.jprep.manabie.io:31400',
    },
    uat: {
        GRAPHQL_SCHEMA_URL_BOB: 'https://admin.uat.jprep.manabie.io/v1/graphql',
        GRAPHQL_SCHEMA_URL_EUREKA: 'https://admin.uat.jprep.manabie.io/eureka/v1/graphql',
        GRAPHQL_SCHEMA_URL_FATIMA: 'https://admin.uat.jprep.manabie.io/fatima/v1/graphql',
        GRPC_ENDPOINT: 'https://web-api.uat.jprep.manabie.io',
    },
};

const endpointsKeyCloakForJPREP: Record<IEnvironmentKey, IKeyCloakEndpoint> = {
    staging: {
        URL_AUTH: 'https://d2020-ji-sso.jprep.jp/auth/',
        URL_TOKEN: 'https://d2020-ji-sso.jprep.jp/auth/realms/master/protocol/openid-connect/token',
        URL_USER: 'https://d2020-ji-sso.jprep.jp/auth/admin/realms/manabie-test/users/',
        URL_BASH_JPREP: 'https://web-api.staging.jprep.manabie.io:31400/jprep/',
    },
    uat: {
        URL_AUTH: 'https://d2020-ji-sso.jprep.jp/auth/',
        URL_TOKEN: 'https://d2020-ji-sso.jprep.jp/auth/realms/master/protocol/openid-connect/token',
        URL_USER: 'https://d2020-ji-sso.jprep.jp/auth/admin/realms/manabie-test/users/',
        URL_BASH_JPREP: 'https://web-api.uat.jprep.manabie.io:31400/jprep/',
    },
};

export const AccountSchoolAdminJPREP: Record<IEnvironmentKey, IAccountJprep> = {
    staging: {
        USERNAME: 'product.test+jprep.staging@manabie.com',
        PASSWORD: 'manabie',
    },
    uat: {
        USERNAME: 'thu.vo+jprepuat1@manabie.com',
        PASSWORD: '#$thu.vo123',
    },
};

const environmentKeys: IEnvironmentKey[] = ['uat', 'staging'];

function isEnvironmentKey(value: string): value is IEnvironmentKey {
    return environmentKeys.includes(value as IEnvironmentKey);
}

export function loadConfiguration(env: string | undefined) {
    if (env && isEnvironmentKey(env) && configs[env]) return configs[env];

    return configs.staging;
}

export function loadJprepConfiguration(env: string | undefined) {
    if (env && isEnvironmentKey(env) && configsJPREP[env]) return configsJPREP[env];

    return configsJPREP.staging;
}

export function loadJprepKeyCloakConfiguration(env: string | undefined) {
    if (env && isEnvironmentKey(env) && endpointsKeyCloakForJPREP[env])
        return endpointsKeyCloakForJPREP[env];

    return endpointsKeyCloakForJPREP.staging;
}

export function loadAccountJprepConfiguration(env: string | undefined) {
    if (env && isEnvironmentKey(env) && AccountSchoolAdminJPREP[env])
        return AccountSchoolAdminJPREP[env];

    return AccountSchoolAdminJPREP.staging;
}
