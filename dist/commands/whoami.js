'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.whoami = whoami;

var _utils = require('../utils');

function whoami(yargs) {
  _utils.Log.args(yargs.argv);

  var gql = new _utils.GraphQL();

  gql.whoami().then(function (res) {
    if (!!res.errors) {
      res.errors.forEach(function (err) {
        _utils.Log.error(err.message);
      });
      process.exit(1);
    }

    if (!res.data.currentUser) {
      _utils.Log.warn('\nNot logged in.\n');
      _utils.Log.info('If you have an account, you can log in with: ' + _utils.Log.magenta('reaction login'));
      return;
    }

    var _res$data$currentUser = res.data.currentUser,
        _id = _res$data$currentUser._id,
        username = _res$data$currentUser.username,
        email = _res$data$currentUser.email;


    _utils.Log.info('\nCurrently logged in as:\n');
    _utils.Log.info('Username: ' + _utils.Log.magenta(username));
    _utils.Log.info('Email: ' + _utils.Log.magenta(email));
    _utils.Log.debug('User ID: ' + _id);

    if (yargs.argv.token) {
      var token = _utils.Config.get('global', 'launchdock.token');
      _utils.Log.info('Auth Token: ' + _utils.Log.magenta(typeof token === 'string' ? token : '***no token found***'));
    }
  }).catch(function (e) {
    return _utils.Log.error(e);
  });
}