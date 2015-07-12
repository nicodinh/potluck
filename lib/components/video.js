var h = require('virtual-dom/h')
var nextTick = require('next-tick')
var value = require('observ')
var struct = require('observ-struct')
var Event = require('geval/event')

module.exports = Video
module.exports.render = render

function Video (opts) {
  var state = struct({
    isLocal: value(false),
    width: value(0),
    height: value(0),
    audio: value(true),
    video: value(true),
  })
  state.onLoad = Event()

  return state
}


function render (state) {
  var style = (state.width() && state.height()) ?
    ('width: ' + Math.floor(state.width()) + 'px; height: ' + Math.floor(state.height()) + 'px;') :
    ''
  return h('div.pl-video', {
    className: state.isLocal() ? 'pl-local' : 'pl-remote',
    loadHook: new LoadHook(state.onLoad.broadcast),
    attributes: {
      style: style
    }
  })
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
