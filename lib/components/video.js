var h = require('virtual-dom/h')
var nextTick = require('next-tick')
var value = require('observ')
var struct = require('observ-struct')
var fitToRatio = require('../fit-to-ratio')
var getWinSize = require('winresize-event').getWinSize
var WeakmapEvent = require('mercury/examples/lib/weakmap-event')

module.exports = Video

var LoadEvent = WeakmapEvent()

function Video (data) {
  data = data || {}
  return struct({
    local: value(data.local || false),
    width: value(0),
    height: value(0),
    audio: value(true),
    video: value(true)
  })
}

Video.onLoad = LoadEvent.listen

Video.render = function render (state) {
  var style = (state.width() && state.height()) ?
    ('width: ' + Math.floor(state.width()) + 'px; height: ' + Math.floor(state.height()) + 'px;') :
    ''
  return h('div.pl-video', {
    className: state.local() ? 'pl-local' : 'pl-remote',
    loadHook: new LoadHook(function (node) {
      LoadEvent.broadcast(state, node)
    }),
    attributes: {
      style: style
    }
  }, [
    state.audio() ? '' : h('div.pl-no-audio', 'No Audio'),
    state.video() ? '' : h('div.pl-no-video', 'No Video')
  ])
}

Video.fit = function fit (state, dimensions) {
  var winSize = getWinSize()
  var maxDimensions = {
    width: Math.min(200, winSize.width / 2),
    height: Math.min(200, winSize.height / 4)
  }
  var fitDimensions = fitToRatio(dimensions, maxDimensions)
  state.width.set(fitDimensions.width)
  state.height.set(fitDimensions.height)
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
