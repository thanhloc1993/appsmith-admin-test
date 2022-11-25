import {
    ILoadConfigurationOptions,
    IRunEnvironment,
    loadConfiguration,
    runCucumber,
} from '@cucumber/cucumber/api';
import { isTruthyString } from '@cucumber/cucumber/lib/configuration/index';
import parse from '@cucumber/tag-expressions';

import { parseDisabledUnleashFeatureToTagExpression } from './unleash';
import { parseGherkinExpression } from './utils';
import { Command } from 'commander';
import path from 'path';

interface FinderOptions {
    tags: string[];
    profile: string[];
    paths: string[];
    filterUnleash: boolean;
    config: string;
}
const defaultFeature = path.resolve(__dirname, '../../test-suites/squads/**/features/**/*.feature');
const defaultConfig = path.resolve(__dirname, '../../cucumber.js').replace(`${process.cwd()}/`, '');

export async function handleWithFilterUnleash(parseTags: string) {
    if (!process.env.UNLEASH_CLIENT_KEY) {
        throw new Error(`Please provide UNLEASH_CLIENT_KEY in your env`);
    }
    const disableUnleashFlags = await parseDisabledUnleashFeatureToTagExpression();
    if (!disableUnleashFlags) return parseTags;

    if (parseTags) return `(${parseTags}) and ${disableUnleashFlags}`;

    return disableUnleashFlags;
}

async function handleTagsExpression({
    tagExpression,
    paths,
    filterUnleash,
}: {
    tagExpression: string;
    paths: string[];
    filterUnleash: boolean;
}) {
    let features: string[] = [];
    if (filterUnleash) {
        tagExpression = await handleWithFilterUnleash(tagExpression);
    }
    if (!paths?.length) {
        throw new Error(`Please provide feature path`);
    }

    const expressionNode = parse(tagExpression);

    parseGherkinExpression(paths).forEach((data) => {
        const { gherkin, path } = data;
        let evaluate = true;

        if (tagExpression) {
            const tagsArr = gherkin.feature.tags.map((tag) => tag.name);
            evaluate = expressionNode.evaluate(tagsArr);
            if (evaluate === false) {
                const evaluateScenarios = gherkin.feature.children
                    .filter((child) => child.tags && child.tags.length)
                    .map((child) => {
                        return expressionNode.evaluate([
                            ...tagsArr,
                            ...child.tags.map((tag) => tag.name),
                        ]);
                    });

                evaluate = evaluateScenarios.includes(true);
            }
        }

        if (evaluate) features = [...features, path];
    });

    console.log(`Found ${features.length} feature files`);

    return {
        tagExpression,
        paths: features,
    };
}

async function finder(option: FinderOptions) {
    const cwd = `${process.cwd()}/`;

    const environment: IRunEnvironment = {
        cwd: cwd,
        stdout: process.stdout,
        stderr: process.stderr,
        env: process.env,
    };
    const optionConfigurations: ILoadConfigurationOptions = {
        file: option.config,
        profiles: option.profile,
        provided: {
            paths: option.paths,
            tags: (option.tags || []).join(' and ') || '',
        },
    };
    const { useConfiguration: configuration, runConfiguration } = await loadConfiguration(
        optionConfigurations,
        environment
    );

    const { tagExpression, paths } = await handleTagsExpression({
        tagExpression: runConfiguration.sources.tagExpression,
        paths: runConfiguration.sources.paths,
        filterUnleash: option.filterUnleash,
    });

    if (!paths?.length) {
        return {
            shouldAdvertisePublish:
                !runConfiguration.formats.publish &&
                !configuration.publishQuiet &&
                !isTruthyString(process.env.CUCUMBER_PUBLISH_QUIET),
            shouldExitImmediately: configuration.forceExit,
            success: 1,
        };
    }

    runConfiguration.sources.tagExpression = tagExpression;
    runConfiguration.sources.paths = paths;

    //TODO: enable this line if you want to debug configuration will be run in cucumber
    // console.log('runConfiguration', runConfiguration);

    const { success } = await runCucumber(runConfiguration, environment);
    return {
        shouldAdvertisePublish:
            !runConfiguration.formats.publish &&
            !configuration.publishQuiet &&
            !isTruthyString(process.env.CUCUMBER_PUBLISH_QUIET),
        shouldExitImmediately: configuration.forceExit,
        success,
    };
}

export const runE2ECli = new Command('run-e2e')
    .command('run-e2e')
    .description("Command don't related to anything")
    .option<string[]>(
        '-t, --tags <value...>',
        'Tags to filter your feature files, can be multiple. EX --tags @tag1 @tag2',
        (value, previous) => {
            // use Set to remove duplicate tags
            const result = new Set([...previous, value]);
            return result.size ? Array.from(result) : previous;
        },
        [
            'not @ignore',
            process.env.CI && process.env.ENV !== 'staging' ? 'not @staging' : '',
            process.env.TAGS ?? '', //TODO: rm later when this script is stable
        ].filter(Boolean)
    )
    .option(
        '-fu, --filter-unleash [value]',
        'Filter with disable tags in unleash. Force to pass UNLEASH_CLIENT_KEY in env',
        false
    )
    .option<string[]>(
        '-p, --profile <value...>',
        'Profile to start your app. Example: --profile default, --profile dev --profile prod.',
        (value, previous) => {
            const result = new Set([...previous, value]);
            return result.size ? Array.from(result) : previous;
        },
        ['default', process.env.CI ? 'ci' : 'development', process.env.ORGANIZATION ?? ''].filter(
            Boolean
        )
    )
    .option(
        '-c, --config <value>',
        'Path to config cucumber. Example: --config ./cucumber.js',
        defaultConfig
    )
    .argument('[feature-files...]', 'Path to your feature files, can be multiple or glob pattern', [
        defaultFeature,
    ])
    .action(async (featureFiles: string[], option: Omit<FinderOptions, 'paths'>) => {
        try {
            const { success, shouldExitImmediately } = await finder({
                ...option,
                paths: featureFiles,
            });
            process.exitCode = success ? 0 : 1;
            if (shouldExitImmediately) {
                process.exit();
            }
        } catch (e: any) {
            console.error('[run-e2e]', e);
            process.exitCode = 1;
            process.exit();
        }
    });
