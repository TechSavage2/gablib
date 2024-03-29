/*******************************************************************************

 gablib
 api.auth.notifications.js (2024-01-08)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

/**
 * @module Notifications
 */

'use strict';

import { _fetch } from './_fetch.js';

/**
 * Get notification list. Supports paginating and various filters.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string|null} [maxId] - for paginating
 * @param {string|null} [sinceId] - to get new notifications
 * @param {*} [filters] - filter options
 * @param {boolean} [filters.onlyFollowing=false] - only show notifications from accounts you follow
 * @param {boolean} [filters.onlyVerified=false] - only show notifications from verified accounts
 * @param {string[]|enumNotificationFilterType[]} [filters.types=[]] - filter by one or several types:
 * 'follow', 'reblog', 'favourite', 'poll', 'mention', 'group_moderation_event'
 * {See {@link enumNotificationFilterType}.}
 * @returns {Promise<*>}
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
 * @returns {Promise<*>}
 */
export async function clearUnreadNotifications(lo) {
  const url = new URL('/api/v1/notifications/mark_read', lo.baseUrl);
  return await _fetch(lo, url, 'POST', 'json', '{}');
}

// WARN deprecated.
export async function markNotificationsRead(lo) {
  console.warn('markNotificationsRead() has been deprecated. Please use clearUnreadNotifications() instead.');
  return await clearUnreadNotifications(lo);
}
