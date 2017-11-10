import { initGlobalConfig } from './config';
import { processNotifications } from './notifications';

export default function () {
  initGlobalConfig();
  processNotifications();
}
