var fs = require('fs')
var http = require('http')
var url = require('url')
var querystring = require('querystring')

http.createServer(onRequest).listen(8400)

function onRequest (req, res) {
  // TODO(sww): use ecstatic
  if (req.url === '/index.html' || req.url === '/') {
    fs.createReadStream('./index.html').pipe(res)
  } else if (req.url === '/index.js') {
    fs.createReadStream('./index.js').pipe(res)
  } else if (req.method === 'POST' && /^\/send/.test(req.url)) {
    var qs = url.parse(req.url).query
    var kvs = querystring.parse(qs)
    if (!kvs.filename) {
      res.statusCode = 400
      res.end('missing filename query param')
    } else {
      req.pipe(fs.createWriteStream(kvs.filename))
      console.log('wrote', kvs.filename, 'to local disk')
    }
  } else {
    res.statusCode = 404
    res.end('not found')
  }
}

