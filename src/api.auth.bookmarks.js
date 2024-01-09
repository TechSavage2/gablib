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
