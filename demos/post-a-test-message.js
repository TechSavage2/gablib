/**
 * Will post a hard coded message to your timeline.
 * Just make sure to initialize env (see README.md)
 *
 * node demos/post-a-test-message
 * bun demos/post-a-test-message.js
 */

'use strict';

import { login, createStatus, enumVisibility } from '../gablib.js';

// login to your account
const lo = await login();

// post a message
const result = await createStatus(lo,
  '### This message was posted with gablib\n\n#gablib **rocks!** Find gablib here:\n\nhttps://github.com/TechSavage2/gablib',
  {
    visibility: enumVisibility.public
  });

console.log(result);
