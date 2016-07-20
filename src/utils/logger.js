import { assign } from 'lodash';
import chalk from 'chalk';

/* eslint-disable no-console */

const loggers = {
  info(msg) {
    console.log(chalk.blue(`${msg}`));
  },
  success(msg) {
    console.log(chalk.green(`${msg}`));
  },
  warn(msg) {
    console.log(chalk.yellow(`${msg}`));
  },
  error(msg) {
    console.log(chalk.bold.red(`${msg}`));
  }
};

// extend chalk with custom log methods
export default assign(chalk, loggers);
