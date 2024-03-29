/*******************************************************************************

 gablib
 api.auth.statuses.js (2024-01-04)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

/**
 * @module Statuses
 */

import { _fetch } from './_fetch.js';
import { readFileSync } from 'node:fs';
import { extname } from 'node:path';
import { findObjectId, mapObject, stripMD } from './utils.js';
import { mapAccount, mapAttachmentMeta, mapAttachmentRoot, mapStatus } from './maps.js';
import { Poll } from './obj/Poll.js';
import { enumStatusSort } from './enums.js';

let markdownStripper = stripMD;
let markdownStripperIsAsync = false;

// to extract min/max ids from favorites
const rxMin = /min_id=\d+/i;
const rxMax = /max_id=\d+/i;

/**
 * Set a custom Markdown function to strip markdown from Status texts.
 * @param {Function} fn - function that takes Markdown as input and returns cleaned text.
 * @param {Boolean} [isAsync=false] whether or not the call is asynchronous or not
 */
export function setMarkdownFunction(fn, isAsync = false) {
  if ( fn ) {
    markdownStripper = fn;
    markdownStripperIsAsync = isAsync;
  }
}

/**
 * Post or edit a new status to home timeline or a group.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string|null} markdown Text to post. Can be formatted as Markdown. May be omitted if there are attachments,
 * otherwise it is required.
 * @param {Object} [options]
 * @param {string} [options.groupId] GroupID to post to. You must be a member of the group.
 * @param {string[]} [options.attachmentIds] Array of attachment IDs from previous [`uploadMedia()`]{@link uploadMedia}.
 * @param {Object|Poll} [options.poll] Poll object, JSON or a stringified JSON string representing the poll options and expiration.
 * See {@link enumPollExpires} for options.
 * @param {string|enumVisibility} [options.visibility] Visibility of post see {@link enumVisibility}.
 * @param {Boolean} [options.sensitive] if the content should be hidden by default
 * @param {string|enumPostExpires} [options.expires] when the post should expire, see {@link enumPostExpires} for options.
 * @param {boolean} [options.privateGroup] if private to the group
 * @param {string} [options.replyId] Status or comment ID this is a reply to.
 * @param {string} [options.quoteId] Status ID this is a quote for.
 * @param {string} [options.spoiler] Spoiler text for sensitive statuses
 * @param {string} [options.language='en'] ISO 639 language code for the status
 * @param {string} [options.scheduledAt] ISO 8601 formatted date when this status should become posted.
 * @param {string} [options.editId] Can be set to edit a status, but you can instead use [`editStatus()`]{@link editStatus}
 * @returns {Promise<*>}
 */
export async function createStatus(lo, markdown, options = {}) {
  options = Object.assign({}, options);

  if ( arguments.length > 3 ) {
    throw new Error('attachmentIds and editId are now moved into the options object.');
  }

  const status = markdownStripperIsAsync ? await markdownStripper(markdown) : markdownStripper(markdown);
  const attachments = Array.isArray(options.attachmentIds) ? options.attachmentIds : [];

  if ( !options.attachmentIds?.length && !status.length ) {
    throw new Error('Status text is empty and no attachments. At least one must be present.');
  }

  if ( markdown === status ) {
    markdown = null;
  }

  // Use user account defaults if not specified
  const sensitive = typeof options.sensitive === 'boolean' ? options.sensitive : lo.initJSON.compose.default_sensitive;
  const visibility = options.visibility ? options.visibility : lo.initJSON.compose.default_privacy;
  const expires = options.expires ? options.expires : lo.initJSON.compose.default_status_expiration;

  let poll = null;
  if ( options.poll instanceof Poll ) {
    poll = options.poll.toJSON();
  }
  else if ( typeof options.poll === 'object' ) {
    poll = options.poll;
  }

  //  if (attachments.length && poll) { // Gab seem to allow this combo
  //    throw new Error('Cannot attach poll if there are media attachments.')
  //  }

  const body = {
    markdown, status, sensitive, visibility,
    'media_ids'     : attachments,
    'expires_at'    : expires,
    'isPrivateGroup': !!options.privateGroup,
    'in_reply_to_id': options.replyId ? options.replyId : null,
    'quote_of_id'   : options.quoteId ? options.quoteId : null,
    'spoiler_text'  : options.spoiler ? options.spoiler : '',
    'poll'          : poll,
    'group_id'      : options.groupId ? options.groupId : null,
    'language'      : options.language ? options.language : 'en',         // ISO 639
    'scheduled_at'  : options.scheduledAt ? options.scheduledAt : null    // ISO 8601
  };

  const url = new URL('/api/v1/statuses', lo.baseUrl);

  let method = 'POST';
  if ( options.editId ) {
    url.pathname += `/${ options.editId }`;
    method = 'PUT';
  }

  return await _fetch(lo, url, method, 'json', body);
}

