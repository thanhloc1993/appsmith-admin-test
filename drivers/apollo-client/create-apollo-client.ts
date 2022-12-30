import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';

import { REPORT_GRAPHQL_URL, REPORT_HASURA_SECRET } from './config';

export function createApolloClient() {
    if (!REPORT_GRAPHQL_URL) throw Error('Missing REPORT_GRAPHQL_URL');
    if (!REPORT_HASURA_SECRET) throw Error('Missing REPORT_HASURA_SECRET');

    const httpLink = createHttpLink({
        uri: REPORT_GRAPHQL_URL,
        headers: {
            'x-hasura-admin-secret': REPORT_HASURA_SECRET,
            'Content-Type': 'application/json',
        },
    });

    return new ApolloClient({
        link: httpLink,
        cache: new InMemoryCache(),
    });
}
