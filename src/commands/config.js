import _ from 'lodash';
import { Config, Log } from '../utils';

const helpMessage = `
Usage:

  reaction config [command] [options]

    Commands:
      reset     Reset a local or global reaction-cli config file to default values

    Options:
      --local   Local reaction-cli config if in an app directory
      --global  Global reaction-cli config
`;

function showHelp() {
  Log.default(helpMessage);
}

export function config(yargs) {
  const subCommands = yargs.argv._;
  const args = _.omit(yargs.argv, ['_', '$0']);

  if (subCommands[1] === 'reset' && (args.local || args.global)) {
    const type = args.local ? 'local' : 'global';
    Log.info('Resetting Reaction CLI configs...');
    Config.reset(type);
    Log.success('Done!');
  } else {
    showHelp();
  }
}
