/*******************************************************************************

 gablib
 getTokens.js (2024-01-02)
 Copyright (c) 2024 TechSavage

 *******************************************************************************/

'use strict';

export function getTokens(html) {
  // WARN note that this is sensitive to changes in the html (in use for now.)
  // Alt: lightweight DOM parser for nodejs and iterate over each node/JSON
  const rxAuthToken = /<input type="hidden" name="authenticity_token" value="([^"]+)" \/>/gim;
  const rxCsrfToken = /<meta name="csrf-token" content="([^"]+)" \/>/gim;
  const rxInitJSON = /<script id="initial-state" type="application\/json">([^<]+)<\/script>/gim;

  const matchAuthToken = rxAuthToken.exec(html);
  const matchCsrfToken = rxCsrfToken.exec(html);
  const matchInitJSON = rxInitJSON.exec(html);

  let initJSON;
  try {
    initJSON = matchInitJSON && matchInitJSON.length >= 2 ? JSON.parse(matchInitJSON[ 1 ]) : null;
  }
  catch(err) {
    throw new Error(`Could not parse initial JSON from resulting page: ${ err.message }`);
  }

  const accessToken = initJSON ? initJSON.meta.access_token : null;

  return {
    authToken: matchAuthToken && matchAuthToken.length >= 2 ? matchAuthToken[ 1 ] : null,
    csrfToken: matchCsrfToken && matchCsrfToken.length >= 2 ? matchCsrfToken[ 1 ] : null,
    accessToken,
    initJSON
  };
}
