import inquirer from 'inquirer';
import { exec, rm } from 'shelljs';
import { Log } from '../utils';


function resetMeteor() {
  Log.info('\nResetting the database...');
  exec('meteor reset');
  Log.success('Done!');
}

function resetNpm() {
  Log.info('\nDeleting node_modules...');
  rm('-rf', 'node_modules');
  Log.info('\nReinstalling node_modules...');
  exec('meteor npm install');
  Log.success('Done!\n');
}

export function reset(yargs) {
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
      if (answers.reset) {
        resetMeteor();
        resetNpm();
      } else {
        resetMeteor();
      }
    });
  }
}
