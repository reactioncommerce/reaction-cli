import fs from 'fs';

export function setRegistryEnv(file) {
  let registryData;

  try {
    registryData = fs.readFileSync(file, 'utf8');
  } catch (error) {
    Log.error(`Error reading Reaction Registry file: ${Log.magenta(file)}`);
    process.exit(1);
  }

  process.env.REACTION_REGISTRY = registryData;

  return JSON.parse(registryData);
}
