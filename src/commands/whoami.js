import { Config, Log } from '../utils';


export function whoami(yargs) {
  Log.args(yargs.argv);

  const conf = Config.get('global', 'launchdock');

  if (!conf || !conf.token) {
    Log.warn('\nNot logged in.\n');
    Log.info(`If you already have an account, you can log in with: ${Log.magenta('reaction login')}`);
    process.exit(0);
  }

  Log.info('\nCurrently logged in as:\n');
  Log.info(`Username: ${Log.magenta(conf.username)}`);
  Log.info(`Email: ${Log.magenta(conf.email)}`);
  Log.info(`Profile: ${Log.magenta(conf.profile)}`);
  Log.debug(`User ID: ${conf.id}`);

  if (yargs.argv.token) {
    Log.info(`Auth Token: ${Log.magenta(typeof conf.token === 'string' ? conf.token : '***no token found***')}`);
  }
}
