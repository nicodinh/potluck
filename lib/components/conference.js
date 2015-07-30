var after = require('after')
var array = require('observ-array')
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
    remotes: array([])
  })

  connectVideo(state, data.adapter)

  return state
}

Conference.render = function render (state) {
  return h('div.pl-conference', [
    Video.render(state.local),
    state.remotes[0] ? Video.render(state.remotes[0]) : ''
    // state.remotes.map(function (remote) {
    //   return Video.render(remote)
    // })
  ])
}

function connectVideo (state, videoAdapter) {
  listenOnce(Video.onLoad, state.local(), onLocalLoad)

  function onLocalLoad (localDomElement) {
    videoAdapter.connect(localDomElement)
    state.local.absent.set(false)
    log('local loaded and attached')

    // Cause local element to reflow
    nextTick(function () {
      localDomElement.style.offsetWidth;
    })

    videoAdapter.on('peer.incoming', onIncomingPeer)
  }

  function onIncomingPeer (stream) {
    var remote = Video()
    state.remotes.push(remote)
    log('potluck received remote', remote, stream)

    listenOnce(Video.onLoad, remote(), function onRemoteLoad (remoteDomElement) {
      log('remote loaded')
      var peer = videoAdapter.connectPeer(stream, remoteDomElement)

      peer.on('connected', function () {
        remote.absent.set(false)
        remote.audio.set(peer.audio)
        remote.video.set(peer.video)
      })
      peer.on('disconnected', function () {
        remote.absent.set(true)
        log('disconnected event received')
        for (var i = 0, ii = state.remotes.getLength(); i < ii; i++) {
          if (state.remotes.get(i) === remote) {
            log('tearing down remote', remote)
            state.remotes.splice(i, 1)
            break;
          }
        }
      })

      peer.on('audioChanged', remote.audio.set)
      peer.on('videoChanged', remote.video.set)
      peer.on('dimensionsChanged', function (dimensions) {
        Video.fit(state.local, dimensions)
      })

    })
  }

  function listenOnce (listen, state, cb) {
    var unlisten = listen(state, function (arg) {
      cb(arg)
      unlisten()
    })
  }

}
