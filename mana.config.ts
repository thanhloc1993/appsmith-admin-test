import { ManabieConfiguration } from '@manabie-com/mana-cli';

const configuration: ManabieConfiguration = {
    envfile: ['.env', '.env.local'],
    tsConfig: './tsconfig.json',
    graphql: {
        rootTypePath: './supports/graphql/__generated__/root-types.ts',
        schemaPath: './schema.graphql',
        documents: [
            {
                inputDocument: './supports/graphql/bob/*.{ts,graphql}',
                outputType: './supports/graphql/bob/bob-types.ts',
                outputQuery: './supports/graphql/__generated__/bob/all-queries.graphql',
                schemaPath: './supports/graphql/__generated__/bob/schema.graphql',
                rootTypePath: './supports/graphql/__generated__/bob/root-types.ts',
            },
            {
                inputDocument: './supports/graphql/eureka/*.{ts,graphql}',
                outputType: './supports/graphql/eureka/eureka-types.ts',
                outputQuery: './supports/graphql/__generated__/eureka/all-queries.graphql',
                schemaPath: './supports/graphql/__generated__/eureka/schema.graphql',
                rootTypePath: './supports/graphql/__generated__/eureka/root-types.ts',
            },
            {
                inputDocument: './supports/graphql/fatima/*.{ts,graphql}',
                outputType: './supports/graphql/fatima/fatima-types.ts',
                outputQuery: './supports/graphql/__generated__/fatima/all-queries.graphql',
                schemaPath: './supports/graphql/__generated__/fatima/schema.graphql',
                rootTypePath: './supports/graphql/__generated__/fatima/root-types.ts',
            },
        ],
    },
    hasura: {
        version: 'v1.3.3',
        instances: [
            {
                hasuraUrl: 'https://admin.staging-green.manabie.io/',
                localHasuraUrl: 'https://admin.local-green.manabie.io:31600/',
                schemaPath: './supports/graphql/__generated__/bob/schema.graphql',
                secretEnvName: {
                    ADMIN_SECRET: 'MANA_ADMIN_SECRET_BOB',
                },
                logFile: './supports/graphql/__generated__/bob/log.json',
                metadataPath: './supports/graphql/__generated__/bob/metadata',
                graphqlFilePaths: ['./supports/graphql/__generated__/bob/all-queries.graphql'],
            },
            {
                hasuraUrl: 'https://admin.staging-green.manabie.io/eureka/',
                localHasuraUrl: 'https://admin.local-green.manabie.io:31600/eureka',
                schemaPath: './supports/graphql/__generated__/eureka/schema.graphql',
                secretEnvName: {
                    ADMIN_SECRET: 'MANA_ADMIN_SECRET_EUREKA',
                },
                graphqlFilePaths: ['./supports/graphql/__generated__/eureka/all-queries.graphql'],
                metadataPath: './supports/graphql/__generated__/eureka/metadata',
                logFile: './supports/graphql/__generated__/eureka/log.json',
            },
            {
                hasuraUrl: 'https://admin.staging-green.manabie.io/fatima/',
                localHasuraUrl: 'https://admin.local-green.manabie.io:31600/fatima',
                schemaPath: './supports/graphql/__generated__/fatima/schema.graphql',
                secretEnvName: {
                    ADMIN_SECRET: 'MANA_ADMIN_SECRET_FATIMA',
                },
                graphqlFilePaths: './supports/graphql/__generated__/fatima/all-queries.graphql',
                metadataPath: './supports/graphql/__generated__/fatima/metadata',
                logFile: './supports/graphql/__generated__/fatima/log.json',
            },
        ],
    },
};

export default configuration;
