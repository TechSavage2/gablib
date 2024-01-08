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

let markdownStripper = stripMD;
let markdownStripperIsAsync = false;

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
 * @param {string|number} [options.groupId] GroupID to post to. You must be a member of the group.
 * @param {Array} [options.attachmentIds] Array of attachment IDs from previous [`uploadMedia()`]{@link Statuses:uploadMedia}.
 * @param {Object|Poll} [options.poll] Poll object, JSON or a stringified JSON string representing the poll options and expiration.
 * See {@link enumPollExpires} for options.
 * @param {string} [options.visibility] Visibility of post see {@link enumVisibility}.
 * @param {Boolean} [options.sensitive] if the content should be hidden by default
 * @param {string} [options.expires] when the post should expire, see {@link enumPostExpires} for options.
 * @param {} [options.privateGroup]
 * @param {string|number} [options.replyId] Status or comment ID this is a reply to.
 * @param {string|number} [options.quoteId] Status ID this is a quote for.
 * @param {string} [options.spoiler] Spoiler text for sensitive statuses
 * @param {string} [options.language='en] ISO 639 language code for the status
 * @param {string} [options.scheduledAt] ISO 8601 formatted date when this status should become posted.
 * @param {string|number} [options.editId] Can be set to edit a status, but you can instead use [`editStatus()`]{@link Statuses:editStatus}
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
 * @param {string|number} statusId - Status ID of the status you want to edit.
 * @param {string} newMarkdown - New text for the status
 * @param {Object} [options]
 * @param {string|number} [options.groupId] GroupID to post to. You must be a member of the group.
 * @param {Array} [options.attachmentIds] Array of attachment IDs from previous [`uploadMedia()`]{@link Statuses:uploadMedia}.
 * @param {Object|Poll} [options.poll] Poll object, JSON or a stringified JSON string representing the poll options and expiration.
 * See {@link enumPollExpires} for options.
 * @param {string} [options.visibility] Visibility of post see {@link enumVisibility}.
 * @param {Boolean} [options.sensitive] if the content should be hidden by default
 * @param {string} [options.expires] when the post should expire, see {@link enumPostExpires} for options.
 * @param {} [options.privateGroup]
 * @param {string|number} [options.replyId] Status or comment ID this is a reply to.
 * @param {string|number} [options.quoteId] Status ID this is a quote for.
 * @param {string} [options.spoiler] Spoiler text for sensitive statuses
 * @param {string} [options.language='en] ISO 639 language code for the status
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
 * @param {string} [filename] - filename is required if pathOrBuffer is buffer
 * @returns {Promise<*>}
 */
export async function uploadMedia(lo, pathOrBuffer, filename = null) {
  const form = new FormData();

  try {
    const buffer = typeof pathOrBuffer === 'string' ? readFileSync(pathOrBuffer) : pathOrBuffer;

    // todo this does not stream the file/buffer... large files should be buffered (loaded into memory for now)
    form.append('file', new Blob([ buffer ]), filename || `file${ extname(pathOrBuffer) }`);
  }
  catch(err) {
    throw new Error(`Could not use buffer or load file: ${ err.message }`);
  }

  try {
    const url = lo.baseUrl + '/api/v1/media';
    return await _fetch(lo, url, 'POST', 'binary', form, [ 200, 202 ]);
  }
  catch {
    return { content: null, ok: false };
  }
}

/**
 * Get a single status post.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string|number} statusId - ID of status to retrieve
 * @returns {Promise<*>}
 */
export async function getStatus(lo, statusId) {
  const url = lo.baseUrl + `/api/v1/statuses/${ statusId }`;
  return await _fetch(lo, url);
}

/**
 * Delete a single status post.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string|number} statusId - ID of status to delete
 * @returns {Promise<*>}
 */
export async function deleteStatus(lo, statusId) {
  const url = lo.baseUrl + `/api/v1/statuses/${ statusId }`;
  return await _fetch(lo, url, 'DELETE', 'json', null, [ 204 ]);
}

/**
 * Get a list of statuses based on a tag.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} tagName - tag name
 * @returns {Promise<*>}
 */
export async function getStatusesFromTag(lo, tagName) {
  const url = lo.baseUrl + `/api/v2/timelines/tag/${ tagName }`;
  return await _getStatuses(lo, url);
}

/**
 * Get a list of statuses based on an account.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string|number} account - ID of account
 * @param {number} [page=1] - page number
 * @param {string} [sort] - sort method. Valid options: see {@link enumStatusSort}.
 * @returns {Promise<*>}
 */
export async function getAccountStatuses(lo, account, page = 1, sort = 'newest') {
  const url = lo.baseUrl + `/api/v2/accounts/${ account }/statuses?page=${ page }&sort_by=${ sort }`;
  return await _getStatuses(lo, url);
}

/**
 * Get comments from a status or a comment branch.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param statusId
 * @param maxId
 * @param sort
 * @returns {Promise<*>}
 */
export async function getComments(lo, statusId, maxId = null, sort = 'oldest') {
  const maxIdFormatted = maxId ? `&max_id=${ maxId }` : '';
  const url = lo.baseUrl + `/api/v1/status_comments/${ statusId }?&sort_by=${ sort }${ maxIdFormatted }`;
  return await _fetch(lo, url);  // todo comments are not (yet?) modified by Gab
}

/**
 * Valid lists:
 *
 * home, explore, group_collection, group_pins, group/id (see groups), links,
 * list/id, pro, related/statusId, video, "clips"
 *
 * @param {LoginObject} lo
 * @param {string} timeline
 * @param {number} [pageOrMaxId]
 * @param {string} [sort="no-reposts"]
 * @param {boolean} [pinned=false] if true, request pinned posts
 * @returns {Promise}
 */
export async function getTimelineStatuses(lo, timeline = 'home', pageOrMaxId = 0, sort = 'no-reposts', pinned = false) {
  //todo validate sort arguments
  //todo video timeline additions args: only_following=1, media_type=clips|<none> (sort clips: newest,top_today, video: top* all)

  if ( timeline === 'clips' ) {
    timeline = 'video';
    sort += '&media_type=clips';
  }

  if ( pinned ) {
    sort += '&pinned=true';
  }

  let maxIdFormatted = '';  // assume maxId if > 500,000, otherwise page
  pageOrMaxId |= 0;
  if ( pageOrMaxId > 1 ) {
    maxIdFormatted = (pageOrMaxId > 5000000) ? `max_id=${ pageOrMaxId }&` : `page=${ pageOrMaxId }?`;
  }

  const url = lo.baseUrl + `/api/v2/timelines/${ timeline }?${ maxIdFormatted }sort_by=${ sort }`;
  return await _getStatuses(lo, url);
}

/**
 * Get a list of who reposted this status.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param statusId
 * @param maxId
 * @returns {Promise<*>}
 */
export async function getStatusRepostedBy(lo, statusId, maxId = 0) {
  const url = lo.baseUrl + `/api/v1/statuses/${ statusId }/reblogged_by${ maxId > 0 ? '&max_id=' + maxId : '' }`;
  return await _fetch(lo, url);
}

/**
 * Get a status' revisions (edits)
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param statusId
 * @returns {Promise<*>}
 */
export async function getStatusRevisions(lo, statusId) {
  const url = lo.baseUrl + `/api/v1/statuses/${ statusId }/revisions`;
  return await _fetch(lo, url);
}

/**
 * Mark this status as favorite (like, reaction.)
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param statusId
 * @param reactId
 * @returns {Promise<*>}
 */
export async function favoritePost(lo, statusId, reactId = '1') {
  const url = lo.baseUrl + `/api/v1/statuses/${ statusId }/favourite`;
  const body = {};
  if ( reactId !== '1' ) body.reaction_id = reactId;
  return await _fetch(lo, url, 'POST', 'json', body);
}

/**
 * Unmark this status as favorite (unlike.)
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param statusId
 * @param reactId
 * @returns {Promise<*>}
 */
export async function unfavoritePost(lo, statusId, reactId = '1') {
  const url = lo.baseUrl + `/api/v1/statuses/${ statusId }/unfavourite`;
  const body = {};
  return await _fetch(lo, url, 'POST', 'json', body);
}

/**
 * Get the pin status of this post.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param statusId
 * @returns {Promise<*>}
 */
export async function pinStatusState(lo, statusId) {
  const url = lo.baseUrl + `/api/v1/statuses/${ statusId }/pin`;
  return await _fetch(lo, url);
}

/**
 * Pin this status.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param statusId
 * @returns {Promise<*>}
 */
export async function pinStatus(lo, statusId) {
  const url = lo.baseUrl + `/api/v1/statuses/${ statusId }/pin`;
  return await _fetch(lo, url, 'POST', 'json', {});
}

/**
 * Unpin this status.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param statusId
 * @returns {Promise<*>}
 */
export async function unpinStatus(lo, statusId) {
  const url = lo.baseUrl + `/api/v1/statuses/${ statusId }/unpin`;
  return await _fetch(lo, url, 'POST', 'json', {});
}

/**
 * Get bookmark status of this post.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param statusId
 * @returns {Promise<*>}
 */
export async function bookmarkStatusState(lo, statusId) {
  const url = lo.baseUrl + `/api/v1/statuses/${ statusId }/bookmark`;
  return await _fetch(lo, url);
}

/**
 * Bookmark this status.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param statusId
 * @param collectionId
 * @returns {Promise<*>}
 */
export async function bookmarkStatus(lo, statusId, collectionId) {
  const url = lo.baseUrl + `/api/v1/statuses/${ statusId }/bookmark`;
  const body = { bookmarkCollectionId: collectionId };
  return await _fetch(lo, url, 'POST', 'json', body);
}

/**
 * Un-bookmark this status.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param statusId
 * @returns {Promise<*>}
 */
export async function unbookmarkStatus(lo, statusId) {
  const url = lo.baseUrl + `/api/v1/statuses/${ statusId }/unbookmark`;
  return await _fetch(lo, url, 'POST', 'json', {});
}

/**
 * Get quotes of this status.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param statusId
 * @returns {Promise<*>}
 */
export async function getStatusQuotes(lo, statusId) {
  const url = lo.baseUrl + `/api/v1/statuses/${ statusId }/quotes`;
  return await _fetch(lo, url);
}

/**
 * Get context for this status.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param statusId
 * @returns {Promise<*>}
 */
export async function getStatusContext(lo, statusId) {
  const url = lo.baseUrl + `/api/v1/statuses/${ statusId }/context`;
  return await _fetch(lo, url);
}

/**
 * Get status statistics like number of likes, reposts etc.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param statusId
 * @returns {Promise<*>}
 */
export async function getStatusStats(lo, statusId) {
  const url = lo.baseUrl + `/api/v1/status_stats/${ statusId }`;
  return await _fetch(lo, url);
}

/**
 * List statuses with the same link card.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string|number} cardId - ID of link card
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
 * @param {*} status - status to "move"
 * @param {string|number|null} groupId - groupId to "move" to, or null if to home timeline.
 * @returns {Promise<{ok: boolean, content: null}|{ok}|*>}
 */
export async function moveStatus(lo, status, groupId) {
  // todo more to move...
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

  if ( result.content.t ) { // results from some sites need property remapping
    result.content.t.forEach(statusId => {
      statuses.push(_formatStatus(result, statusId, true));
    });
  }
  else {
    // todo normal mastodon results
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

  //    if ( status.groupId ) {
  //      // todo remap Group object when Gab has finished it
  //    }

  if ( status.poll_id ) {
    status.poll = findObjectId(status.poll_id, result.content.p);
  }

  // todo cards, reposts, quote posts

  return status;
}
