/*******************************************************************************

 gablib
 CookieJar.js (2024-01-04)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

'use strict';

/**
 * Basic cookie jar for _fetch
 * @constructor
 * @private
 */
export function CookieJar() {
  let cookies = {};

  // cookiesArray usually obtained via headers.getSetCookies() as an array
  this.set = function(cookiesArray) {
    cookiesArray.forEach(cookie => {
      const i = cookie.indexOf('=');
      if ( i < 1 ) return;

      const parts = [ cookie.slice(0, i), cookie.slice(i + 1) ].map(e => e.trim());
      if ( parts[ 1 ].length ) {
        cookies[ parts[ 0 ] ] = parts[ 1 ]; // update/set cookie
      }
      else {
        delete cookies[ parts[ 0 ] ];       // delete cookie
      }
    });
  };

  this.get = function(key) {
    if ( typeof cookies[ key ] === 'string' ) {
      return decodeURIComponent(cookies[ key ]);
    }
    else return null;
  };

  this.has = function() {
    return Object.keys(cookies).length > 0;
  };

  // (override) return all cookies for header Cookie / requests
  this.toString = function() {
    return Object
      .entries(cookies)
      .map(arr => `${ arr[ 0 ] }=${ arr[ 1 ] }`)
      .join(';');
  };

  this.serialize = function() {
    return JSON.stringify(cookies);
  };

  this.deserialize = function(obj) {
    cookies = JSON.parse(obj);
  };
}
