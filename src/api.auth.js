/*******************************************************************************

 gablib
 api.auth.js (2024-01-04)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

'use strict';

import { _fetch } from './_fetch.js';

export async function getMyShortcuts(lo) {
  const url = lo.baseUrl + '/api/v1/shortcuts';
  return await _fetch(lo, url, 'GET', 'json');
}

export async function getConversationOwner(lo, convId) {
  const url = lo.baseUrl + `/api/v1/conversation_owner/${ convId }`;
  return await _fetch(lo, url);
}
