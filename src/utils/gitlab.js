import fetch from 'node-fetch';
import * as Config from './config';
import Logger from './logger';

export default class Gitlab {

  constructor(options = {}) {
    const defaults = {
      apiVersion: 'v4',
      url: process.env.LAUNCHDOCK_GIT_URL || Config.get('cli', 'launchdock.gitUrl'),
      token: process.env.LAUNCHDOCK_GIT_TOKEN || Config.get('global', 'launchdock.token')
    };

    this.options = Object.assign({}, defaults, options);

    this.options.apiBaseUrl = `${this.options.url}/api/${this.options.apiVersion}`;

    if (!this.options.url) {
      const msg = 'Missing Launchdock URL.';
      Logger.error(msg);
      throw new Error(msg);
    }
  }

  _checkSession() {
    if (!this.options.token) {
      const msg = 'ERROR: Must be logged in';
      Logger.error(msg);
      throw new Error(msg);
    }
  }

  login(username, password) {
    const url = `${this.options.apiBaseUrl}/session`;

    Logger.debug(`[Launchdock API] POST ${url}`);

    return fetch(`${url}?login=${username}&password=${password}`, {
      method: 'POST'
    }).then((res) => res.json());
  }

  create(resource, data) {
    this._checkSession();

    const url = `${this.options.apiBaseUrl}/${resource}`;

    Logger.debug({ data }, `[Launchdock API] POST ${url}`);

    return fetch(url, {
      method: 'POST',
      headers: {
        'PRIVATE-TOKEN': this.options.token
      },
      body: JSON.stringify(data)
    }).then((res) => res.json());
  }


  list(resource, data) {
    this._checkSession();

    const url = `${this.options.apiBaseUrl}/${resource}`;

    Logger.debug({ data }, `[Launchdock API] GET ${url}`);

    return fetch(url, {
      method: 'GET',
      headers: {
        'PRIVATE-TOKEN': this.options.token
      }
    }).then((res) => res.json());
  }


  get(resource, id) {
    this._checkSession();

    const url = `${this.options.apiBaseUrl}/${resource}/${id}`;

    Logger.debug(`[Launchdock API] GET ${url}`);

    return fetch(url, {
      method: 'GET',
      headers: {
        'PRIVATE-TOKEN': this.options.token
      }
    }).then((res) => res.json());
  }


  update(resource, id, data) {
    this._checkSession();

    const url = `${this.options.apiBaseUrl}/${resource}/${id}`;

    Logger.debug({ data }, `[Launchdock API] POST ${url}`);

    return fetch(url, {
      method: 'POST',
      headers: {
        'PRIVATE-TOKEN': this.options.token
      },
      body: JSON.stringify(data)
    }).then((res) => res.json());
  }


  delete(resource, id) {
    this._checkSession();

    const url = `${this.options.apiBaseUrl}/${resource}/${id}`;

    Logger.debug(`[Launchdock API] DELETE ${url}`);

    return fetch(url, {
      method: 'DELETE',
      headers: {
        'PRIVATE-TOKEN': this.options.token
      }
    }).then((res) => res.json());
  }
}