/**
 * Edit an existing status. You need to be the owner of the status.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} statusId - Status ID of the status you want to edit.
 * @param {string|null} newMarkdown - New text for the status. May be omitted if there are attachments,
 * otherwise it is required.
 * @param {Object} [options]
 * @param {string} [options.groupId] GroupID to post to. You must be a member of the group.
 * @param {string[]} [options.attachmentIds] Array of attachment IDs from previous [`uploadMedia()`]{@link uploadMedia}.
 * @param {Object|Poll} [options.poll] Poll object, JSON or a stringified JSON string representing the poll options and expiration.
 * See {@link enumPollExpires} for options.
 * @param {string|enumVisibility} [options.visibility] Visibility of post see {@link enumVisibility}.
 * @param {Boolean} [options.sensitive] if the content should be hidden by default
 * @param {string|enumPostExpires} [options.expires] when the post should expire, see {@link enumPostExpires} for options.
 * @param {boolean} [options.privateGroup] if private to the group
 * @param {string} [options.replyId] Status or comment ID this is a reply to.
 * @param {string} [options.quoteId] Status ID this is a quote for.
 * @param {string} [options.spoiler] Spoiler text for sensitive statuses
 * @param {string} [options.language='en'] ISO 639 language code for the status
 * @param {string} [options.scheduledAt] ISO 8601 formatted date when this status should become posted.
 */
export async function editStatus(lo, statusId, newMarkdown, options) {
  options = Object.assign({}, options, { editId: statusId });
  return createStatus(lo, newMarkdown, options);
}

/**
 * Upload media files for attachments.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string|Buffer|ArrayBuffer|TypedArray|Uint8Array|Blob|File} pathOrBuffer - path to a media file to upload or
 * a pre-initialized Buffer object.
 * @param {string} [filename] - filename is recommended if pathOrBuffer is binary data. If none is given, the
 * function will try to guess the extension based on binary content and use a generic name.
 * @returns {Promise<*>}
 */
export async function uploadMedia(lo, pathOrBuffer, filename) {
  const form = new FormData();

  try {
    let file = undefined;
    let buffer;

    if ( typeof pathOrBuffer === 'string' ) {
      buffer = readFileSync(pathOrBuffer);
    }
    else {
      buffer = pathOrBuffer;
    }

    if ( typeof filename === 'string' ) {
      file = filename;
    }
    else {
      file = `file${ extname(pathOrBuffer) }`;
    }

    form.append('file', new Blob([ buffer ]), file);
  }
  catch(err) {
    throw new Error(`Could not use buffer or load file: ${ err.message }`);
  }

  try {
    const url = new URL('/api/v1/media', lo.baseUrl);
    return await _fetch(lo, url, 'POST', 'binary', form, [ 200, 202 ]);
  }
  catch {
    return { content: null, ok: false };
  }
}

/**
 * Get a single status post.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} statusId - ID of status to retrieve
 * @returns {Promise<*>}
 */
export async function getStatus(lo, statusId) {
  const url = new URL(`/api/v1/statuses/${ statusId }`, lo.baseUrl);
  return await _fetch(lo, url);
}

/**
 * Delete a single status post.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} statusId - ID of status to delete
 * @returns {Promise<*>}
 */
export async function deleteStatus(lo, statusId) {
  const url = new URL(`/api/v1/statuses/${ statusId }`, lo.baseUrl);
  return await _fetch(lo, url, 'DELETE', 'json', null, [ 204 ]);
}

/**
 * Get a list of statuses based on a tag.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} tagName - tag name without the hash symbol
 * @returns {Promise<*>}
 */
export async function getStatusesFromTag(lo, tagName) {
  const url = new URL(`/api/v2/timelines/tag/${ tagName }`, lo.baseUrl);
  return await _getStatuses(lo, url);
}

/**
 * Get a list of statuses based on an account.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} account - ID of account
 * @param {number|string} [pageOrMaxId] - page number, page as number, or maxId as string
 * @param {string} [sort] - sort method. Valid options: see {@param onlyComments @link enumStatusSort}.
 * @param {boolean} [onlyComments=false] only get comments from this account. Note: only works with max id.
 * @returns {Promise<*>}
 */
export async function getAccountStatuses(lo, account, pageOrMaxId = 0, sort = 'newest', onlyComments = false) {
  const url = new URL(`/api/v2/accounts/${ account }/statuses`, lo.baseUrl);

  if ( typeof pageOrMaxId === 'number' ) {
    url.searchParams.append('page', pageOrMaxId.toString());
  }
  else if ( typeof pageOrMaxId === 'string' ) {
    url.searchParams.append('max_id', pageOrMaxId.toString());
  }

  if ( typeof sort === 'string' ) {
    url.searchParams.append('sort_by', sort);
  }

  if ( onlyComments ) {
    url.searchParams.append('only_comments', 'true');
  }

  return await _getStatuses(lo, url);
}

/**
 * Get comments from a status or a comment branch.
 * If a user have you blocked the `content` property of the status will show
 * "[HIDDEN – USER BLOCKS YOU]". (Also see {@link getAccountBlockedBys}.)
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} statusId Status ID to get comments from
 * @param {string} [maxId] status ID for paging
 * @param {string} [sort="oldest"] Sort method
 * @returns {Promise<*>}
 */
export async function getComments(lo, statusId, maxId, sort = 'oldest') {
  const url = new URL(`/api/v1/status_comments/${ statusId }`, lo.baseUrl);
  if ( typeof maxId === 'string' ) {
    url.searchParams.append('max_id', maxId);
  }
  if ( typeof sort === 'string' ) {
    url.searchParams.append('sort_by', sort);
  }
  return await _fetch(lo, url);
}

/**
 * Get your own favorited statuses.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string|number|*} [maxId] next ID for paging. This id is retrieved from
 * the response header "link". This function extracts these for you and attaches them
 * onto the result object as `minId` and `maxId`. However, you can simply pass in the
 * current object instead to get the next page.
 * @returns {Promise<*>}
 */
export async function getFavorites(lo, maxId) {
  const url = new URL('/api/v1/favourites', lo.baseUrl);
  if ( maxId ) {
    if ( typeof maxId === 'object' && maxId.maxId ) {
      const nextId = maxId.maxId;
      url.searchParams.append('max_id', nextId);
    }
    else {
      url.searchParams.append('max_id', maxId);
    }
  }
  const result = await _fetch(lo, url);

  // extract prev/next (min/max) ids and add as meta
  if ( result.ok ) {
    const link = result.headers.get('link');
    const mMin = link?.match(rxMin);
    const mMax = link?.match(rxMax);

    const min = mMin ? mMin[ 0 ]?.split('=')[ 1 ] : null;
    const max = mMax ? mMax[ 0 ]?.split('=')[ 1 ] : null;

    result.minId = min;
    result.maxId = max;
  }

  return result;
}

/**
 * Get statuses from a timeline given a timeline type.
 *
 * Valid timeline names:
 *
 * home, explore, group_collection, group_pins, group/id (see groups), links,
 * list/id, pro, related/statusId, video, "clips"
 *
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string|enumTimelines} timeline - a valid timeline name (see {@link enumTimelines}).
 * @param {number|string|{}} [pageOrMaxId] either page (number), or max status ID (string),
 * or a previous result from this call, for pagination
 * @param {string|enumStatusSort} [sort=enumStatusSort.newestNoReposts] Sort method
 * @param {{}} [filters={}]
 * @param {boolean} [filters.pinned] Only show pinned statuses
 * @param {boolean} [filters.onlyFollowing] Only show statuses by accounts you follow
 * @param {boolean} [filters.groupId] If timeline type = group, set group id here as string
 * @returns {Promise<*>}
 */
