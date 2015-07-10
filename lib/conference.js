var tokSessionId = '1_MX40NTI1ODM0Mn5-MTQzNjM5MjE5MzAxMH5HbDI0WElTRUszbnpUM0Q5Z2VpblR4bkx-fg'
var tokToken = 'T1==cGFydG5lcl9pZD00NTI1ODM0MiZzaWc9ZTIzYzRkZTlhOWRlZjMxNDQzMmFiOTIyOWY5YzU3ZjViOTQ4MTY5YTpzZXNzaW9uX2lkPTFfTVg0ME5USTFPRE0wTW41LU1UUXpOak01TWpFNU16QXhNSDVIYkRJMFdFbFRSVXN6Ym5wVU0wUTVaMlZwYmxSNGJreC1mZyZjcmVhdGVfdGltZT0xNDM2MzkyMTkzJm5vbmNlPTAuOTg5MTY5MTYwMTM2OTUzJnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE0MzY0Nzg1OTM='
var tokApiKey = '45258342'

var createElement = require('base-element')
var TokboxAdapter = require('potluck-tokbox-adapter')
var onceEvents = require('once-events')

var adapter = new TokboxAdapter({
  apiKey: tokApiKey,
  sessionId: tokSessionId,
  token: tokToken,
})


module.exports = function(rootElement) {
  var el = createElement(rootElement)
  var localVideo = require('./video')()
  var remoteVideo = require('./video')()

  var self = {
    render: function(data) {
      return el.render(function() {
        return el.html('div.conference', [
          'some text',
          localVideo.render({ isLocal: true }),
          remoteVideo.render({})
        ])
      })
    }
  }

  onceEvents([localVideo, remoteVideo], 'init', function (nodes) {
    var localNode = nodes[0]
    var remoteNode = nodes[1]
    adapter.connect()
    adapter.publish(localNode)
    adapter.on('peer.incoming', function (stream) {
      adapter.connectPeer(stream, remoteNode)
    })
  })

  return self
}
