var onceEvents = require('once-events')
var wr = require('winresize-event')
var createElement = require('base-element')

var observ = require('observ')
var observStruct = require('observ-struct')

var state = observStruct({
  isStarted: observ(false),
  localVideo: observStruct({
    isLocal: observ(true),
    width: observ(200),
    height: observ(200),
    audio: observ(true),
    video: observ(true),
  }),
  remoteVideo: observStruct({
    isLocal: observ(false),
    width: observ(0),
    height: observ(0),
    audio: observ(true),
    video: observ(true)
  })
})

module.exports = function (rootElement, adapter) {
  var el = createElement(rootElement)
  var localVideo = require('./local-video')()
  var remoteVideo = require('./remote-video')()

  function render() {
    console.log('rendering', state())
    return el.render(function() {
      return el.html('div.pl-conference', [
        localVideo.render(state.localVideo),
        remoteVideo.render(state.remoteVideo)
      ])
    })
  }
  state(rafDebounce(render))

  // I don't like this code being here.
  function setRemoteDimensions (dim) {
    state.remoteVideo.width.set(dim.width)
    state.remoteVideo.height.set(dim.height)
  }
  wr.winResize.on(setRemoteDimensions)
  setRemoteDimensions(wr.getWinSize())

  // Why does once-events error?
  // onceEvents([localVideo, remoteVideo], 'load', function(events) {
  require('run-parallel')([
    function(cb) { localVideo.addEventListener('load', function(ev) { cb(null, ev) }) },
    function(cb) { remoteVideo.addEventListener('load', function(ev) { cb(null, ev) }) }
  ], function(_, events) {
    var localNode = events[0]
    var remoteNode = events[1]

    adapter.connect()
    adapter.publish(localNode)

    adapter.on('peer.incoming', function (stream) {
      var peer = adapter.connectPeer(stream, remoteNode)

      peer.on('dimensionsChanged', function(dimensions) {
        var dim = localVideo.getFitDimensions(dimensions)
        state.localVideo.width.set(dim.width)
        state.localVideo.height.set(dim.height)
      })
    })
  })

  return render
}


//TODO move to a library
var raf = require('raf')
function rafDebounce(fn) {
  var context
  var args
  var queued
  return function debounced () {
    context = this
    args = Array.prototype.slice.call(arguments)
    if (queued) { return }
    queued = true
    raf(run)
  }
  function run () {
    fn.apply(context, args)
    queued = false
  }
}
