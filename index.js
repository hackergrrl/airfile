var button = document.getElementById('button')
var after = require('after-all')
var xhr = require('xhr')

var data = {}

button.onclick = function (e) {
  var files = document.getElementById('files').files

  var afterRead = after(doSend)

  for (var i = 0; i < files.length; i++) {
    (function (file) {
      var done = afterRead()
      readAsBase64(file, function (_, blob) {
        data[file.name] = blob.substring(blob.indexOf(',') + 1)
        done()
      })
    })(files[i])
  }

  function doSend (_) {
    var afterSend = after(onDone)

    Object.keys(data).forEach(function (filename) {
      var done = afterSend()
      xhr({
        body: data[filename],
        method: 'POST',
        uri: '/send?filename=' + filename
      }, function (err, resp, body) {
        done(err, body)
      })
    })
  }

  function onDone (_) {
    console.log('all done')
  }
}

function readAsBase64 (file, done) {
  var reader = new window.FileReader()
  reader.addEventListener('load', function (e) {
    done(null, e.target.result)
  })
  reader.addEventListener('error', done)
  reader.readAsDataURL(file)
}
