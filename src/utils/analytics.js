import _ from 'lodash';
import os from 'os';
import Analytics from 'analytics-node';
import yargs from 'yargs';
import { getUserId } from './config';
import getVersions from './versions';

const segmentKey = require('../../config.json').segment;

const cmd = yargs.argv.$0;
const args = process.argv.splice(2, process.argv.length).join(' ');

export function track(cb) {
  if (!!segmentKey) {
    const command = `${cmd} ${args}`;
    const argv = _.forEach(yargs.argv, (val) => !!val);
    const versions = Object.assign(getVersions(), {
      os: {
        platform: os.platform(),
        release: os.release()
      }
    });
    const properties = { command, argv, versions };

    const analytics = new Analytics(segmentKey, { flushAt: 1, flushAfter: 1 });
    analytics.track({ event: 'command', userId: getUserId(), properties }, cb);
  } else {
    cb();
  }
}
