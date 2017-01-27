import inquirer from 'inquirer';
import { exec, rm } from 'shelljs';
import { Log, yarnOrNpm } from '../utils';


function resetMeteor() {
  Log.info('\nResetting the database...');
  exec('meteor reset');
  Log.success('Done!');
}

function resetNpm() {
  Log.info('\nDeleting node_modules...');
  rm('-rf', 'node_modules');
  Log.info('\nReinstalling node_modules...');
  exec(`meteor ${yarnOrNpm()} install`);
  Log.success('Done!\n');
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
