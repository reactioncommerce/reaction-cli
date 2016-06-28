import { echo, exec } from 'shelljs';
import { Log, info } from '../utils';

export function init() {
  const repoUrl = 'https://github.com/reactioncommerce/reaction';
  const dirName = 'reaction';

  Log.info('Cloning Reaction from Github...\n');

  exec(`git clone ${repoUrl} ${dirName}`);

  Log.success('Reaction successfully installed!');

  Log.info('To start your new app, just run:');

  echo('');
  echo(info.bold(` cd ${dirName}`));
  echo(info.bold(' meteor'));
  echo('');
}
