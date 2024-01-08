/*******************************************************************************

 gablib
 api.auth.groups.js (2024-01-06)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

'use strict';

import { _fetch } from './_fetch.js';

export async function getGroupCategories(lo) {
  const url = lo.baseUrl + '/api/v1/group_categories';
  return await _fetch(lo, url, 'GET', 'json', null, false);
}

export async function getMyGroups(lo, minimalList = false) {
  const url = lo.baseUrl + '/api/v1/groups?tab=member';
  const result = await _fetch(lo, url, 'GET', 'json');

  if ( minimalList ) {
    return {
      ok     : result.ok,
      content: result.content.map(e => {return { id: e.id, title: e.title };})
    };
  }
  else return result;
}
