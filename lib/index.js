var hg = require('mercury')
var Conference = require('./components/conference')

module.exports = function Potluck (rootElement, videoAdapter) {
  return hg.app(rootElement, Conference({ adapter: videoAdapter }), Conference.render)
}
