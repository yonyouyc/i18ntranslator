var _XLSX = require('./util/xlsx')
var readFileContent = require('./util/file').readFileContent
module.exports = {
  writeXlsx: _XLSX.writeXlsx,
  readXlsx: _XLSX.readXlsx,
  readFileContent: readFileContent
}