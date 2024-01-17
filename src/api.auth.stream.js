/*******************************************************************************

 gablib
 api.auth.stream.js (2024-01-11)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

/**
 * @module Streaming
 */

'use strict';

/**
 * stream-event event.
 * @event stream-event
 * @type {Object}
 * @property {{}} json - the event message as JSON
 */

/**
 * stream-ended event.
 * @event stream-ended
 */

/**
 * stream-error event.
 * @event stream-error
 * @type {Object}
 * @property {*} error object as argument
 */

import { gablibEvents } from './utils.js';

/**
 * Subscribe to the streaming API. It may emit three events:
 *
 * stream-event
 * stream-ended
 * stream-error
 *
 * You can obtain an event handler by importing `gablibEvents` from gablib.
 *
 * NOTE: This call doesn't return unless a stream-ended event occurred. Therefor
 * we don't recommend using await for this call, but instead the regular
 * Promise.then().catch() approach to allow successive code to execute unhindered.
 *
 * A stream-error is also transmitted on error with the error object passed in
 * as the second argument.
 *
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {boolean} [autoReconnect=true] - if socket closed error, attempt to reconnect.
 * @returns {Promise<*>}
 * @fires stream-event
 * @fires stream-ended
 * @fires stream-error
 * @example
 * gablibEvents.on('stream-message', json => {  });
 */
export async function getStream(lo, autoReconnect = true) {
  const url = new URL('/api/v4/streaming', lo.baseUrl);

  const options = {
    method : 'GET',
    headers: {
      'Accept'         : 'text/event-stream',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip,deflate,br',
      'Cache-Control'  : 'no-cache',
      'Pragma'         : 'no-cache',
      'Sec-Fetch-Dest' : 'empty',
      'Sec-Fetch-Mode' : 'cors',
      'Sec-Fetch-Site' : 'same-origin',
      'Sec-Gpc'        : '1',
      'Referer'        : lo.baseUrl,
      'User-Agent'     : lo.userAgent,
      'Cookie'         : lo.cookies.toString()
    }
  };

  const response = await fetch(url, options);
  const header = response.headers;
  try {
    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

    // serialize if active
    if ( lo.loginOk && typeof lo.serializePath === 'string' ) {
      lo.serialize();
    }

    let chunk = '';

    while( true ) {
      const { value, done } = await reader.read();
      if ( done ) break;
      chunk += value;
      // todo this is NOT super elegant.. :) works for now. We can get incomplete json strings, we need to merge chunks.
      chunk.split('data: ').forEach(part => {
        try {
          const msg = Object.assign({}, { event: 'ping' }, JSON.parse(part));
          gablibEvents.emit('stream-event', msg);
          chunk = '';
        }
        catch {}
      });
    }
  }
  catch(err) {
    gablibEvents.emit('stream-error', err);
    if ( autoReconnect ) {
      // WARN recursive
      await getStream(lo, true);
    }
  }

  gablibEvents.emit('stream-ended');
}
