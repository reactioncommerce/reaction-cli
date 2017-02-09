import _ from 'lodash';
import fetch from 'node-fetch';
import * as Config from './config';
import Log from './logger';
import hashPassword from './hash_password';


export class GraphQL {
  constructor(endpoint) {
    if (!!endpoint && typeof endpoint !== 'string') {
      throw new TypeError('Please provide a GraphQL endpoint string');
    }
    this.url = endpoint || process.env.LAUNCHDOCK_GRAPHQL_ENDPOINT || 'https://dev.launchdock.io/graphql';
  }

  fetch(query, variables = {}, opts = {}) {
    if (typeof query !== 'string') {
      throw new TypeError('a query argument is required');
    }

    opts.body = JSON.stringify({ query, variables });

    _.defaultsDeep(opts, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return fetch(this.url, opts).then((res) => res.json());
  }

  login(email, password) {
    if (!email || !password) {
      Log.error('\nEmail and password required');
      process.exit(1);
    }

    return this.fetch(`
      mutation loginWithPassword ($email: String!, $password: HashedPassword!) {
        loginWithPassword (email: $email, password: $password) {
          id
          token
          tokenExpires
        }
      }
    `, { email, password: hashPassword(password) });
  }

  register(email, password) {
    if (!email || !password) {
      Log.error('\nEmail, password, and password confirmation required');
      process.exit(1);
    }

    return this.fetch(`
      mutation createUser ($email: String!, $password: HashedPassword!) {
        createUser (email: $email, password: $password) {
          id
          token
          tokenExpires
        }
      }
    `, { email, password: hashPassword(password) });
  }
}
