/*******************************************************************************

 gablib
 api.public.js (2024-01-04)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

/**
 * @module Public
 */

'use strict';

import { _fetch } from './_fetch.js';

/**
 * Get account JSON from an account id.
 * @param {string} baseUrl
 * @param accountId
 * @returns {Promise<*>}
 */
export async function getAccountFromId(baseUrl, accountId) {
  const url = new URL(`/api/v1/accounts/${ accountId }`, baseUrl);
  return await _fetch(null, url);
}

/**
 * Get account JSON from a username.
 * @param {string} baseUrl
 * @param username
 * @returns {Promise<*>}
 */
export async function getAccountFromUsername(baseUrl, username) {
  const url = new URL(`/api/v1/account_by_username/${ username }`, baseUrl);
  return await _fetch(null, url);
}

/**
 * Get the trend feed.
 * @param {string} baseUrl
 * @returns {Promise<*>}
 */
export async function getTrendsFeed(baseUrl) {
  const url = new URL('/api/v3/trends_feed', baseUrl);
  return await _fetch(null, url);
}

/**
 * Get the news feed.
 * @param {string} baseUrl
 * @returns {Promise<*>}
 */
export async function getNewsFeed(baseUrl) {
  const url = new URL('/feed/?feed=json', baseUrl);
  return await _fetch(null, url);
}

/**
 * Get a list of popular statuses.
 * @param {string} baseUrl
 * @param {string} [type='gab]
 * @returns {Promise<*>}
 */
export async function getPopularStatuses(baseUrl, type = 'gab') {
  const url = new URL('/api/v1/popular_links', baseUrl);
  url.searchParams.append('type', type || 'gab');
  return await _fetch(null, url);
}
