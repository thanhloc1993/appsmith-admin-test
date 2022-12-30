import { createApolloClient } from '../../../drivers/apollo-client/create-apollo-client';
import scenarioSeverityBob from '../../../drivers/message-formatter/hasura/severity-query';
import { genSeveritySchema } from './gen-severity-schema';
import { Command } from 'commander';
import 'cross-fetch/polyfill';

async function updateSeverityTable(dryRunMode: boolean) {
    const schema = await genSeveritySchema();
    const data = {
        arg: schema.scenarios,
    };

    if (dryRunMode) {
        console.log('[DRY RUN MODE] Data to be inserted: \n', data);
        return;
    }

    const gqlClient = createApolloClient();
    await gqlClient.mutate(scenarioSeverityBob.upsertScenarioSeverity(data)).catch((e) => {
        throw Error('[updateSeverityTable] ' + e);
    });

    console.log(
        `[update-severity-table] Table e2e_scenario_severity updated with ${schema.scenarios.length} entries.`
    );
}

export const updateSeverityTableCli = new Command('update-severity-table')
    .command('update-severity-table')
    .description('Update e2e_scenario_severity table')
    .option(
        '-drm, --dry-run-mode',
        'Does not update the table. Show data that will be used to insert.'
    )
    .action(async (option) => {
        try {
            await updateSeverityTable(option.dryRunMode);
        } catch (e: any) {
            console.error(e.message, { error: e });
            process.exitCode = 1;
        }
    });
