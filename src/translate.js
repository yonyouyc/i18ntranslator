var readFileContent = require('./util/file').readFileContent
var readXlsx = require('./util/xlsx').readXlsx
var path = '../dest/translated.xlsx'
var translate = {}
var json = readXlsx(path)
var json = json.sort(function (a, b) {
  return a.key.length > a.key.length
})
json.forEach(function (item) {
  translate[item.key] = item.value
})
readFileContent('../code', function () {
  console.log('end')
}, function (path) {
  console.log(path)
})
///分为*.js 和 *.html

// 输出所有中文内容（正则）