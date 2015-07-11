var createElement = require('base-element')
var Conference = require('./conference')

module.exports = function Potluck(rootElement, videoAdapter) {
  var baseElement = createElement(rootElement)
  var state = Conference.schema()
  var app = Conference()

  app.useVideoAdapter(state, videoAdapter)
  render(state)

  var debouncedRender = rafDebounce(render)
  // Re-render on state change, at most once per raf
  state(function onChange() {
    debouncedRender(state)
  })

  function render(state) {
    return baseElement.render(function () {
      return app.render(state)
    })
  }
}

//TODO move to a library
var raf = require('raf')
function rafDebounce(fn) {
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
