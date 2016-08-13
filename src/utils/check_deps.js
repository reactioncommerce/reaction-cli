import includes from 'lodash/includes';
import checkIfInReactionDir from './check_app';
import checkMeteor from './check_meteor';


export default function (checks = [], callback) {
  if (includes(checks, 'app')) {
    checkIfInReactionDir();
    if (checks.length === 1) {
      callback();
    }
  }
  if (includes(checks, 'meteor')) {
    checkMeteor(callback);
  }
}
