import fs from 'fs-extra';
import path from 'path';
import rimraf from 'rimraf';
import { default as vm } from 'vm';
import Log from './logger';
import { exists, getDirectories } from './fs';

/**
 * getAssetPaths: Get pathnames of all asset directories from each plugin.
 * @param {String} appRoot - absolute path to project root
 * @param {String} subDir - plugin sub-directory (core/included/custom)
 * @return {Array} - Array of objects that contain absolute source & destination paths for copy process
 */
function getAssetPaths(appRoot, subDir) {
  const assetPaths = [];
  const pluginRoot = path.join(appRoot, '/imports/plugins/', subDir);
  // get all plugin directories at provided base path
  const pluginDirs = getDirectories(pluginRoot);
  pluginDirs.forEach((pluginDir) => {
    const pluginPath = pluginRoot + pluginDir;
    const registryImport = pluginPath + '/register.js';
    let pluginName = ''; // this is where the result of register.js execution goes into.
    if (exists(registryImport)) {
      try {
        const content = fs.readFileSync(registryImport, 'utf8');
        if (content  && content.length) {
          // Strip out all import statements.
          const code = content.replace(/import.*\n/g, '');
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
      } catch (error) {
        Log.error(`Can't execute file ${registryImport}: ${error}`);
        process.exit(1);
      }

      if (pluginName) {
        const privateResourcesDirectory = pluginPath + '/private';
        if (exists(privateResourcesDirectory)) {
          assetPaths.push({
            source: privateResourcesDirectory,
            destination: path.join(appRoot, 'private/plugins', pluginName)
          });
        }
        const publicResourcesDirectory = pluginPath + '/public';
        if (exists(publicResourcesDirectory)) {
          assetPaths.push({
            source: publicResourcesDirectory,
            destination: path.join(appRoot, 'public/plugins', pluginName)
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
 *
 * @param {Array} assetDirs - Array of objects that contain the absolute source and destination paths for copying the assets.
 * @return {undefined}
 */
function copyAssets(assetDirs) {
  for (const { source, destination } of assetDirs) {
    try {
      fs.copySync(source, destination);
    } catch (error) {
      Log.error(`Can't copy files from ${source} to ${destination}: ${error}`);
    }
  }
}

function cleanup(appRoot) {
  rimraf(`${appRoot}/public/plugins/*`);
  rimraf(`${appRoot}/private/plugins/*`);
}

export default function () {
  Log.info('Provisioning assets...\n');

  const appRoot = path.resolve('.').split('.meteor')[0];
  cleanup(appRoot);

  const core = getAssetPaths(appRoot, 'core');
  const included = getAssetPaths(appRoot, 'included');
  const custom = getAssetPaths(appRoot, 'custom');

  const assetDirs = [].concat(core, included, custom);
  copyAssets(assetDirs);
}
