/*******************************************************************************

 gablib
 api.auth.feeds.js (2024-01-12)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

/**
 * @module Feeds
 */

'use strict';

import { _fetch } from './_fetch.js';
import { getTimelineStatuses } from './api.auth.statuses.js';

/**
 * Get status list of feed based on type
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string|enumFeedType} type - type of feed (see {@link enumFeedType}).
 * Valid types: 'own', 'featured', 'member_of'
 * @returns {Promise<*>}
 */
export async function getFeed(lo, type) {
  const url = new URL('/api/v2/lists', lo.baseUrl);
  url.searchParams.append('type', type);
  return await _fetch(lo, url);
}

/**
 * List member accounts for a feed id.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} feedId - feed id
 * @returns {Promise<*>}
 */
export async function getFeedMembers(lo, feedId) {
  const url = new URL(`/api/v1/lists/${ feedId }/accounts`, lo.baseUrl);
  return await _fetch(lo, url);
}

/**
 * Create a new feed.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {{}} options Options for the new feed
 * @param {string} options.title - title of the new feed
 * @param {boolean} [options.visibility='private'] - visibility of feed.
 * Valid values: 'private', 'public'.
 * @param {string} [options.slug=null] - slug for the feed. Note that creating a
 * slug requires permission to do so.
 * @returns {Promise<*>}
 */
export async function createFeed(lo, options) {
  const url = new URL('/api/v1/lists', lo.baseUrl);
  const body = _myFeedOptions(options);
  return await _fetch(lo, url, 'POST', 'json', body);
}

/**
 * Edit an existing feed.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} feedId - id of your feed
 * @param {{}} options Options for the new feed
 * @param {string} options.title - title of the new feed
 * @param {boolean} [options.visibility='private'] - visibility of feed.
 * Valid values: 'private', 'public'
 * @param {string} [options.slug=null] - slug for the feed. Note that creating a
 * slug requires permission to do so.
 * @returns {Promise<*>}
 */
export async function editFeed(lo, feedId, options) {
  const url = new URL(`/api/v1/lists/${ feedId }`, lo.baseUrl);
  const body = _myFeedOptions(options);
  return await _fetch(lo, url, 'PUT', 'json', body);
}

/**
 *
 * @param options
 * @returns {{visibility: string, slug: null}}
 * @private
 */
function _myFeedOptions(options) {
  const body = {
    visibility: 'private',
    slug      : null
  };

  if ( !options || (typeof options.title !== 'string' && !options.title.trim().length) ) {
    throw new Error('Feed needs a title.');
  }

  body.title = options.title.trim();

  if ( typeof options.visibility === 'boolean' ) {
    body.visibility = options.visibility;
  }

  if ( typeof options.slug === 'string' ) {
    body.slug = options.slug;
  }

  return body;
}

/**
 * Delete a feed
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} feedId - id of your feed
 * @returns {Promise<*>}
 */
export async function deleteFeed(lo, feedId) {
  const url = new URL(`/api/v1/lists/${ feedId }`, lo.baseUrl);
  return await _fetch(lo, url, 'DELETE');
}

/**
 * Add an account as member to your feed.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} feedId - id of your feed
 * @param {string} accountId id of account you want to add as member
 * @returns {Promise<*>}
 */
export async function addFeedMember(lo, feedId, accountId) {
  const url = new URL(`/api/v1/lists/${ feedId }/accounts`, lo.baseUrl);
  return await _fetch(lo, url, 'POST', 'json', { account_id: accountId });
}

/**
 * Remove a member from your feed.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} feedId - id of your feed
 * @param {string} accountId - id of the account you want to remove
 * @returns {Promise<*>}
 */
export async function removeFeedMember(lo, feedId, accountId) {
  const url = new URL(`/api/v1/lists/${ feedId }/accounts`, lo.baseUrl);
  url.searchParams.append('account_id', accountId);
  return await _fetch(lo, url, 'DELETE');
}

/**
 * Subscribe to a feed
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} feedId - id of a feed
 * @returns {Promise<*>}
 */
export async function subscribeFeed(lo, feedId) {
  const url = new URL(`/api/v1/lists/${ feedId }/subscribers`, lo.baseUrl);
  return await _fetch(lo, url, 'POST');
}

/**
 * Unsubscribe from a feed
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} feedId - id of a feed
 * @returns {Promise<*>}
 */
export async function unsubscribeFeed(lo, feedId) {
  const url = new URL(`/api/v1/lists/${ feedId }/subscribers`, lo.baseUrl);
  return await _fetch(lo, url, 'DELETE');
}

/**
 * List subscribers of a feed
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} feedId - id of a feed
 * @returns {Promise<*>}
 */
export async function getFeedSubscribers(lo, feedId) {
  const url = new URL(`/api/v1/lists/${ feedId }/subscribers`, lo.baseUrl);
  return await _fetch(lo, url, 'GET');
}

/**
 * Get relationship between you and the feeds (membership, subscriber, admin status).
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string[]} feedIds - array with list of feed ids
 * @returns {Promise<*>}
 */
export async function getFeedRelationships(lo, feedIds) {
  const url = new URL('/api/v1/list_relationships', lo.baseUrl);
  if ( !Array.isArray(feedIds) ) {
    throw new TypeError('Need an array with feed ids.');
  }
  return await _fetch(lo, url, 'POST', 'json', { listIds: feedIds });
}

/**
 * Get feed suggestions
 * @param {LoginObject} lo - Valid and active LoginObject
 * @returns {Promise<*>}
 */
export async function getFeedSuggestions(lo) {
  const url = new URL('/api/v2/suggestions', lo.baseUrl);
  url.searchParams.append('type', 'feed');
  return await _fetch(lo, url, 'GET');
}

/**
 * Get feed timeline.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} feedId - id of a feed
 * @param {number|string} [pageOrMaxId] either page or max status ID for pagination
 * @param {string} [sort="no-reposts"] Sort method
 * @returns {Promise<*>}
 */
export async function getFeedTimeline(lo, feedId, pageOrMaxId, sort) {
  return getTimelineStatuses(lo, `list/${ feedId }`, pageOrMaxId, sort);
}
