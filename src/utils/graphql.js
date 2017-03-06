import _ from 'lodash';
import fetch from 'node-fetch';
import * as Config from './config';
import Log from './logger';
import hashPassword from './hash_password';


export class GraphQL {
  constructor(options = {}) {
    const { endpoint, token } = options;

    if (!!endpoint && typeof endpoint !== 'string') {
      throw new TypeError('GraphQL endpoint must be a String');
    }

    if (!!token && typeof token !== 'string') {
      throw new TypeError('Launchdock token must be a String');
    }

    this.url = process.env.LAUNCHDOCK_GRAPHQL_ENDPOINT || endpoint || 'https://api.launchdock.io/graphql';
    this.token = process.env.LAUNCHDOCK_TOKEN || token || Config.get('global', 'launchdock.token');
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

    if (this.token) {
      opts.headers['meteor-login-token'] = this.token;
    }

    return fetch(this.url, opts).then((res) => res.json()).catch((e) => Log.error(e));
  }


  login({ username, password }) {
    if (!username || !password) {
      Log.error('\nEmail and password required');
      process.exit(1);
    }

    return this.fetch(`
      mutation loginWithPassword ($username: String!, $password: HashedPassword!) {
        loginWithPassword (username: $username, password: $password) {
          token
          tokenExpires
          user {
            _id
            username
            email
          }
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
    `, { token, username, password });
  }


  whoami() {
    return this.fetch(`
      query {
        currentUser {
          _id
          email
          username
        }
      }
    `);
  }
}
