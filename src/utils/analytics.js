import _ from 'lodash';
import Analytics from 'analytics-node';
import yargs from 'yargs';
import { getUserId } from './config';
import getVersions from './versions';

const segmentKey = require('../../config.json').segment;

const cmd = yargs.argv.$0;
const args = process.argv.splice(2, process.argv.length).join(' ');

export function track(cb) {
  if (!!segmentKey) {
    const userId = getUserId();
    const command = `${cmd} ${args}`.trim();
    const argv = _.forEach(yargs.argv, (val) => !!val);
    const versions = getVersions();
    const properties = { command, ...argv, ...versions };
    const analytics = new Analytics(segmentKey, { flushAt: 2, flushAfter: 20 });
    analytics.identify({ userId, traits: { versions }});
    analytics.track({ event: 'command', userId, properties }, cb);
  } else {
    cb();
  }
}
