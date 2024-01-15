/*******************************************************************************

 gablib
 utils.js (2024-01-05)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

/**
 * @module Utils
 */

'use strict';

import { EventEmitter } from 'node:events';

let _zeroWidthIndex = 0;

/**
 * Returns an event handler that can be used across a gablib application.
 * @type {module:events.EventEmitter}
 */
export const gablibEvents = new EventEmitter();

/**
 * Map properties of json to those of map.
 * @param {{}} json - object to remap
 * @param {{}} map - map holding the property names corresponding with json, and
 * values for the new property names.
 * @returns {{}}
 */
export function mapObject(json, map) {
  const newJSON = {};
  Object.keys(map).forEach(key => {
    if ( typeof json[ key ] !== 'undefined' ) {
      newJSON[ map[ key ] ] = json[ key ];
    }
  });
  return newJSON;
}

/**
 * Map JSON so that properties becomes values, and vice verse.
 * @param {{}} map - map for properties vs. values
 * @returns {{}}
 */
export function inverseMap(map) {
  const newMap = {};
  Object.keys(map).forEach(key => {
    newMap[ map[ key ] ] = key;
  });
  return newMap;
}

/**
 * Find object with id in an array of objects.
 * @param {*} id
 * @param {Array} array
 * @param {string} [key='id'] key for 'id' in array objects.
 * @returns {null|*}
 */
export function findObjectId(id, array, key = 'id') {
  for(const o of array) {
    if ( o[ key ] === id ) return o;
  }
  return null;
}

/**
 * Basic Markdown stripper. You can replace this with a custom plugin.
 * @param md
 * @param options
 * @returns {*}
 * @license MIT
 * @author remove-markdown by stiang. Modified by TechSavage.
 * @see https://github.com/stiang/remove-markdown
 */
export function stripMD(md, options) {
  options = Object.assign({}, {
    listUnicodeChar    : false,
    stripListLeaders   : true,
    gfm                : true,
    useImgAltText      : true,
    abbr               : false,
    replaceLinksWithURL: false,
    htmlTagsToSkip     : []
  }, options);

  let output = md;

  // Remove horizontal rules (stripListHeaders conflict with this rule, which is why it has been moved to the top)
  output = output.replace(/^(-\s*?|\*\s*?|_\s*?){3,}\s*/gm, '');

  try {
    if ( options.stripListLeaders ) {
      if ( options.listUnicodeChar )
        output = output.replace(/^([\s\t]*)([*\-+]|\d+\.)\s+/gm, options.listUnicodeChar + ' $1');
      else
        output = output.replace(/^([\s\t]*)([*\-+]|\d+\.)\s+/gm, '$1');
    }

    if ( options.gfm ) {
      output = output
        // Header
        .replace(/\n={2,}/g, '\n')
        // Fenced codeblocks
        .replace(/~{3}.*\n/g, '')
        // Strikethrough
        .replace(/~~/g, '')
        // Fenced codeblocks
        .replace(/`{3}.*\n/g, '');
    }

    if ( options.abbr ) {
      // Remove abbreviations
      output = output.replace(/\*\[.*]:.*\n/, '');
    }

    // Remove HTML tags
    output = output.replace(/<[^>]*>/g, '');

    let htmlReplaceRegex = new RegExp('<[^>]*>', 'g');

    if ( options.htmlTagsToSkip.length > 0 ) {
      // Using negative lookahead. Eg. (?!sup|sub) will not match 'sup' and 'sub' tags.
      let joinedHtmlTagsToSkip = '(?!' + options.htmlTagsToSkip.join('|') + ')';

      // Adding the lookahead literal with the default regex for html. Eg./<(?!sup|sub)[^>]*>/ig
      htmlReplaceRegex = new RegExp('<' + joinedHtmlTagsToSkip + '[^>]*>', 'ig');
    }

    output = output
      // Remove HTML tags
      .replace(htmlReplaceRegex, '')
      // Remove setext-style headers
      .replace(/^[=\-]{2,}\s*$/g, '')
      // Remove footnotes?
      .replace(/\[\^.+?](: .*?$)?/g, '')
      .replace(/\s{0,2}\[.*?]: .*?$/g, '')
      // Remove images
      .replace(/!\[(.*?)][[(].*?[\])]/g, options.useImgAltText ? '$1' : '')
      // Remove inline links
      .replace(/\[([^\]]*?)][\[(].*?[\])]/g, options.replaceLinksWithURL ? '$2' : '$1')
      // Remove blockquotes
      .replace(/^(\n)?\s{0,3}>\s?/gm, '$1')
      // .replace(/(^|\n)\s{0,3}>\s?/g, '\n\n')
      // Remove reference-style links?
      .replace(/^\s{1,2}\[(.*?)]: (\S+)( ".*?")?\s*$/g, '')
      // Remove atx-style headers
      .replace(/^(\n)?\s*#{1,6}\s*( (.+))? +#+$|^(\n)?\s*#{1,6}\s*( (.+))?$/gm, '$1$3$4$6')
      // Remove * emphasis
      .replace(/([*]+)(\S)(.*?\S)??\1/g, '$2$3')
      // Remove _ emphasis. Unlike *, _ emphasis gets rendered only if
      //   1. Either there is a whitespace character before opening _ and after closing _.
      //   2. Or _ is at the start/end of the string.
      .replace(/(^|\W)([_]+)(\S)(.*?\S)??\2($|\W)/g, '$1$3$4$5')
      // Remove code blocks
      .replace(/(`{3,})(.*?)\1/gm, '$2')
      // Remove inline code
      .replace(/`(.+?)`/g, '$1')
      // // Replace two or more newlines with exactly two? Not entirely sure if this belongs here...
      // .replace(/\n{2,}/g, '\n\n')
      // // Remove newlines in a paragraph
      // .replace(/(\S+)\n\s*(\S+)/g, '$1 $2')
      // Replace strike through
      .replace(/~(.*?)~/g, '$1');
  }
  catch(err) {
    console.error(err.message);
    return md;
  }
  return output;
}

