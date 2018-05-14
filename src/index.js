var readdir = require('./util/file').readdir
var fs = require('fs')
// var generateDictionary = require('./util/dictionary').generateDictionary
var destDictionary = require('./util/dictionary').destDictionary
var lineReader = require('line-reader')
var getChinese = require('./util/dictionary').getChinese
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
        // lineReader.eachLine(_path + file, function(line, last) {
        //   var str_cut = null
        //   var str_len = line.length
        //   for (var i = 0; i < str_len; i++) {
        //     var a = line.charAt(i);
        //     if (escape(a).length > 4) {
        //       if (!str_cut) {
        //         str_cut = new String()
        //       }
        //       //中文字符的长度经编码之后大于4
        //       str_cut = str_cut.concat(a);
        //     }
        //     if (escape(a).length <= 4 || i === (str_len - 1)) {
        //       if (str_cut) {
        //         generateDictionary(str_cut.toString(), '')  //将中文字符作为myDictionary对象的键名，并初始化值为''
        //       }
        //       str_cut = null
        //     }
        //   }
        //   // 如果读到了文件的最后一行
        //   if (last) {
        //     finishedSize++
        //     console.log(_path + file)
        //   }
        // })
        if (file.indexOf('.html') > 0) {
          var status = 'code'
          lineReader.eachLine(_path + file, function (line, last) {
            var arr = line.match(/[\u4e00-\u9faf]+/g)
            switch (status) {
              case 'code' :
                var startIndex = line.indexOf('<!--')
                var endIndex = line.indexOf('-->')
                // html注释在同一行的情况
                if (startIndex > -1 && endIndex > -1) {
                // 改变status的值为code
                  status = 'code'
                // 获取注释前面的内容
                  var startStr = line.substring(0, startIndex)
                // 获取注释后面的内容
                  var endStr = line.substring(endIndex)
                  if (startStr) {
                    getChinese(startStr)
                  }
                  if (endStr) {
                    getChinese(endStr)
                  } 
                } else if (startIndex > -1 && endIndex < 0) { //多行注释的情况
                  // 改变status的状态为commentStart，表示是多行注释，直到-->出现
                  status = 'commentStart'
                  var startStr = line.substring(0, startIndex)
                  if (startStr) {
                    getChinese(startStr)
                  }
                } else if (startIndex < 0) {
                  status = 'code'
                  getChinese(line)
                }
                break
              case 'commentStart': 
                var endIndex = line.indexOf('-->')
                // 多行注释结束，改变status=code，否则的话就status继续为commentStart
                if (endIndex > -1) {
                  var endStr = line.substring(endIndex)
                  if (endStr) {
                    getChinese(endStr)
                  }
                  status = 'code'
                } else {
                  status = 'commentStart'
                }
                break
              default:
                status = 'code'
                break
            }
            if (last) {
              finishedSize++
              console.log(_path + file)
            }
          })
        }
        if (file.indexOf('.js') > 0) {
          status = 'code'
          lineReader.eachLine(_path + file, function (line, last) {
            switch (status) {
              case 'code' :
              // js里有多行注释和单行注释的情况
                var singleStartIndex = line.indexOf('//')
                var mulStartIndex = line.indexOf('/*')
                var mulEndIndex = line.indexOf('*/')
              // 用//单行注释的情况且不在''里面
                if (singleStartIndex > -1 && line.search(/('|").*\/\/.*('|")$/) < 0) {
                  status = 'code'
                  var startStr = line.substring(0, singleStartIndex)
                  if (startStr) {
                    getChinese(startStr)
                  }
                } else if (mulStartIndex > -1 && mulEndIndex> -1){// 用/* */单行注释的情况
                  status = 'code'
                  var startStr = line.substring(0, mulStartIndex)
                  var endStr = line.substring(mulEndIndex)
                  if (startStr) {
                    getChinese(startStr)
                  }
                  if (endStr) {
                    getChinese(endStr)
                  }
                } else if (mulStartIndex > -1 && mulEndIndex < 0) {// 用/* */多行注释的情况
                  status = 'startComment' // 多行注释开始
                  var startStr = line.substring(0, mulStartIndex)
                  if (startStr) {
                    getChinese(startStr)
                  }
                } else {
                  getChinese(line)
                }
                break
              case 'startComment': 
                var mulEndIndex = line.indexOf('*/')
                // 多行注释结束
                if (mulEndIndex > -1) {
                  status = 'code'
                  var endStr = line.substring(mulEndIndex)
                  if (endStr) {
                    getChinese(endStr)
                  }
                } else {
                  status = 'startComment'
                }
                break
              default:
                status = 'code'
            }
            if (last) {
              finishedSize++
              console.log(_path + file)
            }
          })
        }
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