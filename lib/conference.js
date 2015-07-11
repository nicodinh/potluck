var h = require('virtual-dom/h')
var parallel = require('run-parallel')

var struct = require('observ-struct')
var value = require('observ')

var LocalVideo = require('./local-video')
var RemoteVideo = require('./remote-video')

module.exports = Conference
module.exports.schema = schema

function schema() {
  return struct({
    localVideo: LocalVideo.schema(),
    remoteVideo: RemoteVideo.schema()
  })
}

function Conference () {
  var localVideo = LocalVideo()
  var remoteVideo = RemoteVideo()

  return {
    useVideoAdapter: useVideoAdapter,
    render: render
  }

  function render (state) {
    return h('div.pl-conference', [
      localVideo.render(state.localVideo),
      remoteVideo.render(state.remoteVideo)
    ])
  }

  function useVideoAdapter(state, videoAdapter) {
    parallel([
      parallelize(localVideo.onLoad),
      parallelize(remoteVideo.onLoad)
    ], function(_, results) {
      var localNode = results[0]
      var remoteNode = results[1]

      videoAdapter.connect()
      videoAdapter.publish(localNode)

      videoAdapter.on('peer.incoming', function (stream) {
        var peer = videoAdapter.connectPeer(stream, remoteNode)

        peer.on('dimensionsChanged', function (dimensions) {
          localVideo.fitDimensions(state.localVideo, dimensions)
        })
      })
    })
  }

}

function parallelize(eventListener) {
  return function(cb) {
    var unlisten = eventListener(function(result) {
      unlisten()
      cb(null, result)
    });
  }
}
