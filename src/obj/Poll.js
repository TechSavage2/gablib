/*******************************************************************************

 gablib
 Poll.js (2024-01-04)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

'use strict';

import { enumPollExpires } from '../enums.js';

const MAX_OPTIONS = 8;

/**
 * Poll helper object to create polls for postMessage statuses.
 * The poll options will appear in the order they are given/added.
 * @param {Array} [options=[]] optional array with string entries representing the options.
 * @constructor
 * @throws If provided options is not an Array.
 */
export function Poll(options = []) {
  if ( !Array.isArray(options) ) {
    throw new TypeError('Options object must be a type of Array.');
  }

  let expires = enumPollExpires.threeDays;

  /**
   * Add an option.
   * @param {string} text Option text
   * @returns {boolean} May fail if maximum number of options has been reached.
   */
  this.add = function(text) {
    if ( options.length >= MAX_OPTIONS || typeof text !== 'string' ) return false;
    options.push(text);
    return true;
  };

  /**
   * Set expire delta for the poll to expire. (See {@link enumPollExpires}).
   * @param {number|enumPollExpires} [seconds=enumPollExpires.threeDays] - delta in number of seconds.
   * @returns {boolean} false if out of range
   */
  this.setExpire = function(seconds = enumPollExpires.threeDays) {
    if ( seconds < enumPollExpires.oneHour || seconds > enumPollExpires.oneWeek ) return false;
    expires = seconds | 0;
    return true;
  };

  /**
   * Produce the poll JSON object that is sent to server. This is handled
   * automatically internally by the `createStatus()` call.
   * @returns {{}}
   */
  this.toJSON = function() {
    return { options, expires_in: expires };
  };

  // make sure we're not exceeding max options and that each entry is a string
  options = options.slice(0, MAX_OPTIONS).filter(e => typeof e === 'string');
}
