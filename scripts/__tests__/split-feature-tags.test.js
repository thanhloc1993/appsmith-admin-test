// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const {
    smallFeatureChunks,
    convertCronTime2ICTTime,
    splitFeatureTags,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('../split-feature-tags');

describe('smallFeatureChunks', () => {
    const envObj = process.env;
    afterEach(() => {
        process.env = envObj;
    });

    it('should split feature tags with chunk = 1', () => {
        const { results, tagExpression } = smallFeatureChunks({
            chunk: 1,
            organization: 'jprep',
            pathFile: path.resolve(__dirname, 'squad-tags.json'),
        });
        expect(tagExpression).toEqual(['user', 'syllabus-1', 'syllabus-2']);
        expect(results).toEqual([
            {
                tagString: '@user and (@user-1)',
                squad: 'user',
                time: '40 1 * * *',
                organization: 'jprep',
                key: 'user',
            },
            {
                tagString: '@user and (@user-2)',
                squad: 'user',
                time: '40 1 * * *',
                organization: 'jprep',
                key: 'user',
            },
            {
                tagString: '@syllabus and (@syllabus-1)',
                squad: 'syllabus',
                time: '00 22 * * *',
                organization: 'jprep',
                key: 'syllabus-1',
            },
            {
                tagString: '@syllabus and (@syllabus-2)',
                squad: 'syllabus',
                time: '00 22 * * *',
                organization: 'jprep',
                key: 'syllabus-1',
            },
            {
                tagString: '@syllabus and (@syllabus-1)',
                squad: 'syllabus',
                time: '30 22 * * *',
                organization: 'jprep',
                key: 'syllabus-2',
            },
            {
                tagString: '@syllabus and (@syllabus-2)',
                squad: 'syllabus',
                time: '30 22 * * *',
                organization: 'jprep',
                key: 'syllabus-2',
            },
        ]);
    });

    it('should split feature tags with chunk = 1 and group syllabus-1,syllabus-2', () => {
        const { results, tagExpression } = smallFeatureChunks({
            chunk: 1,
            organization: 'jprep',
            pathFile: path.resolve(__dirname, 'squad-tags.json'),
            group: ['syllabus-1', 'syllabus-2'],
        });
        expect(tagExpression).toEqual(['syllabus-1', 'syllabus-2']);
        expect(results).toEqual([
            {
                tagString: '@syllabus and (@syllabus-1)',
                squad: 'syllabus',
                time: '00 22 * * *',
                organization: 'jprep',
                key: 'syllabus-1',
            },
            {
                tagString: '@syllabus and (@syllabus-2)',
                squad: 'syllabus',
                time: '00 22 * * *',
                organization: 'jprep',
                key: 'syllabus-1',
            },
            {
                tagString: '@syllabus and (@syllabus-1)',
                squad: 'syllabus',
                time: '30 22 * * *',
                organization: 'jprep',
                key: 'syllabus-2',
            },
            {
                tagString: '@syllabus and (@syllabus-2)',
                squad: 'syllabus',
                time: '30 22 * * *',
                organization: 'jprep',
                key: 'syllabus-2',
            },
        ]);
    });
    it('should only split feature tags with chunk = 1 and cron time = ""30 22 * * *"', () => {
        process.env = {
            ...process.env,
            CRON_TIME: '30 22 * * *',
        };
        const { results, tagExpression } = smallFeatureChunks({
            chunk: 1,
            organization: 'jprep',
            pathFile: path.resolve(__dirname, 'squad-tags.json'),
            cronTime: convertCronTime2ICTTime(),
        });
        expect(tagExpression).toEqual(['syllabus-2']);
        expect(results).toEqual([
            {
                tagString: '@syllabus and (@syllabus-1)',
                squad: 'syllabus',
                time: '30 22 * * *',
                organization: 'jprep',
                key: 'syllabus-2',
            },
            {
                tagString: '@syllabus and (@syllabus-2)',
                squad: 'syllabus',
                time: '30 22 * * *',
                organization: 'jprep',
                key: 'syllabus-2',
            },
        ]);
    });
});
describe('splitFeatureTags', () => {
    const envObj = process.env;
    afterEach(() => {
        process.env = envObj;
    });
    it('should split feature tags with chunk = 1', () => {
        process.env = {
            ...process.env,
            CRON_TIME: '30 22 * * *',
            TAGS: '@syllabus',
            SQUADS: '@syllabus',
        };
        const { results, tagExpression } = splitFeatureTags({
            chunk: 1,
        });
        expect(tagExpression).toEqual('@syllabus');
        expect(results).toEqual([
            {
                tagString: '@syllabus',
                squad: '@syllabus',
                organization: undefined,
            },
        ]);
    });

    it('should split feature tags with chunk = 1 and group syllabus-1,syllabus-2', () => {
        process.env = {
            ...process.env,
            GROUP: 'syllabus-1,syllabus-2',
        };
        const { tagExpression } = splitFeatureTags({
            chunk: 1,
        });
        expect(tagExpression).toEqual('syllabus-1, syllabus-2');
    });
});
