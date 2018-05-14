import { GraphQL, Log } from '../../utils';

export default async function envUnset({ _id, values }) {
  const gql = new GraphQL();

  const result = await gql.fetch(`
    mutation envUnset($_id: ID!, $values: [String]!) {
      envUnset(_id: $_id values: $values) {
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

  return result.data.envUnset.env;
}
