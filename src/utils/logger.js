import chalk from 'chalk';

export const info = chalk.blue;
export const success = chalk.green;
export const warn = chalk.yellow;
export const error = chalk.bold.red;

/* eslint-disable no-console */

const Log = {
  info(msg) {
    console.log(info(`\n${msg}`));
  },
  success(msg) {
    console.log(success(`\n${msg}`));
  },
  warn(msg) {
    console.log(warn(`\n${msg}`));
  },
  error(msg) {
    console.log(error(`\n${msg}`));
  }
};

export default Log;
