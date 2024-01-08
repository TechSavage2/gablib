/*******************************************************************************

 gablib
 api.public.js (2024-01-04)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

'use strict';

import { _fetch } from './_fetch.js';

export async function getAccountFromId(baseUrl, accountId) {
  const url = `${ baseUrl }/api/v1/accounts/${ accountId }`;
  return await _fetch(null, url);
}

export async function getAccountFromUsername(baseUrl, username) {
  const url = `${ baseUrl }/api/v1/account_by_username/${ username }`;
  return await _fetch(null, url);
}

export async function getTrendsFeed(baseUrl) {
  const url = baseUrl + '/api/v3/trends_feed';
  return await _fetch(null, url);
}

export async function getNewsFeed() {
  return await _fetch(null, 'https://news.gab.com/feed/?feed=json');
}

export async function getPopularStatuses(baseUrl, type = 'gab') {
  const url = `${ baseUrl }/api/v1/popular_links?type=${ type }`;
  return await _fetch(null, url);
}
