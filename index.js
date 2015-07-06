'use strict'

var crel = require('crel')

var capture = require('rtc-capture')
var attach = require('rtc-attach')
var quickconnect = require('rtc-quickconnect')

var local = crel('div', { 'class': 'local-container' })
var remote = crel('div', { 'class': 'remote-container' })

capture({
  audio: true,
  video: true
}, function (err, localStream) {
  if (err) {
    return console.error('local media capture failed', err)
  }

  attach(localStream, { muted: true }, function (err, el) {
    if (err) {
      return console.error('Error attaching local stream', err)
    }
    local.appendChild(el)
  })

  quickconnect('http://192.168.1.160:8181/', {
    room: 'test-eaze'
  })
    .addStream(localStream)
    .on('call:started', function (id, pc, data) {
      attach(pc.getRemoteStreams()[0], function (err, el) {
        if (err) return
        el.setAttribute('id', id)
        remote.appendChild(el)
      })
    })
    .on('call:ended', function (id) {
      var el = document.getElementById(id)
      el.parentNode.removeChild(el)
    })

    .createDataChannel('resolution')
    .on('channel:opened:resolution', function (id, dc) {
      dc.onmessage = function (ev) {
        console.log('peer', id, 'says:', ev.data)
      }

      window.onresize = sendDimensions
      sendDimensions()
      function sendDimensions () {
        dc.send(window.innerWidth + 'x' + window.innerHeight)
      }
    })
})

document.body.appendChild(local)
document.body.appendChild(remote)
