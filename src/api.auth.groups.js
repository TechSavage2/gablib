/*******************************************************************************

 gablib
 api.auth.groups.js (2024-01-06)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

'use strict';

import { _fetch } from './_fetch.js';

export async function getGroupCategories(lo) {
  const url = lo.baseUrl + '/api/v1/group_categories';
  const result = await _fetch(lo, url, 'GET', 'json', null, false);
  return { content: result.content, ok: result.status === 200 };
}

export async function getMyGroups(lo, minimalList = false) {
  const url = lo.baseUrl + '/api/v1/groups?tab=member';
  const result = await _fetch(lo, url, 'GET', 'json');

  const ok = result.status === 200;
  const content = minimalList && ok ? result.content.map(e => {return { id: e.id, title: e.title };}) : result.content;
  return { content, ok };
}
