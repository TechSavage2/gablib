/*******************************************************************************

 gablib
 loginObject.js (2024-01-04)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

'use strict';

import { readFileSync, writeFileSync } from 'node:fs';
import { CookieJar } from './CookieJar.js';

const defEmailEnv = 'MASTODON_USEREMAIL';
const defaultPasswordEnv = 'MASTODON_PASSWORD';
const defaultBaseUrlEnv = 'MASTODON_BASEURL';

const commonUserAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.1; rv:109.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (X11; Linux i686; rv:109.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:109.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.1; rv:115.0) Gecko/20100101 Firefox/115.0',
  'Mozilla/5.0 (X11; Linux i686; rv:115.0) Gecko/20100101 Firefox/115.0',
  'Mozilla/5.0 (Linux x86_64; rv:115.0) Gecko/20100101 Firefox/115.0',
  'Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:115.0) Gecko/20100101 Firefox/115.0',
  'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:115.0) Gecko/20100101 Firefox/115.0',
  'Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:115.0) Gecko/20100101 Firefox/115.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (iPad; CPU OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.6099.119 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.2210.91',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.2210.91',
  'Mozilla/5.0 (Linux; Android 10; HD1913) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36 EdgA/120.0.2210.99',
  'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36 EdgA/120.0.2210.99',
  'Mozilla/5.0 (Linux; Android 10; Pixel 3 XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36 EdgA/120.0.2210.99',
  'Mozilla/5.0 (Linux; Android 10; ONEPLUS A6003) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36 EdgA/120.0.2210.99',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 EdgiOS/120.2210.116 Mobile/15E148 Safari/605.1.15',
  'Mozilla/5.0 (Windows Mobile 10; Android 10.0; Microsoft; Lumia 950XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 Edge/40.15254.603',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OPR/106.0.0.0',
  'Mozilla/5.0 (Windows NT 10.0; WOW64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OPR/106.0.0.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OPR/106.0.0.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OPR/106.0.0.0',
  'Mozilla/5.0 (Linux; Android 10; VOG-L29) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36 OPR/76.2.4027.73374',
  'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Vivaldi/6.5.3206.48',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Vivaldi/6.5.3206.48',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Vivaldi/6.5.3206.48',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Vivaldi/6.5.3206.48',
  'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Vivaldi/6.5.3206.48',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPad; CPU OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPod touch; CPU iPhone 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1'
];

/**
 * LoginObject is returned initialized by the login() function. See documentation
 * for login().
 * @param credentials
 * @param altPassword
 * @param altBaseUrl
 * @constructor
 */
export function LoginObject(credentials, altPassword = null, altBaseUrl = null) {
  let userEmail = defEmailEnv;
  let password = defaultPasswordEnv;
  let baseUrl = defaultBaseUrlEnv;

  // Use alternative env variables
  if ( typeof credentials === 'string' && typeof altPassword === 'string' && typeof altBaseUrl === 'string' ) {
    userEmail = credentials;
    password = altPassword;
    baseUrl = altBaseUrl;
    credentials = null;
  }

  // return actual credentials - we use functions for email/pwd to protect outputting them in debug
  this.email = () => credentials ? credentials.userEmail : process.env[ userEmail ];
  this.password = () => credentials ? credentials.password : process.env[ password ];
  this.baseUrl = credentials ? credentials.baseUrl : process.env[ baseUrl ];

  if ( !this.email().length || !this.password().length || !this.baseUrl.length ) {
    throw new Error(`Environmental values missing: MASTODON_USEREMAIL, MASTODON_PASSWORD, MASTODON_BASEURL.
Alternatively provide credentials manually to login().
You can also provide alternative names for env values as login('myemailenv', 'mypwdenv', 'myurlenv')`);
  }

  // remove ending slash
  if ( this.baseUrl.endsWith('/') ) {
    this.baseUrl = this.baseUrl.substring(0, this.baseUrl.length - 1);
  }

  this.lastUrl = this.baseUrl;
  this.cookies = new CookieJar();

  this.authToken = null;      // for login
  this.accessToken = null;    // for bearer authorization
  this.csrfToken = null;      // improved xss protection (not too useful here, but we'll include it)
  this.initJSON = {};         // meta, settings, your userid, name etc.

  this.userAgent = commonUserAgents[ (commonUserAgents.length * Math.random()) | 0 ];

  this.getMyAccountInfo = function() {
    const id = this.initJSON.meta.me;
    return this.initJSON.accounts[ id ];
  };

  this.getVersion = function() {
    return this.initJSON.meta.version;
  };

  // NOTE experimental area! (so far untested)
  this.serialize = function(filename) {
    const obj = {
      lo     : this,
      cookies: this.cookies.serialize()
    };
    const ser = JSON.stringify(obj);

    if ( filename ) {
      try {
        writeFileSync(filename, ser, 'utf8');
      }
      catch(err) {
        console.error(`Error - Could not write serialized object: ${ err }`);
      }
    }
    return ser;
  };

  this.deserialize = function(filename) {
    let obj;
    if ( !filename.startsWith('{"lo') ) {
      try {
        obj = readFileSync(filename, 'utf8');
      }
      catch(err) {
        console.error(`Error - Could not read serialized object: ${ err }`);
        return null;
      }
    }
    else obj = filename;

    const json = JSON.parse(obj);
    Object.assign(this, json.lo);
    this.cookies = new CookieJar();
    this.cookies.deserialize(json.cookies);
  };
}
