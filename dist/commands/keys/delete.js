'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _filter2 = require('lodash/filter');

var _filter3 = _interopRequireDefault(_filter2);

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(publicKeyTitle) {
    var keys, key, gql, res, updatedKeys;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            keys = _utils.Config.get('global', 'launchdock.keys', []);
            key = (0, _filter3.default)(keys, function (k) {
              return k.title === publicKeyTitle;
            })[0];

            if (key) {
              _context.next = 4;
              break;
            }

            return _context.abrupt('return', _utils.Log.error('\nKey not found'));

          case 4:
            gql = new _utils.GraphQL();
            _context.next = 7;
            return gql.fetch('\n    mutation keyDelete($_id: ID!) {\n      keyDelete(_id: $_id) {\n        success\n      }\n    }\n  ', { _id: key._id });

          case 7:
            res = _context.sent;


            if (!!res.errors) {
              res.errors.forEach(function (err) {
                _utils.Log.error(err.message);
              });
              process.exit(1);
            }

            _context.next = 11;
            return gql.fetch('\n    query {\n      sshKeys {\n        _id\n        title\n        key\n      }\n    }\n  ');

          case 11:
            updatedKeys = _context.sent;


            if (!!updatedKeys.errors) {
              updatedKeys.errors.forEach(function (err) {
                _utils.Log.error(err.message);
              });
              process.exit(1);
            }

            if (!(updatedKeys.data.sshKeys.length === 0)) {
              _context.next = 15;
              break;
            }

            return _context.abrupt('return', _utils.Config.unset('global', 'launchdock.keys'));

          case 15:

            _utils.Config.set('global', 'launchdock.keys', updatedKeys.data.sshKeys);

            _utils.Log.success('Success!');

            return _context.abrupt('return', updatedKeys.data.sshKeys);

          case 18:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function keyDelete(_x) {
    return _ref.apply(this, arguments);
  }

  return keyDelete;
}();