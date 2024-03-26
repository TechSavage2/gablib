/*******************************************************************************

 gablib
 api.auth.businesses.js (2024-03-26)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

/**
 * @module Businesses
 */

'use strict';

import { _fetch } from './_fetch.js';

/**
 * Get list of business categories.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @returns {Promise<*>}
 */
export async function getBusinessCategories(lo) {
  const url = new URL('/api/v1/business_categories', lo.baseUrl);
  return await _fetch(lo, url);
}

/**
 * Get list of business attributes.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @returns {Promise<*>}
 */
export async function getBusinessAttributes(lo) {
  const url = new URL('/api/v1/marketplace_listing_attributes', lo.baseUrl);
  return await _fetch(lo, url);
}

/**
 * Get list of promoted businesses.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {number} [category] - promotions from this category.
 * @param {number} [limit=200] - max items to return (presumed)
 * @returns {Promise<*>}
 */
export async function getPromotedBusinesses(lo, category, limit = 200) {
  const url = new URL('/api/v1/business_promoted', lo.baseUrl);
  if ( category | 0 ) {
    url.searchParams.append('category', (category | 0).toString());
  }
  url.searchParams.append('promotion[]', limit.toString());
  return await _fetch(lo, url);
}

/**
 *
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} categoryId - valid business category
 * @param {number} [page] - page to list
 * @returns {Promise<*>}
 */
export async function getBusinessesByCategory(lo, categoryId, page) {
  const url = new URL('/api/v1/business_search', lo.baseUrl);
  url.searchParams.append('category_id', categoryId);
  if ( page | 0 ) {
    url.searchParams.append('page', (page | 0).toString());
  }
  return await _fetch(lo, url);
}

/**
 * Get listings for a business.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} businessId - id of business
 * @param {string} [sinceId] - for paging (presumably similar to maxId.)
 * @returns {Promise<*>}
 */
export async function getBusinessListings(lo, businessId, sinceId) {
  const url = new URL('/api/v1/marketplace_listing_search', lo.baseUrl);
  url.searchParams.append('business_id', businessId);
  if ( sinceId ) {
    url.searchParams.append('since_id', sinceId);
  }
  return await _fetch(lo, url);
}

/**
 * Browse businesses by array of categories.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {[number]} ecs - list of business categories
 * @returns {Promise<*>}
 */
export async function browseBusinesses(lo, ecs) {
  const url = new URL('/api/v1/business_browse', lo.baseUrl);
  url.searchParams.append('ec', ecs.map(e => e | 0).join(','));
  return await _fetch(lo, url);
}

/**
 * Get details about a business listing item.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} itemId - id of item to get details from
 * @returns {Promise<*>}
 */
export async function getBusinessItem(lo, itemId) {
  const url = new URL(`/api/v1/marketplace_listings/${ itemId }`, lo.baseUrl);
  return await _fetch(lo, url);
}

/**
 * Get my business item saves.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @returns {Promise<*>}
 */
export async function getBusinessSaves(lo) {
  const url = new URL(`/api/v1/marketplace_listing_saves`, lo.baseUrl);
  return await _fetch(lo, url);
}

/**
 * Get details about a business listing item.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} itemId - id of item to get saves details from
 * @returns {Promise<*>}
 */
export async function getBusinessItemSaves(lo, itemId) {
  const url = new URL(`/api/v1/marketplace_listings/${ itemId }/saves`, lo.baseUrl);
  return await _fetch(lo, url);
}

/**
 * Save or unsave a marketplace item.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} itemId - id of item to get saves details from
 * @param {boolean} state - true to save, false to unsave
 * @returns {Promise<*>}
 */
export async function saveBusinessItem(lo, itemId, state) {
  const url = new URL(`/api/v1/marketplace_listings/${ itemId }/saves`, lo.baseUrl);
  return await _fetch(lo, url, state ? 'POST' : 'DELETE');
}

/**
 * Search marketplace listings for given account and optional query.
 * @param {LoginObject} lo - Valid and active LoginObject
 * @param {string} accountId - id of account to search items on
 * @param {string} [query=""] query string. May be empty.
 * @returns {Promise<*>}
 */
export async function searchListings(lo, accountId, query = '') {
  const url = new URL(`/api/v1/accounts//${ accountId }/marketplace_listings`, lo.baseUrl);
  url.searchParams.append('query', query);
  return await _fetch(lo, url);
}
