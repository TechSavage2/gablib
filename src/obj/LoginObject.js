/*******************************************************************************

 gablib
 loginObject.js (2024-01-04)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

'use strict';

import { readFileSync, writeFileSync } from 'node:fs';
import { CookieJar } from './CookieJar.js';
import { createHash } from 'crypto';

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
 * for `login()`. Don't provide any arguments to use the default env names
 * ('MASTODON_USEREMAIL', 'MASTODON_PASSWORD', 'MASTODON_BASEURL').
 * @param {string|{}} [credentials] - credential object, or env name for alternative user email.
 * @param {string} [credentials.userEmail] - email for user
 * @param {string} [credentials.password] - password
 * @param {string} [credentials.baseUrl] - base URL of site
 * @param {string} [altPassword] - alternative env name for password
 * @param {string} [altBaseUrl] - alternative env name for base URL
 * @constructor
 */
export function LoginObject(credentials, altPassword, altBaseUrl) {
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

  this.serializePath = null;
  this.lastUrl = this.baseUrl;  // used for referer in header
  this.loginOk = false;
  this.cookies = new CookieJar();

  this.authToken = null;        // for login
  this.accessToken = null;      // for bearer authorization
  this.csrfToken = null;        // improved xss protection (not too useful here, but we'll include it)
  this.initJSON = {};           // meta, settings, your userid, name etc.

  this.userAgent = commonUserAgents[ (commonUserAgents.length * Math.random()) | 0 ];

  this.getMyAccountInfo = function() {
    const id = this.initJSON.meta.me;
    return this.initJSON.accounts[ id ];
  };

  this.getVersion = function() {
    return this.initJSON.meta.version;
  };

  /**
   * Get MD5 checksum from credentials. This is used internally only
   * @returns {string}
   * @private
   */
  this._getMD5 = function() {
    return createHash('md5')
      .update(`${ this.email() }${ this.password() }${ this.baseUrl }`)
      .digest('hex');
  };

  /**
   * Serialize current auth session to disk.
   * See `<LoginObject>.serializePath`
   * @param {string} [path] for manually serializing
   * @returns {string}
   */
  this.serialize = function(path) {
    const obj = {
      lo     : this,
      cookies: this.cookies.serialize(),
      hash   : this._getMD5()
    };
    const ser = JSON.stringify(obj);
    const filepath = path || this.serializePath;

    if ( filepath ) {
      try {
        writeFileSync(filepath, ser, 'utf8');
      }
      catch(err) {
        console.error(`Could not write serialized object: ${ err }`);
      }
    }
    return ser;
  };

  /**
   * Deserialize login session previously stored to disk.
   * See `<LoginObject>.serializePath`
   * @param {string} [path] for manually deserializing
   * @returns {LoginObject|null}
   */
  this.deserialize = function(path) {
    let obj;
    const filepath = path || this.serializePath;
    try {
      obj = readFileSync(filepath, 'utf8');
    }
    catch(err) {
      return null;
    }

    const json = JSON.parse(obj);

    if ( this._getMD5() === json.hash ) {
      Object.assign(this, json.lo);
      this.cookies = new CookieJar();
      this.cookies.deserialize(json.cookies);
      return this;
    }
    else return null;
  };
}
