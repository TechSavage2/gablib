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
  //  'bci'      : 'bookmark_collection_id',  // ?? latter is missing, but also seem to always be 'null'
  'c'  : 'content',
  'ca' : 'created_at',
  'ci' : 'conversation_id',
  'drc': 'direct_replies_count',
  'e'  : 'emojis',
  'fvd': 'favourited',
  'g'  : 'group',
  'gi' : 'group_id',  // ??
  'hq' : 'has_quote',
  'i'  : 'id',
  'ir' : 'is_reply',
  //  in_reply_to_account_id: null, // not in the gab remapped result, but are in the non-mapped results
  //  in_reply_to_id: null,
  'l'   : 'language',
  'm'   : 'mentions',
  'mai' : 'media_attachment_ids',
  'md'  : 'markdown',
  'p'   : 'pinnable',
  'pbg' : 'pinnable_by_group',
  'pci' : 'preview_card_id',
  'pi'  : 'poll_id',
  'qc'  : 'quotes_count',
  'qoi' : 'quote_of_id',
  'rbc' : 'reblogs_count',
  'rbgd': 'reblogged',
  'rc'  : 'replies_count',
  'rcs' : 'reaction_counts',
  'rid' : 'reaction_id',      // *your* reaction ID (1=liked, etc.)
  //'roi' : 'reblog_of_id', // ?? latter is missing in Gabs remapped results
  's'  : 'sensitive',
  'sci': 'status_context_id',
  'st' : 'spoiler_text',
  't'  : 'text',
  'tg' : 'tags',
  'u'  : 'uri',
  'ul' : 'url',
  'v'  : 'visibility'
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

// sci - context id
//  "id": "123",
//  "name": "👀 It's Happening",
//  "index": 0,
//  "is_global": true,
//  "is_enabled": true

// Card (link)
//  "id": 123,
//  "url": "https://www...sion/",
//  "title": "Open sou...ore",
//  "description": "FOS...way",
//  "type": "link",
//  "provider_name": "",
//  "provider_url": "",
//  "html": "",
//  "width": 1200,
//  "height": 600,
//  "image": "https://media...20881.jpeg",
//  "embed_url": "",
//  "updated_at": "202...5.483Z",
//  "gab_content_type": null

// Card (video)
//  "id": 44466209,
//  "url": "https://www.youtube...d6Y",
//  "title": "KD...EATURES",
//  "description": "",
//  "type": "video",
//  "provider_name": "YouTube",
//  "provider_url": "https://www.youtube.com/",
//  "html": "<iframe width=\"200\" height=\"113\" src=\"https://www.youtube.com/embed/...6Y?feature=oembed\" frameborder=\"0\" allowfullscreen=\"\" title=\"KD...EATURES\"></iframe>",
//  "width": 200,
//  "height": 113,
//  "image": "https://media.gab.com/system/preview_cards/images/044/466/209/original/e7....jpeg",
//  "embed_url": "",
//  "updated_at": "2024-01...10Z",
//  "gab_content_type": null

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
