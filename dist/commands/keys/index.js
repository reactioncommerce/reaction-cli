'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keys = undefined;

var keys = exports.keys = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(yargs) {
    var subCommands, publicKeyPath, sshKeys, publicKeyTitle;
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
            if (!(subCommands[1] === 'add')) {
              _context.next = 9;
              break;
            }

            if (subCommands[2]) {
              _context.next = 7;
              break;
            }

            return _context.abrupt('return', _utils.Log.error('Public key path required'));

          case 7:
            publicKeyPath = subCommands[2];
            return _context.abrupt('return', (0, _add2.default)(publicKeyPath));

          case 9:
            if (!(subCommands[1] === 'list')) {
              _context.next = 15;
              break;
            }

            _context.next = 12;
            return (0, _list2.default)();

          case 12:
            sshKeys = _context.sent;


            if (sshKeys.length === 0) {
              _utils.Log.info('\nNo SSH keys found.\n');
              _utils.Log.info('Run ' + _utils.Log.magenta('reaction keys add /path/to/key.pub') + ' to upload one.\n');
              process.exit(0);
            }

            sshKeys.forEach(function (k) {
              return _utils.Log.info(k.title);
            });

          case 15:
            if (!(subCommands[1] === 'delete')) {
              _context.next = 20;
              break;
            }

            if (subCommands[2]) {
              _context.next = 18;
              break;
            }

            return _context.abrupt('return', _utils.Log.error('Public key name required'));

          case 18:
            publicKeyTitle = subCommands[2];
            return _context.abrupt('return', (0, _delete2.default)(publicKeyTitle));

          case 20:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function keys(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _utils = require('../../utils');

var _list = require('./list');

var _list2 = _interopRequireDefault(_list);

var _add = require('./add');

var _add2 = _interopRequireDefault(_add);

var _delete = require('./delete');

var _delete2 = _interopRequireDefault(_delete);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var helpMessage = '\nUsage:\n\n  reaction keys [command]\n\n    Commands:\n      add       Add an SSH public key for deploying to Launchdock\n      list      Show your existing SSH keys\n      delete    Remove an existing SSH public key from Launchdock\n';