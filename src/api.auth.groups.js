/*******************************************************************************

 gablib
 api.auth.groups.js (2024-01-06)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

'use strict';

import { _fetch } from './_fetch.js';
import { extname } from 'node:path';
import { readFileSync } from 'node:fs';

export async function getGroupCategories(lo) {
  const url = lo.baseUrl + '/api/v1/group_categories';
  return await _fetch(lo, url, 'GET', 'json');
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

export async function getGroup(lo, groupId) {
  const url = `${ lo.baseUrl }/api/v1/groups/${ groupId }`;
  return await _fetch(lo, url, 'GET', 'json');
}

export async function createGroup(lo, config) {
  const url = `${ lo.baseUrl }/api/v1/groups`;
  const result = _formatGroupConfig(config, {});

  if ( typeof result.config.title !== 'string' ||
    !result.config.title.length ||
    +result.config.groupCategoryId < 1 ) {
    throw new Error('Group need at least title and category.');
  }

  return await _fetch(lo, url, 'POST', 'binary', result.form);
}

export async function editGroup(lo, group, newConfig = {}) {
  const url = `${ lo.baseUrl }/api/v1/groups/${ group.id }`;
  const result = _formatGroupConfig({
    title           : group.title,
    description     : group.description,
    isPrivate       : group.is_private,
    isVisible       : group.is_visible,
    isAdminsVisible : group.is_admins_visible,
    isMembersVisible: group.is_members_visible,
    isMediaVisible  : group.is_media_visible,
    isLinksVisible  : group.is_links_visible,
    isModerated     : group.is_moderated,
    allowQuotes     : group.allow_quotes,
    password        : group.password,
    groupCategoryId : group.group_category.id
  }, newConfig);

  if ( typeof result.config.title !== 'string' ||
    !result.config.title.length ||
    +result.config.groupCategoryId < 1 ) {
    throw new Error('Group need at least title and category.');
  }

  return await _fetch(lo, url, 'PUT', 'binary', result.form);
}

function _formatGroupConfig(config, newConfig) {
  config = Object.assign({}, {
    title           : null,
    description     : null,
    isPrivate       : null,
    isVisible       : null,
    isAdminsVisible : null,
    isMembersVisible: null,
    isMediaVisible  : null,
    isLinksVisible  : null,
    isModerated     : null,
    password        : null,
    allowQuotes     : null,
    groupCategoryId : null,
    coverImage      : null,
    filename        : null
  }, config, newConfig);

  const form = new FormData();
  Object.keys(config).forEach(key => {
    const value = config[ key ];
    if ( null !== value && key === 'title' ) form.append('title', value);
    else if ( null !== value && key === 'description' ) form.append('description', value);
    else if ( null !== value && key === 'isPrivate' ) form.append('is_private', value);
    else if ( null !== value && key === 'isVisible' ) form.append('is_visible', value);
    else if ( null !== value && key === 'isAdminsVisible' ) form.append('is_admins_visible', value);
    else if ( null !== value && key === 'isMembersVisible' ) form.append('is_members_visible', value);
    else if ( null !== value && key === 'isMediaVisible' ) form.append('is_media_visible', value);
    else if ( null !== value && key === 'isLinksVisible' ) form.append('is_links_visible', value);
    else if ( null !== value && key === 'isModerated' ) form.append('is_moderated', value);
    else if ( null !== value && key === 'password' ) form.append('password', value);
    else if ( null !== value && key === 'allowQuotes' ) form.append('allow_quotes', value);
    else if ( null !== value && key === 'groupCategoryId' ) form.append('group_category_id', value);
    else if ( null !== value && key === 'coverImage' ) {
      const buffer = typeof value === 'string' ? readFileSync(value) : value;
      form.append('cover_image', new Blob([ buffer ]), typeof value === 'string' ? `cover${ extname(value) }` : 'cover.jpg'); // todo get extension right
    }
  });

  return { config, form };
}
