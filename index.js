var button = document.getElementById('button')

var data = {}

button.onclick = function (e) {
  var files = document.getElementById('files').files
  console.log(files[0])
  var pending = files.length

  for (var i = 0; i < files.length; i++) {
    (function (file) {
      readAsBinaryString(file, function (_, blob) {
        data[file.name] = blob
        onDone()
      })
    })(files[i])
  }

  function onDone () {
    if (--pending === 0) {
      console.log('done', data)
    }
  }
}

function readAsBinaryString (file, done) {
  var reader = new window.FileReader()
  reader.addEventListener('load', function (e) {
    done(null, e.target.result)
  })
  reader.addEventListener('error', done)
  reader.readAsBinaryString(file)
}
