var button = document.getElementById('button')
var waterfall = require('run-waterfall')
var xhr = require('xhr')

button.onclick = function (e) {
  var files = document.getElementById('files').files

  var tasks = []

  for (var i = 0; i < files.length; i++) {
    (function (file) {
      tasks.push(function (callback) {
        console.log('task!')
        readAsBase64(file, function (_, blob) {
          blob = blob.substring(blob.indexOf(',') + 1)
          xhr({
            body: blob,
            method: 'POST',
            uri: '/send?filename=' + file.name
          }, function (err, resp, body) {
            console.log('xhr done', err, resp, body)
            callback(err)
          })
        })
      })
    })(files[i])
  }

  waterfall(tasks, onDone)

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
