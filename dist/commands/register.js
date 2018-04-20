'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = register;

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function register(yargs) {
  _utils.Log.args(yargs.argv);

  _inquirer2.default.prompt([{
    type: 'input',
    name: 'inviteToken',
    message: 'Invite Token:'
  }, {
    type: 'input',
    name: 'name',
    message: 'Full name:'
  }, {
    type: 'input',
    name: 'username',
    message: 'Username:'
  }, {
    type: 'password',
    name: 'password',
    message: 'Password:'
  }, {
    type: 'password',
    name: 'passwordAgain',
    message: 'Password again:'
  }]).then(function (answers) {
    var inviteToken = answers.inviteToken,
        username = answers.username,
        password = answers.password,
        name = answers.name;


    var gql = new _utils.GraphQL();

    gql.register({ token: inviteToken, name: name, username: username, password: password }).then(function (res) {
      if (!!res.errors) {
        res.errors.forEach(function (err) {
          _utils.Log.error(err.message);
        });
        process.exit(1);
      }

      var _res$data$inviteAccep = res.data.inviteAccept,
          _id = _res$data$inviteAccep._id,
          email = _res$data$inviteAccep.email;


      gql.login({ username: username, password: password }).then(function (result) {
        if (!!result.errors) {
          result.errors.forEach(function (err) {
            _utils.Log.error(err.message);
          });
          process.exit(1);
        }

        var _result$data$loginWit = result.data.loginWithPassword,
            token = _result$data$loginWit.token,
            tokenExpires = _result$data$loginWit.tokenExpires;


        _utils.Config.set('global', 'launchdock', { _id: _id, name: name, username: username, email: email, token: token, tokenExpires: tokenExpires });

        _utils.Log.success('\nLogged in as ' + username);
      });
    }).catch(function (e) {
      return _utils.Log.error(e);
    });
  });
}