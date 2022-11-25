let defaultProfile = {
    requireModule: ['ts-node/register', 'tsconfig-paths/register'],
    require: [
        'test-suites/squads/**/step-definitions/**/*.ts',
        'step-definitions/**/*.ts',
        'supports/**/*.ts',
    ],
    publishQuiet: true,
    order: 'random',
    forceExit: true,
    failFast: process.env.FAIL_FAST === 'true',
};

let addOnDevelopmentProfile = {
    format: ['progress', 'json:report/json/cucumber-report.json'],
};

let addOnCIProfile = {
    parallel: 5,
    format: ['./drivers/message-formatter'],
};

const cucumberConfig = {
    default: defaultProfile,
    development: addOnDevelopmentProfile,
    ci: addOnCIProfile,
    manabie: {
        tags: `not @jprep`,
    },
    jprep: {
        tags: `@jprep`,
    },
};

module.exports = cucumberConfig;
