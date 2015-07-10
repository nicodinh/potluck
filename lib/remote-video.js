var video = require('./video')

module.exports = function(state) {
  var el = video(state)

  // TODO more logic belongs here for remote-only videos

  return el
}
