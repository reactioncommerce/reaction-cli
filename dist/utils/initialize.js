'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (callback) {
  (0, _config.initGlobalConfig)();
  (0, _analytics.track)(callback);
};

var _analytics = require('./analytics');

var _config = require('./config');