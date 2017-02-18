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

  login({ username, password }) {
    if (!username || !password) {
      Log.error('\nEmail and password required');
      process.exit(1);
    }

    return this.fetch(`
      mutation loginWithPassword ($username: String!, $password: HashedPassword!) {
        loginWithPassword (username: $username, password: $password) {
          id
          token
          tokenExpires
        }
      }
    `, { username, password: hashPassword(password) });
  }

  register({ token, username, password }) {
    if (!token) {
      Log.error('\nAn invite token is required');
      process.exit(1);
    }

    if (!username || !password) {
      Log.error('\nUsername, password, and password confirmation required');
      process.exit(1);
    }

    return this.fetch(`
      mutation acceptInvite($username: String!, $password: String!, $token: String!) {
        acceptInvite(username: $username, password: $password, token: $token) {
          _id
          email
        }
      }
    `, { token, username, password: hashPassword(password) });
  }
}
