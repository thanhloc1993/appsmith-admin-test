import { Envelope, SourceMediaType } from '@cucumber/messages';

export const envelopeMeta: Envelope = {
    meta: {
        protocolVersion: '16.0.1',
        implementation: { name: 'cucumber-js', version: '7.3.1' },
        cpu: { name: 'x64' },
        os: { name: 'linux', version: '5.13.0-41-generic' },
        runtime: { name: 'node.js', version: '16.13.0' },
    },
};

export const envelopeSource: Envelope = {
    source: {
        data: '@cms @demo @network\n\nFeature: Network environment simulation\n\n    Scenario: Network is down\n        Given "school admin" logins CMS\n        When network connectivity down on CMS\n        Then school admin can not connect network\n',
        uri: 'features/demo/network.feature',
        mediaType: SourceMediaType.TEXT_X_CUCUMBER_GHERKIN_PLAIN,
    },
};

export const envelopeFeature: Envelope = {
    gherkinDocument: {
        feature: {
            tags: [
                {
                    location: { line: 1, column: 1 },
                    name: '@cms',
                    id: '1b681560-6525-487a-8bc1-c108b3c122e8',
                },
                {
                    location: { line: 1, column: 6 },
                    name: '@demo',
                    id: '507a0a56-451f-40c6-bacd-1e36affd4d53',
                },
                {
                    location: { line: 1, column: 12 },
                    name: '@network',
                    id: 'f6fc6861-86bc-43e2-bb49-1278e9a2a44e',
                },
            ],
            location: { line: 3, column: 1 },
            language: 'en',
            keyword: 'Feature',
            name: 'Network environment simulation',
            description: '',
            children: [
                {
                    scenario: {
                        id: 'e10b3099-13e6-44a9-bb2f-3247e0607775',
                        tags: [],
                        location: { line: 5, column: 5 },
                        keyword: 'Scenario',
                        name: 'Network is down',
                        description: '',
                        steps: [
                            {
                                id: 'a2662207-99e9-4da1-b821-d962c563cff4',
                                location: { line: 6, column: 9 },
                                keyword: 'Given ',
                                text: '"school admin" logins CMS',
                            },
                            {
                                id: '90b5ccf5-3649-4852-8095-b04f493b6836',
                                location: { line: 7, column: 9 },
                                keyword: 'When ',
                                text: 'network connectivity down on CMS',
                            },
                            {
                                id: '537b763d-0701-4c22-96c6-e17b4411cc23',
                                location: { line: 8, column: 9 },
                                keyword: 'Then ',
                                text: 'school admin can not connect network',
                            },
                        ],
                        examples: [],
                    },
                },
            ],
        },
        comments: [],
        uri: 'features/demo/network.feature',
    },
};

export const envelopePickle: Envelope = {
    pickle: {
        id: '118526f7-8280-422d-bd72-849457b9a241',
        uri: 'features/demo/network.feature',
        astNodeIds: ['e10b3099-13e6-44a9-bb2f-3247e0607775'],
        tags: [
            { name: '@cms', astNodeId: '1b681560-6525-487a-8bc1-c108b3c122e8' },
            { name: '@demo', astNodeId: '507a0a56-451f-40c6-bacd-1e36affd4d53' },
            { name: '@network', astNodeId: 'f6fc6861-86bc-43e2-bb49-1278e9a2a44e' },
        ],
        name: 'Network is down',
        language: 'en',
        steps: [
            {
                id: '82dbd853-7b40-4e94-9d6f-9f3855bdd7ed',
                text: '"school admin" logins CMS',
                astNodeIds: ['a2662207-99e9-4da1-b821-d962c563cff4'],
            },
            {
                id: 'ae8313b7-bdf4-44c8-a651-95c2228fcd0e',
                text: 'network connectivity down on CMS',
                astNodeIds: ['90b5ccf5-3649-4852-8095-b04f493b6836'],
            },
            {
                id: '237213e5-9c98-4bc8-ace4-69a89bc54fec',
                text: 'school admin can not connect network',
                astNodeIds: ['537b763d-0701-4c22-96c6-e17b4411cc23'],
            },
        ],
    },
};

