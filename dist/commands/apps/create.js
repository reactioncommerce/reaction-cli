'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _shelljs = require('shelljs');

var _utils = require('../../utils');

var _list = require('./list');

var _list2 = _interopRequireDefault(_list);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_ref2) {
    var name = _ref2.name,
        env = _ref2.env,
        remote = _ref2.remote;
    var gql, result, gitRemote;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            gql = new _utils.GraphQL();
            _context.next = 3;
            return gql.fetch('\n    mutation appCreate($name: String!, $env: JSON ) {\n      appCreate(name: $name, env: $env) {\n        _id\n        name\n        defaultUrl\n        git {\n          ssh_url_to_repo\n        }\n      }\n    }\n  ', { name: name, env: env });

          case 3:
            result = _context.sent;


            if (!!result.errors) {
              result.errors.forEach(function (err) {
                _utils.Log.error(err.message);
              });
              process.exit(1);
            }

            if (remote !== false) {
              _utils.Log.info('\nCreating git remote for custom deployment...\n');
              _utils.Log.info('To deploy this repo, run: ' + _utils.Log.magenta('reaction deploy --app ' + name) + '\n');

              gitRemote = result.data.appCreate.git.ssh_url_to_repo;


              if ((0, _shelljs.exec)('git remote add launchdock-' + name + ' ' + gitRemote).code !== 0) {
                _utils.Log.error('Failed to create git remote');
                process.exit(1);
              }
            } else {
              _utils.Log.error('Sorry, deploying a prebuilt image is not available right now. Please contact support for more info.');
              process.exit(1);
              // Log.info(`\nCreated new app: ${Log.magenta(result.data.appCreate.name)}`);
              // Log.info(`\nTo deploy, you can run:\n\n ${Log.magenta(`reaction deploy --app ${name} --image <your-image>`)}\n`);
            }

            _utils.Log.success('Done!');

            return _context.abrupt('return', (0, _list2.default)());

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function appCreate(_x) {
    return _ref.apply(this, arguments);
  }

  return appCreate;
}();