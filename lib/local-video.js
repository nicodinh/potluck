var fitToRatio = require('./fit-to-ratio')
var getWinSize = require('winresize-event').getWinSize
var Video = require('./video')

module.exports = LocalVideo
module.exports.schema = schema

function schema () {
  var state = Video.schema()

  state.isLocal.set(true)
  // Default to a reasonable size
  state.height.set(200)
  state.width.set(200)

  return state
}

function LocalVideo () {
  var video = Video()

  video.fitDimensions = function fitDimensions (state, dimensions) {
    var winSize = getWinSize()
    var maxDimensions = {
      width: Math.min(200, winSize.width / 2),
      height: Math.min(200, winSize.height / 5)
    }
    var fitDimensions = fitToRatio(dimensions, maxDimensions)
    video.setDimensions(state, fitDimensions)
  }

  return video
}
