import fs from 'fs';
import fetch from 'node-fetch';
import semver from 'semver';
import getLatest from 'latest-semver';
import Log from './logger';

// get the latest release version from Github releases
export async function getLatestReactionRelease() {
  try {
    const res = await fetch('https://api.github.com/repos/reactioncommerce/reaction/releases');
    const releases = await res.json();
    const tags = [];
    releases.forEach((r) => tags.push(r.tag_name));
    return getLatest(tags);
  } catch (err) {
    return null;
  }
}

// notify user if a Reaction update is available
export async function checkForReactionUpdate() {
  // get current Reaction version
  let reactionVersion;
  try {
    const packageFile = fs.readFileSync('./package.json', 'utf8');

    const f = JSON.parse(packageFile);

    if (f.name === 'reaction') {
      reactionVersion = f.version;
    }
  } catch(e) {
    reactionVersion = null;
  }

  // check if a newer release is available
  if (reactionVersion) {
    try {
      const latestRelease = await getLatestReactionRelease();

      if (semver.lt(reactionVersion, latestRelease)) {
        const { blue, green, magenta } = Log;
        Log.info(green('\nA newer version of Reaction exists on Github.\n'));
        Log.info(green(`Current version: ${magenta(reactionVersion)}`));
        Log.info(green(`Available version: ${magenta(latestRelease)}`));
        Log.info(green(`\nTo update, run: ${blue('reaction pull')}\n`));
      }
    } catch (err) {
      Log.error(err);
    }
  }
}
