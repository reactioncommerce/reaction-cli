import { exec } from 'shelljs';
import { exists, Log } from '../utils';

export function init(argv) {
  const repoUrl = 'https://github.com/reactioncommerce/reaction';
  const dirName = argv._[1] || 'reaction';
  const branch = argv.branch;

  if (exists(dirName)) {
    Log.warn(`\nDirectory '${dirName}' already exists.`);
    Log.warn('Use \'reaction init somename\' to install in a different directory.\n');
    process.exit(1);
  }

  Log.info(`\nCloning the ${branch} branch of Reaction from Github...`);
  exec(`git clone -b ${branch} ${repoUrl} ${dirName}`);

  Log.info('\nInstalling NPM packages...');
  exec(`cd ${dirName} && meteor npm install`);

  Log.success('\nReaction successfully installed!');

  const { blue } = Log;

  Log.info('\nTo start your Reaction instance, just run: \n');
  Log.info(blue.bold(` cd ${dirName}`));
  Log.info(blue.bold(' reaction\n'));
}
