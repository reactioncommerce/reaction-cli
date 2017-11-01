import { GraphQL, Log } from '../../utils';

export default async function forgotPassword({ email }) {
  const gql = new GraphQL();

  const result = await gql.forgotPassword({ email });

  if (!!result.errors) {
    result.errors.forEach((err) => {
      Log.error(err.message);
    });
    process.exit(1);
  }

  Log.info(`\nA password reset email is being sent to ${email}\n`);

  Log.success('Done!');

  return result;
}
