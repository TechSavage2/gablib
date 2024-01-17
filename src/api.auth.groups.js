/*******************************************************************************

 gablib
 api.auth.groups.js (2024-01-06)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

/**
 * @module Groups
 */

'use strict';

import { _fetch } from './_fetch.js';
import { extname } from 'node:path';
import { readFileSync } from 'node:fs';
import { getExtensionFromBuffer } from './utils.js';

/**
 * Get global group categories and their ids.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @returns {Promise<*>}
 */
export async function getGroupCategories(lo) {
  const url = lo.baseUrl + '/api/v1/group_categories';
  return await _fetch(lo, url, 'GET', 'json');
}

/**
 * List featured groups
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {boolean} [minimalList=false] reduce resulting list to id and title
 * @returns {Promise<*>}
 */
export async function getFeaturedGroups(lo, minimalList = false) {
  return _getGroupTypes(lo, 'featured', minimalList);
}

/**
 * List groups you are member of.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {boolean} [minimalList=false] reduce resulting list to id and title
 * @returns {Promise<*>}
 */
export async function getMyGroups(lo, minimalList = false) {
  return _getGroupTypes(lo, 'member', minimalList);
}

/**
 * List groups you are administrating.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {boolean} [minimalList=false] reduce resulting list to id and title
 * @returns {Promise<*>}
 */
export async function getMyAdminGroups(lo, minimalList = false) {
  return _getGroupTypes(lo, 'admin', minimalList);
}

/**
 *
 * @param lo
 * @param type
 * @param minimalList
 * @returns {Promise<*>}
 * @private
 */
async function _getGroupTypes(lo, type, minimalList) {
  const url = new URL('/api/v1/groups', lo.baseUrl);
  url.searchParams.append('tab', type);

  const result = await _fetch(lo, url);
  if ( minimalList ) {
    return {
      ok     : result.ok,
      content: result.content.map(e => {return { id: e.id, title: e.title };})
    };
  }
  else return result;
}

/**
 * Get list of suggested groups
 * @param {LoginObject} lo - Valid and active LoginObject
 * @returns {Promise<*>}
 */
export async function getSuggestedGroups(lo) {
  const url = new URL(`/api/v2/suggestions`, lo.baseUrl);
  url.searchParams.append('type', 'groups');
  return _fetch(lo, url);
}

/**
 * List groups by category name (see `getGroupCategories()`).
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} categoryName - name of a valid category
 * @param {number} [page=1] - page, for pagination
 * @returns {Promise<*>}
 */
export async function getGroupsByCategory(lo, categoryName, page = 1) {
  const url = new URL(`/api/v1/groups/_/category/${ categoryName }`, lo.baseUrl);
  url.searchParams.append('page', page.toString());
  return _fetch(lo, url);
}

/**
 * List groups by hashtag.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} tag - name of a hashtag without hash-symbol (for example 'linux')
 * @param {number} [page=1] - page, for pagination
 * @returns {Promise<*>}
 */
export async function getGroupsByTag(lo, tag, page = 1) {
  const url = new URL(`/api/v1/groups/_/tag/${ tag }`, lo.baseUrl);
  url.searchParams.append('page', page.toString());
  return _fetch(lo, url);
}

/**
 * List relationship (member or not etc.) for array with group Ids.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string[]} groupIds - list of group ids to check
 * @returns {Promise<*>}
 */
export async function getGroupRelationships(lo, groupIds) {
  const url = new URL('/api/v1/group_relationships', lo.baseUrl);
  return _fetch(lo, url, 'POST', 'json', { groupIds });
}

/**
 * Get information about a specific group.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} groupId - group id to get information about
 * @returns {Promise<*>}
 */
export async function getGroup(lo, groupId) {
  const url = `${ lo.baseUrl }/api/v1/groups/${ groupId }`;
  return await _fetch(lo, url, 'GET', 'json');
}

