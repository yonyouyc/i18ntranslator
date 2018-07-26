var _XLSX = require('./util/xlsx')
var readFileContent = require('./util/file').readFileContent
var setting = require('./util/setting')
module.exports = {
  writeXlsx: _XLSX.writeXlsx,
  readXlsx: _XLSX.readXlsx,
  readFileContent: readFileContent,
  setting: setting
}