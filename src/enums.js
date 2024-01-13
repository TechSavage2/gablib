/*******************************************************************************

 gablib
 enums.js (2024-01-04)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

'use strict';

/**
 * Enum for handling account follow requests.
 * @global
 * @enum {string}
 * @readonly
 */
export const enumAccountFollowRequest = {
  approve: 'authorize',
  reject : 'reject'
};

/**
 * Valid media types when requesting media attachments from account timelines.
 * @global
 * @enum {string}
 * @readonly
 */
export const enumAccountMediaType = {
  image: 'image',
  video: 'video'
};

/**
 * Valid feed types.
 * @global
 * @enum {string}
 * @readonly
 */
export const enumFeedType = {
  own     : 'own',
  featured: 'featured',
  memberOf: 'member_of'
};

/**
 * Enum for handling group join requests.
 * @global
 * @enum {string}
 * @readonly
 */
export const enumGroupModerationJoin = {
  approve: 'approve',
  reject : 'reject'
};

/**
 * Expire times for new polls. You can use other values than these,
 * but these are the defaults some sites are using.
 * @global
 * @enum {number}
 * @readonly
 */
export const enumPollExpires = {
  oneHour  : 3600,
  sixHours : 21600,
  oneDay   : 86400,
  threeDays: 259200,
  oneWeek  : 604800
};

/**
 * Expire times for new statuses.
 * @global
 * @enum {string}
 * @readonly
 */
export const enumPostExpires = {
  never      : '',
  fiveMinutes: 'five_minutes',
  oneHour    : 'one_hour',
  sixHours   : 'six_hours',
  oneDay     : 'one_day',
  threeDays  : 'three_days',
  oneWeek    : 'one_week'
};

/**
 * Reaction IDs for when marking a status favorite.
 * @global
 * @enum {string}
 * @readonly
 */
export const enumReactions = {
  thumbsUp  : '1',
  thumbsDown: '2',
  laughedAt : '3',
  angry     : '4',
  honked    : '5',
  heart     : '6',
  salute    : '11',
  xmasTree  : '15'
};

/**
 * Valid filters for global `search()`
 * @global
 * @enum {string}
 * @readonly
 */
export const enumSearchFilterTypes = {
  all    : null,
  status : 'status',
  group  : 'group',
  top    : 'top',
  account: 'account',
  link   : 'link',
  feed   : 'feed',
  hashtag: 'hashtag'
};

/**
 * Valid shortcut types.
 * @global
 * @enum {string}
 * @readonly
 */
export const enumShortType = {
  account: 'account',
  group  : 'group',
  list   : 'list'
};

/**
 * Sorting methods for when requesting timelines.
 * @global
 * @enum {string}
 * @readonly
 */
export const enumStatusSort = {
  newest          : 'newest',
  newestWithGroups: 'with-groups',
  newestNoReposts : 'no-reposts',
  hot             : 'hot',
  top             : 'top',
  recent          : 'recent', // pro??
  rising          : 'rising', // does not work with pro, does with explore
  topToday        : 'top_today', // pro??
  topWeekly       : 'top_weekly', // pro??
  topMonthly      : 'top_monthly', // pro??
  topYearly       : 'top_yearly', // pro??
  topAllTime      : 'top_all_time' // pro??
};

/**
 * Valid timeline types for `getTimelineStatuses()`
 * @global
 * @enum {string}
 * @readonly
 */
export const enumTimelines = {
  home           : 'home',
  group          : 'group',
  explore        : 'explore',
  video          : 'video',
  clips          : 'clips',
  photos         : 'photos',
  polls          : 'polls',
  links          : 'links',
  list           : 'list',
  groupCollection: 'group_collection',
  groupPins      : 'group_pins'
};

/**
 * Visibility for new or edited statuses.
 * @global
 * @enum {string}
 * @readonly
 */
export const enumVisibility = {
  public  : 'public',
  private : 'private',
  unlisted: 'unlisted'
};