/**
 * Create a new group.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {Object} config - group configuration
 * @param {string} config.title - Name of group
 * @param {string} config.groupCategoryId - Group category (see `getGroupCategories()`).
 * @param {string} [config.description] - Group description
 * @param {string} [config.slug] - Group slug (short name)
 * @param {boolean} [config.isPrivate=true] - If group is private
 * @param {boolean} [config.isVisible=true] - If group shows up in search
 * @param {boolean} [config.isAdminsVisible=false] - If administrators and moderators are visible to group members
 * @param {boolean} [config.isMembersVisible=false] - If member list is visible to other members
 * @param {boolean} [config.isMediaVisible=true] - show media files (images, videos) in statuses
 * @param {boolean} [config.isLinksVisible=true] - show link cards in statuses
 * @param {boolean} [config.isModerated=true] - if group is moderated
 * @param {boolean} [config.allowQuotes=true] - if statuses can be quoted
 * @param {string} [config.password] - password if group requires a password to join * @returns {Promise<*>}
 */
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

/**
 * Edit an existing group you are owner/admin of.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {Object} group - a group object
 * @param {Object} [newConfig={}] new configuration for group
 * @param {string} [newConfig.title] - Name of group
 * @param {string} [newConfig.groupCategoryId] - Group category (see `getGroupCategories()`).
 * @param {string} [newConfig.description] - Group description
 * @param {string} [newConfig.slug] - Group slug (short name)
 * @param {boolean} [newConfig.isPrivate=true] - If group is private
 * @param {boolean} [newConfig.isVisible=true] - If group shows up in search
 * @param {boolean} [newConfig.isAdminsVisible=false] - If administrators and moderators are visible to group members
 * @param {boolean} [newConfig.isMembersVisible=false] - If member list is visible to other members
 * @param {boolean} [newConfig.isMediaVisible=true] - show media files (images, videos) in statuses
 * @param {boolean} [newConfig.isLinksVisible=true] - show link cards in statuses
 * @param {boolean} [newConfig.isModerated=true] - if group is moderated
 * @param {boolean} [newConfig.allowQuotes=true] - if statuses can be quoted
 * @param {string} [newConfig.password] - password if group requires a password to join
 * @returns {Promise<*>}
 */
export async function editGroup(lo, group, newConfig = {}) {
  const url = new URL(`/api/v1/groups/${ group.id }`, lo.baseUrl);
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

/**
 *
 * @param config
 * @param newConfig
 * @returns {{form: *, config}}
 * @private
 */
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
    if ( null !== value && key === 'title' ) {
      form.append('title', value);
    }
    else if ( null !== value && key === 'description' ) {
      form.append('description', value);
    }
    else if ( null !== value && key === 'isPrivate' ) {
      form.append('is_private', value);
    }
    else if ( null !== value && key === 'isVisible' ) {
      form.append('is_visible', value);
    }
    else if ( null !== value && key === 'isAdminsVisible' ) {
      form.append('is_admins_visible', value);
    }
    else if ( null !== value && key === 'isMembersVisible' ) {
      form.append('is_members_visible', value);
    }
    else if ( null !== value && key === 'isMediaVisible' ) {
      form.append('is_media_visible', value);
    }
    else if ( null !== value && key === 'isLinksVisible' ) {
      form.append('is_links_visible', value);
    }
    else if ( null !== value && key === 'isModerated' ) {
      form.append('is_moderated', value);
    }
    else if ( null !== value && key === 'password' ) {
      form.append('password', value);
    }
    else if ( null !== value && key === 'allowQuotes' ) {
      form.append('allow_quotes', value);
    }
    else if ( null !== value && key === 'groupCategoryId' ) {
      form.append('group_category_id', value);
    }
    else if ( null !== value && key === 'coverImage' ) {
      let buffer;
      let filename;
      let ext;

      if ( typeof value === 'string' ) {
        try {
          filename = value;
          buffer = readFileSync(filename);
          ext = extname(filename);
        }
        catch(err) {
          throw new Error('Could not read file.');
        }
      }
      else {
        buffer = value;
        ext = getExtensionFromBuffer(buffer);
        filename = `cover${ ext }`;
      }

      form.append('cover_image', new Blob([ buffer ]), filename);
    }
  });

  return { config, form };
}

/**
 * NOTE: Before joining a group request group information using `getGroup()`. If
 * the flag `hasPassword` is true you will instead first need to send a request
 * using `requestGroupJoin()` rather than using this function.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} groupId - Group ID to join
 * @returns {Promise<*>}
 */
