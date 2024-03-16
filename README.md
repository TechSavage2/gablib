gablib
======

API package for scripting/programming Mastodon nodes where OAuth2 for custom apps has been disabled
on the server.

This package will allow you to build apps by logging in programmatically via the regular "human"
_auth/sign_in_ page and extract tokens for API calls that requires authentication.

This is not a standalone package/app but intended to be used as part of a custom client or for
various scripting/automation tasks.

Things you can build, but not limited to:

- Custom GUI/TUI clients
- Feed/RSS bots
- General post automation and scheduling
- Bridges/federation between other social platform APIs, cross-posting
- Analytics, insight and statistics tools
- Integration with ML for classifying, summarizing, "AI" use detection, and so forth.
- General integration with ERMs, CRMs, communications etc. for businesses

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
  experimental.)

API support
-----------

- Full support for Statuses and Comments
- Full support for Groups
- Full support for Shortcuts
- Full support for Bookmark Collections
- Full support for Feeds
- Full support for Notifications
- Full support for Direct Messages/Chats
- Full support for site wide search
- Full support for Streaming API (live updates)
- Full support for Public APIs
- Support for Accounts (except for 'deep' settings)
- Support for (de)serialization of session/auth between executions.

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
$ pnpm add https://github.com/TechSavage2/gablib
```

It's now ready for use. As of now there are no other dependencies to be installed.

Getting Started
---------------

Make sure you have a registered and active account with the Mastodon site you want to log on to (
unless you only want to use the public APIs.)

Make sure to initialize environmental variables on your system.

**For Linux and macOS, you can use:**

```bash
export MASTODON_USEREMAIL='your@mastodon.email'
export MASTODON_PASSWORD='yourSecretPassword'
export MASTODON_BASEURL='https://somemastodon.site'
```

Add this in, for example, your `~/.profile` file on Linux (or `~/.bashrc` if you're using Wayland,)
and to the `~/.bash_profile` on macOS.

**Windows (cmd)**

```cmd
setx MASTODON_USEREMAIL "your@mastodon.email"
setx MASTODON_PASSWORD "yourSecretPassword"
setx MASTODON_BASEURL "https://somemastodon.site"
```

Remember to restart the shell for the changes to take effect.

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
import { login } from 'gablib';
```

or if you prefer the entire library as a single object:

```JavaScript
import * as gablib from 'gablib';
```

Now call the primary function to log in:

```JavaScript
import { login } from 'gablib';

const loginObject = await login();  // ! most calls are asynchronous
```

If successful login, the object is now initialized for use with API functions. If login failed it
will _throw an error_. Check that your credentials are correct and if a complex password that it's
properly escaped (if using env.)

Limitations
-----------

- This package is addressing specifically the site Gab as they have deviated from the standard
  Mastodon APIs and mechanisms. This will probably not work well with standard Mastodon sites as of
  now, as it has not been tested with those (although possible, and maybe in a future version).
- Due to Cross-Origin Resource Sharing (CORS) restrictions you won't be able to create an _
  in-browser_ client unless you make it as a _browser extension_.

Documentation
-------------

**JSDoc** online developer documentation can be [found here](https://techsavage2.github.io/gablib/).

**Wiki** with examples and tips can be [found here](https://github.com/TechSavage2/gablib/wiki).

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

- [ ] True privacy/encryption for DMs (where you create and own the private key. H/D exchange
  options.)
- [ ] Events (WIP. Support for streaming api added.)
- [ ] AI

Issues
------

See [issues](https://github.com/TechSavage2/gablib/issues) on Codeberg.

Notes
-----

The package has only been tested with Linux so far, but there shouldn't be anything preventing it
from working with Windows, macOS and other platforms as well.

License
-------

MIT

Copyright 2024 TechSavage

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
associated documentation files (the “Software”), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute,
sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial
portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES
OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
