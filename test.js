'use strict'
var OpentokAdapter = require('potluck-opentok-adapter')
var App = require('./lib')

require('debug').enable('*')

var adapter = new OpentokAdapter({
  apiKey: '45258342',
  sessionId: '2_MX40NTI1ODM0Mn5-MTQzNjg0Mjc1MTE1M35zOU4vbU9RWEtPL3RPK25ieU5IT2t1K1l-fg',
  token: 'T1==cGFydG5lcl9pZD00NTI1ODM0MiZzaWc9MzNkMWMzMmRmODAwNDEyOWMxZTlkNzE0NjJlZDJjZjdkMGJmNmQ0NDpzZXNzaW9uX2lkPTJfTVg0ME5USTFPRE0wTW41LU1UUXpOamcwTWpjMU1URTFNMzV6T1U0dmJVOVJXRXRQTDNSUEsyNWllVTVJVDJ0MUsxbC1mZyZjcmVhdGVfdGltZT0xNDM2ODQyNzUyJm5vbmNlPTAuNTg5MjM5MTQ1MTYzNDQ2NyZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDM2OTI5MTUy'
})

App(document.body, adapter)
