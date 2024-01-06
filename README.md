gablib
======

API package for scripting/programming Mastodon nodes where OAuth has been disabled on the server.
This package will programmatically login via the regular "human" auth/sign_in page, extract tokens
to allow for operations that requires authentication.

NOTE: Alpha version. WIP. Use at own risk!

Install
-------

Clone this repo using git, or download the zip file and unzip it to a directory. It's now ready for
use. As of now there are no other dependencies to be installed.

**Note** that this package and modules uses ESM format (i.e. use `import` statements.)

Usage
-----

Make sure you have a registered and active account with the Mastodon site you want to log on to.

Make sure to initialize environmental variables on your system. For Linux, you can use:

```bash
export MASTODON_USEREMAIL='your@mastodon.email'
export MASTODON_PASSWORD='yourSecretPassword'
export MASTODON_BASEURL='https://somemastodon.site'
```

Put this in your ~/.profile file.

You can also use different environment names and simply supply them instead (see below.)

In your JavaScript you can now call as the first function:

```JavaScript
import { login } from './src/login.js';

const loginObject = await login();  // note that the call is asynchronous
```

If successful login the object is now initialized for use with API functions. If login failed it
will throw an error. Check that your credentials are correct and if a complex password properly
escaped.

If you want to use a different set of env variables, you can specify them like:

```JavaScript
import { login } from './src/login.js';

// export ALTEMAIL="myother@email.com"
// export ALTPASSWORD="altsecret"
// export ALTBASEURL="https://altmastodon.com"
const loginObject = await login('ALTEMAIL', 'ALTPASSWORD', 'ALTBASEURL');
```

Alternatively you can specify the login credentials as arguments (**not recommended** unless they
are loaded from a database or credential store):

```JavaScript
import { login } from './src/login.js';

const loginObject = await login({
  userEmail: 'your@mastodon.email',
  password : 'yourSecretPassword',
  baseUrl  : 'https://somemastodon.site'
});
```

To test if your env credentials are correct and login is working, you can run:

```bash
$ node test-login
```

If everything is fine you will see SUCCESS printed to console together with some account information
for your account.

To call API functions then is simply a matter of logging in and use the resulting
`LoginObject` as argument for API calls that require authentication:

```JavaScript
import { login } from './src/login.js';
import { postMessage } from './api.auth.timelines.js';
import { Poll } from './src/obj/Poll.js';

const loginObject = await login();

// post a message to your own timeline (text can be markdown)
const result1 = await postMessage(loginObject, 'some text');

// post a message to a group
const result2 = await postMessage(loginObject, 'some text', { groupId: '1501' });

// post a message to a group with a poll attached
const result3 = await postMessage(loginObject, 'some text', {
  groupId: '1501',
  poll   : new Poll([ 'option 1', 'option 2', 'options 3' ])
});

// post a message to your own timeline only your followers can see
const result4 = await postMessage(loginObject, 'some text', {
  visibility: 'private' // or use enumVisibility.private
});
```

To get a list of groups you are member of:

```JavaScript
import { login } from '../src/login.js';
import { getMyGroups } from '../src/api.auth.groups.js';

const loginObject = await login();

// list groups
const result = await getMyGroups(loginObject);
console.log(result);

// You can also set 'minimal' list to true for only id and group title:
//const result = await getMyGroups(loginObject, true);
```

Upload media as attachments (this method will likely change in the future!):

```JavaScript
// after login, first upload media files in parallel
const mediaResult = await Promise.all([
  uploadMedia(loginObject, '/path/to/file1.jpg'),
  uploadMedia(loginObject, '/path/to/file2.png'),
  uploadMedia(loginObject, '/path/to/file3.mp4')
]);

// extract media Ids
const attachmentIds = mediaResult.map(e => e.content.id);

// post message with attachment ids as an array 
const result = await postMessage(
  loginObject,
  'Take a look at these files:',
  {},
  attachmentIds
);

console.log(result);
```

Additional modules
------------------

- `src/login.js` : main module to perform automated login
- `src/obj/Poll.js` : Poll helper object to make polls for new statuses
- `src/api.auth.statuses.js` : API calls related to statuses
- `src/api.auth.groups.js` : API calls related to groups
- `src/api.auth.js` : API calls for generic/misc calls
- `src/api.public.js` : API calls that don't require authentication
- `src/enums.js` : enum helpers to set proper values for some calls

(more will come)

Most modules are intended for internal use. You can explore them if you want, but use them at your
own risk as they could change/disappear at any time during the alpha state.

_Note that using this package may cause you to be logged out from other sessions due to server
session expiration and possibly UserAgent. In worst case, all you need to do is to log back in._

Features
--------

- [x] Easy to use
- [x] ESM modules (import/export)
- [x] login using the _sign_in_ form instead of OAuth
- [x] API calls using authentications (WIP)
- [x] public API calls (WIP)
- [ ] (de)serializing of session/auth data for reuse between executions (experimental)
- [ ] events (responses, errors, upload/download progress, etc.)

You can use both _nodejs_ and _bun_ executables for the package.

The package has only been tested with Linux, but shouldn't be anything preventing it from working
with Windows, macOS and other platforms as well.

_Although it should be possible to use this with any Mastodon it has not been tested with any
Mastodon instances other than Gab, and since they have changed, added and removed many of the API
calls it may not work fully as expected as with a 'normal' node.

License
-------

AGPL

Copyright (c) 2024 TechSavage
