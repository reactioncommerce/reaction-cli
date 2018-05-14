'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.env = undefined;

var _forEach2 = require('lodash/forEach');

var _forEach3 = _interopRequireDefault(_forEach2);

var _filter2 = require('lodash/filter');

var _filter3 = _interopRequireDefault(_filter2);

var _omit2 = require('lodash/omit');

var _omit3 = _interopRequireDefault(_omit2);

var env = exports.env = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(yargs) {
    var subCommands, args, app, apps, currentApp, vals, values, conf, varsToUnset, _vals;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _utils.Log.args(yargs.argv);

            subCommands = yargs.argv._;
            args = (0, _omit3.default)(yargs.argv, ['_', '$0']);
            app = args.app;


            if (!subCommands[1]) {
              _utils.Log.default(helpMessage);
              process.exit(1);
            }

            if (!app) {
              _utils.Log.error('Error: App name required');
              process.exit(1);
            }

            apps = _utils.Config.get('global', 'launchdock.apps', []);
            currentApp = (0, _filter3.default)(apps, function (a) {
              return a.name === app;
            })[0];


            if (!currentApp || !currentApp._id) {
              _utils.Log.error('Error: App not found');
              process.exit(1);
            }

            // list

            if (!(subCommands[1] === 'list')) {
              _context.next = 15;
              break;
            }

            _context.next = 12;
            return (0, _list2.default)(currentApp._id);

          case 12:
            vals = _context.sent;


            if (vals) {
              _utils.Log.default('');
              (0, _forEach3.default)(vals, function (val, key) {
                _utils.Log.default(key + ': ' + val);
              });
            } else {
              _utils.Log.info('\nNo environment variables found.\n');
            }

            return _context.abrupt('return', vals);

          case 15:
            values = {};

            // convert any supplied env vars into an object

            if (Array.isArray(args.e)) {
              args.e.forEach(function (val) {
                var conf = val.split('=');
                values[conf[0]] = conf[1];
              });
            } else if (typeof args.e === 'string') {
              conf = args.e.split('=');

              values[conf[0]] = conf[1];
            }

            // set

            if (!(subCommands[1] === 'set')) {
              _context.next = 21;
              break;
            }

            if (args.settings) {
              values.METEOR_SETTINGS = (0, _utils.getStringFromFile)(args.settings);
            }

            if (args.registry) {
              values.REACTION_REGISTRY = (0, _utils.getStringFromFile)(args.registry);
            }

            return _context.abrupt('return', (0, _set2.default)({ _id: currentApp._id, values: values }));

          case 21:
            if (!(subCommands[1] === 'unset')) {
              _context.next = 27;
              break;
            }

            varsToUnset = Array.isArray(args.e) ? args.e : [args.e];
            _context.next = 25;
            return (0, _unset2.default)({ _id: currentApp._id, values: varsToUnset });

          case 25:
            _vals = _context.sent;


            if (_vals) {
              _utils.Log.info('\nRemaining Environment Variables:\n');
              (0, _forEach3.default)(_vals, function (val, key) {
                _utils.Log.default(key + ': ' + val);
              });
            } else {
              _utils.Log.info('\nNo environment variables remaining.\n');
            }

          case 27:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function env(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _utils = require('../../utils');

var _list = require('./list');

var _list2 = _interopRequireDefault(_list);

var _set = require('./set');

var _set2 = _interopRequireDefault(_set);

var _unset = require('./unset');

var _unset2 = _interopRequireDefault(_unset);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var helpMessage = '\nUsage:\n\n  reaction env [command] [options]\n\n    Commands:\n      list      List the environment variables for a deployment\n      set       Set the environment variables for a deployment\n      unset     Unset environment variables for a deployment\n\n    Options:\n      --app       The name of the app to reference [Required]\n      --env-file  Load a specified env file\n      --registry  Path to a reaction.json registry file\n      --settings  Path to a Meteor settings.json file\n';