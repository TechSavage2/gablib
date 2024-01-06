/**
 * List groups you are member of.
 *
 * node demos/list-my-groups
 * bun demos/list-my-groups.js
 */

'use strict';

import { login } from '../src/login.js';
import { getMyGroups } from '../src/api.auth.groups.js';

// login to your account
const lo = await login();

// list groups
const result = await getMyGroups(lo, true);
console.log(result);
