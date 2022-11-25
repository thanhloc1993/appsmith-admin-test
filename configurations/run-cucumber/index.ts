import { genTagSchemaCli } from './gen-tag-schema';
import { runE2ECli } from './run-end-to-end';
import { Command } from 'commander';
import * as dotenv from 'dotenv';

dotenv.config({
    path: '.env.local',
});

const cli = new Command('eibanam').description('Eibanam CLI').command('eibanam');
// TODO: add commands here
// cli.option('-envfile, --envfile <pathToEnvFile...>', 'Path to your .env files ^^');

cli.addCommand(runE2ECli);
cli.addCommand(genTagSchemaCli);

void cli.parseAsync(process.argv);

export default cli;
