var h = require('virtual-dom/h')
var parallel = require('run-parallel')
var struct = require('observ-struct')
var ObservArray = require('observ-array')
var Video = require('./video')

module.exports = Conference

function Conference (data) {
  var local = Video({local: true})
  var remotes = ObservArray([])

  var adapter = data.adapter

  return struct({
    local: local,
    remotes: remotes
  })

  function useVideoAdapter (videoAdapter) {
    parallel([
      parallelize(Video.onLoad.listen),
      parallelize(Video.onLoad.listen)
    ], function (_, results) {
      var localNode = results[0].node
      var remoteNode = results[1].node

      videoAdapter.connect()
      videoAdapter.publish(localNode)

      videoAdapter.on('peer.incoming', function (stream) {
        var peer = videoAdapter.connectPeer(stream, remoteNode)

        peer.on('dimensionsChanged', function (dimensions) {
          Video.fit(local, dimesions)
        })
        peer.on('audioChanged', remote.hasAudio.set)
        peer.on('videoChanged', remote.hasVideo.set)
        remote.hasAudio.set(peer.audio)
        remote.hasVideo.set(peer.video)
      })
    })
  }
}

Conference.render = function render (state) {
  return h('div.pl-conference', [
    Video.render(state.local),
    Video.render(state.remote)
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
