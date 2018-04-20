'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.domains = undefined;

var domains = exports.domains = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(yargs) {
    var subCommands, _yargs$argv, app, domain;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _utils.Log.args(yargs.argv);

            subCommands = yargs.argv._;

            if (subCommands[1]) {
              _context.next = 4;
              break;
            }

            return _context.abrupt('return', _utils.Log.default(helpMessage));

          case 4:
            _yargs$argv = yargs.argv, app = _yargs$argv.app, domain = _yargs$argv.domain;

            if (!(!app || !domain)) {
              _context.next = 7;
              break;
            }

            return _context.abrupt('return', _utils.Log.default(helpMessage));

          case 7:
            if (!(subCommands[1] === 'add')) {
              _context.next = 9;
              break;
            }

            return _context.abrupt('return', (0, _add2.default)({ name: app, domain: domain }));

          case 9:
            if (!(subCommands[1] === 'delete')) {
              _context.next = 11;
              break;
            }

            return _context.abrupt('return', (0, _delete2.default)({ name: app, domain: domain }));

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function domains(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _utils = require('../../utils');

var _add = require('./add');

var _add2 = _interopRequireDefault(_add);

var _delete = require('./delete');

var _delete2 = _interopRequireDefault(_delete);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var helpMessage = '\nUsage:\n\n  reaction domains [command] <options>\n\n    Commands:\n      add       Add a new custom domain for an app deployment\n      delete    Remove a custom domain for an app deployment\n\n    Options:\n      --app, -a      The name of the app to update [Required]\n      --domain, -d   The domain name to add to your app (example.com) [Required]\n';