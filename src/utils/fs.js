import fs from 'fs';
import path from 'path';
import Log from './logger';

/**
 * Synchronously check if a file or directory exists
 * @param {String} searchPath - path to file or directory
 * @return {Boolean} - returns true if file or directory exists
 */
export function exists(searchPath) {
  try {
    fs.statSync(searchPath);
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
export function isEmptyOrMissing(searchPath) {
  let stat;
  try {
    stat = fs.statSync(searchPath);
  } catch (e) {
    return true;
  }
  if (stat.isDirectory()) {
    const items = fs.readdirSync(searchPath);
    return !items || !items.length;
  }
  const file = fs.readFileSync(searchPath);
  return !file || !file.length;
}


/**
 * Get an array of directory names in a given path
 * @param {String} dir - path to a directory
 * @return {Array} returns an array of directory names
 */
export function getDirectories(dir) {
  try {
    const files = fs.readdirSync(dir).filter((file) => {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
    return files;
  } catch(e) {
    Log.error('Directory not found: ' + dir);
    Log.error(e);
    process.exit(1);
  }
}


/**
 * Get an array of file names in a given directory
 * @param {String} dir - path to a directory
 * @return {Array} returns an array of file names
 */
export function getFiles(dir) {
  try {
    const files = fs.readdirSync(dir).filter((file) => {
      return fs.statSync(path.join(dir, file)).isFile();
    });
    return files;
  } catch(e) {
    Log.error(e, `Directory not found: ${Log.magenta(dir)}`);
    process.exit(1);
  }
}


/**
 * Read and return the contents of a JSON file at a given path
 * @param {String} file - path to a JSON file
 * @return {Object} returns the JSON content of the file
 */
export function getJSONFromFile(file) {
  try {
    return fs.readJSONSync(file);
  } catch (error) {
    Log.error(error, `Error reading JSON file: ${Log.magenta(file)}`);
    process.exit(1);
  }
}


/**
 * Read and return the contents of a JSON file at a given path
 * @param {String} file - path to a JSON file
 * @return {Object} returns the JSON content of the file
 */
export function getStringFromFile(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch (error) {
    Log.error(error, `Error reading file: ${Log.magenta(file)}`);
    process.exit(1);
  }
}
