'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exists = exists;
exports.isEmptyOrMissing = isEmptyOrMissing;
exports.getDirectories = getDirectories;
exports.getFiles = getFiles;
exports.getJSONFromFile = getJSONFromFile;
exports.getStringFromFile = getStringFromFile;
exports.getUserHome = getUserHome;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Synchronously check if a file or directory exists
 * @param {String} searchPath - path to file or directory
 * @return {Boolean} - returns true if file or directory exists
 */
function exists(searchPath) {
  try {
    _fs2.default.statSync(searchPath);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Synchronously check if a file or directory is empty or doesn't exist
 * @param {String} searchPath - path to file or directory
 * @return {Boolean} returns true if file or directory is empty or missing
 */
function isEmptyOrMissing(searchPath) {
  var stat = void 0;
  try {
    stat = _fs2.default.statSync(searchPath);
  } catch (e) {
    return true;
  }
  if (stat.isDirectory()) {
    var items = _fs2.default.readdirSync(searchPath);
    return !items || !items.length;
  }
  var file = _fs2.default.readFileSync(searchPath);
  return !file || !file.length;
}

/**
 * Get an array of directory names in a given path
 * @param {String} dir - path to a directory
 * @return {Array} returns an array of directory names
 */
function getDirectories(dir) {
  try {
    var files = _fs2.default.readdirSync(dir).filter(function (file) {
      return _fs2.default.statSync(_path2.default.join(dir, file)).isDirectory();
    });
    return files;
  } catch (e) {
    _logger2.default.error('Directory not found: ' + dir);
    _logger2.default.error(e);
    process.exit(1);
  }
}

/**
 * Get an array of file names in a given directory
 * @param {String} dir - path to a directory
 * @return {Array} returns an array of file names
 */
function getFiles(dir) {
  try {
    var files = _fs2.default.readdirSync(dir).filter(function (file) {
      return _fs2.default.statSync(_path2.default.join(dir, file)).isFile();
    });
    return files;
  } catch (e) {
    _logger2.default.error(e, 'Directory not found: ' + _logger2.default.magenta(dir));
    process.exit(1);
  }
}

/**
 * Read and return the contents of a JSON file at a given path
 * @param {String} file - path to a JSON file
 * @return {Object} returns the JSON content of the file
 */
function getJSONFromFile(file) {
  try {
    return _fs2.default.readJSONSync(file);
  } catch (error) {
    _logger2.default.error(error, 'Error reading JSON file: ' + _logger2.default.magenta(file));
    process.exit(1);
  }
}

/**
 * Read and return the contents of a JSON file at a given path
 * @param {String} file - path to a JSON file
 * @return {Object} returns the JSON content of the file
 */
function getStringFromFile(file) {
  try {
    return _fs2.default.readFileSync(file, 'utf8');
  } catch (error) {
    _logger2.default.error(error, 'Error reading file: ' + _logger2.default.magenta(file));
    process.exit(1);
  }
}

/**
 * Get the path to the current user's home directory
 * @return {String} path to user's home dir
 */
function getUserHome() {
  return process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
}