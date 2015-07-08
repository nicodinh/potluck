var createElement = require('base-element')

var nextId = 0

module.exports = function (domElement) {
  var el = createElement(domElement)

  var self = {
    render: function(data) {
      return el.render(function() {
        return this.html('div.video', {
          className: data.isLocal ? 'local' : 'remote'
        })
      })
    }
  }
  Object.defineProperty(self, 'element', {
    get: function() {
      return el.element
    }
  })

  return self
}
