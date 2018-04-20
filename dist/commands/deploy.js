'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deploy = undefined;

var _filter2 = require('lodash/filter');

var _filter3 = _interopRequireDefault(_filter2);

var _omit2 = require('lodash/omit');

var _omit3 = _interopRequireDefault(_omit2);

var deploy = exports.deploy = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(yargs) {
    var args, app, image, apps, appToDeploy, msg, values, conf, options, gql, notInReactionDir, packageFile, keys, result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _utils.Log.args(yargs.argv);

            args = (0, _omit3.default)(yargs.argv, ['_', '$0']);
            app = args.app, image = args.image;

            if (!(!app && !image)) {
              _context.next = 5;
              break;
            }

            return _context.abrupt('return', _utils.Log.default(helpMessage));

          case 5:
            if (app) {
              _context.next = 7;
              break;
            }

            return _context.abrupt('return', _utils.Log.error('Error: App name required (--app myapp)'));

          case 7:
            apps = _utils.Config.get('global', 'launchdock.apps', []);
            appToDeploy = (0, _filter3.default)(apps, function (a) {
              return a.name === app;
            })[0];

            if (appToDeploy) {
              _context.next = 13;
              break;
            }

            msg = 'App not found. Run \'reaction apps list\' to see your active apps';

            _utils.Log.error(msg);
            throw new Error(msg);

          case 13:
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

            // read in a settings file if provided
            if (args.settings) {
              values.METEOR_SETTINGS = (0, _utils.getStringFromFile)(args.settings);
            }

            // read in a Reaction registry file if provided
            if (args.registry) {
              values.REACTION_REGISTRY = (0, _utils.getStringFromFile)(args.registry);
            }

            options = { _id: appToDeploy._id };


            if (Object.keys(values).length > 0) {
              options.env = values;
            }

            gql = new _utils.GraphQL();


            if (image || appToDeploy.image) {
              // docker pull deployment
              _utils.Log.warn('Prebuilt Docker image deployment is currently unavailable.');
              _utils.Log.warn('Contact support for more info.');

              process.exit(1);

              // TODO: allow deployment of prebuilt images
              //
              // options.image = image || appToDeploy.image;
              //
              // const result = await gql.fetch(`
              //   mutation appPull($_id: ID!, $image: String! $env: JSON) {
              //     appPull(_id: $_id, image: $image, env: $env) {
              //       _id
              //       name
              //       image
              //       defaultUrl
              //     }
              //   }
              // `, options);
              //
              // if (!!result.errors) {
              //   result.errors.forEach((err) => {
              //     Log.error(err.message);
              //   });
              //   process.exit(1);
              // }
              //
              // const { defaultUrl } = result.data.appPull;
              //
              // Log.success('\nDone!\n');
              //
              // Log.info(`Updated ${Log.magenta(app)} with image ${Log.magenta(options.image)}\n`);
              // Log.info('You will receive a notification email as soon as the deployment finishes.\n');
              // Log.info(`App URL: ${Log.magenta(defaultUrl)}\n`);
            } else {
              // git push deployment

              notInReactionDir = function notInReactionDir() {
                _utils.Log.error('\nNot in a Reaction app directory.\n');
                _utils.Log.info('To create a new local project, run: ' + _utils.Log.magenta('reaction init') + '\n');
                _utils.Log.info('Or to create a deployment with a prebuilt Docker image, use the --image flag\n');
                _utils.Log.info('Example: ' + _utils.Log.magenta('reaction apps create --name ' + app + ' --image myorg/myapp:latest') + '\n');
              };

              packageFile = void 0;

              try {
                packageFile = _fsExtra2.default.readJSONSync('./package.json');
              } catch (e) {
                notInReactionDir();
                process.exit(1);
              }

              if (packageFile.name !== 'reaction') {
                notInReactionDir();
                process.exit(1);
              }

              keys = _utils.Config.get('global', 'launchdock.keys', []);


              if (!keys.length) {
                _utils.Log.error('\nAn SSH public key is required to do custom deployments\n');
                _utils.Log.info('To publish a new key: ' + _utils.Log.magenta('reaction keys add /path/to/key.pub') + '\n');
                process.exit(1);
              }

              _utils.Log.info('\nPushing updates to be built...\n');

              result = (0, _shelljs.exec)('git push launchdock-' + app, { silent: true });


              if (result.code !== 0) {
                _utils.Log.error('Deployment failed');
                process.exit(1);
              }

              if (result.stderr.includes('Everything up-to-date')) {
                _utils.Log.info('No committed changes to deploy.\n');
                process.exit(0);
              }

              _utils.Log.info('You will be notified as soon as your app finishes building and deploying.\n');
              _utils.Log.success('Done!\n');
            }

          case 21:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function deploy(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _shelljs = require('shelljs');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var helpMessage = '\nUsage:\n\n  reaction deploy [options]\n\n    Options:\n      --app, -a    The name of the app to deploy (required)\n      --env, -e    Set/update an environment varible before deployment\n      --image, -i  The Docker image to deploy\n';