import { loadConfiguration } from 'configurations/load-environment';

const { GRAPHQL_SCHEMA_URL_BOB, GRAPHQL_SCHEMA_URL_EUREKA, GRAPHQL_SCHEMA_URL_FATIMA } =
    loadConfiguration(process.env.ENV);

export { GRAPHQL_SCHEMA_URL_BOB, GRAPHQL_SCHEMA_URL_EUREKA, GRAPHQL_SCHEMA_URL_FATIMA };
