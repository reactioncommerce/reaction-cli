'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _filter2 = require('lodash/filter');

var _filter3 = _interopRequireDefault(_filter2);

exports.open = open;

var _opn = require('opn');

var _opn2 = _interopRequireDefault(_opn);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var helpMessage = '\nUsage:\n\n  reaction open <appname>\n';

function open(yargs) {
  _utils.Log.args(yargs.argv);

  var name = yargs.argv._[1];

  var help = yargs.argv.help;


  if (!name || help) {
    _utils.Log.default(helpMessage);
    process.exit(1);
  }

  var apps = _utils.Config.get('global', 'launchdock.apps', []);
  var app = (0, _filter3.default)(apps, function (a) {
    return a.name === name;
  })[0];

  if (!app) {
    _utils.Log.error('ERROR: App not found');
    process.exit(1);
  }

  (0, _opn2.default)(app.url || app.defaultUrl, { wait: false });
}