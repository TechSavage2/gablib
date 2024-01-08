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
 * Get your shortcut list.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @returns {Promise<*>}
 */
export async function getMyShortcuts(lo) {
  const url = lo.baseUrl + '/api/v1/shortcuts';
  return await _fetch(lo, url, 'GET', 'json');
}

/**
 * Get conversation owner from a conversation Id.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param convId
 * @returns {Promise<*>}
 */
export async function getConversationOwner(lo, convId) {
  const url = lo.baseUrl + `/api/v1/conversation_owner/${ convId }`;
  return await _fetch(lo, url);
}
