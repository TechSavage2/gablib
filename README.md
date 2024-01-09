gablib
======

API package for scripting/programming Mastodon nodes where OAuth for custom apps has been disabled
on the server.

This package will allow you to build apps by logging in programmatically via the regular "human"
auth/sign_in page and extract tokens for operations that requires authentication.

This is not a standalone package/app but intended to be used as part of a custom client or for
scripting.

**⚠️ NOTE: The API is currently _not stable_ and in ALPHA, a WIP. Breaking changes could happen.
Use it as a tech preview. Avoid use for production as of now. This message will go away when the
API is frozen.**

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

- [x] Easy to use
- [x] ES modules (import/export)
- [x] login using the _sign_in_ form instead of OAuth
- [x] API calls using authentications (WIP)
- [x] public API calls (WIP)
- [x] full support for statuses and comments
- [x] 'normalizes' Gab's remapped status lists format to that of normal Mastodon
- [x] can use a custom markdown stripper
- [ ] streams and sockets wrapper objects (for client use)
- [ ] (de)serializing of session/auth data for reuse between executions (experimental)
- [ ] events (responses, errors, upload/download progress, etc.)

APIs
----

- Full support for **Statuses**
  - Create Edit, Delete, Attachments, Timelines, (Un)Favorite, (Un)Bookmark, (Un)Pin, Move (aux function), Comment, Comment trees, Context, Posting to groups, Statuses from Tags, Revisions, Cards, Quotes, Replies, Stats
  - Custom (optional) plugin for handling Markdown stripping.
  - Handles and remaps Gab's rearranged results as well as the shortened properties on status JSONs.
- Partial support for **Groups** (WIP)
  - Create, Edit, Categories, (Administration)
- Full support for **Notifications**
  - Get notifications, Mark read, Filters
- Support for **Accounts** (TODO)
  - (Edit, Delete, Settings, Stats (following, followers, blocks, mutes, blocking))
- Support for **Bookmarks** administration (TODO)
  - (List  collections, Create, Delete)
- Support for **Lists** (TODO)
- Support for **Feeds** (TODO)
- Support for **Public** APIs (requires no authentication)
  - Account information, Trends feed, News feed, Popular statuses

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
"type": "module",
```

or use the `.mjs` extension for your JavaScript files.

To import a function you can then use:

```JavaScript
import { login } from 'gablib/gablib.js';
```

or if you prefer the entire library on a single object:

```JavaScript
import * as gablib from 'gablib/gablib.js';
```

Now call the primary function to log in:

```JavaScript
import { login } from 'gablib/gablib.js';

const loginObject = await login();  // note that the call is asynchronous
```

If successful login, the object is now initialized for use with API functions. If login failed it
will _throw an error_. Check that your credentials are correct and if a complex password that it's
properly escaped (if using env.)

Documentation
-------------

Online documentation (JSDoc) can be found here

https://techsavage2.github.io/gablib/

Wiki page with examples and tips:

https://github.com/TechSavage2/gablib/wiki

To see specifics for each API call, JSON structures and so on, the official Mastodon can be useful.
Note that some Mastodon sites (such as Gab) have modified some of these responses, JSONs and API
calls, but to get the broader gist this is still helpful:

https://docs.joinmastodon.org/methods/

Local Docs
----------

You can generate a local version of the documentation by installing the
developer dependencies. While in the project root folder:

```bash
$ npm i -D
```

Then run:

```bash
$ npm run docs
```

The docs are now found in the `docs/` folder. You may want to fire up a local
server for the folder for everything to work smoothly.

For example if you have python installed:

```bash
cd docs/
python -m http.server
```

Go to the link to see the docs.

Issues
------

See [issues](https://github.com/TechSavage2/gablib/issues)

Notes
-----

The package has only been tested with Linux so far, but there shouldn't be anything preventing
it from working with Windows, macOS and other platforms as well.

License
-------

AGPL

Copyright (c) 2024 TechSavage
