'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setRegistryEnv = setRegistryEnv;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setRegistryEnv(file) {
  var registryData = void 0;

  try {
    registryData = _fs2.default.readFileSync(file, 'utf8');
  } catch (error) {
    Log.error('Error reading Reaction Registry file: ' + Log.magenta(file));
    process.exit(1);
  }

  // console.log(registryData);

  process.env.REACTION_REGISTRY = registryData;

  return JSON.parse(registryData);
}