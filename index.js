'use strict'
var TokboxAdapter = require('potluck-tokbox-adapter')

var credentials = {
  apiKey: '45258342',
  sessionId: '1_MX40NTI1ODM0Mn5-MTQzNjU2NjExNDkxNX5wckUwNndrUnJ5cXdLWXlSbG44enE0dHR-fg',
  token: 'T1==cGFydG5lcl9pZD00NTI1ODM0MiZzaWc9YzdmZGYwZGNlNzk1MzQ0MzU1MjBhZTY3MTA5M2RjMWQ3N2MzN2YwOTpzZXNzaW9uX2lkPTFfTVg0ME5USTFPRE0wTW41LU1UUXpOalUyTmpFeE5Ea3hOWDV3Y2tVd05uZHJVbko1Y1hkTFdYbFNiRzQ0ZW5FMGRIUi1mZyZjcmVhdGVfdGltZT0xNDM2NTY2MTE2Jm5vbmNlPTAuOTgzNTMxNTU2MDkyMjAyNyZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDM2NjUyNTE2'
}
var adapter = new TokboxAdapter(credentials)

var render = require('./lib/conference')(document.body, adapter)
render()
