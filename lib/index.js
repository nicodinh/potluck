var createElement = require('base-element')
var Conference = require('./components/conference')

// This file is mostly boilerplate that will be abstracted away.
// We're just attaching the virtual dom to the real dom at whatever
// rootElement is given, then setting up the app to re-render whenever the state changes.
// All rerendering is debounced to requestAnimationFrame.
module.exports = function Potluck (rootElement, videoAdapter) {

  var baseElement = createElement(rootElement)
  var state = Conference()

  baseElement.addEventListener('unload', function () {
    videoAdapter.disconnect()
  })

  state.useVideoAdapter(videoAdapter)

  var debouncedRender = rafDebounce(render)
  // Re-render on state change, at most once per raf
  state(function onChange () {
    debouncedRender(state)
  })

  // Initial render
  render(state)

  function render (state) {
    // Tell the baseElement to render (connecting the virtual dom to the real dom)
    return baseElement.render(function () {
      return Conference.render(state)
    })
  }

}

// TODO move to a library
var raf = require('raf')
function rafDebounce (fn) {
  var context
  var args
  var queued
  return function debounced () {
    context = this
    args = Array.prototype.slice.call(arguments)
    if (queued) { return }
    queued = true
    raf(run)
  }
  function run () {
    fn.apply(context, args)
    queued = false
  }
}
