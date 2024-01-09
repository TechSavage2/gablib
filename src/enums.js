/*******************************************************************************

 gablib
 enums.js (2024-01-04)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

'use strict';

/**
 * @global
 * @type {{rising: string, top: string, top_today: string, 'newest-with-groups': string, top_yearly: string, top_all_time: string, hot: string, newest: string, recent: string, top_weekly: string, top_monthly: string, 'newest-no-reposts': string}}
 */
export const enumStatusSort = {
  'newest'            : 'newest',
  'newest-with-groups': 'with-groups',
  'newest-no-reposts' : 'no-reposts',
  'hot'               : 'hot',
  'top'               : 'top',
  'recent'            : 'recent', // pro??
  'rising'            : 'rising', // does not work with pro, does with explore
  'top_today'         : 'top_today', // pro??
  'top_weekly'        : 'top_weekly', // pro??
  'top_monthly'       : 'top_monthly', // pro??
  'top_yearly'        : 'top_yearly', // pro??
  'top_all_time'      : 'top_all_time' // pro??
};

/**
 * @global
 * @type {{oneHour: string, oneDay: string, never: string, sixHours: string, threeDays: string, oneWeek: string, fiveMinutes: string}}
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
 * @global
 * @type {{oneHour: number, oneDay: number, sixHours: number, threeDays: number, oneWeek: number}}
 */
export const enumPollExpires = {
  oneHour  : 3600,
  sixHours : 21600,
  oneDay   : 86400,
  threeDays: 259200,
  oneWeek  : 604800
};

/**
 * @global
 * @type {{private: string, public: string, unlisted: string}}
 */
export const enumVisibility = {
  public  : 'public',
  private : 'private',
  unlisted: 'unlisted'
};

/**
 * @global
 * @type {{honked: string, laughedAt: string, thumbsDown: string, angry: string, thumbsUp: string, heart: string, salute: string}}
 */
export const enumReactions = {
  thumbsUp  : '1',
  thumbsDown: '2',
  laughedAt : '3',
  angry     : '4',
  honked    : '5',
  heart     : '6',
  salute    : '11'
};

/**
 * @global
 * @type {{explore: string, clips: string, links: string, video: string, list: string, home: string, group: string}}
 */
export const enumKnownTimelines = {
  'home'   : 'home',
  'group'  : 'group',
  'explore': 'explore',
  'video'  : 'video',
  'clips'  : 'clips', // NOTE this will be converted to 'video' and have an additional argument added to it (Gab thing.)
  'links'  : 'links',
  'list'   : 'list'
};

/**
 * @global
 * @type {{all: null, feed: string, top: string, link: string, account: string, status: string, group: string, hashtag: string}}
 */
export const enumSearchFilterTypes = {
  'all'    : null,
  'status' : 'status',
  'group'  : 'group',
  'top'    : 'top',
  'account': 'account',
  'link'   : 'link',
  'feed'   : 'feed',
  'hashtag': 'hashtag'
};
