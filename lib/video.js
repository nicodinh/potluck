var createElement = require('base-element')

var nextId = 0

module.exports = function () {
  var el = createElement()

  return {
    render: function(data) {
      return el.html('div.video', {
        className: data.isLocal ? 'local' : 'remote'
      })
    }
  }
}
