'use strict'
var OpentokAdapter = require('potluck-opentok-adapter')
var App = require('./lib')

var adapter = new OpentokAdapter({
  apiKey: '45258342',
  sessionId: '1_MX40NTI1ODM0Mn5-MTQzNjc0NDQ3MTU2MX55dUVNNHNmMnQ2L3NZQW9yZlRqSVdqdk5-fg',
  token: 'T1==cGFydG5lcl9pZD00NTI1ODM0MiZzaWc9Y2Y1YjI2YjJiYjQxNzE3NTFkYzBmOTNmNGQyYTMyZDQwMzk2NWI4NTpzZXNzaW9uX2lkPTFfTVg0ME5USTFPRE0wTW41LU1UUXpOamMwTkRRM01UVTJNWDU1ZFVWTk5ITm1NblEyTDNOWlFXOXlabFJxU1ZkcWRrNS1mZyZjcmVhdGVfdGltZT0xNDM2NzQ0NDcyJm5vbmNlPTAuMTE2NTYwOTM1NTA4NDU5OCZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDM2ODMwODcy'
})

App(document.body, adapter)
