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
  Log.args(yargs.argv);

  const subCommands = yargs.argv._;
  const args = _.omit(yargs.argv, ['_', '$0']);
  const type = args.global ? 'global' : 'local';

  if (subCommands[1] === 'set' && !!subCommands[2] && !!subCommands[3]) {
    Config.set(type, subCommands[2], subCommands[3]);
    Log.success('Success!\n');
  } else if (subCommands[1] === 'get' && !!subCommands[2]) {
    Log.info(`Getting ${type} config...\n`);
    const conf = Config.get(type, subCommands[2]);
    Log.default(conf);
  } else if (subCommands[1] === 'unset' && !!subCommands[2]) {
    Log.info(`Unsetting ${type} config...\n`);
    Config.unset(type, subCommands[2]);
    Log.success('Success!\n');
  } else if (subCommands[1] === 'reset') {
    Log.info(`Resetting ${type} Reaction CLI config...`);
    Config.reset(type);
    Log.success('Success!\n');
  } else {
    showHelp();
  }
}
