/*******************************************************************************

 gablib
 api.auth.stream.js (2024-01-11)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

/**
 * @module Streaming
 */

'use strict';

import { streamEmitter } from './utils.js';

export async function getStream(lo) {
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
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

  let chunk = '';

  while( true ) {
    const { value, done } = await reader.read();
    if ( done ) break;
    chunk += value;
    // todo this is NOT super elegant.. :) works for now. We can get incomplete json strings, we need to merge chunks.
    chunk.split('data: ').forEach(part => {
      try {
        streamEmitter.emit('stream-event', JSON.parse(part));
        chunk = '';
      }
      catch {}
    });
  }

  streamEmitter.emit('stream-ended', { value: null });
}
