'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = undefined;

var _forEach2 = require('lodash/forEach');

var _forEach3 = _interopRequireDefault(_forEach2);

var _omit2 = require('lodash/omit');

var _omit3 = _interopRequireDefault(_omit2);

var run = exports.run = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(yargs) {
    var commands, args, cmd, devSettings, prodSettings;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _utils.Log.args(yargs.argv);

            _context.next = 3;
            return (0, _utils.checkForReactionUpdate)();

          case 3:
            commands = yargs.argv._;
            args = (0, _omit3.default)(yargs.argv, ['_', '$0', 'debugPort', 'mobileServer', 'noLint', 'noReleaseCheck', 'allowIncompatibleUpdate', 'allowSuperuser']);
            cmd = 'meteor';


            if (!!commands.length && commands[0] === 'debug') {
              cmd += ' debug';
            }

            devSettings = 'settings/dev.settings.json';
            prodSettings = 'settings/settings.json';


            if (args.settings) {
              _utils.Log.info('\nUsing settings file at ' + _utils.Log.magenta(args.settings) + '\n');
              cmd += ' --settings ' + args.settings;
            } else if ((0, _utils.exists)(prodSettings)) {
              _utils.Log.info('\nUsing settings file at ' + _utils.Log.magenta(prodSettings) + '\n');
              cmd += ' --settings ' + prodSettings;
            } else if ((0, _utils.exists)(devSettings)) {
              _utils.Log.info('\nUsing settings file at ' + _utils.Log.magenta(devSettings) + '\n');
              cmd += ' --settings ' + devSettings;
            }

            (0, _forEach3.default)((0, _omit3.default)(args, ['settings', 's', 'registry', 'r', 'raw-logs', 'rawLogs']), function (val, key) {
              if (val) {
                var dash = key.length > 1 ? '--' : '-';
                if (val === true) {
                  cmd += ' ' + (dash + key);
                } else {
                  cmd += ' ' + (dash + key) + ' ' + val;
                }
              }
            });

            if (args.registry) {
              (0, _utils.setRegistryEnv)(args.registry);
            }

            cmd += ' --raw-logs';

            _utils.Log.debug('Command: ' + cmd);

            _utils.Log.info('Setting up plugin imports...\n');
            (0, _utils.loadPlugins)();

            _utils.Log.info('Setting up style imports...\n');
            (0, _utils.loadStyles)();

            (0, _shelljs.exec)(cmd, { maxBuffer: 1024 * 1000 });

          case 19:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function run(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _shelljs = require('shelljs');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }