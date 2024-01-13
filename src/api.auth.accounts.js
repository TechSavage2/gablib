/*******************************************************************************

 gablib
 api.auth.accounts.js (2024-01-06)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

/**
 * @module Accounts
 */

'use strict';

import { _fetch } from './_fetch.js';
import { refreshSession } from './login.js';

/**
 * Get your own account details, including source (for updating.)
 * @param {LoginObject} lo - Valid and active LoginObject
 * @returns {Promise<*>}
 */
export async function getMyAccount(lo) {
  const url = new URL('/api/v1/accounts/verify_credentials', lo.baseUrl);
  return _fetch(lo, url);
}

/**
 * Update your own account information.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {Object} options - new settings
 * @param {string} [options.displayName] New display name if provided
 * @param {string} [options.note] New "bio" if provided
 * @param {boolean} [options.locked] If account is locked or not.
 * @param {string} [options.avatar] New avatar image provided as Buffer
 * @param {string} [options.header] New header image provided as Buffer
 * @returns {Promise<*>}
 */
export async function editMyAccount(lo, options) {
  if ( !Object.keys(options).length ) {
    return { content: null, ok: false };
  }

  const body = new FormData();
  if ( typeof options.displayName === 'string' ) {
    body.append('display_name', options.displayName);
  }

  if ( typeof options.note === 'string' ) {
    body.append('note', options.note);
  }

  if ( typeof options.avatar !== 'undefined' ) {
    body.append('avatar', options.avatar);
  }

  if ( typeof options.header !== 'undefined' ) {
    body.append('header', options.header);
  }

  if ( typeof options.locked === 'boolean' ) {
    body.append('header', options.locked.toString());
  }

  const url = new URL('/api/v1/accounts/update_credentials', lo.baseUrl);
  return _fetch(lo, url, 'PATCH', 'binary', body);
}

/**
 * Get list of suggested accounts
 * @param {LoginObject} lo - Valid and active LoginObject
 * @returns {Promise<*>}
 */
export async function getSuggestedAccounts(lo) {
  const url = new URL(`/api/v2/suggestions`, lo.baseUrl);
  url.searchParams.append('type', 'verified');
  return _fetch(lo, url);
}

/**
 * Get list of related accounts
 * @param {LoginObject} lo - Valid and active LoginObject
 * @returns {Promise<*>}
 */
export async function getRelatedAccounts(lo) {
  const url = new URL(`/api/v2/suggestions`, lo.baseUrl);
  url.searchParams.append('type', 'related');
  return _fetch(lo, url);
}

/**
 * List relationship (member or not etc.) for array with account Ids.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {Array} accountIds - list of account (ids as strings) to check
 * @returns {Promise<*>}
 */
export async function getAccountRelationships(lo, accountIds) {
  const url = new URL(`/api/v1/accounts/${ accountIds }/relationships`, lo.baseUrl);
  return _fetch(lo, url, 'POST', 'json', { accountIds });
}

/**
 * List follower accounts to given account. Note that if the account has blocked
 * public lists this function will fail.
 * @param {LoginObject} lo - Valid and active LoginObject.
 * @param {string} accountId - followers to account id
 * @returns {Promise<unknown>}
 */
export async function getAccountFollowers(lo, accountId) {
  const url = new URL(`/api/v1/accounts/${ accountId }/followers`, lo.baseUrl);
  return _fetch(lo, url);
}

/**
 * List following accounts to given account. Note that if the account has blocked
 * public lists this function will fail.
 * @param {LoginObject} lo - Valid and active LoginObject.
 * @param {string} accountId - followings to account id
 * @returns {Promise<unknown>}
 */
export async function getAccountFollowing(lo, accountId) {
  const url = new URL(`/api/v1/accounts/${ accountId }/following`, lo.baseUrl);
  return _fetch(lo, url);
}

/**
 * List accounts you have blocked.
 * @param {LoginObject} lo - Valid and active LoginObject.
 * @returns {Promise<unknown>}
 */
export async function getAccountBlocks(lo) {
  const url = new URL(`/api/v1/blocks`, lo.baseUrl);
  return _fetch(lo, url);
}

/**
 * List accounts you have muted.
 * @param {LoginObject} lo - Valid and active LoginObject.
 * @returns {Promise<unknown>}
 */
export async function getAccountMutes(lo) {
  const url = new URL(`/api/v1/mutes`, lo.baseUrl);
  return _fetch(lo, url);
}

/**
 * List accounts that have you blocked.
 * NOTE: there is normally an API call, but some instances have this blocked/disabled.
 * We instead refresh the authenticated home page and re-extract up-to-date from that.
 * @param {LoginObject} lo - Valid and active LoginObject.
 * @returns {Promise<*>}
 */
export async function getAccountBlockedBys(lo) {
  lo = await refreshSession(lo);  // todo can fail if session has become invalid
  return { content: { accounts: lo.initJSON.meta.blocked_by }, ok: true, status: 200 };
}

/**
 * Get list of follow requests if you use a locked account.
 * @param {LoginObject} lo - Valid and active LoginObject.
 * @param {string} [maxId] - max id for pagination
 * @param {string} [sinceId] - statuses posted since this status id
 * @param {string|number} [limit=40] max items, max can be 80
 * @returns {Promise<unknown>}
 */
export async function getFollowRequests(lo, maxId, sinceId, limit = 40) {
  const url = new URL(`/api/v1/follow_requests`, lo.baseUrl);
  if ( maxId ) url.searchParams.append('max_id', maxId);
  if ( sinceId ) url.searchParams.append('since_id', sinceId);
  if ( limit ) url.searchParams.append('limit', limit);
  return _fetch(lo, url);
}

/**
 * Accept or reject an account follow request.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} accountId - account to handle
 * @param {string} type - authorize or reject request. See {@link enumAccountFollowRequest}
 * @returns {Promise<unknown>}
 */
export async function handleAccountFollowRequests(lo, accountId, type) {
  const url = new URL(`/api/v1/follow_requests/${ accountId }/${ type }`, lo.baseUrl);
  return _fetch(lo, url, 'BODY');
}

/**
 * Get list of media attachments based on type (video, image)
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} accountId - account to list
 * @param {string} type - media type to list. See {@link enumAccountMediaType}
 * 'image', 'video'
 * @param {string|number} [maxId]
 * @returns {Promise<unknown>}
 */
export async function getAccountAttachments(lo, accountId, type, maxId) {
  const url = new URL(`/api/v1/accounts/${ accountId }/media_attachments`, lo.baseUrl);
  url.searchParams.append('type', type);
  if ( maxId ) url.searchParams.append('max_id', maxId);
  return _fetch(lo, url);
}

/**
 * Search for an account name.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} keyword - starting part of an account or username
 * @param {number} [limit=4] - max result in a single query (absolute mastodon max is 80, default 40, some uses 4.)
 * @returns {Promise<*>}
 */
export async function searchAccounts(lo, keyword, limit = 4) {
  const url = new URL('/api/v1/accounts/search', lo.baseUrl);
  url.searchParams.append('q', keyword);
  url.searchParams.append('limit', limit.toString());
  url.searchParams.append('resolve', 'false');
  return _fetch(lo, url);
}
