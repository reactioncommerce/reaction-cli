import { exec, which } from 'shelljs';
import { Log, loadPlugins, loadStyles } from '../utils';

export function build(yargs) {
  Log.args(yargs.argv);

  const commands = yargs.argv._;

  const dockerIsInstalled = !!which('docker');

  if (!dockerIsInstalled) {
    Log.warn(`
Oops! You don\'t have Docker installed yet!

Please install Docker first, then try running this command again.

For more info about how to install on your operating system...
https://docs.docker.com/engine/installation/
    `);
    process.exit(1);
  }

  if (!commands[1]) {
    Log.error('\nOops! A Docker image name is required.\n');
    Log.error('Try running:\n');
    Log.warn(Log.yellow(' reaction build <imageName>\n'));
    process.exit(1);
  }

  Log.info('\nSetting up plugin imports...\n');
  loadPlugins();

  Log.info('\nSetting up style imports...\n');
  loadStyles();

  Log.info('Starting Docker build...\n');
  if (exec(`docker build -t ${commands[1]} .`).code !== 0) {
    Log.error('\nError: Docker build failed. Exiting.');
    process.exit(1);
  }
}
