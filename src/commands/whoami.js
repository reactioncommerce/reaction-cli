import { GraphQL, Log } from '../utils';


export function whoami(yargs) {
  Log.args(yargs.argv);

  const gql = new GraphQL();

  gql.whoami().then((res) => {
    if (!!res.errors) {
      res.errors.forEach((err) => {
        Log.error(err.message);
      });
      process.exit(1);
    }

    if (!res.data.currentUser) {
      Log.warn('\nNot logged in.\n');
      Log.info(`If you have an account, you can log in with: ${Log.magenta('reaction login')}`);
      return;
    }

    const { _id, username, email } = res.data.currentUser;

    Log.info('\nCurrently logged in as:\n');
    Log.info(`Username: ${Log.magenta(username)}`);
    Log.info(`Email: ${Log.magenta(email)}`);
    Log.debug(`User ID: ${_id}`);
  })
  .catch((e) => Log.error(e));
}
