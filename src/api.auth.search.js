/*******************************************************************************

 gablib
 api.auth.search.js (2024-01-09)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

/**
 * @module Search
 */

'use strict';

import { _fetch } from './_fetch.js';

/**
 * Search site for query. Filter type must be set to one type, defaults to 'status'.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} query Search query, keywords
 * @param {number} [page=1] page number for results
 * @param {Object} [filters={}] filters for query
 * @param {boolean} [filters.onlyVerified] only show results from verified accounts
 * @param {string} [filters.type='status'] filter results on type: See {@link enumSearchFilterTypes}.
 * 'status', 'group', 'top', 'account', 'link', 'feed', 'hashtag'
 * @returns {Promise<*>}
 * @throws If query is empty
 */
export async function search(lo, query, page = 1, filters = {}) {
    filters = Object.assign({}, {
      onlyVerified: false,
      type: 'status'
    }, filters)

  const url = new URL('/api/v3/search', lo.baseUrl);

  if ( typeof query !== 'string' || !query.trim().length ) {
    throw new Error('Search query is empty.');
  }

  url.searchParams.append('q', query);
  url.searchParams.append('resolve', 'true');
  url.searchParams.append('onlyVerified', (!!filters.onlyVerified).toString());

  page |= 0;
  if ( page > 0 ) {
    url.searchParams.append('page', page);
  }

  if ( typeof filters.type === 'string' ) {
    url.searchParams.append('type', filters.type);
  }

  return _fetch(lo, url);
}
