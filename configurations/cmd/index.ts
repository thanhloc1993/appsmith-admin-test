import { genTagSchemaCli } from './run-cucumber/gen-tag-schema';
import { runE2ECli } from './run-cucumber/run-end-to-end';
import { updateSeverityTableCli } from './update-severity/update-severity-table';
import { Command } from 'commander';

const cli = new Command();

cli.addCommand(runE2ECli);
cli.addCommand(genTagSchemaCli);
cli.addCommand(updateSeverityTableCli);

void cli.parseAsync(process.argv);

export default cli;