export const resultDocumentStorage = {
    features: {
        'features/demo/network.feature': {
            source: {
                data: '@cms @demo @network\n\nFeature: Network environment simulation\n\n    Scenario: Network is down\n        Given "school admin" logins CMS\n        When network connectivity down on CMS\n        Then school admin can not connect network\n',
                uri: 'features/demo/network.feature',
                mediaType: 'text/x.cucumber.gherkin+plain',
            },
            status: 'UNKNOWN',
            featureId: expect.any(String),
            scenarios: [
                {
                    id: 'e10b3099-13e6-44a9-bb2f-3247e0607775',
                    tags: [],
                    location: {
                        line: 5,
                        column: 5,
                    },
                    keyword: 'Scenario',
                    name: 'Network is down',
                    description: '',
                    steps: [
                        {
                            id: 'a2662207-99e9-4da1-b821-d962c563cff4',
                            location: {
                                line: 6,
                                column: 9,
                            },
                            keyword: 'Given ',
                            text: '"school admin" logins CMS',
                        },
                        {
                            id: '90b5ccf5-3649-4852-8095-b04f493b6836',
                            location: {
                                line: 7,
                                column: 9,
                            },
                            keyword: 'When ',
                            text: 'network connectivity down on CMS',
                        },
                        {
                            id: '537b763d-0701-4c22-96c6-e17b4411cc23',
                            location: {
                                line: 8,
                                column: 9,
                            },
                            keyword: 'Then ',
                            text: 'school admin can not connect network',
                        },
                    ],
                    examples: [],
                },
            ],
            gherkinDocument: {
                feature: {
                    tags: [
                        {
                            location: {
                                line: 1,
                                column: 1,
                            },
                            name: '@cms',
                            id: '1b681560-6525-487a-8bc1-c108b3c122e8',
                        },
                        {
                            location: {
                                line: 1,
                                column: 6,
                            },
                            name: '@demo',
                            id: '507a0a56-451f-40c6-bacd-1e36affd4d53',
                        },
                        {
                            location: {
                                line: 1,
                                column: 12,
                            },
                            name: '@network',
                            id: 'f6fc6861-86bc-43e2-bb49-1278e9a2a44e',
                        },
                    ],
                    location: {
                        line: 3,
                        column: 1,
                    },
                    language: 'en',
                    keyword: 'Feature',
                    name: 'Network environment simulation',
                    description: '',
                    children: [
                        {
                            scenario: {
                                id: 'e10b3099-13e6-44a9-bb2f-3247e0607775',
                                tags: [],
                                location: {
                                    line: 5,
                                    column: 5,
                                },
                                keyword: 'Scenario',
                                name: 'Network is down',
                                description: '',
                                steps: [
                                    {
                                        id: 'a2662207-99e9-4da1-b821-d962c563cff4',
                                        location: {
                                            line: 6,
                                            column: 9,
                                        },
                                        keyword: 'Given ',
                                        text: '"school admin" logins CMS',
                                    },
                                    {
                                        id: '90b5ccf5-3649-4852-8095-b04f493b6836',
                                        location: {
                                            line: 7,
                                            column: 9,
                                        },
                                        keyword: 'When ',
                                        text: 'network connectivity down on CMS',
                                    },
                                    {
                                        id: '537b763d-0701-4c22-96c6-e17b4411cc23',
                                        location: {
                                            line: 8,
                                            column: 9,
                                        },
                                        keyword: 'Then ',
                                        text: 'school admin can not connect network',
                                    },
                                ],
                                examples: [],
                            },
                        },
                    ],
                },
                comments: [],
                uri: 'features/demo/network.feature',
            },
            dataMutation: {
                arg: {
                    feature_id: expect.any(String),
                    instance_id: expect.any(String),
                    name: 'Network environment simulation',
                    keyword: 'Feature',
                    tags: ['@cms', '@demo', '@network'],
                    rules: [],
                    scenarios: [
                        {
                            id: 'e10b3099-13e6-44a9-bb2f-3247e0607775',
                            tags: [],
                            location: {
                                line: 5,
                                column: 5,
                            },
                            keyword: 'Scenario',
                            name: 'Network is down',
                            description: '',
                            steps: [
                                {
                                    id: 'a2662207-99e9-4da1-b821-d962c563cff4',
                                    location: {
                                        line: 6,
                                        column: 9,
                                    },
                                    keyword: 'Given ',
                                    text: '"school admin" logins CMS',
                                },
                                {
                                    id: '90b5ccf5-3649-4852-8095-b04f493b6836',
                                    location: {
                                        line: 7,
                                        column: 9,
                                    },
                                    keyword: 'When ',
                                    text: 'network connectivity down on CMS',
                                },
                                {
                                    id: '537b763d-0701-4c22-96c6-e17b4411cc23',
                                    location: {
                                        line: 8,
                                        column: 9,
                                    },
                                    keyword: 'Then ',
                                    text: 'school admin can not connect network',
                                },
                            ],
                            examples: [],
                        },
                    ],
                    children: [
                        {
                            scenario: {
                                id: 'e10b3099-13e6-44a9-bb2f-3247e0607775',
                                tags: [],
                                location: {
                                    line: 5,
                                    column: 5,
                                },
                                keyword: 'Scenario',
                                name: 'Network is down',
                                description: '',
                                steps: [
                                    {
                                        id: 'a2662207-99e9-4da1-b821-d962c563cff4',
                                        location: {
                                            line: 6,
                                            column: 9,
                                        },
                                        keyword: 'Given ',
                                        text: '"school admin" logins CMS',
                                    },
                                    {
                                        id: '90b5ccf5-3649-4852-8095-b04f493b6836',
                                        location: {
                                            line: 7,
                                            column: 9,
                                        },
                                        keyword: 'When ',
                                        text: 'network connectivity down on CMS',
                                    },
                                    {
                                        id: '537b763d-0701-4c22-96c6-e17b4411cc23',
                                        location: {
                                            line: 8,
                                            column: 9,
                                        },
                                        keyword: 'Then ',
                                        text: 'school admin can not connect network',
                                    },
                                ],
                                examples: [],
                            },
                        },
                    ],
                    description: '',
                    uri: 'features/demo/network.feature',
                    media_type: 'text/x.cucumber.gherkin+plain',
                    data: '@cms @demo @network\n\nFeature: Network environment simulation\n\n    Scenario: Network is down\n        Given "school admin" logins CMS\n        When network connectivity down on CMS\n        Then school admin can not connect network\n',
                    status: '',
                },
            },
        },
    },
    featuresInitSource: {
        'features/demo/network.feature': {
            source: {
                data:
                    '@cms @demo @network\n' +
                    '\n' +
                    'Feature: Network environment simulation\n' +
                    '\n' +
                    '    Scenario: Network is down\n' +
                    '        Given "school admin" logins CMS\n' +
                    '        When network connectivity down on CMS\n' +
                    '        Then school admin can not connect network\n',
                uri: 'features/demo/network.feature',
                mediaType: 'text/x.cucumber.gherkin+plain',
            },
            status: 'UNKNOWN',
            featureId: expect.any(String),
        },
    },
    instance: {
        instanceId: expect.any(String),
        totalWorker: 1,
        instanceName: 'Welcome to manabie end-to-end world',
        status: 'UNKNOWN',
        statusStatistics: {
            feature: {
                PASSED: 0,
                UNKNOWN: 0,
                UNDEFINED: 0,
                AMBIGUOUS: 0,
                FAILED: 0,
                PENDING: 0,
                SKIPPED: 0,
            },
            scenario: {
                PASSED: 0,
                UNKNOWN: 0,
                UNDEFINED: 0,
                AMBIGUOUS: 0,
                FAILED: 0,
                PENDING: 0,
                SKIPPED: 0,
            },
        },
        flavor: expect.any(Object),
        tags: [],
        squadTags: [],
        metadata: {
            protocolVersion: '16.0.1',
            implementation: { name: 'cucumber-js', version: '7.3.1' },
            cpu: { name: 'x64' },
            os: { name: 'linux', version: '5.13.0-41-generic' },
            runtime: { name: 'node.js', version: '16.13.0' },
        },
    },
};
