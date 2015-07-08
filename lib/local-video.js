var BaseElement = require('base-element')
var Video = require('./video')

module.exports = function LocalVideo(el) {
  Video.call(this, el)
}
var proto = LocalVideo.prototype = Object.create(Video.prototype)
