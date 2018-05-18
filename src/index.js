var readdir = require('./util/file').readdir
var fs = require('fs')
var path = require('path')
var destDictionary = require('./util/dictionary').destDictionary
var lineReader = require('line-reader')
var getChinese = require('./util/dictionary').getChinese
// 读取所有code目录下的文件
var path = require('path')
// 当前目录下js和html文件的总数
var filesize = 0
// 当前目录下已经完成读取的js和html文件的总数
var finishedSize = 0
// 当前目录下文件夹的数量
var directorySize = 0
// 当前目录下已经遍历的文件夹数量
var getDirectorySize = 0
// 当前目录下非js和html文件的总数
var otherFileSize = 0
// 当前目录下已经遍历的非js和html文件的数量
var getOtherFileSize = 0
// 存储所给目录下的所有文件夹
var directoryArr = []

// 逐行读取文件内容，同时忽略注释
function readLine(file, callback) {
  // 这里读取当前文件全部内容，用来判断该文件的内容是否为空，如果为空的话lineReader.eachLine不会执行
  var str = fs.readFileSync(file).toString()
  if (!str) {
    callback()
    return
  }
  // 找出html文件夹的注释
  if (file.indexOf('.html') > 0) {
    var status = 'code'
    lineReader.eachLine(file, function (line, last) {
      switch (status) {
        case 'code':
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
        callback()
      }
    })
  }
  // 找出js文件的注释
  if (file.indexOf('.js') > 0) {
    var status = 'code'
    lineReader.eachLine(file, function (line, last) {
      switch (status) {
        case 'code':
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
          } else if (mulStartIndex > -1 && mulEndIndex > -1) {// 用/* */单行注释的情况
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
        callback()
      }
    })
  }
}

// 给当前文件或文件夹添加完整的路径
function fullPath(dir, files) {
  return files.map(function (f) {
    return path.join(dir, f)
  })
}

// 工具的入口函数
function readFileContent(path) {
  fs.readdir(path, function (err, files) {
    if (err) console.log(err)
    files = fullPath(path, files)
    if (files) {
      // 循环获取当前目录下js和html文件、非这两种文件以及文件夹的数量
      for (var i = 0; i < files.length; i++) {
        var stats = fs.statSync(files[i])
        if (stats.isFile()) {
          if (files[i].indexOf('.js') > -1 || files[i].indexOf('.html') > -1) {
            filesize++
          } else {
            otherFileSize++
          }
        }
        if (stats.isDirectory()) {
          directorySize++
        }
      }
      files.forEach(function (f) {
        fs.stat(f, function (err, stats) {
          if (stats.isFile()) {
            if (f.indexOf('.js') > -1 || f.indexOf('.html') > -1) {
              readLine(f, function () {
                finishedSize++
                // 判断当前目录下的js和html文件是否已经遍历完了，遍历完的话就遍历下一个子目录
                if (filesize == finishedSize) {
                  filesize = 0
                  finishedSize = 0
                  getOtherFileSize = 0
                  otherFileSize = 0
                  directorySize = 0
                  getDirectorySize = 0
                  var directory = directoryArr.shift()
                  if (directory) {
                    console.log('directory:' + directory)
                    rdFileContent(directory)
                  } else {
                    fs.writeFile('../dest/final.txt', JSON.stringify(destDictionary), function (err) {
                      if (err) {
                        throw err;
                      }
                      console.log('The file has been saved!');
                    });
                  }
                }
              })
            } else {
              // 这里处理当前目录下即没有html、js文件也没有文件夹的情况
              if (filesize == 0 && directorySize == 0) {
                getOtherFileSize++
                if (getOtherFileSize == otherFileSize) {
                  getOtherFileSize = 0
                  otherFileSize = 0
                  var directory = directoryArr.shift()
                  if (directory) {
                    rdFileContent(directory)
                  } else {
                    fs.writeFile('../dest/final.txt', JSON.stringify(destDictionary), function (err) {
                      if (err) {
                        throw err;
                      }
                      console.log('The file has been saved!');
                    });
                  }
                }

              }
            }
          }
          if (stats.isDirectory()) {
            directoryArr.push(f)
            // 这里处理当前目录下没有js和html文件的情况
            if (filesize == 0) {
              getDirectorySize++
              if (getDirectorySize == directorySize) {
                getDirectorySize = 0
                otherFileSize = 0
                getOtherFileSize = 0
                directorySize = 0
                var directory = directoryArr.shift()
                if (directory) {
                  rdFileContent(directory)
                }
              }
            }
          }
        })
      })
    }
  })
}
readFileContent('../code')

///分为*.js 和 *.html

// 输出所有中文内容（正则）