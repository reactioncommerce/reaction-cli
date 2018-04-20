import fs from 'fs';
import Log from './logger';
import { initLocalConfig } from './config';

export default function () {
  const file = './package.json';

  try {
    fs.statSync(file);
  } catch(e) {
    Log.warn('Not in a Reaction app directory. To create a new app, run: reaction init');
    process.exit(1);
  }

  let packageFile;
  try {
    packageFile = fs.readFileSync(file, 'utf8');
  } catch(e) {
    Log.error('A package.json has been found, but it\'s empty. Exiting...');
    process.exit(1);
  }

  const f = JSON.parse(packageFile);

  Log.warn('f.name ' + f.name);
  if (f.name !== 'reaction' || f.name !== 'create-reaction-app') {
    Log.error('Not in a create-reaction-app or base Reaction app. Exiting...');
    process.exit(1);
  }

  initLocalConfig();
}
