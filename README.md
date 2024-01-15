gablib
======

API package for scripting/programming Mastodon nodes where OAuth2 for custom apps has been disabled
on the server.

This package will allow you to build apps by logging in programmatically via the regular "human"
_auth/sign_in_ page and extract tokens for API calls that requires authentication.

This is not a standalone package/app but intended to be used as part of a custom client or for
various scripting/automation tasks.

Things you can build:

- Custom GUI/TUI clients
- Feed/RSS bots
- General post automation and scheduling
- Analytics, insight and statistics tools
- Bridges between other social platform APIs, cross-posting
- Integration with ML for classifying, summarizing, "AI" detection and so forth.
- General integration with ERMs, CRMs, communications etc.

and much more.

**⚠️ NOTE: The API is currently _not stable_ and in ALPHA, a WIP. Breaking changes could happen. Use
it as a tech preview. Avoid use for production as of now. This message will go away when the API is
frozen.**

Requirements
------------

One of:

- [NodeJS](https://nodejs.org/en/) version 18 or newer (for the fetch api).
- [Bun](https://bun.sh/) version 1.0.21 or newer.

Installation
------------

Using `npm` to install the package into your nodejs project:

```bash
$ npm install https://github.com/TechSavage2/gablib
```

Alternatively, you can use `yarn` to install the package into your nodejs project:

```bash
$ yarn add https://github.com/TechSavage2/gablib
```

or `pnpm`:

```bash
$ pnpm install https://github.com/TechSavage2/gablib
```

It's now ready for use. As of now there are no other dependencies to be installed.

Features
--------

- Easy to use
- Asynchronous
- ES modules (import/export)
- Login using the _sign_in_ form instead of OAuth2
- Can call APIs requiring authentications
- Public API calls
- Streaming API as events
- Can use a custom Markdown stripper
- Optional automatic (de)serializing of session/auth data for reuse between executions (
  experimental)

Supported APIs
--------------

- Full support for **Statuses and Comments**
    - Create Edit, Delete, Attachments, Timelines, (Un)Favorite, (Un)Bookmark, (Un)Pin, Move (aux
      function), Comment, Comment trees, Context, Posting to groups, Statuses from Tags, Revisions,
      Cards, Quotes, Replies, Stats
    - Custom (optional) plugin for handling Markdown stripping.
    - Handles and remaps Gab's rearranged results as well as the shortened properties on status
      JSONs.
- Full support for **Groups**
    - Create, Edit, Categories, Moderation
- Full support for **Bookmark Collections**
    - List collections, Create, Edit, Delete
- Full support for **Notifications**
    - Get notifications, Mark read, Filters
- Full support for **Shortcuts**
    - List, Add, Delete, Reorder
- Full support for **Accounts**
    - Stats, Edit, Account Settings
- Full support for **Feeds**
    - Create, Edit, Delete, Add/Remove members, (Un)Subscribe, Timelines, Feed lists, List members
      and Subscribers
- Full support for the **Streaming API**
    - Realtime events for new posts, reposts, likes, notifications etc.
- Full support for site wide **search**
    - All, filters
- Support for **Public** APIs (no authentication required)
    - Account information, Trends feed, News feed, Popular statuses
- Support for **Chats/DM** (TODO)
- Support for **Site Settings** (TODO)
- Support for (de)serialization of session/auth between executions.

Getting Started
---------------

Make sure you have a registered and active account with the Mastodon site you want to log on to.

Make sure to initialize environmental variables on your system.

For Linux, you can use:

```bash
export MASTODON_USEREMAIL='your@mastodon.email'
export MASTODON_PASSWORD='yourSecretPassword'
export MASTODON_BASEURL='https://somemastodon.site'
```

Put this in for example your `~/.profile` file.

You can also use different environment names and simply supply them instead (
see [wiki](https://github.com/TechSavage2/gablib/wiki/Authenticating).)

This package uses the ES module format (i.e. use `import` statements.)

To use ESM in your project, either update `package.json` with the following:

```json
{
  "type": "module"
}
```

or use the `.mjs` extension for your JavaScript files.

To import functions as needed, you can then use:

```JavaScript
import { login } from 'gablib/gablib.js';
```

or if you prefer the entire library as a single object:

```JavaScript
import * as gablib from 'gablib/gablib.js';
```

Now call the primary function to log in:

```JavaScript
import { login } from 'gablib/gablib.js';

const loginObject = await login();  // ! most calls are asynchronous
```

If successful login, the object is now initialized for use with API functions. If login failed it
will _throw an error_. Check that your credentials are correct and if a complex password that it's
properly escaped (if using env.)

Documentation
-------------

Online documentation (JSDoc) can be found here

https://techsavage2.github.io/gablib/

Wiki with examples and tips:

https://github.com/TechSavage2/gablib/wiki

To see specifics for each API call, JSON structures and so on, the official Mastodon can be useful.
Note that some Mastodon sites have modified some of these responses, JSONs and API calls, but to get
the broader gist this is still helpful:

https://docs.joinmastodon.org/methods/

Generate Local Docs
-------------------

You can generate a local version of the documentation by installing the developer dependencies.
While in the project root folder:

```bash
$ npm i -D
```

Then run:

```bash
$ npm run docs
```

If you don't like to use the dark theme simply edit the `jsdocs.json` and remove the custom CSS file
referenced in the `scripts` property.

The docs are now found in the `docs/` folder. You may want to fire up a local server for the folder
for everything to work smoothly.

For example, if you have python installed:

```bash
cd docs/
python -m http.server
```

Go to the link to see the docs.

TODOs
-----

- [ ] Chat APIs (social and public)
- [ ] Events (responses, errors, upload/download progress, etc.)
- [ ] AI

Issues
------

See [issues](https://github.com/TechSavage2/gablib/issues) on GitHub.

Notes
-----

The package has only been tested with Linux so far, but there shouldn't be anything preventing it
from working with Windows, macOS and other platforms as well.

License
-------

AGPL

Copyright (c) 2024 TechSavage
