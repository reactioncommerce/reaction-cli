'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GraphQL = undefined;

var _defaultsDeep2 = require('lodash/defaultsDeep');

var _defaultsDeep3 = _interopRequireDefault(_defaultsDeep2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _config = require('./config');

var Config = _interopRequireWildcard(_config);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _hash_password = require('./hash_password');

var _hash_password2 = _interopRequireDefault(_hash_password);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GraphQL = exports.GraphQL = function () {
  function GraphQL() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, GraphQL);

    var endpoint = options.endpoint,
        token = options.token;


    if (!!endpoint && typeof endpoint !== 'string') {
      throw new TypeError('GraphQL endpoint must be a String');
    }

    if (!!token && typeof token !== 'string') {
      throw new TypeError('Launchdock token must be a String');
    }

    this.url = process.env.LAUNCHDOCK_GRAPHQL_ENDPOINT || endpoint || Config.get('cli', 'launchdock.graphqlUrl');
    this.token = process.env.LAUNCHDOCK_TOKEN || token || Config.get('global', 'launchdock.token');
  }

  _createClass(GraphQL, [{
    key: 'fetch',
    value: function fetch(query) {
      var variables = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (typeof query !== 'string') {
        throw new TypeError('a query argument is required');
      }

      opts.body = JSON.stringify({ query: query, variables: variables });

      (0, _defaultsDeep3.default)(opts, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (this.token) {
        opts.headers['meteor-login-token'] = this.token;
      }

      _logger2.default.debug('GraphQL url: ' + this.url);
      _logger2.default.debug('GraphQL fetch options:');
      _logger2.default.debug(opts);

      return (0, _nodeFetch2.default)(this.url, opts).then(function (res) {
        return res.json();
      }).catch(function (e) {
        return _logger2.default.error(e);
      });
    }
  }, {
    key: 'login',
    value: function login(_ref) {
      var username = _ref.username,
          password = _ref.password;

      if (!username || !password) {
        _logger2.default.error('\nEmail and password required');
        process.exit(1);
      }

      return this.fetch('\n      mutation loginWithPassword ($username: String!, $password: HashedPassword!) {\n        loginWithPassword (username: $username, password: $password) {\n          token\n          tokenExpires\n          user {\n            _id\n            username\n            email\n          }\n        }\n      }\n    ', { username: username, password: (0, _hash_password2.default)(password) });
    }
  }, {
    key: 'register',
    value: function register(_ref2) {
      var token = _ref2.token,
          name = _ref2.name,
          username = _ref2.username,
          password = _ref2.password;

      if (!token) {
        _logger2.default.error('\nAn invite token is required');
        process.exit(1);
      }

      if (!name) {
        _logger2.default.error('\nFull name is required');
        process.exit(1);
      }

      if (!username || !password) {
        _logger2.default.error('\nUsername, password, and password confirmation required');
        process.exit(1);
      }

      return this.fetch('\n      mutation inviteAccept($username: String!, $password: String!, $name: String!, $token: String!) {\n        inviteAccept(username: $username, password: $password, name: $name, token: $token) {\n          _id\n          email\n        }\n      }\n    ', { token: token, name: name, username: username, password: password });
    }
  }, {
    key: 'whoami',
    value: function whoami() {
      return this.fetch('\n      query {\n        currentUser {\n          _id\n          email\n          username\n        }\n      }\n    ');
    }
  }]);

  return GraphQL;
}();