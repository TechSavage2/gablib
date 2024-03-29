/*******************************************************************************

 gablib
 api.auth.shortcuts.js (2024-01-10)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

/**
 * @module Shortcuts
 */

'use strict';

import { _fetch } from './_fetch.js';

/**
 * Get your shortcut list.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @returns {Promise<*>}
 */
export async function getShortcuts(lo) {
  const url = new URL('/api/v1/shortcuts', lo.baseUrl);
  return _fetch(lo, url);
}

/**
 * Add a new shortcut providing type of shortcut and the id for that object.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} id - id of the object you want to create a shortcut for
 * @param {string|enumShortType} type type of shortcut, for example 'group', 'account', 'list'
 * (See {@link enumShortType}).
 * @returns {Promise<*>}
 */
export async function addShortcut(lo, id, type) {
  const url = new URL('/api/v1/shortcuts', lo.baseUrl);
  return _fetch(lo, url, 'POST', 'json', { shortcut_type: type, shortcut_id: id });
}

/**
 * Delete a shortcut
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} shortcutId - id of shortcut to delete
 * @returns {Promise<*>}
 */
export async function deleteShortcut(lo, shortcutId) {
  const url = new URL(`/api/v1/shortcuts/${ shortcutId }`, lo.baseUrl);
  return _fetch(lo, url, 'DELETE');
}

/**
 * Clear unread count for shortcut
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} shortcutId - shortcut id to clear unread count for
 * @returns {Promise<*>}
 */
export async function clearShortcutCount(lo, shortcutId) {
  const url = new URL(`/api/v1/shortcuts/${ shortcutId }/clear_count`, lo.baseUrl);
  return _fetch(lo, url, 'POST');
}

/**
 * Reorder your shortcuts.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string[]} idArray - array of shortcut ids in the order you want them to appear
 * (for example: `['3', '1', '2', ...]`).
 * @returns {Promise<*>}
 */
export async function reorderShortcut(lo, idArray) {
  const url = new URL('/api/v1/shortcuts/reorder', lo.baseUrl);
  const body = { shortcuts: idArray.map((e, i) => {return { id: e, order: i };}) };
  return _fetch(lo, url, 'POST', 'json', body);
}
