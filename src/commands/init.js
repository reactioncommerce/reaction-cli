import { echo, exec } from 'shelljs';
import { Log, info } from '../utils';

export function init(argv) {
  const repoUrl = 'https://github.com/reactioncommerce/reaction';
  const dirName = argv._[1] || 'reaction';
  const branch = argv.branch;

  Log.info(`\nCloning the ${branch} branch of Reaction from Github...\n`);
  exec(`git clone -b ${branch} ${repoUrl} ${dirName}`);

  Log.info('\nInstalling NPM packages...');
  exec(`cd ${dirName} && meteor npm install`);

  Log.success('\nReaction successfully installed!');

  const { blue } = Log;

  Log.info('\nTo start your new app, just run: \n');
  Log.info(blue.bold(` cd ${dirName}`));
  Log.info(blue.bold(' reaction\n'));
}
