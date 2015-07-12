var h = require('virtual-dom/h')
var parallel = require('run-parallel')
var struct = require('observ-struct')

var LocalVideo = require('./local-video')
var RemoteVideo = require('./remote-video')

module.exports = Conference
module.exports.render = render

function Conference () {
  var state = struct({
    localVideo: LocalVideo(),
    remoteVideo: RemoteVideo()
  })
  state.useVideoAdapter = useVideoAdapter

  return state

  function useVideoAdapter (videoAdapter) {
    parallel([
      parallelize(state.localVideo.onLoad.listen),
      parallelize(state.remoteVideo.onLoad.listen)
    ], function (_, results) {
      var localNode = results[0]
      var remoteNode = results[1]

      videoAdapter.connect()
      videoAdapter.publish(localNode)

      videoAdapter.on('peer.incoming', function (stream) {
        var peer = videoAdapter.connectPeer(stream, remoteNode)

        peer.on('dimensionsChanged', function (dimensions) {
          state.localVideo.fitDimensions(dimensions)
        })
        peer.on('audioChanged', state.remoteVideo.hasAudio.set)
        peer.on('videoChanged', state.remoteVideo.hasVideo.set)
        state.remoteVideo.hasAudio.set(peer.audio)
        state.remoteVideo.hasVideo.set(peer.video)
      })
    })
  }
}

function render (state) {
  return h('div.pl-conference', [
    LocalVideo.render(state.localVideo),
    RemoteVideo.render(state.remoteVideo)
  ])
}


function parallelize (eventListener) {
  return function (cb) {
    var unlisten = eventListener(function (result) {
      unlisten()
      cb(null, result)
    })
  }
}
