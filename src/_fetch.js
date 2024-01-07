/*******************************************************************************

 gablib
 apiFetch.js (2024-01-04)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

'use strict';

import { login } from './login.js';

/**
 Private function that handles all our scenarios. This function is not intended
 to be called directly, but through wrappers that will provide the correct
 arguments.
 */
export async function _fetch(
  loginObject,
  url,
  method = 'GET',
  resultType = 'json',
  body = null,
  auth = true) {

  const ua = loginObject ? loginObject.userAgent : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Firefox/120.0';

  const options = {
    headers    : {
      'Accept'                   : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language'          : 'en-US,en;q=0.5',
      'Accept-Encoding'          : 'gzip,deflate',
      'Cache-Control'            : 'no-cache',
      'Connection'               : 'keep-alive',
      'Pragma'                   : 'no-cache',
      'Sec-Fetch-Dest'           : 'document', /** empty,document */
      'Sec-Fetch-Mode'           : 'navigate', /** cors,navigate */
      'Sec-Fetch-Site'           : 'same-origin', /** none,same-origin */
      'Sec-Gpc'                  : '1',
      'Sec-Fetch-User'           : '?1',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent'               : ua
    },
    method     : method,
    mode       : 'cors',
    credentials: 'include',
    redirect   : 'manual'   // we need to handle redirects manually to transfer auth/cookies to redirected page
  };

  if ( loginObject ) {
    if ( loginObject.cookies.has() ) {
      options.headers[ 'Cookie' ] = loginObject.cookies.toString();
    }

    if ( loginObject.lastUrl ) {
      options.headers[ 'Referer' ] = loginObject.lastUrl;
    }

    if ( auth && loginObject.accessToken ) {
      options.headers[ 'Authorization' ] = `Bearer ${ loginObject.accessToken }`;
    }

    if ( loginObject.csrfToken ) {
      // does not seem to be required
      options.headers[ 'X-Csrf-Token' ] = loginObject.csrfToken;
    }
  }

  if ( resultType === 'json' ) {
    options.headers[ 'Content-Type' ] = 'application/json;charset=UTF-8';
    if ( body ) options.body = JSON.stringify(body);
  }
  else if ( resultType === 'binary' ) {
    //options.headers[ 'Content-Type' ] = 'application/json;charset=UTF-8';
    if ( body ) options.body = body;
  }
  else if ( resultType === 'html' ) {
    options.headers[ 'Content-Type' ] = 'application/x-www-form-urlencoded';
    if ( body ) {
      const bodyParts = [];
      Object.keys(body).forEach(part => {
        bodyParts.push(encodeURIComponent(part) + '=' + encodeURIComponent(body[ part ]));
      });
      options.body = bodyParts.join('&');
    }
  }
  else {
    options.headers[ 'Content-Type' ] = 'text/plain;charset=UTF-8';
    if ( body ) options.body = JSON.stringify(body);
  }

  if ( body && options.body.length && resultType !== 'binary' ) {
    options[ 'Content-Length' ] = options.body.length;
  }

  const response = await fetch(url, options);
  const headers = response.headers;
  const status = response.status;
  const content = resultType === 'json' || resultType === 'binary' ? await response.json() : await response.text();

  // update login object
  if ( loginObject ) {
    loginObject.cookies.set(headers.getSetCookie());
    loginObject.lastUrl = response.url;
  }

  return { content, headers, status, url: response.url };
  //todo consolidate return as in almost all cases we only need content and status:
  //{ content: result.content, ok: result.status === 200 }
}
