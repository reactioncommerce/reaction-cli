import { GraphQL, Log } from '../../utils';

export default async function envList(_id) {
  const gql = new GraphQL();

  const result = await gql.fetch(`
    query app($_id: ID!) {
      app(_id: $_id){
        env
      }
    }
  `, { _id });

  if (!!result.errors) {
    result.errors.forEach((err) => {
      Log.error(err.message);
    });
    process.exit(1);
  }

  return result.data.app.env;
}
