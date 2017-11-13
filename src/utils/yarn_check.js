import inquirer from 'inquirer';
import { Config } from './';

// TODO: deprecate all of the Yarn stuff
export function hasYarn() {
  return false;
}

export function hasNpm() {
  return !hasYarn();
}

export function yarnOrNpm() {
  return Config.get('global', 'yarn') ? 'yarn' : 'npm';
}

export function checkYarn(callback) {
  if (Config.get('global', 'yarn') === undefined && hasYarn()) {
    inquirer.prompt([{
      type: 'confirm',
      name: 'useYarn',
      message: '\nIt looks like you have Yarn installed.\nWould you like to use it instead of npm?',
      default: false
    }]).then(({ useYarn }) => {
      Config.set('global', 'yarn', useYarn);
      callback();
    });
  } else {
    callback();
  }
}
