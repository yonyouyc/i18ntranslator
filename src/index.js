var readdir = require('./util/file').readdir
var fs = require('fs')
var generateDictionary = require('./util/dictionary').generateDictionary
var destDictionary = require('./util/dictionary').destDictionary
var lineReader = require('line-reader')
// 读取所有code目录下的文件
var path = require('path')

var filesize = 0
var finishedSize = 0
function readFileContent (path, parentPath) {
  readdir(parentPath + path, function (err, files) {
    if (files)
    filesize += files.filter(function (item) {
      return item.indexOf('.') >= 0 &&
        (item.indexOf('.html') > 0||item.indexOf('.js') > 0) &&
        parentPath.indexOf('uapprove') < 0
    }).length
    // 上级目录
    var _path = parentPath + path + '/'
    files && files.forEach(function (file) {
      if (_path.indexOf('uapprove') < 0 && file.indexOf('.')>=0 && (file.indexOf('.html') > 0||file.indexOf('.js') > 0)) {
        console.log(_path + file)
        lineReader.eachLine(_path + file, function(line, last) {
          var str_cut = null
          var str_len = line.length
          for (var i = 0; i < str_len; i++) {
            var a = line.charAt(i);
            if (escape(a).length > 4) {
              if (!str_cut) {
                str_cut = new String()
              }
              //中文字符的长度经编码之后大于4
              str_cut = str_cut.concat(a);
            } else {
              if (str_cut) {
                generateDictionary(str_cut.toString(), '')
              }
              str_cut = null
            }
          }
          // 如果读到了文件的最后一行
          if (last) {
            finishedSize++
            console.log(_path + file)
          }
        })
      } else {
        readFileContent(file, _path)
      }
    })
  })
}
readFileContent('code', '../')
var _interval = setInterval(function () {
  if (finishedSize !=0 && finishedSize == filesize) {
    console.log(destDictionary)
    fs.writeFile('../dest/final.txt', JSON.stringify(destDictionary), function (err) {
      if (err) {
        throw err;
      }
      console.log('The file has been saved!');
    });
    clearInterval(_interval)
  }
}, 2000)

///分为*.js 和 *.html

// 输出所有中文内容（正则）