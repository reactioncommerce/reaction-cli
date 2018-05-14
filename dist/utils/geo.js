'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGeoDetail = undefined;

var getGeoDetail = exports.getGeoDetail = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var res;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _nodeFetch2.default)('https://geo.getreaction.io/json/');

          case 3:
            res = _context.sent;
            _context.next = 6;
            return res.json();

          case 6:
            return _context.abrupt('return', _context.sent);

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](0);
            return _context.abrupt('return', null);

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 9]]);
  }));

  return function getGeoDetail() {
    return _ref.apply(this, arguments);
  };
}();

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }