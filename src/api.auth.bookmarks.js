/*******************************************************************************

 gablib
 api.auth.bookmarks.js (2024-01-07)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

'use strict';
import { _fetch } from './_fetch.js';

export async function getBookmarkCollection(lo) {
  const url = lo.baseUrl + `/api/v1/bookmark_collections`;
  return await _fetch(lo, url);
}
