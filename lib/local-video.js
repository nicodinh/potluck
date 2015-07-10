var video = require('./video')
var fitToRatio = require('./fit-to-ratio')
var getWinSize = require('winresize-event').getWinSize

module.exports = function() {
  var el = video()

  el.getFitDimensions = function (dimensions) {
    var winSize = getWinSize()
    var maxDimensions = {
      width: Math.min(200, winSize.width / 2),
      height: Math.min(200, winSize.height / 5)
    }
    return fitToRatio(dimensions, maxDimensions)
  }

  return el
}
