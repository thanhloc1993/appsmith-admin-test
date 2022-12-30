import { parseGherkinExpression } from '../utils';
import path from 'path';

const defaultFeatureFiles = path.resolve(
    __dirname,
    '../../../test-suites/squads/**/features/**/*.feature'
);

interface IScenario {
    feature_name: string;
    feature_path: string;
    scenario_name: string;
    keyword: string;
    severity_tags?: string;
}
interface ISchema {
    scenarios: IScenario[];
}

export async function genSeveritySchema() {
    const result: ISchema = {
        scenarios: [],
    };

    // For each feature file
    parseGherkinExpression([defaultFeatureFiles]).forEach((featureFileData) => {
        const { path, gherkin } = featureFileData;
        const feature_path = path.replace(`${process.cwd()}/`, '');

        const feature = gherkin.feature;

        // For each scenario
        feature.children.forEach((scenario) => {
            if (scenario.type === 'ScenarioOutline' || scenario.type === 'Scenario') {
                const scenarioData: IScenario = {
                    feature_name: feature.name,
                    feature_path: feature_path,
                    scenario_name: scenario.name,
                    keyword: scenario.keyword,
                };

                const tags = scenario.tags.map((tag) => tag.name);

                scenarioData.severity_tags = '@minor';
                if (tags.includes('@critical')) scenarioData.severity_tags = '@critical';
                if (tags.includes('@blocker')) scenarioData.severity_tags = '@blocker';

                result.scenarios.push(scenarioData);
            }
        });
    });

    return result;
}
