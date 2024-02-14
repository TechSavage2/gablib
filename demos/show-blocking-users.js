/**
 * Show user accounts that is currently blocking you.
 * Just make sure to initialize env (see README.md)
 *
 * node demos/show-blocking-users
 * bun demos/show-blocking-users.js
 */

'use strict';

import { login, getAccountBlockedBys, getAccountFromId } from '../gablib.js';

console.log('Logging in...');

// login to your account
const lo = await login();

console.log('Showing account that is blocking yours -');

const res = await getAccountBlockedBys(lo);
const list = res.content.accounts;

console.log(`Number of accounts blocking: \x1b[31;1m${ list.length }\x1b[m`);

for(let id of list) {
  const result = await getAccountFromId(lo, id);
  const user = result.content;
  if ( user ) {
    const username = user.display_name.length ? user.display_name : user.username;
    console.log(`Blocking account: \x1b[31;1m${ username }\x1b[m @ \x1b[32;1m${ user.url }\x1b[m`);
  }
  else {
    console.log(`\x1b[33;1mAccount with id \x1b[31m${ id }\x1b[33m is deleted.\x1b[m`);
  }
}
