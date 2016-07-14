import { echo, exec } from 'shelljs';
import { Log, info } from '../utils';

export function init(argv) {
  const repoUrl = 'https://github.com/reactioncommerce/reaction';
  const dirName = argv._[1] || 'reaction';
  const branch = argv.branch;

  Log.info(`Cloning the ${branch} branch of Reaction from Github...\n`);
  exec(`git clone -b ${branch} ${repoUrl} ${dirName}`);

  Log.info('Installing NPM packages...');
  exec(`cd ${dirName} && meteor npm install`);

  Log.success('Reaction successfully installed!');

  Log.info('To start your new app, just run:');

  echo('');
  echo(info.bold(` cd ${dirName}`));
  echo(info.bold(' reaction'));
  echo('');
}
