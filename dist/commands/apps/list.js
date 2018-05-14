'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../../utils');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var gql, result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            gql = new _utils.GraphQL();
            _context.next = 3;
            return gql.fetch('\n    query {\n      apps {\n        _id\n        name\n        image\n        defaultUrl\n        domains\n        git {\n          ssh_url_to_repo\n        }\n        user {\n          username\n        }\n      }\n    }\n  ');

          case 3:
            result = _context.sent;


            if (!!result.errors) {
              result.errors.forEach(function (err) {
                _utils.Log.error(err.message);
              });
              process.exit(1);
            }

            if (result.data.apps.length === 0) {
              _utils.Config.unset('global', 'launchdock.apps');
            } else {
              _utils.Config.set('global', 'launchdock.apps', result.data.apps);
            }

            return _context.abrupt('return', result.data.apps);

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function appsList() {
    return _ref.apply(this, arguments);
  }

  return appsList;
}();