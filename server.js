var fs = require('fs')
var http = require('http')

http.createServer(onRequest).listen(8400)

function onRequest (req, res) {
  // TODO(sww): use ecstatic
  if (req.url === '/index.html' || req.url === '/') {
    fs.createReadStream('./index.html').pipe(res)
  } else {
    res.statusCode = 404
    res.end('not found')
  }
}

