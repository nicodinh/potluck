var hg = require('mercury')
var Conference = require('./components/conference')

// This file is mostly boilerplate that will be abstracted away.
// We're just attaching the virtual dom to the real dom at whatever
// rootElement is given, then setting up the app to re-render whenever the state changes.
// All rerendering is debounced to requestAnimationFrame.
module.exports = function Potluck (rootElement, videoAdapter) {
  return hg.app(rootElement, Conference({ adapter: videoAdapter }), Conference.render)
}
