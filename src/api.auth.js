/*******************************************************************************

 gablib
 api.auth.js (2024-01-04)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

'use strict';

import { _fetch } from './_fetch.js';

export async function getMyShortcuts(lo) {
  const url = lo.baseUrl + '/api/v1/shortcuts';
  const result = await _fetch(lo, url, 'GET', 'json');
  return { content: result.content, ok: result.status === 200 };
}

export async function getBookmarkCollection(lo) {
  const url = lo.baseUrl + `/api/v1/bookmark_collections`;
  const result = await _fetch(lo, url);
  return { content: result.content, ok: result.status === 200 };
}

export async function getConversationOwner(lo, convId) {
  const url = lo.baseUrl + `/api/v1/conversation_owner/${ convId }`;
  const result = await _fetch(lo, url);
  return { content: result.content, ok: result.status === 200 };
}
