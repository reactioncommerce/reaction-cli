'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apps = undefined;

var _forEach2 = require('lodash/forEach');

var _forEach3 = _interopRequireDefault(_forEach2);

var _omit2 = require('lodash/omit');

var _omit3 = _interopRequireDefault(_omit2);

var apps = exports.apps = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(yargs) {
    var subCommands, args, name, remote, notInReactionDir, packageFile, keys, keypairHelpUrl, env, conf, allApps, blue, magenta, table;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _utils.Log.args(yargs.argv);

            subCommands = yargs.argv._;
            args = (0, _omit3.default)(yargs.argv, ['_', '$0']);
            name = args.name, remote = args.remote;

            if (subCommands[1]) {
              _context.next = 6;
              break;
            }

            return _context.abrupt('return', _utils.Log.default(helpMessage));

          case 6:
            if (!(subCommands[1] === 'create')) {
              _context.next = 15;
              break;
            }

            if (name) {
              _context.next = 9;
              break;
            }

            return _context.abrupt('return', _utils.Log.error('Error: App name required'));

          case 9:

            if (remote !== false) {
              notInReactionDir = function notInReactionDir() {
                _utils.Log.error('\nNot in a Reaction app directory.\n');
                _utils.Log.info('To create a new local project, run: ' + _utils.Log.magenta('reaction init') + '\n');
                _utils.Log.info('Or to create a deployment from a prebuilt Docker image, use the --no-remote flag\n');
                _utils.Log.info('Example:');
                _utils.Log.info(' ' + _utils.Log.magenta('reaction apps create --name ' + name + ' --no-remote') + '\n');
                _utils.Log.info(' ' + _utils.Log.magenta('reaction deploy --app ' + name + ' --image reactioncommerce/reaction:latest') + '\n');
              };

              packageFile = void 0;

              try {
                packageFile = _fsExtra2.default.readJSONSync('./package.json');
              } catch (e) {
                notInReactionDir();
                process.exit(1);
              }

              if (packageFile.name !== 'create-reaction-app') {
                notInReactionDir();
                process.exit(1);
              }

              keys = _utils.Config.get('global', 'launchdock.keys', []);


              if (!keys.length) {
                _utils.Log.error('\nAn SSH public key is required to do custom deployments\n');
                _utils.Log.info('To add a key to your account: ' + _utils.Log.magenta('reaction keys add /path/to/key.pub') + '\n');
                keypairHelpUrl = 'https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/';

                _utils.Log.info('More info about creating a key pair: ' + _utils.Log.magenta(keypairHelpUrl) + '\n');
                process.exit(1);
              }
            }

            env = {};

            // convert any supplied env vars into an object

            if (Array.isArray(args.e)) {
              args.e.forEach(function (val) {
                var conf = val.split('=');
                env[conf[0]] = conf[1];
              });
            } else if (typeof args.e === 'string') {
              conf = args.e.split('=');

              env[conf[0]] = conf[1];
            }

            if (args.settings) {
              env.METEOR_SETTINGS = (0, _utils.getStringFromFile)(args.settings);
            }

            if (args.registry) {
              env.REACTION_REGISTRY = (0, _utils.getStringFromFile)(args.registry);
            }

            return _context.abrupt('return', (0, _create2.default)({ name: name, env: env, remote: remote }));

          case 15:
            if (!(subCommands[1] === 'list')) {
              _context.next = 20;
              break;
            }

            _context.next = 18;
            return (0, _list2.default)();

          case 18:
            allApps = _context.sent;


            if (allApps.length !== 0) {
              blue = _utils.Log.blue, magenta = _utils.Log.magenta;
              table = new _cliTable2.default({
                head: [blue('App ID'), blue('Name'), blue('Image'), blue('Default URL'), blue('Domains'), blue('Created By')]
              });


              _utils.Log.info('\nApps List\n');

              allApps.forEach(function (app) {
                var row = [];
                (0, _forEach3.default)((0, _omit3.default)(app, ['git']), function (val, key) {
                  if (key === 'domains' && Array.isArray(val) && val.length > 1) {
                    row.push(magenta(val.length > 1 ? val.join('\n') : val));
                  } else if (key === 'user') {
                    row.push(magenta(val.username));
                  } else {
                    row.push(magenta(val || ''));
                  }
                });
                table.push(row);
              });

              _utils.Log.info(table.toString());
              _utils.Log.info('');
            } else {
              _utils.Log.info('\nNo apps found.\n');
              _utils.Log.info('Run ' + _utils.Log.magenta('reaction apps create <appname>') + ' to create one.\n');
            }

          case 20:
            if (!(subCommands[1] === 'delete')) {
              _context.next = 24;
              break;
            }

            if (name) {
              _context.next = 23;
              break;
            }

            return _context.abrupt('return', _utils.Log.error('App name required'));

          case 23:
            return _context.abrupt('return', (0, _delete2.default)({ name: name }));

          case 24:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function apps(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _cliTable = require('cli-table2');

var _cliTable2 = _interopRequireDefault(_cliTable);

var _utils = require('../../utils');

var _list = require('./list');

var _list2 = _interopRequireDefault(_list);

var _create = require('./create');

var _create2 = _interopRequireDefault(_create);

var _delete = require('./delete');

var _delete2 = _interopRequireDefault(_delete);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var helpMessage = '\nUsage:\n\n  reaction apps [command]\n\n    Commands:\n      list      List your app deployments\n      create    Create a new app deployment on Launchdock\n      delete    Remove an existing app deployment from Launchdock\n';