/**
 * Sleep function.
 * @param {number} ms - delay in milliseconds
 * @returns {Promise<*>}
 */
export async function sleep(ms) {
  return new Promise(success => {
    setTimeout(success, ms);
  });
}

/**
 * Return a zero width char that can be inserted in statuses that goes to
 * multiple destinations at once to avoid being blocked as spamming.
 * @returns {string} - a single zero width char
 */
export function getZeroWidthChar() {
  const zeroWidthChars = '\x00AD\x034F\x061C\x17B4\x17B5\x180E\x200B\x200C\x200D\x200E\x200F\x2060\x2061\x2062\x2063\x2064\x206A\x206B\x206C\x206D\x206E\x206F';
  return zeroWidthChars.charAt(_zeroWidthIndex++ % zeroWidthChars.length);
}

/**
 * Simplified file-type detection for attachments.
 * @param {Buffer} buffer - buffer holding the file
 * @returns {string} Detected extension, or '.ext' if unknown.
 */
export function getExtensionFromBuffer(buffer) {
  let ext = '.ext';
  const type = buffer.readInt32BE() >>> 0;
  if ( type === 0x89504e47 ) {
    ext = '.png';
  }
  else if ( (type & 0xffff0000) >>> 0 === 0xffd80000 ) {
    ext = '.jpg';
  }
  else if ( type === 0x47494638 ) {
    ext = '.gif';
  }
  else if ( type === 0x52494646 && buffer.readInt32BE(8) === 0x57454250 ) {
    ext = '.webp';
  }
  else if ( type === 0x52494646 && buffer.readInt32BE(8) === 0x41564920 ) {
    ext = '.avi';
  }
  else if ( buffer.readInt32BE(4) === 0x66747970 && [ 0x69736f6d, 0x6D6D7034, 0x6D703432, 0x69736F35 ].includes(buffer.readInt32BE(8)) ) {
    ext = '.mp4';
  }
  else if ( buffer.subarray(0, 0x20).toString().includes('webm') ) { // todo mkv based, better check
    ext = '.webm';
  }
  else if ( buffer.subarray(0, 0x20).toString().includes('matroska') ) {
    ext = '.mkv';
  }
  else if ( type === 0xfff14c80 ) {
    ext = '.mp3';
  }
  else {
    console.warn(`Could not detect file type (0x${ (type >>> 0).toString(16) }). Please report issue:`);
    console.warn('https://github.com/TechSavage2/gablib/issues');
  }

  return ext;
}
