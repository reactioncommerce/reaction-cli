import { track } from './analytics';
import { initGlobalConfig } from './config';

export default function (callback) {
  initGlobalConfig();
  track(callback);
}
