/*******************************************************************************

 gablib
 api.auth.bookmarks.js (2024-01-07)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

/**
 * @module Bookmarks
 */

'use strict';

import { _fetch } from './_fetch.js';

/**
 * Get your bookmark collections.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @returns {Promise<*>}
 */
export async function getBookmarkCollection(lo) {
  const url = new URL(`/api/v1/bookmark_collections`, lo.baseUrl);
  return await _fetch(lo, url);
}

/**
 * Create a new bookmark collection.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} title Title of new bookmark collection
 * @returns {Promise<*>}
 */
export async function createBookmarkCollection(lo, title) {
  const url = new URL('/api/v1/bookmark_collections', lo.baseUrl);
  return await _fetch(lo, url, 'POST', 'json', { title });
}

/**
 * Edit an existing bookmark collection.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} bookmarkCollectionId id of bookmark collection
 * @param {string} title New title of bookmark collection
 * @returns {Promise<*>}
 */
export async function editBookmarkCollection(lo, bookmarkCollectionId, title) {
  const url = new URL(`/api/v1/bookmark_collections/${ bookmarkCollectionId }`, lo.baseUrl);
  return await _fetch(lo, url, 'PUT', 'json', { title });
}

/**
 * Delete an existing bookmark collection
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} bookmarkCollectionId id of bookmark collection
 * @returns {Promise<*>}
 */
export async function deleteBookmarkCollection(lo, bookmarkCollectionId) {
  const url = new URL(`/api/v1/bookmark_collections/${ bookmarkCollectionId }`, lo.baseUrl);
  return await _fetch(lo, url, 'DELETE');
}
