# potluck

One-on-one video chat component, with extra emphasis on mobile experience.

Uses `tokbox` for video connections.

### Usage

Currently can only be used with `potluck-tokbox-adapter`, which expects opentok to be
loaded via script and shimmed as `require('opentok') === window.OT`

Don't like tokbox? Create a new video adapter.

```js
var TokboxAdapter = require('potluck-tokbox-adapter')
var adapter = new TokboxAdapter({
  apiKey: '/* your tokbox api key */',
  sessionId: '/* tokbox id of the session you want to join */',
  token: '/* tokbox token for the session */'
})

// Start a potluck in your app.
// Someone can join at your current url if they have the correct tokbox credentials.
var videoChatContainer = document.querySelector('.my-video-container')
require('potluck')(videoChatContainer, adapter)

// When you're done...
adapter.disconnect()
videoChatContainer.remove()
```

### Development

- Acquire some tokbox credentials (check potluck-tokbox-adapter's [test-server.js](https://github.com/eaze/potluck-tokbox-adapter/blob/master/test-server.js))
- `npm install`
- `npm run dev` to start watch for css/js
- Start http server in root and open index.html
