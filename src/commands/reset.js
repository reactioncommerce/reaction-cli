import inquirer from 'inquirer';
import rimraf from 'rimraf';
import { execSync as exec } from 'child_process';
import { Log, installModules } from '../utils';


function resetMeteor() {
  Log.info('\nResetting the database...');

  try {
    exec('meteor reset', { stdio: 'inherit' });
  } catch (err) {
    Log.error('Database reset failed');
    process.exit(1);
  }

  Log.success('Done!');
}

function resetNpm() {
  Log.info('\nDeleting node_modules...');
  rimraf('node_modules', () => {
    Log.info('\nReinstalling node_modules...');
    installModules();
    Log.success('Done!\n');
  });
}

export function reset(yargs) {
  Log.args(yargs.argv);

  const args = yargs.argv;

  if (args.y) {
    resetMeteor();
    resetNpm();
  } else if (args.n) {
    resetMeteor();
  } else {
    inquirer.prompt([{
      type: 'confirm',
      name: 'reset',
      message: '\nResetting the database! Also delete node_modules?',
      default: false
    }]).then((answers) => {
      resetMeteor();
      if (answers.reset) {
        resetNpm();
      }
    });
  }
}
