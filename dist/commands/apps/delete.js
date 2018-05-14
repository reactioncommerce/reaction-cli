'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reject2 = require('lodash/reject');

var _reject3 = _interopRequireDefault(_reject2);

var _filter2 = require('lodash/filter');

var _filter3 = _interopRequireDefault(_filter2);

var _shelljs = require('shelljs');

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_ref2) {
    var name = _ref2.name;
    var apps, app, gql, res;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            apps = _utils.Config.get('global', 'launchdock.apps', []);
            app = (0, _filter3.default)(apps, function (a) {
              return a.name === name;
            })[0];

            if (app) {
              _context.next = 4;
              break;
            }

            return _context.abrupt('return', _utils.Log.error('\nApp deployment not found'));

          case 4:
            gql = new _utils.GraphQL();
            _context.next = 7;
            return gql.fetch('\n    mutation appDelete($_id: ID!) {\n      appDelete(_id: $_id) {\n        success\n      }\n    }\n  ', { _id: app._id });

          case 7:
            res = _context.sent;


            if (!!res.errors) {
              res.errors.forEach(function (err) {
                _utils.Log.error(err.message);
              });
              process.exit(1);
            }

            (0, _shelljs.exec)('git remote remove launchdock-' + name, { silent: true });

            _utils.Config.set('global', 'launchdock.apps', (0, _reject3.default)(apps, function (a) {
              return a.name === name;
            }));

            _utils.Log.success('\nApp \'' + name + '\' successfully deleted.\n');

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function appDelete(_x) {
    return _ref.apply(this, arguments);
  }

  return appDelete;
}();