export async function joinGroup(lo, groupId) {
  const url = new URL(`/api/v1/groups/${ groupId }/accounts`, lo.baseUrl);
  return _fetch(lo, url, 'POST');
}

/**
 * Leave a group you're already a member of.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} groupId - Group ID to join
 * @returns {Promise<*>}
 */
export async function leaveGroup(lo, groupId) {
  const url = new URL(`/api/v1/groups/${ groupId }/accounts`, lo.baseUrl);
  return _fetch(lo, url, 'DELETE');
}

/**
 * If a group require a password to join, use this function to request a join.
 * You need to supply the password for the group you want to join.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} groupId - Group ID to join
 * @param {string} password - password to join the group
 * @returns {Promise<*>}
 * @throws If password is missing it will throw an error
 */
export async function requestGroupJoin(lo, groupId, password) {
  const url = new URL(`/api/v1/groups/${ groupId }/password`, lo.baseUrl);
  if ( !password ) throw new Error('Group join requests require a password.');
  return _fetch(lo, url, 'POST', 'json', { password });
}

/**
 * Mute or unmute a group you are member of.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} groupId - group id to mute or unmute
 * @param {boolean} state - true to mute, false to unmute
 * @returns {Promise<*>}
 */
export async function muteGroup(lo, groupId) {
  const url = new URL(`/api/v1/groups/${ groupId }/block`, lo.baseUrl);
  return _fetch(lo, url, 'POST');
}

/**
 * Unmute a group you are member of.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} groupId - Group ID to join
 * @returns {Promise<*>}
 */
export async function unmuteGroup(lo, groupId) {
  const url = new URL(`/api/v1/groups/${ groupId }/unblock`, lo.baseUrl);
  return _fetch(lo, url, 'POST');
}

/*******************************************************************************

 Moderation functions

 ******************************************************************************/

/**
 * Get moderation stats, number of statuses that needs review (held back.)
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} groupId - Group ID to join
 * @returns {Promise<*>}
 */
export async function getGroupModerationStats(lo, groupId) {
  const url = new URL(`/api/v1/groups/${ groupId }/moderation/stats`, lo.baseUrl);
  return _fetch(lo, url);
}

/**
 * List join requests if your group require a password to join.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} groupId - Group ID to join
 * @returns {Promise<*>}
 */
export async function getGroupJoinRequests(lo, groupId) {
  const url = new URL(`/api/v1/groups/${ groupId }/join_requests`, lo.baseUrl);
  return _fetch(lo, url);
}

/**
 * Handle a join request. You can either 'accept' or 'reject' a request.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} groupId - Group ID to join
 * @param {string} accountId - ID of account that requested to join.
 * @param {string} type - need to be either 'accept' or 'reject' (see {@link enumGroupModerationJoin}).
 * @returns {Promise<*>}
 */
export async function handleGroupJoinRequest(lo, groupId, accountId, type) {
  const url = new URL(`/api/v1/groups/${ groupId }/join_requests/respond`, lo.baseUrl);
  return _fetch(lo, url, 'POST', 'json', { accountId, type });
}

/**
 * List group members
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} groupId - Group ID to join
 * @returns {Promise<*>} List of accounts
 */
export async function getGroupAccounts(lo, groupId) {
  const url = new URL(`/api/v1/groups/${ groupId }/accounts`, lo.baseUrl);
  return _fetch(lo, url);
}

/**
 * List administrators and moderators of this group.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} groupId - Group ID to join
 * @returns {Promise<*>}  lists for accounts and roles
 */
export async function getGroupAdminsAndMods(lo, groupId) {
  const url = new URL(`/api/v1/groups/${ groupId }/admins_and_mods`, lo.baseUrl);
  return _fetch(lo, url);
}

/**
 * List media attachments in this group (videos and images.)
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} groupId - Group ID to join
 * @returns {Promise<*>}
 */
export async function getGroupAttachments(lo, groupId) {
  const url = new URL(`/api/v1/groups/${ groupId }/media_attachments`, lo.baseUrl);
  return _fetch(lo, url);
}

/**
 * List links (cards) in this group (links, embeddings.)
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} groupId - Group ID to join
 * @returns {Promise<*>}
 */
