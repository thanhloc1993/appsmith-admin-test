import { parseGherkinExpression, resolveFromCwd } from './utils';
import { Command } from 'commander';
import { writeFileSync } from 'fs';
import path from 'path';

interface GenTagSchemaOptions {
    outputPath: string;
    featureFiles: string[];
}
interface IScenario {
    tags: string[];
    line: number;
    keyword: string;
}
interface IFeature {
    path: string;
    tags: string[];
    scenarios: {
        [scenarioName: string]: IScenario;
    };
    countScenarios: number;
}

function genTagSchema(option: GenTagSchemaOptions) {
    if (!option.featureFiles || !option.featureFiles.length) {
        throw new Error(`Please provide feature files`);
    }
    if (!option.outputPath) {
        throw new Error(`Please provide output path`);
    }

    const result: {
        features: {
            [featureName: string]: IFeature;
        };
        countScenarios: number;
    } = {
        countScenarios: 0,
        features: {},
    };

    const cwd = `${process.cwd()}/`;

    parseGherkinExpression(option.featureFiles).forEach((data) => {
        const { path, gherkin } = data;
        const scenarios: { [scenarioName: string]: IScenario } = {};

        gherkin.feature.children.forEach((child) => {
            if (child.type === 'Scenario') {
                scenarios[child.name] = {
                    tags: child.tags.map((tag) => tag.name),
                    line: child.location.line,
                    keyword: child.keyword,
                };
            } else if (child.type === 'ScenarioOutline') {
                child.examples.forEach((example) => {
                    example.tableBody.forEach((row) => {
                        const scenarioName =
                            child.name + ' | ' + row.cells.map((cell) => cell.value).join(' ');
                        scenarios[scenarioName] = {
                            tags: [
                                ...child.tags.map((tag) => tag.name),
                                ...example.tags.map((tag) => tag.name),
                            ],
                            line: child.location.line,
                            keyword: child.keyword,
                        };
                    });
                });
            }
        });

        result.features[gherkin.feature.name] = {
            countScenarios: Object.keys(scenarios).length,
            path: path.replace(cwd, ''),
            tags: gherkin.feature.tags.map((tag) => tag.name),
            scenarios: scenarios,
        };
        result.countScenarios += result.features[gherkin.feature.name].countScenarios;
    });

    console.log(`Found ${Object.keys(result.features).length} features`);
    console.log(`Found ${result.countScenarios} scenarios`);
    console.log(`Writing tag schema to ${option.outputPath}`);

    writeFileSync(resolveFromCwd(option.outputPath), JSON.stringify(result, null, 4));

    return result;
}
const defaultFeature = path.resolve(__dirname, '../../test-suites/squads/**/features/**/*.feature');

export const genTagSchemaCli = new Command('gen-tag-schema')
    .command('gen-tag-schema')
    .description("Command don't related to anything")
    .option('-output-path, --output-path <value>', 'Output path for generated file')
    .argument('[feature-files...]', 'Path to your feature files, can be multiple or glob pattern', [
        process.env.FEATURE_FILES || defaultFeature,
    ])
    .action((featureFiles: string[], option: Omit<GenTagSchemaOptions, 'featureFiles'>) => {
        try {
            genTagSchema({
                ...option,
                featureFiles: featureFiles,
            });
        } catch (e: any) {
            console.error(e.message, { error: e });
            process.exitCode = 1;
        }
    });
