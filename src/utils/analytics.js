import _ from 'lodash';
import Analytics from 'analytics-node';
import yargs from 'yargs';
import { getUserId, get } from './config';
import { getGeoDetail } from './geo';
import getVersions from './versions';

const segmentKey = get('cli', 'segment');

const cmd = yargs.argv.$0;
const args = process.argv.splice(2, process.argv.length).join(' ');

export async function track() {
  if (!!segmentKey && !process.env.CI && !process.env.CIRCLECI && !process.env.REACTION_DOCKER_BUILD) {
    const geo = await getGeoDetail();
    const userId = getUserId();
    const command = `${cmd} ${args}`.trim();
    const argv = _.forEach(yargs.argv, (val) => !!val);
    const versions = getVersions();
    const properties = { command, geo, ...argv, ...versions };
    const analytics = new Analytics(segmentKey, { flushAt: 2, flushAfter: 20 });
    analytics.identify({ userId, traits: { ...versions, geo } });
    analytics.track({ event: 'command', userId, properties });
  }
}
