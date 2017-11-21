import fs  from 'fs-extra'
import path from 'path';
import Log from './logger';
import { exists, getDirectories } from './fs';




/**
 * getAssetPaths: Get pathnames of all asset directories from each plugin.
 * @param {String} baseDirPath - path to a plugins sub-directory (core/included/custom)
 * @return {Array} - Array of objects that contains plugin name & absolutepath of plugins `/private` directory
 */
function getAssetPaths(baseDirPath) {
  const assetPaths = [];
  // get all plugin directories at provided base path
  const pluginDirs = getDirectories(baseDirPath);
  pluginDirs.forEach((plugin) => {
    const assetDirectory = baseDirPath + plugin + '/private';
    if (exists(assetDirectory)) {
      assetPaths.push({name: plugin, dir: assetDirectory});
    }
  });
  return assetPaths;
}

/**
 * copyAssets: Copy all asset files into application's /private folder
 * @param {String} appRoot - application root path
 * @param {Array} assetDirs - Array of objects that contains plugin name & absolutepath of plugins `/private` directory
 * @return undefined
 */
function copyAssets(appRoot, assetDirs){
  for (const {dir, name} of assetDirs) {
    const targetDir = path.join(appRoot, "private/plugins", name);
    fs.copySync(dir, targetDir);
  }
}

export default function () {
  Log.info('Provisioning assets...\n');

  const appRoot = path.resolve('.').split('.meteor')[0];
  const pluginsPath = path.join(appRoot, '/imports/plugins/');
  const corePlugins = pluginsPath + 'core/';
  const includedPlugins = pluginsPath + 'included/';
  const customPlugins = pluginsPath + 'custom/';

  const core = getAssetPaths(corePlugins);
  const included = getAssetPaths(includedPlugins);
  const custom = getAssetPaths(customPlugins);

  const assetDirs = [].concat(core, included, custom);
  copyAssets(appRoot, assetDirs);
}
