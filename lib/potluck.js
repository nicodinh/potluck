var createElement = require('base-element')
var observ = require('observ')
var observStruct = require('observ-struct')

module.exports = function (rootElement, videoAdapter) {
  var el = createElement(rootElement)
  var conference = require('./conference')(state)

  conference.setVideoAdapter(videoAdapter)

  function render () {
    return el.render(function () {
      return conference.render(state)
    })
  }

  var debouncedRender = rafDebounce(render)
  state(debouncedRender)

  return render
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
