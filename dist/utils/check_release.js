'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkForReactionUpdate = exports.getLatestReactionRelease = undefined;

// get the latest release version from Github releases
var getLatestReactionRelease = exports.getLatestReactionRelease = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var res, releases, tags;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _nodeFetch2.default)('https://api.github.com/repos/reactioncommerce/reaction/releases');

          case 3:
            res = _context.sent;
            _context.next = 6;
            return res.json();

          case 6:
            releases = _context.sent;
            tags = [];

            releases.forEach(function (r) {
              return tags.push(r.tag_name);
            });
            return _context.abrupt('return', (0, _latestSemver2.default)(tags));

          case 12:
            _context.prev = 12;
            _context.t0 = _context['catch'](0);
            return _context.abrupt('return', null);

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 12]]);
  }));

  return function getLatestReactionRelease() {
    return _ref.apply(this, arguments);
  };
}();

// notify user if a Reaction update is available


var checkForReactionUpdate = exports.checkForReactionUpdate = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
    var reactionVersion, packageFile, f, latestRelease, blue, green, magenta;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // get current Reaction version
            reactionVersion = void 0;

            try {
              packageFile = _fs2.default.readFileSync('./package.json', 'utf8');
              f = JSON.parse(packageFile);


              if (f.name === 'reaction') {
                reactionVersion = f.version;
              }
            } catch (e) {
              reactionVersion = null;
            }

            // check if a newer release is available

            if (!reactionVersion) {
              _context2.next = 13;
              break;
            }

            _context2.prev = 3;
            _context2.next = 6;
            return getLatestReactionRelease();

          case 6:
            latestRelease = _context2.sent;


            if (_semver2.default.lt(reactionVersion, latestRelease)) {
              blue = _logger2.default.blue, green = _logger2.default.green, magenta = _logger2.default.magenta;

              _logger2.default.info(green('\nA newer version of Reaction exists on Github.\n'));
              _logger2.default.info(green('Current version: ' + magenta(reactionVersion)));
              _logger2.default.info(green('Available version: ' + magenta(latestRelease)));
              _logger2.default.info(green('\nTo update, run: ' + blue('reaction pull') + '\n'));
            }
            _context2.next = 13;
            break;

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2['catch'](3);

            _logger2.default.error(_context2.t0);

          case 13:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[3, 10]]);
  }));

  return function checkForReactionUpdate() {
    return _ref2.apply(this, arguments);
  };
}();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _latestSemver = require('latest-semver');

var _latestSemver2 = _interopRequireDefault(_latestSemver);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }