import includes from 'lodash/includes';
import checkApp from './check_app';
import checkMeteor from './check_meteor';
import Log from './logger';

export default function (checks = [], callback) {
  if (includes(checks, 'app')) {
    checkApp();
  }
  if (includes(checks, 'meteor')) {
    checkMeteor(callback);
  }
}
