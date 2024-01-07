/*******************************************************************************

 gablib
 maps.js (2024-01-05)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

'use strict';

export const mapAccount = {
  'i'     : 'id',
  'un'    : 'username',
  'ac'    : 'acct',
  'dn'    : 'display_name',
  'l'     : 'locked',
  'ca'    : 'created_at',
  'nt'    : 'note',
  'u'     : 'url',
  'av'    : 'avatar',
  'avs'   : 'avatar_static',
  'avsml' : 'avatar_small',
  'avss'  : 'avatar_small_static',
  'h'     : 'header',
  'hs'    : 'header_static',
  'is'    : 'is_spam',
  'foc'   : 'followers_count',
  'fic'   : 'following_count',
  'sc'    : 'statuses_count',
  'ip'    : 'is_pro',
  'iv'    : 'is_verified',
  'idn'   : 'is_donor',
  'ii'    : 'is_investor',
  'spl'   : 'show_pro_life',
  'ipd'   : 'is_parody',
  'emojis': 'emojis',
  'fields': 'fields'
};

export const mapStatus = {
  'i'        : 'id',
  'ca'       : 'created_at',
  's'        : 'sensitive',
  'st'       : 'spoiler_text',
  'v'        : 'visibility',
  'l'        : 'language',
  'u'        : 'uri',
  'ul'       : 'url',
  'drc'      : 'direct_replies_count',
  'rc'       : 'replies_count',
  'rbc'      : 'reblogs_count',
  'p'        : 'pinnable',
  'pbg'      : 'pinnable_by_group',
  'g'        : 'group',
  'pi'       : 'poll_id',
  'hq'       : 'has_quote',
  'qoi'      : 'quote_of_id',
  'qc'       : 'quotes_count',
  'rcs'      : 'reaction_counts',
  'ir'       : 'is_reply',
  'ai'       : 'account_id',
  'mai'      : 'media_attachment_ids',
  'sci'      : 'status_context_id',
  'ci'       : 'conversation_id',
  'fvd'      : 'favourited',
  'rbgd'     : 'reblogged',
  'm'        : 'media_attachments',
  'c'        : 'content',
  't'        : 'text',
  'md'       : 'markdown',
  'tg'       : 'tags',
  'e'        : 'emojis',
  'analytics': 'analytics'
};

// sci in status, context id
//{
//  "id": "109345154905552362",
//  "name": "👀 It's Happening",
//  "index": 0,
//  "is_global": true,
//  "is_enabled": true
//}

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

// todo Gab has not finished mapping this, so this is not complete either...
//export const mapGroup = {
//  'i'   : 'id',
//  't'   : 'title',
//  'd'   : 'description',
//  'dh'  : 'description_html',
//  'ciu' : 'cover_image_url',
//  'cit' : 'cover_image_thumbnail_url',
//  'cim' : 'cover_image_medium_url',
//  'ia'  : 'is_archived',
//  'mc'  : 'member_count',
//  'iv'  : 'is_verified',
//  'im'  : 'is_moderated',
//  'ca'  : 'created_at',
//  'ip'  : 'is_private',
//  'ivs' : 'is_visible',
//  'sl'  : 'slug',
//  'u'   : 'url',
//  'gc'  : 'group_category',      //??
//  'ipd' : 'password',            //??
//  'hp'  : 'has_password',        //??
//  'ipa' : 'is_paused',           //??
//  'tc'  : 'theme_color',         //??
//  'r'   : 'rules',               //??
//  'iav' : 'is_admins_visible',   //??
//  'imv' : 'is_members_visible',  //??
//  'imdv': 'is_media_visible',    //??
//  'ilv' : 'is_links_visible',    //??
//  'aq'  : 'allow_quotes'         //??
//};
