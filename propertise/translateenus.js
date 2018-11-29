var i18ntranslator = require('../dist/i18ntranslator.min')
// 入口函数
var lineReader = require('line-reader')
var fs = require('fs')
var path = require('path')
function fullPath(dir, files) {
  return files.map(function (f) {
    return path.join(dir, f)
  })
}
// 解码
function decodeUnicode(str) {
  str = str.replace(/\\/g, "%");
  return unescape(str);
}
function saveJS (json) {
  i18ntranslator.writeXlsx(json, './propertise/chinese.xlsx')
}
function CheckIsChinese(val){
  var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
  return reg.test(val)
}
function writeFile (filename, json) {
  var writeDirectoryString = './propertise'
  var writePath = './propertise/' + filename + '.properties'
  fs.mkdir(writeDirectoryString, [], function () {
    fs.writeFile(writePath, json,function(err){
      if(err) console.log(err);
    });
  })
}
function fileReadLine (file, callback) {
  var str = fs.readFileSync(file).toString()
  if (!str) {
    callback(file + 'no data')
    return
  }
  var fileKeys = {}
  lineReader.eachLine(file, function (line, last) {
    if (line.startsWith('#')) {

    } else if (line) {
      var keys = line.split('=')
      try {
        fileKeys[keys[0]] = decodeUnicode(keys[1])
      } catch (e) {
        console.log(line)
        console.log(e)
      }
    }
    if (last) {
      saveJS(fileKeys)
    }
  })
}
fs.readdir('./propertise', function (err, files) {
  console.log('2')
  if (err) console.log(err)
  files = fullPath('./propertise', files)
  files.forEach(function (f) {
    if (f.indexOf('.properties') >= 0) {
      fs.stat(f, function (err, stats) {
        if (stats.isFile()) {
          fileReadLine(f, function () {

          })
        }
      })
    }
  })
})