export async function getGroupCards(lo, groupId) {
  const url = new URL(`/api/v1/groups/${ groupId }/preview_cards`, lo.baseUrl);
  return _fetch(lo, url);
}

/**
 * Search for a group member using a keyword query.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} groupId - Group ID to join
 * @param {string} query - keyword to search for in the member list
 * @returns {Promise<*>}
 */
export async function searchGroupMembers(lo, groupId, query) {
  const url = new URL(`/api/v1/groups/${ groupId }/member_search`, lo.baseUrl);
  if ( !query ) {
    throw new Error('Group member search requires a query.');
  }
  url.searchParams.append('q', query);
  return _fetch(lo, url);
}

/**
 * Get list of statuses that need review.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} groupId - Group ID to join
 * @returns {Promise<*>}
 */
export async function groupModeration(lo, groupId) {
  const url = new URL(`/api/v1/groups/${ groupId }/moderation/`, lo.baseUrl);
  return _fetch(lo, url);
}

/**
 *
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} groupId - Group ID to join
 * @returns {Promise<*>}
 */
export async function getGroupRemovedAccounts(lo, groupId) {
  const url = new URL(`/api/v1/groups/${ groupId }/removed_accounts`, lo.baseUrl);
  return _fetch(lo, url);
}

/**
 *
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} groupId - Group ID to join
 * @param {string} statusId - status id to approve
 * @returns {Promise<*>}
 */
export async function groupApproveStatus(lo, groupId, statusId) {
  const url = new URL(`/api/v1/groups/${ groupId }/moderation/approve_post`, lo.baseUrl);
  return _fetch(lo, url, 'POST', 'json', { statusId });
}

/**
 *
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} groupId - Group ID to join
 * @param {string} statusId - status id to reject
 * @returns {Promise<*>}
 */
export async function groupRejectStatus(lo, groupId, statusId) {
  const url = new URL(`/api/v1/groups/${ groupId }/moderation/remove_post`, lo.baseUrl);
  return _fetch(lo, url, 'POST', 'json', { statusId });
}

/**
 *
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} groupId - Group ID to join
 * @param {string} statusId - status id to use for whitelisting account
 * @returns {Promise<*>}
 */
export async function groupWhitelistFromStatus(lo, groupId, statusId) {
  const url = new URL(`/api/v1/groups/${ groupId }/moderation/approve_user`, lo.baseUrl);
  return _fetch(lo, url, 'POST', 'json', { statusId }, [ 204 ]);
}

/**
 *
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} groupId - Group ID to join
 * @param {string} accountId - account id to remove from group (permanently, i.e banned)
 * @returns {Promise<*>}
 */
export async function groupRemoveAccount(lo, groupId, accountId) {
  const url = new URL(`/api/v1/groups/${ groupId }/removed_accounts`, lo.baseUrl);
  url.searchParams.append('account_id', accountId);
  return _fetch(lo, url, 'POST');
}

/**
 *
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} groupId - Group ID to join
 * @param {string} accountId - account id to make non-permanently removed (i.e. unbanned)
 * @returns {Promise<*>}
 */
export async function groupRemoveRemovedAccount(lo, groupId, accountId) {
  const url = new URL(`/api/v1/groups/${ groupId }/removed_accounts`, lo.baseUrl);
  url.searchParams.append('account_id', accountId);
  return _fetch(lo, url, 'DELETE');
}

/**
 *
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} groupId - Group ID to join
 * @param {string} statusId - status id to remove from group
 * @returns {Promise<*>}
 */
export async function groupRemoveStatus(lo, groupId, statusId) {
  const url = new URL(`/api/v1/groups/${ groupId }/statuses/${ statusId }`, lo.baseUrl);
  return _fetch(lo, url, 'DELETE');
}

/**
 *
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} groupId - Group ID to join
 * @param {string} accountId - account id update role for
 * @param role
 * @returns {Promise<*>}
 */
export async function groupUpdateRole(lo, groupId, accountId, role) {
  const url = new URL(`/api/v1/groups/${ groupId }/accounts`, lo.baseUrl);
  url.searchParams.append('account_id', accountId);
  return _fetch(lo, url, 'PATCH', 'json', { role });
}
