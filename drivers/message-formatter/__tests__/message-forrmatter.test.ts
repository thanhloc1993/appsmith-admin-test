import { IFormatterLogFn } from '@cucumber/cucumber/lib/formatter';
import getColorFns from '@cucumber/cucumber/lib/formatter/get_color_fns';
import { EventDataCollector } from '@cucumber/cucumber/lib/formatter/helpers';
import { SupportCodeLibraryBuilder } from '@cucumber/cucumber/lib/support_code_library_builder';
import {
    IDefineSupportCodeMethods,
    ISupportCodeLibrary,
} from '@cucumber/cucumber/lib/support_code_library_builder/types';
import { IdGenerator } from '@cucumber/messages';

import MessageFormatter from '../message-formatter';
import {
    envelopeFeature,
    envelopeMeta,
    envelopePickle,
    envelopeSource,
    resultDocumentStorage,
} from './data-test';
import EventEmitter from 'events';
import { PassThrough } from 'stream';
import { promisify } from 'util';

const mockedStorage = {
    bucket: jest.fn(() => ({
        create: jest.fn(),
    })),
    getBuckets: jest.fn(() => {
        return [
            [
                {
                    name: 'BUCKET_NAME',
                    file: jest.fn(() => ({
                        save: jest.fn,
                    })),
                    makePrivate: jest.fn,
                },
            ],
        ];
    }),
};

jest.mock('@google-cloud/storage', () => {
    return {
        Storage: jest.fn(() => mockedStorage),
    };
});

type DefineSupportCodeFunction = (methods: IDefineSupportCodeMethods) => void;

export function buildSupportCodeLibrary(
    cwd: string | DefineSupportCodeFunction = __dirname,
    fn: DefineSupportCodeFunction | null = null
): ISupportCodeLibrary {
    if (typeof cwd === 'function') {
        fn = cwd;
        cwd = __dirname;
    }
    const supportCodeLibraryBuilder = new SupportCodeLibraryBuilder();
    supportCodeLibraryBuilder.reset(cwd, IdGenerator.incrementing());
    if (typeof fn === 'function') {
        fn(supportCodeLibraryBuilder.methods);
    }
    return supportCodeLibraryBuilder.finalize();
}

describe('MessageFormatter | documentsStorage layer', () => {
    beforeEach(() => {
        process.env.BUCKET_NAME = 'BUCKET_NAME';
        process.env.GOOGLE_PROJECT_ID = 'GOOGLE_PROJECT_ID';
    });
    afterEach(() => {
        process.env.BUCKET_NAME = undefined;
        process.env.GOOGLE_PROJECT_ID = undefined;
    });

    function initMessageFormatter() {
        const eventBroadcaster = new EventEmitter();
        const eventDataCollector = new EventDataCollector(eventBroadcaster);

        const logFn: IFormatterLogFn = (data) => {
            return data;
        };
        const passThrough = new PassThrough();
        const supportCodeLibrary = buildSupportCodeLibrary();

        const messageFormatter = new MessageFormatter({
            eventBroadcaster,
            eventDataCollector,
            log: logFn,
            parsedArgvOptions: {},
            stream: passThrough,
            cleanup: promisify(passThrough.end.bind(passThrough)),
            supportCodeLibrary,
            cwd: __dirname,
            colorFns: getColorFns(passThrough, {}, false),
            snippetBuilder: {} as any,
        });
        return { messageFormatter, eventBroadcaster, eventDataCollector };
    }
    it('MessageFormatter | init', async () => {
        const { messageFormatter } = initMessageFormatter();
        expect(messageFormatter.googleStorage.bucketName).toEqual('BUCKET_NAME');
        expect(messageFormatter.googleStorage.projectId).toEqual('GOOGLE_PROJECT_ID');
        expect(messageFormatter.documentsStorage.instance).toEqual({
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
        });
    });

    it('MessageFormatter | initialInstance', async () => {
        const { eventBroadcaster, messageFormatter } = initMessageFormatter();

        //initialInstance
        eventBroadcaster.emit('envelope', envelopeMeta);

        expect(messageFormatter.documentsStorage.instance).toEqual(resultDocumentStorage.instance);
    });

    it('MessageFormatter | initialSources', async () => {
        const { eventBroadcaster, messageFormatter } = initMessageFormatter();

        //initialInstance
        eventBroadcaster.emit('envelope', envelopeMeta);

        //initialSources
        eventBroadcaster.emit('envelope', envelopeSource);

        expect(messageFormatter.documentsStorage.features).toEqual(
            resultDocumentStorage.featuresInitSource
        );
    });

    it('MessageFormatter | full flow init data', async () => {
        const { eventBroadcaster, messageFormatter } = initMessageFormatter();

        //initialInstance
        eventBroadcaster.emit('envelope', envelopeMeta);

        //initialSources
        eventBroadcaster.emit('envelope', envelopeSource);

        //initialFeature
        eventBroadcaster.emit('envelope', envelopeFeature);

        //initialHook - will update later

        //initialPickle
        eventBroadcaster.emit('envelope', envelopePickle);

        expect(messageFormatter.documentsStorage.features).toEqual(resultDocumentStorage.features);
    });
});
