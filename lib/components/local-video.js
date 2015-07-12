var fitToRatio = require('../fit-to-ratio')
var getWinSize = require('winresize-event').getWinSize
var Video = require('./video')

module.exports = LocalVideo
module.exports.render = Video.render

function LocalVideo () {
  var state = Video()
  state.isLocal.set(true)
  state.fitDimensions = fitDimensions

  return state

  function fitDimensions (dimensions) {
    var winSize = getWinSize()
    var maxDimensions = {
      width: Math.min(200, winSize.width / 2),
      height: Math.min(200, winSize.height / 5)
    }
    var fitDimensions = fitToRatio(dimensions, maxDimensions)

    state.width.set(fitDimensions.width)
    state.height.set(fitDimensions.height)
  }
}
