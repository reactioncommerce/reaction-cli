'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.track = undefined;

var _forEach2 = require('lodash/forEach');

var _forEach3 = _interopRequireDefault(_forEach2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var track = exports.track = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(cb) {
    var geo, userId, command, argv, versions, properties, analytics;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(!!process.env.CIRCLECI || !!process.env.REACTION_DOCKER_BUILD)) {
              _context.next = 2;
              break;
            }

            return _context.abrupt('return', cb());

          case 2:
            if (!segmentKey) {
              _context.next = 16;
              break;
            }

            _context.next = 5;
            return (0, _geo.getGeoDetail)();

          case 5:
            geo = _context.sent;
            userId = (0, _config.getUserId)();
            command = (cmd + ' ' + args).trim();
            argv = (0, _forEach3.default)(_yargs2.default.argv, function (val) {
              return !!val;
            });
            versions = (0, _versions2.default)();
            properties = _extends({ command: command, geo: geo }, argv, versions);
            analytics = new _analyticsNode2.default(segmentKey, { flushAt: 2, flushAfter: 20 });

            analytics.identify({ userId: userId, traits: _extends({}, versions, { geo: geo }) });
            analytics.track({ event: 'command', userId: userId, properties: properties }, cb);
            _context.next = 17;
            break;

          case 16:
            cb();

          case 17:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function track(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _analyticsNode = require('analytics-node');

var _analyticsNode2 = _interopRequireDefault(_analyticsNode);

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _config = require('./config');

var _geo = require('./geo');

var _versions = require('./versions');

var _versions2 = _interopRequireDefault(_versions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var segmentKey = (0, _config.get)('cli', 'segment');

var cmd = _yargs2.default.argv.$0;
var args = process.argv.splice(2, process.argv.length).join(' ');