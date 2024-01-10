/*******************************************************************************

 gablib
 login.js (2024-01-04)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

'use strict';

import { LoginObject } from './obj/LoginObject.js';
import { _getTokens } from './_getTokens.js';
import { _fetch } from './_fetch.js';

/**
 * @module Login
 */

/**
 * Primary function to log onto into the mastodon site. The function can be
 * provided credentials in three ways:
 *
 * - export env variables using the default MASTODON_USEREMAIL, MASTODON_PASSWORD and MASTODON_BASEURL
 * - export custom env variables and provide the env names as `login('myemailenv', 'mypwdenv', 'myurlenv')`
 * - provide a JSON object as first argument manually setting credentials in code (**not recommended!**):
 *   login({userEmail: 'my@email', password: 'secret', baseUrl: 'https://base.url'})
 *
 * @param {string|{}} [credentials] - either JSON object with credentials, or string with env name for email used with the two next arguments.
 * @param {string} [altPassword] - name of custom env name for password when credentials and altBaseUrl are used for alternative env names
 * @param {string} [altBaseUrl] - name of custom env name for base URL when credentials and altPassword are used for alternative env names
 * @returns {Promise<LoginObject>} this object is used with other API calls that require authentication.
 * @throws when the script could not log in user
 */
export async function login(credentials, altPassword, altBaseUrl) {
  const lo = new LoginObject(credentials, altPassword, altBaseUrl);
  const url = new URL('/auth/sign_in', lo.baseUrl);

  // Step 1: get login page (extract Authenticity, CSRF tokens, initial cookies.)
  try {
    const signInPageResult = await _fetch(lo, `${ lo.baseUrl }/auth/sign_in`, 'GET', 'html');
    Object.assign(lo, _getTokens(signInPageResult.content));
    lo.lastUrl = url;
  }
  catch(err) {
    throw new Error(`Could not request sign_in page: ${ err.message }`);
  }

  // Step 2: do a POST request with login form data (credentials, auth token)
  let loginResult;
  try {
    loginResult = await _fetch(lo, url, 'POST', 'html', {
      'authenticity_token': lo.authToken,
      'user[email]'       : lo.email(),
      'user[password]'    : lo.password()
    }, [ 302 ]);
  }
  catch(err) {
    throw new Error(`Could not POST form data: ${ err.message }`);
  }

  // Step 3: Handle redirect manually to transfer auth/cookies to final page request
  if ( !loginResult.ok ) {
    // fail if not logged in (user will anyway need to update env settings/credentials)
    throw new Error('Expected a redirect. Check if login credentials are set/correct.');
  }

  // Step 4: Get final HTML page with initial JSON set incl. access_token
  return await refreshSession(lo);
}

/**
 * Reload current authenticated page (after login) to refresh access_tokens
 * and cookies, session values. Perhaps useful if server sessions expires (experimental!)
 * @param {LoginObject} lo - current logged in LoginObject from the original `login()` call
 * @returns {Promise<LoginObject>} updated LoginObject
 */
export async function refreshSession(lo) {
  try {
    const finalResult = await _fetch(lo, new URL('/', lo.baseUrl), 'GET', 'html');
    if ( finalResult.ok ) {
      Object.assign(lo, _getTokens(finalResult.content));
    }
    else {
      console.error(`Could not obtain initialized and authenticated page.`);
      process.exit(1);
    }
  }
  catch(err) {
    throw new Error(`Could not obtain initialized and authenticated page: ${ err.message }`);
  }

  return lo;
}
