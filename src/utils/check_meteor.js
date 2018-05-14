import { execSync as exec } from 'child_process';
import inquirer from 'inquirer';
import { sync as cmdExists } from 'command-exists';
import Log from './logger';

export default function (callback) {
  const { blue } = Log;

  if (!cmdExists('meteor')) {
    Log.warn('\nOops! You don\'t have Meteor installed yet! \n');

    if (process.platform === 'win32') {
      Log.warn('\nPlease see Meteor install instructions for Windows at: https://www.meteor.com/install\n');
      process.exit(1);
    }

    inquirer.prompt([{
      type: 'confirm',
      name: 'meteor',
      message: 'Would you like to install it now?',
      default: true
    }]).then((answers) => {
      if (answers.meteor) {
        Log.info('Installing Meteor...\n');
        try {
          exec('curl https://install.meteor.com/ | sh', { stdio: 'inherit' });
        } catch (err) {
          Log.error('\nError: Meteor install failed');
          process.exit(1);
        }
        Log.success('Meteor successfully installed!');
        callback();
      } else {
        Log.info('\nOk, try running this command again once you have Meteor installed.');
        Log.info(`Learn more at: ${blue.bold.underline('http://www.meteor.com')}\n`);
        process.exit(1);
      }
    });
  } else {
    callback();
  }
}
