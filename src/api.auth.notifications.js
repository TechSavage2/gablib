/*******************************************************************************

 gablib
 api.auth.notifications.js (2024-01-08)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

'use strict';

import { _fetch } from './_fetch.js';

/**
 * Get notification list. Supports paginating and various filters.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {number|string|null} [maxId] - for paginating
 * @param {number|string|null} [sinceId] - to get new notifications
 * @param {*|null} [filters] - filter options
 * @returns {Promise<{ok: boolean, content: any}>}
 */
export async function getNotifications(lo, maxId = null, sinceId = null, filters = {}) {
  const filterTypes = [ 'follow', 'reblog', 'favourite', 'poll', 'mention', 'group_moderation_event' ];
  const url = new URL('/api/v1/notifications', lo.baseUrl);

  if ( maxId ) {
    url.searchParams.append('max_id', maxId);
  }

  if ( sinceId ) {
    url.searchParams.append('since_id', sinceId);
  }

  if ( filters.onlyFollowing ) {
    url.searchParams.append('only_following', 'true');
  }

  if ( filters.onlyVerified ) {
    url.searchParams.append('only_verified', 'true');
  }

  // mastodon uses exclude list for type filters:
  if ( Array.isArray(filters.types) && filters.types.length ) {
    const list = [];
    filterTypes.forEach(type => {
      if ( !filters.types.includes(type) ) list.push(type);
    });

    list.forEach(type => {
      url.searchParams.append('exclude_types[]', type);
    });
  }

  return await _fetch(lo, url);
}

/**
 * Mark all notifications read.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @returns {Promise<{ok: boolean, content: any}>}
 */
export async function markNotificationsRead(lo) {
  const url = new URL('/api/v1/notifications/mark_read', lo.baseUrl);
  return _fetch(lo, url, 'POST', 'json', '{}');
}
