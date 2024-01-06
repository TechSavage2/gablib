/*******************************************************************************

 gablib
 api.public.js (2024-01-04)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

'use strict';

import { _fetch } from './_fetch.js';

export async function getAccountFromId(baseUrl, accountId) {
  const url = baseUrl + `/api/v1/accounts/${ accountId }`;
  const result = await _fetch(null, url, 'GET', 'json', null, false);
  return { content: result.content, ok: result.status === 200 };
}

export async function getAccountFromUsername(baseUrl, username) {
  const url = baseUrl + `/api/v1/account_by_username/${ username }`;
  const result = await _fetch(null, url, 'GET', 'json', null, false);
  return { content: result.content, ok: result.status === 200 };
}
