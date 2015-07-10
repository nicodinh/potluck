var createElement = require('base-element')

module.exports = function () {
  var el = createElement()

  el.render = function (state) {
    return el.html('div.pl-video', {
      className: state.isLocal() ? 'pl-local' : 'pl-remote',
      onload: new LoadHook(this),
      attributes: {
        style: 'width: ' + Math.floor(state.width()) + 'px; ' +
          'height: ' + Math.floor(state.height()) + 'px;'
      }
    })
  }

  return el
}

function LoadHook (el) {
  this.el = el
}
LoadHook.prototype.hook = function (node) {
  this.el.send('load', node)
}
