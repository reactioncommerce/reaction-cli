'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _filter2 = require('lodash/filter');

var _filter3 = _interopRequireDefault(_filter2);

var _list = require('../apps/list');

var _list2 = _interopRequireDefault(_list);

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_ref2) {
    var name = _ref2.name,
        domain = _ref2.domain;
    var apps, app, gql, result;
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
            return gql.fetch('\n    mutation domainRemove($appId: ID! $domain: String!) {\n      domainRemove(appId: $appId, domain: $domain) {\n        _id\n        name\n        image\n        domains\n        deploymentId\n        defaultUrl\n      }\n    }\n  ', { appId: app._id, domain: domain });

          case 7:
            result = _context.sent;


            if (!!result.errors) {
              result.errors.forEach(function (err) {
                _utils.Log.error(err.message);
              });
              process.exit(1);
            }

            _utils.Log.info('\nRemoved domain ' + _utils.Log.magenta(domain) + ' from app ' + _utils.Log.magenta(result.data.domainRemove.name) + '\n');

            _context.next = 12;
            return (0, _list2.default)();

          case 12:
            return _context.abrupt('return', result.data.domainRemove);

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function domainRemove(_x) {
    return _ref.apply(this, arguments);
  }

  return domainRemove;
}();