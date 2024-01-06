/*******************************************************************************

 gablib
 enums.js (2024-01-04)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

'use strict';

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

export const enumPostExpires = {
  never      : '',
  fiveMinutes: 'five_minutes',
  oneHour    : 'one_hour',
  sixHours   : 'six_hours',
  oneDay     : 'one_day',
  threeDays  : 'three_days',
  oneWeek    : 'one_week'
};

export const enumPollExpires = {
  oneHour  : 3600,
  sixHours : 21600,
  oneDay   : 86400,
  threeDays: 259200,
  oneWeek  : 604800
};

export const enumVisibility = {
  public  : 'public',
  private : 'private',
  unlisted: 'unlisted'
};

export const enumReactions = {
  thumbsUp  : '1',
  thumbsDown: '2',
  laughedAt : '3',
  angry     : '4',
  honked    : '5',
  heart     : '6',
  salute    : '11'
};

export const enumKnownTimelines = {
  'home'   : 'home',
  'group'  : 'group',
  'explore': 'explore',
  'video'  : 'video',
  'clips'  : 'clips', // NOTE this will be converted to 'video' and have an additional argument added to it (Gab thing.)
  'links'  : 'links',
  'list'   : 'list'
};
