var Event = require('geval/event')
var h = require('virtual-dom/h')
var nextTick = require('next-tick')
var struct = require('observ-struct')
var value = require('observ')

module.exports = Video
module.exports.schema = schema

function schema () {
  return struct({
    isLocal: value(false),
    width: value(0),
    height: value(0),
    audio: value(true),
    video: value(true),
  })
}

function Video () {

  var onloadEvent = Event()

  return {
    onLoad: onloadEvent.listen,
    setDimensions: setDimensions,
    render: render
  }

  function setDimensions(state, dimensions) {
    state.width.set(dimensions.width)
    state.height.set(dimensions.height)
  }

  function render(state) {
    var style = (state.width() && state.height()) ?
      ('width: ' + Math.floor(state.width()) + 'px; height: ' + Math.floor(state.height()) + 'px;') :
      ''
    return h('div.pl-video', {
      className: state.isLocal() ? 'pl-local' : 'pl-remote',
      loadHook: new LoadHook(onloadEvent.broadcast),
      attributes: {
        style: style
      }
    })
  }
}

function LoadHook (cb) {
  this.cb = cb
}
LoadHook.prototype.hook = function (node) {
  var self = this
  nextTick(function () {
    self.cb(node)
  })
}
