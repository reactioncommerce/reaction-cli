'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(publicKeyPath) {
    var publicKey, gql, result, updatedKeys;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if ((0, _utils.exists)(publicKeyPath)) {
              _context.next = 2;
              break;
            }

            return _context.abrupt('return', _utils.Log.error('Public key not found at ' + publicKeyPath));

          case 2:
            publicKey = void 0;

            try {
              publicKey = _fs2.default.readFileSync(publicKeyPath, 'utf8');
            } catch (e) {
              _utils.Log.error('Error reading public key');
              process.exit(1);
            }

            gql = new _utils.GraphQL();
            _context.next = 7;
            return gql.fetch('\n    mutation keyCreate($title: String!, $key: String!) {\n      keyCreate(title: $title, key: $key) {\n        _id\n        title\n        key\n      }\n    }\n  ', { title: publicKeyPath.replace(/^.*?([^\\\/]*)$/, '$1'), key: publicKey });

          case 7:
            result = _context.sent;


            if (!!result.errors) {
              result.errors.forEach(function (err) {
                _utils.Log.error(err.message);
              });
              process.exit(1);
            }

            _utils.Log.info('Added new public key: ' + _utils.Log.magenta(result.data.keyCreate.title));

            _context.next = 12;
            return gql.fetch('\n    query {\n      sshKeys {\n        _id\n        title\n        key\n      }\n    }\n  ');

          case 12:
            updatedKeys = _context.sent;


            if (!!updatedKeys.errors) {
              updatedKeys.errors.forEach(function (err) {
                _utils.Log.error(err.message);
              });
              process.exit(1);
            }

            if (!(updatedKeys.data.sshKeys.length === 0)) {
              _context.next = 18;
              break;
            }

            _utils.Log.info('\nNo SSH keys found.\n');
            _utils.Log.info('Run ' + _utils.Log.magenta('reaction keys add /path/to/key.pub') + ' to upload one.\n');
            return _context.abrupt('return', _utils.Config.unset('global', 'launchdock.keys'));

          case 18:

            _utils.Config.set('global', 'launchdock.keys', updatedKeys.data.sshKeys);

            return _context.abrupt('return', updatedKeys.data.sshKeys);

          case 20:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function keyCreate(_x) {
    return _ref.apply(this, arguments);
  }

  return keyCreate;
}();