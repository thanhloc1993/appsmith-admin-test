import { ManabieConfiguration } from '@manabie-com/mana-cli';

const configuration: ManabieConfiguration = {
    envfile: ['.env', '.env.local'],
    tsConfig: './tsconfig.json',
    graphql: {
        rootTypePath: './hasura/types/root-types.ts',
        schemaPath: './schema.graphql',
        documents: [
            {
                inputDocument: './hasura/*.{ts,graphql}',
                outputType: './hasura/types/draft-types.ts',
                outputQuery: './hasura/types/all-queries.graphql',
                schemaPath: './hasura/__generated__/draft/schema.graphql',
                rootTypePath: './hasura/__generated__/draft/root-types.ts',
            },
        ],
    },
    hasura: {
        version: 'v1.3.3',
        instances: [
            {
                hasuraUrl: 'https://admin.staging-green.manabie.io/draft',
                localHasuraUrl: 'https://admin.local-green.manabie.io:31600/draft',
                schemaPath: './hasura/__generated__/draft/schema.graphql',
                secretEnvName: {
                    ADMIN_SECRET: 'MANA_ADMIN_SECRET_DRAFT',
                },
                logFile: './hasura/__generated__/draft/log.json',
                metadataPath: './hasura/__generated__/draft/metadata',
                graphqlFilePaths: ['./hasura/__generated__/draft/all-queries.graphql'],
            },
        ],
    },
};

export default configuration;
