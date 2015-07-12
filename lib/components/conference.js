var h = require('virtual-dom/h')
var struct = require('observ-struct')
var Video = require('./video')

module.exports = Conference

function Conference (data) {
  var local = Video({local: true})
  var remote = Video()

  useVideoAdapter(data.adapter)

  return struct({
    local: local,
    remote: remote
  })

  function useVideoAdapter (videoAdapter) {
    var nodes = {}
    var unlisten1 = Video.onLoad(local, function (node) {
      unlisten1()
      nodes.local = node
      if (nodes.local && nodes.remote) done()
    })
    var unlisten2 = Video.onLoad(remote, function (node) {
      unlisten2()
      nodes.remote = node
      if (nodes.local && nodes.remote) done()
    })
    function done() {
      var localNode = nodes.local
      var remoteNode = nodes.remote

      videoAdapter.connect()
      videoAdapter.publish(localNode)

      videoAdapter.on('peer.incoming', function (stream) {
        var peer = videoAdapter.connectPeer(stream, remoteNode)

        peer.on('dimensionsChanged', function (dimensions) {
          Video.fit(local, dimensions)
        })
        peer.on('audioChanged', remote.audio.set)
        peer.on('videoChanged', remote.video.set)
        remote.audio.set(peer.audio)
        remote.video.set(peer.video)
      })
    }
  }
}

Conference.render = function render (state) {
  return h('div.pl-conference', [
    Video.render(state.local),
    Video.render(state.remote)
  ])
}
