import * as Config from './config';
import Log from './logger';

const hostingPlatformNotification = `
********************************************************************************
  ${Log.bold('Need help with deployment?')}
  Learn more about the Reaction Platform: ${Log.magenta('http://getrxn.io/reaction-platform')}
********************************************************************************
`;

export function processNotifications() {
  const installedSince = Config.get('id', 'since');
  const timeSinceInstall = Date.now() - installedSince;
  const fourWeeks = 4 * 7 * 24 * 60 * 1000;

  const hasBeenNotified = Config.get('id', 'notifications.hosting');

  if (timeSinceInstall > fourWeeks && !hasBeenNotified) {
    Log.info(hostingPlatformNotification);
    Config.set('id', 'notifications.hosting', true);
  }
}
