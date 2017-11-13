import { execSync as exec } from 'child_process';
import { exists, Log, initInstallModules } from '../utils';

const hostingPlatformNotification = `
********************************************************************************
  ${Log.bold('Need help with deployment?')}
  Learn more about the Reaction Platform: ${Log.blue('http://getrxn.io/managed-platform')}
********************************************************************************
`;

export function init(argv) {
  Log.args(argv);

  const repoUrl = 'https://github.com/reactioncommerce/reaction';
  const dirName = argv._[1] || 'reaction';
  const { branch, tag } = argv;

  if (exists(dirName)) {
    Log.warn(`\nDirectory '${dirName}' already exists.`);
    Log.warn('Use \'reaction init somename\' to install in a different directory.\n');
    process.exit(1);
  }

  Log.info(`\nCloning the ${branch} branch of Reaction from Github...\n`);

  try {
    exec(`git clone -b ${branch} ${repoUrl} ${dirName}`, { stdio: 'inherit' });
  } catch (err) {
    Log.error('\nError: Unable to clone from Github. Exiting.');
    process.exit(1);
  }

  if (tag) {
    Log.info(`\nChecking out tag ${tag}...\n`);

    try {
      exec(`cd ${dirName} && git checkout tags/${tag} -b ${tag}`, { stdio: 'inherit' });
    } catch (err) {
      Log.error('\nError: Failed to checkout tag. Are you sure it exists?');
      process.exit(1);
    }
  }

  Log.info('\nInstalling NPM packages...\n');
  initInstallModules(dirName);

  Log.success('\nReaction successfully installed!');

  const { blue } = Log;

  Log.info('\nTo start your Reaction instance, just run: \n');
  Log.info(blue.bold(` cd ${dirName}`));
  Log.info(blue.bold(' reaction\n'));

  Log.default(hostingPlatformNotification);
}