export async function getTimelineStatuses(
  lo,
  timeline = 'home',
  pageOrMaxId,
  sort = enumStatusSort.newestNoReposts,
  filters = {}) {

  const url = new URL(`/api/v2/timelines/${ timeline === 'clips' ? 'video' : timeline }${ timeline === 'group' ? '/' + filters.groupId : '' }`, lo.baseUrl);

  if ( timeline === 'clips' ) {
    url.searchParams.append('media_type', 'clips');
  }

  if ( filters ) {
    if ( typeof filters.pinned === 'boolean' ) {
      url.searchParams.append('pinned', filters.pinned.toString());
    }

    if ( typeof filters.onlyFollowing === 'boolean' ) {
      url.searchParams.append('only_following', filters.pinned.toString());
    }
  }

  if ( pageOrMaxId ) {
    if ( typeof pageOrMaxId === 'string' ) {
      url.searchParams.append('max_id', pageOrMaxId);
    }
    else if ( typeof pageOrMaxId === 'number' ) {
      url.searchParams.append('page', pageOrMaxId.toString());
    }
    else {
      let list;
      if ( Array.isArray(pageOrMaxId) ) {
        list = pageOrMaxId;
      }
      else if ( Array.isArray(pageOrMaxId.content) ) {
        list = pageOrMaxId.content;
      }
      if ( list.length ) {
        const entry = list[ list.length - 1 ];
        url.searchParams.append('max_id', entry.id.toString());
      }
    }
  }

  return await _getStatuses(lo, url);
}

/**
 * Get a list of who reposted this status.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} statusId - Status ID
 * @param {string} [maxId] last Status ID for pagination
 * @returns {Promise<*>}
 */
export async function getStatusRepostedBy(lo, statusId, maxId) {
  const url = new URL(`/api/v1/statuses/${ statusId }/reblogged_by`, lo.baseUrl);
  if ( typeof maxId === 'string' ) {
    url.searchParams.append('max_id', maxId);
  }
  return await _fetch(lo, url);
}

/**
 * Get a status' revisions (edits)
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} statusId - Status ID
 * @returns {Promise<*>}
 */
export async function getStatusRevisions(lo, statusId) {
  const url = new URL(`/api/v1/statuses/${ statusId }/revisions`, lo.baseUrl);
  return await _fetch(lo, url);
}

/**
 * Like or unlike this status as favorite (like, optional reaction.)
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} statusId - Status ID
 * @param {boolean} state - true if like, false to unlike. Optional reaction id for like.
 * @param {string|enumReactions} [reactId="1"] React id (See {@link enumReactions}).
 * @returns {Promise<*>}
 */
export async function favoritePost(lo, statusId, state, reactId = '1') {
  const url = new URL(`/api/v1/statuses/${ statusId }/${ state ? '' : 'un' }favourite`, lo.baseUrl);
  const body = {};
  if ( state && reactId !== '1' ) {
    body.reaction_id = reactId;
  }
  return await _fetch(lo, url, 'POST', 'json', body);
}

/**
 * Get the pin status of this post.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} statusId - Status ID
 * @returns {Promise<*>}
 */
export async function pinStatusState(lo, statusId) {
  const url = new URL(`/api/v1/statuses/${ statusId }/pin`, lo.baseUrl);
  return await _fetch(lo, url);
}

/**
 * Pin or unpin this status.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} statusId - Status id
 * @param {boolean} state - True to pin, false to unpin
 * @returns {Promise<*>}
 */
export async function pinStatus(lo, statusId, state) {
  const url = new URL(`/api/v1/statuses/${ statusId }/${ state ? '' : 'un' }pin`, lo.baseUrl);
  return await _fetch(lo, url, 'POST');
}

/**
 * Get bookmark status of this post.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} statusId - Status ID
 * @returns {Promise<*>}
 */
export async function bookmarkStatusState(lo, statusId) {
  const url = new URL(`/api/v1/statuses/${ statusId }/bookmark`, lo.baseUrl);
  return await _fetch(lo, url);
}

/**
 * Bookmark or unbookmark this status.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} statusId - Status ID
 * @param {string} collectionId - id of collection to store or remove bookmark in/from.
 * @param {boolean} state - true to bookmark, false to unbookmark
 * @returns {Promise<*>}
 */
export async function bookmarkStatus(lo, statusId, collectionId, state) {
  const url = new URL(`/api/v1/statuses/${ statusId }/${ state ? '' : 'un' }bookmark`, lo.baseUrl);
  const body = state ? { bookmarkCollectionId: collectionId } : {};
  return await _fetch(lo, url, 'POST', 'json', body);
}

/**
 * Get quotes of this status.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} statusId - Status ID
 * @returns {Promise<*>}
 */
export async function getStatusQuotes(lo, statusId) {
  const url = new URL(`/api/v1/statuses/${ statusId }/quotes`, lo.baseUrl);
  return await _fetch(lo, url);
}

/**
 * Get context for this status.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} statusId - Status ID
 * @returns {Promise<*>}
 */
export async function getStatusContext(lo, statusId) {
  const url = new URL(`/api/v1/statuses/${ statusId }/context`, lo.baseUrl);
  return await _fetch(lo, url);
}

