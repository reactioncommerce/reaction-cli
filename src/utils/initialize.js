import { track } from './analytics';
import { initGlobalConfig } from './config';
import { checkYarn } from './yarn_check';

export default function (callback) {
  initGlobalConfig();
  checkYarn(() => track(callback));
}
