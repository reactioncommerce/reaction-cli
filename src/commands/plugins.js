import fs from 'fs-extra';
import path from 'path';
import { exec } from 'shelljs';
import { exists, Log, loadPlugins, loadStyles } from '../utils';

const helpMessage = `
Usage:

  reaction plugins [command]

    Commands:
      create   Create a new plugin in /imports/plugins/custom
      load     Set up the imports of your internal Reaction plugins
`;

export function plugins(yargs) {
  Log.args(yargs.argv);

  const commands = yargs.argv._;

  if (!commands[1]) {
    Log.error('\nOops! A subcommand is required.\n');
    Log.error('To load plugins, try running:\n');
    Log.warn(Log.yellow(' reaction plugins load\n'));
    process.exit(1);
  }

  if (commands[1] === 'load') {
    Log.info('\nSetting up plugin imports...');
    loadPlugins();
    Log.info('\nSetting up style imports...\n');
    loadStyles();
    return Log.success('Done!\n');
  }

  if (commands[1] === 'create') {
    const { name } = yargs.argv;

    if (!name) {
      Log.error('\nA name argument is required. Use the --name flag to choose your plugin name.\n');
      process.exit(1);
    }

    const pluginPath = `./imports/plugins/custom/${name}`;

    if (exists(pluginPath)) {
      Log.error(`\nError: A plugin already exists at ${Log.yellow(`/imports/plugins/custom/${name}`)} \n\nExiting.`);
      process.exit(1);
    }

    const clientImport = path.resolve(pluginPath + '/client/index.js');
    const serverImport = path.resolve(pluginPath + '/server/index.js');
    const registryImport = path.resolve(pluginPath + '/register.js');
    const packageDotJson = path.resolve(pluginPath + '/package.json');

    try {
      fs.ensureFileSync(clientImport, '');
      fs.ensureFileSync(serverImport, '');
      fs.ensureFileSync(registryImport, '');
    } catch (e) {
      Log.error(`Failed to create plugin at ${pluginPath}`);
      process.exit(1);
    }

    const { code } = exec(`cd ${pluginPath} && npm init -y`, { silent: true });

    if (code !== 0) {
      Log.error(`Failed to create a package.json at ${packageDotJson}`);
      process.exit(1);
    }

    Log.success('\nSuccess!\n');

    return Log.info(`New plugin created at: ${Log.magenta(`/imports/plugins/custom/${name}`)}\n`);
  }

  Log.error('\nInvalid subcommand');
  Log.default(helpMessage);
}
