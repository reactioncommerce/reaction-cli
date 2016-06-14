import inquirer from 'inquirer';
import { echo, exec, which } from 'shelljs';
import { Log, info } from '../utils';

function initReaction() {
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

export function init(name) {
  Log.info('Checking if Meteor is installed...');

  const meteorInstalled = !!which('meteor');

  if (!meteorInstalled) {
    Log.warn('Oops! You don\'t have Meteor installed yet! \n');

    inquirer.prompt([{
      type: 'confirm',
      name: 'meteor',
      message: 'Would you like to install it now?',
      default: true
    }]).then((answers) => {
      if (answers.meteor) {
        Log.info('Installing Meteor...\n');
        exec('curl https://install.meteor.com/ | sh');
        initReaction(name);
        process.exit(0);
      } else {
        echo(`\nOk, try running ${info('reaction init')} again once you have Meteor installed.`);
        echo(`Learn more at: ${info.underline('http://www.meteor.com')}`);
        process.exit(1);
      }
    });
  } else {
    Log.success('Meteor is installed!');
    initReaction(name);
  }
}
