import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import keypair from 'keypair';
import { pki, ssh } from 'node-forge';
import uuid from 'uuid';
import _ from 'lodash';
import * as Config from './config';
import { exists } from './fs';
import Log from './logger';
import keysList from '../commands/keys/list';
import keyCreate from '../commands/keys/add';

/**
 * Generate an SSH key pair and save them at ~/.reaction/keys/
 * @param  {String} email  The email found in the public key
 * @return {Object}  returns a results object: { publicKey: String, privateKey: String, title: String }
 */
export function generateKeyPair({ email }) {
  if (!email) {
    Log.error('An email is required to generate a keypair');
    process.exit(1);
  }

  const pair = keypair();
  const pub = pki.publicKeyFromPem(pair.public);
  const priv = pki.privateKeyFromPem(pair.private);

  const publicKey = ssh.publicKeyToOpenSSH(pub, email);
  const privateKey = ssh.privateKeyToOpenSSH(priv);

  const userHome = os.homedir();
  const title = uuid.v1();

  const publicKeyFile = path.resolve(`${userHome}/.reaction/keys/${title}.pub`);
  const privateKeyFile = path.resolve(`${userHome}/.reaction/keys/${title}`);

  fs.ensureFileSync(publicKeyFile);
  fs.ensureFileSync(privateKeyFile);

  fs.writeFileSync(publicKeyFile, publicKey);
  fs.writeFileSync(privateKeyFile, privateKey);

  fs.chmodSync(publicKeyFile, '400');
  fs.chmodSync(privateKeyFile, '400');

  Log.debug(`Generated new SSH key pair: ${title}`);

  return {
    publicKey,
    privateKey,
    title
  };
}


/**
 * Check if the user has a registered SSH key in ~/.reaction/keys/
 * If so, set the GIT_SSH_COMMAND environment variable to use the private key's identity
 * https://superuser.com/a/912281
 * @return {String|null} returns the path to the chosen private key or null if none found
 */
export function setGitSSHKeyEnv() {
  const homeDir = os.homedir();
  const keys = Config.get('global', 'launchdock.keys', []);
  const key = _.filter(keys, (k) => exists(path.resolve(`${homeDir}/.reaction/keys/${k.title}`)))[0];

  if (!!key) {
    let keyPath = path.resolve(`${homeDir}/.reaction/keys/${key.title}`);
    // fix key path for git on Windows
    // https://github.com/reactioncommerce/reaction-cli/issues/54
    if (os.platform() === 'win32') {
      keyPath = keyPath.replace(/\\/g, '/');
    }
    process.env.GIT_SSH_COMMAND = `ssh -i ${keyPath}`;
    Log.debug(`Setting SSH key identity to: ${keyPath}`);
    Log.debug(`export GIT_SSH_COMMAND=${process.env.GIT_SSH_COMMAND}`);
    return keyPath;
  }

  return null;
}


/**
 * Check if the user has a registered SSH key in ~/.reaction/keys/
 * @return {undefined} returns nothing
 */
export async function ensureSSHKeysExist() {
  const keys = await keysList();
  const homeDir = os.homedir();

  let hasKey = false;

  keys.forEach((k) => {
    if (exists(`${homeDir}/.reaction/keys/${k.title}`)) {
      hasKey = true;
    }
  });

  if (keys.length === 0 || !hasKey) {
    const email = Config.get('global', 'launchdock.email');
    const keyPair = generateKeyPair({ email });
    await keyCreate({ publicKey: keyPair.publicKey, title: keyPair.title });
  }
}
