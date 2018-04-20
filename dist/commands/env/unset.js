'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../../utils');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_ref2) {
    var _id = _ref2._id,
        values = _ref2.values;
    var gql, result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            gql = new _utils.GraphQL();
            _context.next = 3;
            return gql.fetch('\n    mutation configUnset($_id: ID!, $values: [String]!) {\n      configUnset(_id: $_id values: $values) {\n        values\n        app\n      }\n    }\n  ', { _id: _id, values: values });

          case 3:
            result = _context.sent;


            if (!!result.errors) {
              result.errors.forEach(function (err) {
                _utils.Log.error(err.message);
              });
              process.exit(1);
            }

            return _context.abrupt('return', result.data.configUnset.values);

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function envUnset(_x) {
    return _ref.apply(this, arguments);
  }

  return envUnset;
}();