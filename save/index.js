const fs = require('fs')

const obj = {
  id: 1,
  message: 'Hello'
}

const jsonStr = JSON.stringify(obj)
const path = `${__dirname}/../db/data.json`

function saveFile() {
  fs.writeFile(path, jsonStr, function(err) {
    if (err) {
      console.log(err)
    }
  })
}

module.exports = saveFile
