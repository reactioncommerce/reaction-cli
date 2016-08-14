import _ from 'lodash';
import { Config, Log } from '../utils';

const helpMessage = `
Usage:

  reaction config [command] [options]

    Commands:
      set       Set a local or global reaction-cli config file value
      reset     Reset a local or global reaction-cli config file to default values

    Options:
      --local   Local reaction-cli config if in an app directory [Default]
      --global  Global reaction-cli config
`;

function showHelp() {
  Log.default(helpMessage);
}

export function config(yargs) {
  const subCommands = yargs.argv._;
  const args = _.omit(yargs.argv, ['_', '$0']);
  const type = args.global ? 'global' : 'local';

  const vals = _.omit(args, [
    'global',
    'local',
    'v',
    'version',
    'h',
    'help',
    'git',
    'plugins'
  ]);

  if (subCommands[1] === 'set') {
    Config.set(type, vals);
    Log.success('Success!\n');
  } else if (subCommands[1] === 'reset') {
    Log.info(`Resetting ${type} Reaction CLI config...`);
    Config.reset(type);
    Log.success('Success!\n');
  } else {
    showHelp();
  }
}
