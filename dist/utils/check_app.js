'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var file = './package.json';

  try {
    _fs2.default.statSync(file);
  } catch (e) {
    _logger2.default.warn('Not in a Reaction app directory. To create a new app, run: reaction init');
    process.exit(1);
  }

  var packageFile = void 0;
  try {
    packageFile = _fs2.default.readFileSync(file, 'utf8');
  } catch (e) {
    _logger2.default.error('A package.json has been found, but it\'s empty. Exiting...');
    process.exit(1);
  }

  var f = JSON.parse(packageFile);

  if (f.name !== 'reaction' || f.name !== 'create-reaction-app') {
    _logger2.default.error('Not in a create-reaction-app or base Reaction app. Exiting...');
    process.exit(1);
  }

  (0, _config.initLocalConfig)();
};

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }