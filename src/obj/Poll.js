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
 * @param options
 * @constructor
 */
export function Poll(options = []) {
  let expires = enumPollExpires.threeDays;

  this.add = function(text) {
    if ( options.length >= MAX_OPTIONS || typeof text !== 'string' ) return false;
    options.push(text);
    return true;
  };

  this.setExpire = function(seconds) {
    if ( seconds < enumPollExpires.oneHour || seconds > enumPollExpires.oneWeek ) return false;
    expires = seconds | 0;
    return true;
  };

  this.toJSON = function() {
    return { options, expires_in: expires };
  };

  // make sure we're not exceeding max options and that each entry is a string
  options = options.slice(0, MAX_OPTIONS).filter(e => typeof e === 'string');
}
