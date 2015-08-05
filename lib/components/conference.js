var after = require('after')
var struct = require('observ-struct')
var h = require('virtual-dom/h')
var nextTick = require('next-tick')
var Video = require('./video')
var log = require('debug')('potluck')

module.exports = Conference

// Conference constructor: initializes the state of conference and connects to the videoAdapter.
function Conference (data) {
  var state = struct({
    local: Video({ local: true }),
    remote: Video()
  })

  connectVideo(state, data.adapter)

  return state
}

Conference.render = function render (state) {
  return h('div.pl-conference', [
    Video.render(state.local),
    Video.render(state.remote)
  ])
}

function connectVideo (state, videoAdapter) {
  var videoElements = {}
  var next = after(2, onVideosLoaded)
  listenOnce(Video.onLoad, state.remote(), function (domElement) {
    videoElements.remote = domElement
    next()
  })
  listenOnce(Video.onLoad, state.local(), function (domElement) {
    videoElements.local = domElement
    next()
  })

  function onVideosLoaded() {
    videoAdapter.connect(videoElements.local)
    state.local.absent.set(false)
    log('local loaded and attached')

    // Cause local element to reflow
    nextTick(function () {
      videoElements.local.style.offsetWidth;
    })

    videoAdapter.on('peer.incoming', onIncomingPeer)

    function onIncomingPeer (stream) {
      log('potluck received remote', stream)

      // check if we're still on the dom
      if (!videoElements.remote.parentNode) {
        // OpenTok REQUIRES that its element be on the dom
        // this is TERRIBLE but we're doing something wrong
        document.querySelector(".pl-remote").appendChild(videoElements.remote)
      }
      var peer = videoAdapter.connectPeer(stream, videoElements.remote)

      peer.on('connected', function () {
        state.remote.absent.set(false)
        state.remote.audio.set(peer.audio)
        state.remote.video.set(peer.video)
      })
      peer.on('disconnected', function () {
        state.remote.absent.set(true)
        log('disconnected event received')
      })

      peer.on('audioChanged', state.remote.audio.set)
      peer.on('videoChanged', state.remote.video.set)
      peer.on('dimensionsChanged', function (dimensions) {
        Video.fit(state.local, dimensions)
      })
    }
  }

  function listenOnce (listen, state, cb) {
    var unlisten = listen(state, function (arg) {
      cb(arg)
      unlisten()
    })
  }

}
