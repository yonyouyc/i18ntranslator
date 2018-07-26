var readFileContent = require('./util/file').readFileContent
var readXlsx = require('./util/xlsx').readXlsx
var path =  require('path')
var srcpath = path.resolve('./dest/translated.xlsx')
var sourceDirectory = path.resolve('./code')
var translate = {}
var json = readXlsx(srcpath)
var fs = require('fs')
json.forEach(function (item) {
  translate[item.key] = item.value
})
var setting = require('./util/setting')
setting.setIgnoreDirectory(['vue'])
readFileContent(sourceDirectory, function () {
  console.log('代码生成成功')
}, function (path, str, fileKeys) {
  if (fileKeys !== 'otherfile') {
    var sortedKeys = fileKeys.sort(function (a, b) {
      return a.toString().length < b.toString().length
    })
    sortedKeys.forEach(function (key) {
      var translated = translate[key]
      if (translated) {
        str = str.replace(key, translated)
      }
    })
  }
  var writePath = path.replace('/code/', '/code-en/')
  var writeDirectory = writePath.split('/')
  writeDirectory = writeDirectory.slice(0, writeDirectory.length-1)
  var writeDirectoryString = ''
  writeDirectory.forEach(function (item) {
    writeDirectoryString += item +'/'
  })
  fs.mkdir(writeDirectoryString, [], function () {
    fs.writeFile(writePath, str,function(err){
      if(err) console.log(err);
      else console.log(writePath+'写文件操作成功');
    });
  })

})
///分为*.js 和 *.html

// 输出所有中文内容（正则）