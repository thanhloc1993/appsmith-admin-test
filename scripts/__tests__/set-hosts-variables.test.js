// eslint-disable-next-line @typescript-eslint/no-var-requires
const { generateHosts, setHostVariables } = require('../set-hosts-variables');

describe('setHostVariables', () => {
    const OLD_ENV = process.env;

    afterAll(() => {
        process.env = OLD_ENV; // Restore old environment
    });
    it('should set host corresponding for staging manabie', () => {
        process.env = {
            ...OLD_ENV,
            ENV: 'staging',
            ORGANIZATION: 'manabie',
        };

        setHostVariables({
            exportVariable: (key, value) => {
                process.env[key] = value;
            },
        });

        expect(process.env.BO_HOST).toEqual('https://backoffice.staging.manabie.io/');
        expect(process.env.TEACHER_HOST).toEqual('https://teacher.staging.manabie.io/');
        expect(process.env.LEARNER_HOST).toEqual('https://learner.staging.manabie.io/');
    });

    it('should set host corresponding for uat jprep', () => {
        process.env = {
            ...OLD_ENV,
            ENV: 'uat',
            ORGANIZATION: 'jprep',
        };

        setHostVariables({
            exportVariable: (key, value) => {
                process.env[key] = value;
            },
        });

        expect(process.env.BO_HOST).toEqual('https://backoffice.uat.jprep.manabie.io/');
        expect(process.env.TEACHER_HOST).toEqual('https://teacher.uat.jprep.manabie.io/');
        expect(process.env.LEARNER_HOST).toEqual('https://learner.uat.jprep.manabie.io/');
    });
});
describe('generateHosts', () => {
    test('should gen host corresponding for staging manabie', () => {
        const hosts = generateHosts('staging', 'manabie');
        expect(hosts).toEqual({
            bo_host: 'https://backoffice.staging.manabie.io/',
            teacher_host: 'https://teacher.staging.manabie.io/',
            learner_host: 'https://learner.staging.manabie.io/',
        });
    });

    test('should gen host corresponding uat manabie', () => {
        const hosts = generateHosts('uat', 'manabie');
        expect(hosts).toEqual({
            bo_host: 'https://backoffice.uat.manabie.io/',
            teacher_host: 'https://teacher.uat.manabie.io/',
            learner_host: 'https://learner.uat.manabie.io/',
        });
    });

    test('should gen host corresponding staging jprep', () => {
        const hosts = generateHosts('staging', 'jprep');
        expect(hosts).toEqual({
            bo_host: 'https://backoffice.staging.jprep.manabie.io/',
            teacher_host: 'https://teacher.staging.jprep.manabie.io/',
            learner_host: 'https://learner.staging.jprep.manabie.io/',
        });
    });

    test('should gen host corresponding uat jprep', () => {
        const hosts = generateHosts('uat', 'jprep');
        expect(hosts).toEqual({
            bo_host: 'https://backoffice.uat.jprep.manabie.io/',
            teacher_host: 'https://teacher.uat.jprep.manabie.io/',
            learner_host: 'https://learner.uat.jprep.manabie.io/',
        });
    });
});
