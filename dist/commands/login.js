'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.login = login;

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _utils = require('../utils');

var _list = require('./apps/list');

var _list2 = _interopRequireDefault(_list);

var _list3 = require('./keys/list');

var _list4 = _interopRequireDefault(_list3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var helpMessage = '\nUsage:\n\n  reaction login [options]\n\n    Options:\n      --user    Your Reaction username\n      --pass    Your Reaction password\n';

function doLogin(user, pass) {
  var _this = this;

  var gql = new _utils.GraphQL();

  gql.login({ username: user, password: pass }).then(function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(res) {
      var _res$data$loginWithPa, _res$data$loginWithPa2, _id, email, token, tokenExpires;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!!res.errors) {
                res.errors.forEach(function (err) {
                  _utils.Log.error(err.message);
                });
                process.exit(1);
              }

              _res$data$loginWithPa = res.data.loginWithPassword, _res$data$loginWithPa2 = _res$data$loginWithPa.user, _id = _res$data$loginWithPa2._id, email = _res$data$loginWithPa2.email, token = _res$data$loginWithPa.token, tokenExpires = _res$data$loginWithPa.tokenExpires;


              _utils.Config.set('global', 'launchdock', { _id: _id, username: user, email: email, token: token, tokenExpires: tokenExpires });

              _context.next = 5;
              return (0, _list2.default)();

            case 5:
              _context.next = 7;
              return (0, _list4.default)();

            case 7:

              _utils.Log.success('\nLogged in as ' + user + '\n');

            case 8:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }()).catch(function (e) {
    return _utils.Log.error(e);
  });
}

function login(yargs) {
  _utils.Log.args(yargs.argv);

  var args = yargs.argv;

  if (args.help) {
    return _utils.Log.default(helpMessage);
  }

  if (args.user && args.pass) {
    return doLogin(args.user, args.pass);
  }

  _inquirer2.default.prompt([{
    type: 'input',
    name: 'username',
    message: 'Username:'
  }, {
    type: 'password',
    name: 'password',
    message: 'Password:'
  }]).then(function (answers) {
    var username = answers.username,
        password = answers.password;

    doLogin(username, password);
  });
}