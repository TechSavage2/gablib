/*******************************************************************************

 gablib
 maps.js (2024-01-05)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

'use strict';

export const mapAccount = {
  'ac'    : 'acct',
  'av'    : 'avatar',
  'avs'   : 'avatar_static',
  'avsml' : 'avatar_small',
  'avss'  : 'avatar_small_static',
  'ca'    : 'created_at',
  'dn'    : 'display_name',
  'emojis': 'emojis',
  'fic'   : 'following_count',
  'fields': 'fields',
  'foc'   : 'followers_count',
  'h'     : 'header',
  'hs'    : 'header_static',
  'i'     : 'id',
  'idn'   : 'is_donor',
  'ii'    : 'is_investor',
  'ip'    : 'is_pro',
  'ipd'   : 'is_parody',
  'is'    : 'is_spam',
  'iv'    : 'is_verified',
  'l'     : 'locked',
  'nt'    : 'note',
  'sc'    : 'statuses_count',
  'spl'   : 'show_pro_life',
  'u'     : 'url',
  'un'    : 'username'
};

// ?? are guesses for now until we encounter an actual gab-mapped post
export const mapStatus = {
  'ai'       : 'account_id',
  'analytics': 'analytics',
  'c'        : 'content',
  'ca'       : 'created_at',
  'ci'       : 'conversation_id',
  'drc'      : 'direct_replies_count',
  'e'        : 'emojis',
  'fvd'      : 'favourited',
  'g'        : 'group',
  'gi'       : 'group_id',
  'hq'       : 'has_quote',
  'i'        : 'id',
  'ir'       : 'is_reply',
  'l'        : 'language',
  'm'        : 'mentions',
  'mai'      : 'media_attachment_ids',
  'md'       : 'markdown',
  'p'        : 'pinnable',
  'pbg'      : 'pinnable_by_group',
  'pci'      : 'preview_card_id',
  'pi'       : 'poll_id',
  'qc'       : 'quotes_count',
  'qoi'      : 'quote_of_id',
  'rbc'      : 'reblogs_count',
  'rbgd'     : 'reblogged',
  'rc'       : 'replies_count',
  'rcs'      : 'reaction_counts',
  'rid'      : 'reaction_id',
  'robi'     : 'reblog_of_id',
  's'        : 'sensitive',
  'sci'      : 'status_context_id',
  'st'       : 'spoiler_text',
  't'        : 'text',
  'tg'       : 'tags',
  'u'        : 'uri',
  'ul'       : 'url',
  'v'        : 'visibility'
};

export const mapAttachmentRoot = {
  'i'   : 'id',
  't'   : 'type',
  'u'   : 'url',
  'pu'  : 'preview_url',
  'smp4': 'source_mp4',
  'ru'  : 'remote_url',
  'm'   : 'meta',
  'ai'  : 'account_id',
  'su'  : 'status_url',
  'si'  : 'status_id',
  'mli' : 'marketplace_listing_id',
  'fn'  : 'file_name',
  'd'   : 'description',
  'b'   : 'blurhash',
  'fct' : 'file_content_type',
  'lmp4': 'lowres_mp4',
  'ff'  : 'file_fingerprint'
};

// iterate over meta:, meta.?original, meta.?small, meta.?playable, meta.?lowres
export const mapAttachmentMeta = {
  'l' : 'length',
  'd' : 'duration',
  'f' : 'fps',
  's' : 'size',
  'w' : 'width',
  'h' : 'height',
  'a' : 'aspect',
  'ae': 'audio_encode',
  'ab': 'audio_bitrate',
  'ac': 'audio_channels',
  'fr': 'frame_rate',
  'b' : 'bitrate',
  'o' : 'original',
  'sm': 'small',
  'p' : 'playable',
  'lr': 'lowres'
};
