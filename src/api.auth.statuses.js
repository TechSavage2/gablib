/*******************************************************************************

 gablib
 api.auth.statuses.js (2024-01-04)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

import { _fetch } from './_fetch.js';
import { readFileSync } from 'node:fs';
import { extname } from 'node:path';
import { findObjectId, mapObject, stripMD } from './utils.js';
import { mapAccount, mapAttachmentMeta, mapAttachmentRoot, mapStatus } from './maps.js';

export async function postMessage(lo, markdown, options = {}, attachments = [], editId = null) {
  const status = stripMD(markdown);
  const sensitive = typeof options.sensitive === 'boolean' ? options.sensitive : lo.initJSON.compose.default_sensitive;
  const visibility = options.visibility ? options.visibility : lo.initJSON.compose.default_privacy;
  const expires = options.expires ? options.expires : lo.initJSON.compose.default_status_expiration;

  if ( markdown === status ) markdown = null;

  const body = {
    markdown, status, sensitive, visibility,
    'media_ids'     : attachments,
    'expires_at'    : expires,
    'isPrivateGroup': !!options.privateGroup,
    'in_reply_to_id': options.replyId ? options.replyId : null,
    'quote_of_id'   : options.quoteId ? options.quoteId : null,
    'spoiler_text'  : options.spoiler ? options.spoiler : '',
    'poll'          : options.poll ? options.poll.toJSON() : null, // use Poll object
    'group_id'      : options.groupId ? options.groupId : null
  };

  const url = lo.baseUrl + '/api/v1/statuses' + (editId ? `/${ editId }` : '');
  const result = await _fetch(lo, url, editId ? 'PUT' : 'POST', 'json', body);

  return { content: result.content, ok: result.status === 200 };
}

// filename is required if pathOrBuffer is buffer
// Record media ID - they need to be added to the postMessage media ids
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
    const result = await _fetch(lo, url, 'POST', 'binary', form);
    return { content: result.content, ok: result.status === 200 };
  }
  catch {
    return { content: null, ok: false };
  }
}

export async function getStatusesFromTag(lo, tagName) {
  const url = lo.baseUrl + `/api/v2/timelines/tag/${ tagName }`;
  return await _getStatuses(lo, url);
}

export async function getAccountStatuses(lo, account, page = 1, sort = 'newest') {
  const url = lo.baseUrl + `/api/v2/accounts/${ account }/statuses?page=${ page }&sort_by=${ sort }`;
  return await _getStatuses(lo, url);
}

export async function getTimelineStatuses(lo, timeline = 'home', pageOrMaxId = 0, sort = 'no-reposts') {
  //todo validate sort arguments
  //todo video timeline additions args: only_following=1, media_type=clips|<none> (sort clips: newest,top_today, video: top* all)

  if ( timeline === 'clips' ) {
    timeline = 'video';
    sort += '&media_type=clips';
  }

  let maxIdFormatted = '';  // assume maxId if > 100,000, otherwise page
  pageOrMaxId |= 0;
  if ( pageOrMaxId > 1 ) {
    maxIdFormatted = (pageOrMaxId > 1000000) ? `max_id=${ pageOrMaxId }&` : `page=${ pageOrMaxId }?`;
  }

  const url = lo.baseUrl + `/api/v2/timelines/${ timeline }?${ maxIdFormatted }sort_by=${ sort }`;
  return await _getStatuses(lo, url);
}

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

function _formatStatus(result, statusId, doRecursive = true) {
  let status = findObjectId(statusId, result.content.s, 'i');
  status = mapObject(status, mapStatus);

  // pin account info
  let account = findObjectId(status.account_id, result.content.a, 'i');
  if ( account ) status.account = mapObject(account, mapAccount);

  // pin any quotes
  if ( doRecursive && status.has_quote ) {
    let quote = findObjectId(status.quote_id, result.content.s, 'i');
    if ( quote ) {
      status.quote = _formatStatus(result, status.quote_id, false);
    }
    else {
      status.quote = null;
      status.quote_id = null;
    }
  }

  // status context?
  if ( status.status_context_id ) {
    status.status_context = findObjectId(status.status_context_id, result.content.s, 'i');
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