/**
 * Get status statistics like number of likes, reposts etc.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} statusId - Status ID
 * @returns {Promise<*>}
 */
export async function getStatusStats(lo, statusId) {
  const url = new URL(`/api/v1/status_stats/${ statusId }`, lo.baseUrl);
  return await _fetch(lo, url);
}

/**
 * List statuses with the same link card.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} cardId - ID of link card
 * @returns {Promise<*>}
 */
export async function getStatusesWithCard(lo, cardId) {
  const url = new URL(`/api/v1/links/${ cardId }`, lo.baseUrl);
  return _fetch(lo, url);
}

/**
 * Convenience function to emulate status moving between home timeline and a
 * group and vice verse, or from one group to another.
 *
 * NOTE: This does not perform a real move as mastodon doesn't support moving
 * statuses other than admins 'removing' statuses from groups.
 *
 * This function will create a new status based on the original, but with target
 * set to a group or null (if already in a group.)
 *
 * If that succeeds the original status is deleted and the new status is returned.
 *
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {*} status - status object to "move"
 * @param {string} groupId - groupId to "move" to, or null if to home timeline.
 * @returns {Promise<*>}
 */
export async function moveStatus(lo, status, groupId) {
  const result = await createStatus(lo, status.markdown || status.text, {
    visibility   : status.visibility,
    sensitive    : status.sensitive,
    language     : status.language,
    spoiler      : status.spoiler_text,
    attachmentIds: status.media_attachment_ids,
    groupId      : groupId ? groupId : null
  });

  if ( result.ok ) {
    const result2 = await deleteStatus(lo, status.id);
    if ( result2.ok ) {
      return result;
    }
  }

  return { content: null, ok: false };
}

/*******************************************************************************

 HELPER FUNCTIONS

 *******************************************************************************/

/**
 *
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param url
 * @returns {Promise}
 * @private
 */
export async function _getStatuses(lo, url) {
  const result = await _fetch(lo, url, 'GET', 'json');
  const statuses = [];

  if ( result.content ) {
    if ( result.content.t ) { // results from some sites need property remapping
      result.content.t.forEach(statusId => {
        statuses.push(_formatStatus(result, statusId, true));
      });
    }
    else {
      // normal mastodon results
      statuses.push(...result.content);
    }
  }
  return { content: statuses, ok: result.status === 200 };
}

/**
 *
 * @param result
 * @param statusId
 * @param doRecursive
 * @returns {*}
 * @private
 */
function _formatStatus(result, statusId, doRecursive = true) {
  let status = findObjectId(statusId, result.content.s, 'i');
  status = mapObject(status, mapStatus);

  // pin account info
  let account = findObjectId(status.account_id, result.content.a, 'i');
  if ( account ) {
    status.account = mapObject(account, mapAccount);
  }

  // pin any quotes
  if ( doRecursive && status.has_quote ) {
    let quote = findObjectId(status.quote_of_id, result.content.s, 'i');
    if ( quote ) {
      status.quote = _formatStatus(result, status.quote_of_id, false);
    }
    else {
      status.quote = null;
    }
  }

  // status context?
  if ( status.status_context_id ) {
    status.status_context = findObjectId(status.status_context_id, result.content.s, 'i');
  }

  // pin any card
  if ( status.preview_card_id ) {
    status.card = findObjectId(status.preview_card_id, result.content.pc);
  }

  // media attachments
  if ( status.media_attachment_ids.length ) {
    const media = [];
    status.media_attachment_ids.forEach(id => {
      let json = findObjectId(id, result.content.ma, 'i');
      if ( json ) {
        json = mapObject(json, mapAttachmentRoot);
        json.meta = mapObject(json.meta, mapAttachmentMeta);
        if ( json.meta.original ) json.meta.original = mapObject(json.meta.original, mapAttachmentMeta);
        if ( json.meta.small ) json.meta.small = mapObject(json.meta.small, mapAttachmentMeta);
        if ( json.meta.playable ) json.meta.playable = mapObject(json.meta.playable, mapAttachmentMeta);
        if ( json.meta.lowres ) json.meta.lowres = mapObject(json.meta.lowres, mapAttachmentMeta);
        media.push(json);
      }
    });
    status.attachments = media;
  }

  if ( status.poll_id ) {
    status.poll = findObjectId(status.poll_id, result.content.p);
  }

  return status;
}
