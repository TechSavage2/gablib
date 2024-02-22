/*******************************************************************************

 gablib
 apiFetch.js (2024-01-04)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

'use strict';

/**
 * Private function that handles all our scenarios. This function is not intended
 *  to be called directly, but through wrappers that will provide the correct
 *  arguments.
 *
 * @param loginObject
 * @param url
 * @param method
 * @param resultType
 * @param body
 * @param expectedReturnCode
 * @returns {Promise}
 * @private
 */
export async function _fetch(
  loginObject,
  url,
  method = 'GET',
  resultType = 'json',
  body = null,
  expectedReturnCode = [ 200 ]) {

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

    if ( loginObject.accessToken ) {
      options.headers[ 'Authorization' ] = `Bearer ${ loginObject.accessToken }`;
    }

    if ( loginObject.csrfToken ) {
      options.headers[ 'X-Csrf-Token' ] = loginObject.csrfToken;
    }
  }

  if ( resultType === 'json' ) {
    options.headers[ 'Content-Type' ] = 'application/json;charset=UTF-8';
    if ( body ) options.body = JSON.stringify(body);
  }
  else if ( resultType === 'binary' ) {
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
  const ok = expectedReturnCode.includes(status | 0);

  let content = null;
  if ( method.toUpperCase() !== 'HEAD' ) {
    if ( ok && status !== 204 ) {
      if ( resultType === 'json' || resultType === 'binary' ) {
        content = await response.json();
      }
      else {
        content = await response.text();
      }
    }
  }

  if ( loginObject && loginObject.loginOk && typeof loginObject.serializePath === 'string' ) {
    if ( ok ) {
      loginObject.serialize();
    }
    else {
      // todo if auth error attempt to refresh page. If that fails do a full login()
    }
  }

  // update login object
  if ( loginObject ) {
    loginObject.cookies.set(headers.getSetCookie());
    loginObject.lastUrl = response.url;
  }

  return { content, ok, status, headers, url: response.url };
}
