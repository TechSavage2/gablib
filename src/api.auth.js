/*******************************************************************************

 gablib
 api.auth.js (2024-01-04)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

/**
 * @module Misc
 */

'use strict';

import { _fetch } from './_fetch.js';

/**
 * Get conversation owner from a conversation ID.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param convId
 * @returns {Promise<*>}
 */
export async function getConversationOwner(lo, convId) {
  const url = new URL(`/api/v1/conversation_owner/${ convId }`, lo.baseUrl);
  return await _fetch(lo, url);
}

/**
 * Get list of suggested feeds
 * @param {LoginObject} lo - Valid and active LoginObject
 * @returns {Promise<*>}
 */
export async function getSuggestedFeeds(lo) {
  const url = new URL(`/api/v2/suggestions`, lo.baseUrl);
  url.searchParams.append('type', 'feeds');
  return _fetch(lo, url);
}
