/**
 * Show notifications. This can be extended to show a dialog and run at an interval.
 * Just make sure to initialize env (see README.md)
 *
 * node demos/notifications
 * bun demos/notifications.js
 */

'use strict';

import { login, getNotifications } from '../gablib.js';

console.log('Logging in...');

// login to your account
const lo = await login();

console.log('Notifications:');

const res = await getNotifications(lo);
const messages = res.content;

for(const msg of messages) {
  const url = msg.status.url;
  switch( msg.type ) {
    case 'favourite':
      console.log(`\x1b[32;1m👍 ${ msg.account.username } liked your post:\x1b[m\n${ url }`);
      break;
    case 'mention':
      console.log(`\x1b[32;1m🗨️  ${ msg.account.username } mentioned you in:\x1b[m\n${ url }`);
      break;
    case 'reblog':
      console.log(`\x1b[32;1m♻ ${ msg.account.username } reposted your post:\x1b[m\n${ url }`);
      break;
  }
}
