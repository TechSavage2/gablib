/*******************************************************************************

 gablib
 api.public.js (2024-01-04)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

/**
 * @module Misc
 */

'use strict';

import { _fetch } from './_fetch.js';

/**
 * Get account JSON from an account id.
 * @param baseUrl
 * @param accountId
 * @returns {Promise<*>}
 */
export async function getAccountFromId(baseUrl, accountId) {
  const url = `${ baseUrl }/api/v1/accounts/${ accountId }`;
  return await _fetch(null, url);
}

/**
 * Get account JSON from a username.
 * @param baseUrl
 * @param username
 * @returns {Promise<*>}
 */
export async function getAccountFromUsername(baseUrl, username) {
  const url = `${ baseUrl }/api/v1/account_by_username/${ username }`;
  return await _fetch(null, url);
}

/**
 * Get the trend feed.
 * @param baseUrl
 * @returns {Promise<*>}
 */
export async function getTrendsFeed(baseUrl) {
  const url = baseUrl + '/api/v3/trends_feed';
  return await _fetch(null, url);
}

/**
 * Get the news feed.
 * @returns {Promise<*>}
 */
export async function getNewsFeed() {
  return await _fetch(null, 'https://news.gab.com/feed/?feed=json');
}

/**
 * Get a list of popular statuses.
 * @param baseUrl
 * @param type
 * @returns {Promise<*>}
 */
export async function getPopularStatuses(baseUrl, type = 'gab') {
  const url = `${ baseUrl }/api/v1/popular_links?type=${ type }`;
  return await _fetch(null, url);
}
