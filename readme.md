# potluck

One-on-one video chat component, with extra emphasis on mobile experience.

Currently uses opentok for video connections.

### Usage

Currently can only be used with `potluck-opentok-adapter`, which expects opentok to be
shimmed as `require('opentok') === window.OT`

Don't like opentok? Create a new video adapter and use it.

```js
var OpentokAdapter = require('potluck-tokbox-adapter')
var adapter = new OpentokAdapter({
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

#### Styling

- Include `./style.css` into your app, however you wish.
  * Recommended: just `require` it with a Browserify transform or Webpack loader.
- The style bundled in positions things well, but doesn't necessarily make them look great.

**Available Classes**

- `.pl-conference`
  * The container element for the video chat. Two video elements are placed in here.
- `.pl-video`
  * Two `.pl-video` elements exist: one for the remote video, one for the local video. Each video stream will fill to fit the size of their parent `pl-video` element.
- `.pl-local`
  * The local video. Placed in the bottom left corner of the conference. Changes size to match the aspect ratio of the remote user.
- `.pl-remote`
  * The remote video. Stretches to fill the conference.
- `.pl-absent`
  * The remote video has this class when no one has connected yet, or when someone leaves after connecting.
- `.pl-no-audio, .pl-no-video`
  * These elements exist as children of each video when there's no audio and/or no video available, with the text 'No Audio' or 'No Video'

### Development

- Acquire some tokbox credentials (check potluck-opentok-adapter's [test-server.js](https://github.com/eaze/potluck-opentok-adapter/blob/master/test-server.js))
- `npm install`
- `npm run dev` to start watch for css/js
- Start http server in root and open index.html
