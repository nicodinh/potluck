'use strict'
var TokboxAdapter = require('potluck-tokbox-adapter')
var App = require('./lib')

var adapter = new TokboxAdapter({
  apiKey: '45258342',
  sessionId: '2_MX40NTI1ODM0Mn5-MTQzNjY1NjQ4NTcyOH5EcGwraWtkUnovbllYaUdhOHBNWVpBK3N-fg',
  token: 'T1==cGFydG5lcl9pZD00NTI1ODM0MiZzaWc9ZTk1NGY0YjcwMjc1NzQwMDEzNjUzYjI5ZDM5MmI1ZDVmNDIyYmJjMTpzZXNzaW9uX2lkPTJfTVg0ME5USTFPRE0wTW41LU1UUXpOalkxTmpRNE5UY3lPSDVFY0d3cmFXdGtVbm92YmxsWWFVZGhPSEJOV1ZwQkszTi1mZyZjcmVhdGVfdGltZT0xNDM2NjU2NDg2Jm5vbmNlPTAuNTEzMzMzMTI4MDY2NzMzNSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDM2NzQyODg2'
})

App(document.body, adapter)
