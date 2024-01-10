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
 * @param {string} baseUrl - sites' base URL
 * @param {string} accountId
 * @returns {Promise<*>}
 */
export async function getAccountFromId(baseUrl, accountId) {
  const url = new URL(`/api/v1/accounts/${ accountId }`, baseUrl);
  return await _fetch(null, url);
}

/**
 * Get account JSON from a username.
 * @param {string} baseUrl - sites' base URL
 * @param {string} username - username for account
 * @returns {Promise<*>}
 */
export async function getAccountFromUsername(baseUrl, username) {
  const url = new URL(`/api/v1/account_by_username/${ username }`, baseUrl);
  return await _fetch(null, url);
}

/**
 * Get the trend feed.
 * @param {string} baseUrl - sites' base URL
 * @returns {Promise<*>}
 */
export async function getTrendsFeed(baseUrl) {
  const url = new URL('/api/v3/trends_feed', baseUrl);
  return await _fetch(null, url);
}

/**
 * Get the news feed.
 * @param {string} baseUrl - sites' base URL
 * @returns {Promise<*>}
 */
export async function getNewsFeed(baseUrl) {
  const url = new URL('/feed/?feed=json', baseUrl);
  return await _fetch(null, url);
}

/**
 * Get a list of popular statuses.
 * @param {string} baseUrl - sites' base URL
 * @param {string} [type='gab'] popular statuses type
 * @returns {Promise<*>}
 */
export async function getPopularStatuses(baseUrl, type = 'gab') {
  const url = new URL('/api/v1/popular_links', baseUrl);
  url.searchParams.append('type', type || 'gab');
  return await _fetch(null, url);
}

/**
 * Get list of suggested feeds
 * @param {string} baseUrl - sites' base URL
 * @param {string} [sort='rising'] - sort method
 * @returns {Promise<*>}
 */
export async function getExplore(baseUrl, sort = 'rising') {
  const url = new URL(`/api/v2/timelines/explore`, baseUrl);
  url.searchParams.append('sort_by', sort);
  return _fetch(null, url);
}

/**
 * Get list of suggested feeds (public version.)
 * @param {string} baseUrl - sites' base URL
 * @param {string} [sort='hot'] - sort method
 * @returns {Promise<*>}
 */
export async function getProFeed(baseUrl, sort = 'hot') {
  const url = new URL(`/timeline/pro`, baseUrl);
  url.searchParams.append('sort_by', sort);
  return _fetch(null, url);
}
