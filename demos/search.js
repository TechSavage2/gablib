/**
 * Search site wide
 *
 * node demos/search <query>
 * bun demos/search.js <query>
 */

'use strict';

import { login } from '../src/login.js';
import { search } from '../src/api.auth.search.js';

const query = process.argv[ 2 ];

if ( !query || !query.trim().length ) {
  console.log('Usage: demos/search "keyword1 [[keyword2] ...]"');
  process.exit(1);
}

console.log(`Searching for: ${ query }. Hold on...`);

const lo = await login();
const result = await search(lo, query);

if ( !result.ok ) {
  console.error('Sorry, something went wrong...');
}
else {
  result.content.statuses.forEach(status => {
    const url = status.url;
    const timeline = status.group ? status.group.title : 'home';
    const account = status.account.display_name || status.account.username || status.account.acct;
    const content = filterContent(status.content);
    const likes = status.favourites_count;
    const reposts = status.reblogs_count;
    const quotes = status.quotes_count;
    const comments = status.direct_replies_count;
    const date = status.created_at;

    // header line
    console.log('---------------------------------------------------------------');
    console.log(`\x1b[34;1mURL: ${ url }\x1b[m`);
    console.log(`\x1b[33;1mPosted by ${ account } at ${ date }\x1b[m\n`);
    console.log(`\x1b[32;1m${ content }\x1b[m\n`);
    console.log(`\x1b[35m${ likes } 👍     ${ reposts } ♻      ${ quotes } \x1b[37;1m"\x1b[0;35m     ${ comments } 💬\x1b[m\n`);
  });

  function filterContent(html) {
    const max = 350;
    let txt = html.replace(/<br \/>/gmi, '\n').replace(/(<([^>]+)>)/igm, '');
    let lines = txt.split('\n');
    if ( lines > 5 ) lines = lines.splice(0, 5).push('...');
    txt = lines.join('\n');
    if ( txt.length > max ) return txt.substring(0, max) + '...';
    else return txt.replace('......', '...');
  }

}
