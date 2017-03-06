import { GraphQL, Log } from '../../utils';

export default async function envList(_id) {
  const gql = new GraphQL();

  const result = await gql.fetch(`
    query config ($_id: ID!) {
      config (_id: $_id){
        app
        values
      }
    }
  `, { _id });

  if (!!result.errors) {
    result.errors.forEach((err) => {
      Log.error(err.message);
    });
    process.exit(1);
  }

  return result.data.config.values;
}
