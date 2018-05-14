import { Log } from '../utils';

export function build(yargs) {
  Log.args(yargs.argv);

  Log.info(`\nThis command has been deprecated. Please use Docker directly instead:\n\n${Log.magenta(' docker build -t <imageName> .')}\n`);
  Log.info(`For more info on the available options, see: ${Log.magenta('https://docs.docker.com/engine/reference/commandline/build/')}`);
}
