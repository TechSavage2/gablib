/*******************************************************************************

 gablib
 api.auth.directmessages.js (2024-01-15)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

/**
 * @module Dms
 */

'use strict';

import { readFileSync } from 'node:fs';
import { _fetch } from './_fetch.js';
import { extname } from 'node:path';

/**
 * Upload media intended for direct messages. The id is passed to `postDm()`
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string|Buffer|ArrayBuffer|TypedArray|Uint8Array|Blob|File} pathOrBuffer - path to a media file,
 * or a Buffer object with a preloaded media file.
 * @param {string} [filename] - filename if fileOrBuffer is a Buffer
 * @returns {Promise<*>}
 */
export async function uploadDmMedia(lo, pathOrBuffer, filename) {
  let buffer;
  if ( typeof pathOrBuffer === 'string' ) {
    try {
      buffer = readFileSync(pathOrBuffer);
    }
    catch(err) {
      throw new Error(`Could not read file "${ pathOrBuffer } Msg: ${ err.message }".`);
    }
  }
  else {
    buffer = pathOrBuffer;
  }

  const body = new FormData();
  body.append('file', new Blob([ buffer ]), filename || `file${ extname(pathOrBuffer) }`);

  const url = new URL('/api/v1/chat_media', lo.baseUrl);
  return await _fetch(lo, url, 'POST', 'binary', body);
}

/**
 * Post a direct message to conversation.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} convId - conversation id
 * @param {string} text - text to post
 * @param {Array} [mediaIds=string[]] optional array with media ids (as strings) from `uploadDmMedia()`.
 * Note: you cannot use ids from the `uploadMedia()` for statuses.
 * @returns {Promise<*>}
 */
export async function postDm(lo, convId, text, mediaIds = []) {
  const url = new URL('/api/v1/chat_messages', lo.baseUrl);
  const body = {
    text,
    media_ids           : mediaIds.map(e => typeof e === 'string' ? e : e.toString()),
    chat_conversation_id: convId
  };
  return await _fetch(lo, url, 'POST', 'json', body);
}

/**
 * Delete a direct message.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} msgId - id of message to delete
 * @returns {Promise<*>}
 */
export async function deleteDm(lo, msgId) {
  const url = new URL(`/api/v1/chat_messages/${ msgId }`, lo.baseUrl);
  return await _fetch(lo, url, 'DELETE');
}

/**
 * Delete entire conversation/thread.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} convId - conversation id
 * @returns {Promise<*>}
 */
export async function deleteDmConversation(lo, convId) {
  const url = new URL(`/api/v1/chat_conversations/messages/${ convId }/destroy_all`, lo.baseUrl);
  return await _fetch(lo, url, 'DELETE');
}

/**
 * Get list of direct message conversations/threads.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string|enumConversationListType} [type='all'] type of conversations, 'all', 'pinned', 'muted'.
 * (See {@link enumConversationListType}).
 * @returns {Promise<*>}
 */
export async function getDmConversations(lo, type = 'all') {
  let url;
  if ( type === 'all' || type === 'pinned' ) {
    url = new URL('/api/v1/chat_conversations/approved_conversations', lo.baseUrl);
    if ( type === 'pinned' ) {
      url.searchParams.append('pinned', 'true');
    }
  }
  else if ( type === 'muted' ) {
    url = new URL('/api/v1/chat_conversations/muted_conversations', lo.baseUrl);
  }

  return await _fetch(lo, url);
}

/**
 * Get count for unread direct message conversations.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @returns {Promise<*>}
 */
export async function getDmConversationUnreadCount(lo) {
  const url = new URL('/api/v1/chat_conversations/approved_conversations/unread_count', lo.baseUrl);
  return await _fetch(lo, url);
}

/**
 * List blocked direct message accounts.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @returns {Promise<*>}
 */
export async function getBlockedDmAccounts(lo) {
  const url = new URL('/api/v1/chat_conversations/blocked_chat_accounts', lo.baseUrl);
  return await _fetch(lo, url);
}

/**
 * Get direct message unread count
 * @param {LoginObject} lo - Valid and active LoginObject
 * @returns {Promise<*>}
 */
export async function getDmUnreadCount(lo) {
  const url = new URL('/api/v1/chat_conversations/approved_conversations/unread_count', lo.baseUrl);
  return await _fetch(lo, url);
}

/**
 * List requested conversations
 * @param {LoginObject} lo - Valid and active LoginObject
 * @returns {Promise<*>}
 */
export async function getRequestedDmConversations(lo) {
  const url = new URL('/api/v1/chat_conversations/requested_conversations', lo.baseUrl);
  return await _fetch(lo, url);
}

/**
 * List requested conversation count
 * @param {LoginObject} lo - Valid and active LoginObject
 * @returns {Promise<*>}
 */
export async function getRequestedDmConversationsCount(lo) {
  const url = new URL('/api/v1/chat_conversations/requested_conversations/count', lo.baseUrl);
  return await _fetch(lo, url);
}

/**
 * Reset unread direct messages count.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @returns {Promise<*>}
 */
