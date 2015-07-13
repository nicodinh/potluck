var hg = require('mercury')
var h = require('mercury').h
var Video = require('./video')

module.exports = Conference

function Conference (data) {
  var state = hg.state({
    local: Video({ local: true }),
    remote: Video()
  })

  useVideoAdapter(state, data.adapter)

  return state
}

function useVideoAdapter (state, videoAdapter) {
  parallelListenOnce(Video.onLoad, [state.local(), state.remote()], function (results) {

    var localNode = results[0]
    var remoteNode = results[1]

    videoAdapter.connect()
    videoAdapter.publish(localNode)

    videoAdapter.on('peer.incoming', function (stream) {
      var peer = videoAdapter.connectPeer(stream, remoteNode)

      peer.on('dimensionsChanged', function (dimensions) {
        Video.fit(state.local, dimensions)
      })
      peer.on('audioChanged', state.remote.audio.set)
      peer.on('videoChanged', state.remote.video.set)
      state.remote.audio.set(peer.audio)
      state.remote.video.set(peer.video)
    })

  })
}

Conference.render = function render (state) {
  return h('div.pl-conference', [
    Video.render(state.local),
    Video.render(state.remote)
  ])
}

function parallelListenOnce(listen, objects, callback) {
  var results = []
  var completed = 0
  objects.forEach(function (obj, i) {
    var unlisten = listen(obj, function (result) {
      unlisten()
      results[i] = result
      completed++
      if (completed == objects.length) callback(results)
    })
  })
}
