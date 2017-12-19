import fs  from 'fs-extra'
import path from 'path';
import { default as vm } from 'vm';
import Log from './logger';
import { exists, getDirectories } from './fs';

/**
 * getAssetPaths: Get pathnames of all asset directories from each plugin.
 * @param {String} appRoot - absolute path to project root
 * @param {String} pluginRoot - path to a plugins sub-directory (core/included/custom)
 * @return {Array} - Array of objects that contain absolute source & destination paths for copy process
 */
function getAssetPaths(appRoot, pluginRoot) {
  const assetPaths = [];
  // get all plugin directories at provided base path
  const pluginDirs = getDirectories(pluginRoot);
  pluginDirs.forEach((pluginDir) => {
    const pluginPath = pluginRoot + pluginDir;
    const registryImport = pluginPath + '/register.js';
    let pluginName = ""; // this is where the result of register.js execution goes into.
    if (exists(registryImport)) {
      try {
        const content = fs.readFileSync(registryImport, "utf8");
        if (content  && content.length) {
          // Strip out all import statements.
          const code = content.replace(/import.*\n/g, "");
          const sandbox = {
            // Mock Reaction.registerPackage function
            Reaction: {
              registerPackage(config) {
                pluginName = config.name;
              }
            },
            _: {
              // lodash's extend is still used in a couple of register.js
              extend() {
                return Object.assign(...arguments);
              }
            }
          };
          vm.createContext(sandbox);
          vm.runInContext(code, sandbox);
        }
      } catch (err) {
        Log.error(`Can't execute file ${registryImport}: ${err}`);
        process.exit(1);
      }

      if (pluginName) {
        const privateResourcesDirectory = pluginPath + '/private';
        if (exists(privateResourcesDirectory)) {
          assetPaths.push({
            source: privateResourcesDirectory,
            destination: path.join(appRoot, "private/plugins", pluginName)
          });
        }
        const publicResourcesDirectory = pluginPath + '/public';
        if (exists(publicResourcesDirectory)) {
          assetPaths.push({
            source: publicResourcesDirectory,
            destination: path.join(appRoot, "public/plugins", pluginName)
          });
        }
      } else {
        Log.info(`Can't determine plugin name for plugin directory ${pluginPath}. No resources copied.`);
      }
    }
  });
  return assetPaths;
}

/**
 * copyAssets: Copy all asset files into application's /private folder
 * @param {Array} assetDirs - Array of objects that contain the absolute source and destination paths for copying the assets.
 * @return undefined
 */
function copyAssets(assetDirs){
  for (const {source, destination} of assetDirs) {
    fs.copySync(source, destination);
  }
}

export default function () {
  Log.info('Provisioning assets...\n');

  const appRoot = path.resolve('.').split('.meteor')[0];
  const pluginsPath = path.join(appRoot, '/imports/plugins/');
  const corePlugins = pluginsPath + 'core/';
  const includedPlugins = pluginsPath + 'included/';
  const customPlugins = pluginsPath + 'custom/';

  const core = getAssetPaths(appRoot, corePlugins);
  const included = getAssetPaths(appRoot, includedPlugins);
  const custom = getAssetPaths(appRoot, customPlugins);

  const assetDirs = [].concat(core, included, custom);
  copyAssets(assetDirs);
}
