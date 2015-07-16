var h = require('virtual-dom/h')
var value = require('observ')
var struct = require('observ-struct')
var nextTick = require('next-tick')
var fitToRatio = require('../fit-to-ratio')
var getWinSize = require('winresize-event').getWinSize
var WeakmapEvent = require('weakmap-event')

module.exports = Video

var LoadEvent = WeakmapEvent()
Video.onLoad = LoadEvent.listen

function Video (data) {
  data = data || {}
  return struct({
    local: value(data.local || false),
    width: value(0),
    height: value(0),
    audio: value(true),
    video: value(true),
    absent: value(true)
  })
}

Video.render = function render (state) {
  var style = (state.width && state.height) ?
    ('width: ' + Math.floor(state.width) + 'px; height: ' + Math.floor(state.height) + 'px;') :
    ''

  return h('div.pl-video', {
    className: (state.local ? 'pl-local' : 'pl-remote') + ' ' +
      (state.absent ? 'pl-absent' : ''),
    attributes: {
      style: style
    }
  }, [
    h('div', {
      loadHook: new LoadHook(function (domElement) {
        LoadEvent.broadcast(state, domElement)
      }),
      attributes: {
        style: 'left: 0; top: 0; width: 100%; height: 100%;'
      }
    }),
    state.audio ? '' : h('div.pl-no-audio', 'No Audio'),
    state.video ? '' : h('div.pl-no-video', 'No Video')
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
