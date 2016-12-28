#!/usr/bin/env node

var fs = require('fs')
var http = require('http')
var url = require('url')
var querystring = require('querystring')
var base64 = require('base64-stream')
var ip = require('internal-ip')
var path = require('path')

http.createServer(onRequest).listen(8400, function () {
  console.log('Listening on', ip.v4() + ':8400')
})

function onRequest (req, res) {
  // TODO(sww): use ecstatic
  if (req.url === '/index.html' || req.url === '/') {
    fs.createReadStream(path.join(__dirname, '..', 'index.html')).pipe(res)
  } else if (req.url === '/bundle.js') {
    fs.createReadStream(path.join(__dirname, '..', 'bundle.js')).pipe(res)
  } else if (req.method === 'POST' && /^\/send/.test(req.url)) {
    var qs = url.parse(req.url).query
    var kvs = querystring.parse(qs)
    if (!kvs.filename) {
      res.statusCode = 400
      res.end('missing filename query param')
    } else {
      req
        .pipe(base64.decode())
        .pipe(fs.createWriteStream(kvs.filename))
        .on('finish', function () {
          res.end()
        })
      console.log('wrote', kvs.filename, 'to local disk')
    }
  } else {
    res.statusCode = 404
    res.end('not found')
  }
}

