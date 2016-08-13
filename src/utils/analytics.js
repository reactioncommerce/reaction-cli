import _ from 'lodash';
import Analytics from 'analytics-node';
import yargs from 'yargs';
import { getUserId } from './config';

const segmentKey = require('../../config.json').segment;
const analytics = new Analytics(segmentKey, { flushAt: 1, flushAfter: 1 });

const cmd = yargs.argv.$0;
const args = process.argv.splice(2, process.argv.length).join(' ');

export function track() {
  const properties = {
    command: `${cmd} ${args}`,
    argv: _.forEach(yargs.argv, (val) => !!val)
  };
  analytics.track({ event: 'command', userId: getUserId(), properties });
}
