var after = require('after')
var hg = require('mercury')
var h = require('mercury').h
var Video = require('./video')

module.exports = Conference

function Conference (data) {
  var state = hg.state({
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
  var localDomElement
  var remoteDomElement

  var next = after(2, connect)
  listenOnce(Video.onLoad, state.local(), function (node) {
    localDomElement = node
    next()
  })
  listenOnce(Video.onLoad, state.remote(), function (node) {
    remoteDomElement = node
    next()
  })

  function connect () {
    videoAdapter.connect()
    videoAdapter.publish(localDomElement)
    state.local.absent.set(false)

    videoAdapter.on('peer.incoming', function (stream) {
      console.log('peer.incoming')
      var peer = videoAdapter.connectPeer(stream, remoteDomElement)

      peer.on('connected', function () {
        state.remote.absent.set(false)
        state.remote.audio.set(peer.audio)
        state.remote.video.set(peer.video)
      })
      peer.on('disconnected', function () {
        state.remote.absent.set(true)
      })

      peer.on('audioChanged', state.remote.audio.set)
      peer.on('videoChanged', state.remote.video.set)
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
