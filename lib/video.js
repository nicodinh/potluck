var createElement = require('base-element')

var nextId = 0


module.exports = function() {
  var el = createElement()

  el.render = function(data) {
    return el.html('div.video', {
      className: (data || {}).isLocal ? 'local' : 'remote',
      oninit: new InitHook(this)
    }, [
      'some child text'
    ])
  }

  return el
}

function InitHook (el) {
  this.el = el
}
InitHook.prototype.hook = function(node) {
  if (this.sent) {
    return
  }
  this.sent = true
  this.el.send('init', node)
}
