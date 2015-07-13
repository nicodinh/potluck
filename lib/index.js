var mainLoop = require('main-loop');
var Conference = require('./components/conference')

module.exports = function Potluck (rootElement, videoAdapter) {
  var state = Conference({ adapter: videoAdapter })
  var loop = mainLoop(state(), Conference.render, {
    diff: require('virtual-dom/diff'),
    patch: require('virtual-dom/patch'),
    create: require('virtual-dom/create-element')
  })
  rootElement.appendChild(loop.target)

  return state(loop.update)
}
