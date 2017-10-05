import { GraphQL, Log } from '../../utils';

export default async function envSet({ _id, values }) {
  const gql = new GraphQL();

  const result = await gql.fetch(`
    mutation envSet($_id: ID!, $values: JSON!) {
      envSet(_id: $_id values: $values) {
        _id
        env
      }
    }
  `, { _id, values });

  if (!!result.errors) {
    result.errors.forEach((err) => {
      Log.error(err.message);
    });
    process.exit(1);
  }

  return result.data.envSet.values;
}
