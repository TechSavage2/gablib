/*******************************************************************************

 gablib
 test-login.js (2024-01-04)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

'use strict';

import { login } from './src/login.js';

try {
  const loginObject = await login();
  const userInfo = loginObject.getMyAccountInfo();

  console.log('\n\x1b[1;32mSUCCESS!\x1b[m\n--------\n');
  console.log(userInfo);
}
catch {
  console.error('Sorry, could not log you in. Please check env values (see README.md for instructions.');
}
