import inquirer from 'inquirer';
import { exec } from 'shelljs';
import { Config } from './';

export function hasYarn() {
  return /[0-9]+(\.[0-9]+)*/.test(exec('meteor yarn version', { silent: true }).stdout.replace(/\r?\n|\r/g, ''));
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