export async function resetDmUnreadCount(lo) {
  const url = new URL('/api/v1/chat_conversations/approved_conversations/reset_all_unread_count', lo.baseUrl);
  return await _fetch(lo, url, 'POST', 'json', null, [ 204 ]);
}

/**
 * List messages of a conversation
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} convId - conversation id to list
 * @param {string} [maxId] - for pagination
 * @returns {Promise<*>}
 */
export async function getDmMessages(lo, convId, maxId) {
  const url = new URL(`/api/v1/chat_conversations/messages/${ convId }`, lo.baseUrl);
  if ( typeof maxId === 'string' ) {
    url.searchParams.append('max_id', maxId);
  }
  return await _fetch(lo, url);
}

/**
 * Get overall information about the direct message conversation.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} convId - conversation id
 * @returns {Promise<*>}
 */
export async function getDmConversationHeader(lo, convId) {
  const url = new URL(`/api/v1/chat_conversation/${ convId }`, lo.baseUrl);
  return await _fetch(lo, url);
}

/**
 * List all media attachments for this direct message conversation.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} convId - conversation id
 * @returns {Promise<*>}
 */
export async function getDmConversationMedia(lo, convId) {
  const url = new URL(`/api/v1/chat_conversation/${ convId }/media_attachments`, lo.baseUrl);
  return await _fetch(lo, url);
}

/**
 * List all cards (links) for this direct message conversation.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} convId - conversation id
 * @returns {Promise<*>}
 */
export async function getDmConversationCards(lo, convId) {
  const url = new URL(`/api/v1/chat_conversation/${ convId }/preview_cards`, lo.baseUrl);
  return await _fetch(lo, url);
}

/**
 * Request conversation with given account.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} accountId - account to add. The request needs to be approved,
 * or may be rejected by the receiver. The resulting object contains the new
 * conversation id.
 * @returns {Promise<*>}
 */
export async function addDmAccount(lo, accountId) {
  const url = new URL('/api/v1/chat_conversation/', lo.baseUrl);
  return await _fetch(lo, url, 'POST', 'json', { account_id: accountId });
}

/**
 * Approve or reject a direct message conversation request.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} convId - conversation id
 * @param {string|enumHandleDirectMessageRequest} type - either 'approve' or 'reject'. Reject in this API means
 * hidden and is not actually rejecting the conversation.
 * (See {@link enumHandleDirectMessageRequest}).
 * @returns {Promise<*>}
 */
export async function handleDmConversation(lo, convId, type) {
  if ( type === 'approve' ) {
    type = 'approved';
  }
  else if ( type === 'reject' ) {
    type = 'hidden';
  }
  else {
    throw Error('Type of handling required.');
  }

  const url = new URL(`/api/v1/chat_conversation/${ convId }/mark_chat_conversation_${ type }`, lo.baseUrl);
  return await _fetch(lo, url, 'POST');
}

/**
 * Pin or unpin a conversation in direct messages.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} convId - conversation id to pin or unpin
 * @param {boolean} state - true to pin, false to unpin
 * @returns {Promise<*>}
 */
export async function pinDmConversation(lo, convId, state) {
  const url = new URL(`/api/v1/chat_conversation_accounts/${ convId }/${ state ? '' : 'un' }pin_chat_conversation`, lo.baseUrl);
  return await _fetch(lo, url, 'POST');
}

/**
 * Mute or unmute a conversation in direct messages.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} convId - conversation id to mute or unmute
 * @param {boolean} state - true to mute, false to unmute
 * @returns {Promise<*>}
 */
export async function muteDmConversation(lo, convId, state) {
  const url = new URL(`/api/v1/chat_conversation_accounts/${ convId }/${ state ? '' : 'un' }mute_chat_conversation`, lo.baseUrl);
  return await _fetch(lo, url, 'POST');
}

/**
 * Mark a conversation as read.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} convId - conversation id to mark as read
 * @returns {Promise<*>}
 */
export async function markDmConversationRead(lo, convId) {
  const url = new URL(`/api/v1/chat_conversation/${ convId }/mark_chat_conversation_read`, lo.baseUrl);
  return await _fetch(lo, url, 'POST');
}

/**
 * Get block relationship with given account for direct messages.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} accountId - account id to get information about
 * @returns {Promise<*>}
 */
export async function dmAccountBlockRelationship(lo, accountId) {
  const url = new URL(`/api/v1/chat_conversation_accounts/${ accountId }/messenger_block_relationships`, lo.baseUrl);
  return await _fetch(lo, url, 'POST');
}

/**
 * Block or unblock an account in direct messages
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string}accountId - account id to block or unblock
 * @param {boolean} state - true to block, false to unblock
 * @returns {Promise<*>}
 */
export async function blockDmAccount(lo, accountId, state) {
  const url = new URL(`/api/v1/chat_conversation_accounts/${ accountId }/${ state ? '' : 'un' }block_messenger`, lo.baseUrl);
  return await _fetch(lo, url, 'POST');
}
