var wr = require('winresize-event')

// Return dimensions that match the aspect ratio of the given dimensions,
// with ceiling at maxDimensions
module.exports = function fitToRatio (dimensions, maxDimensions) {
  maxDimensions || (maxDimensions = wr.getWinSize())
  var aspectRatio = dimensions.width / dimensions.height
  var fit = {}
  // If width > height
  if (aspectRatio > 1) {
    fit.width = maxDimensions.width
    fit.height = fit.width / aspectRatio
    // If height > width
  } else {
    fit.height = maxDimensions.height
    fit.width = fit.height * aspectRatio
  }
  return fit
}
