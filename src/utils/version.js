import fs from 'fs';

export default function () {
  const file = './package.json';

  try {
    fs.statSync(file);
  } catch(e) {
    return null;
  }

  let packageFile;
  try {
    packageFile = fs.readFileSync(file, 'utf8');
  } catch(e) {
    return null;
  }

  const f = JSON.parse(packageFile);

  if (f.name === 'reaction') {
    return f.version;
  }

  return null;
}
